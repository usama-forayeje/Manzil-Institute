"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { DATABASE_ID, COLLECTIONS } from "@/config/appwrite";
import { ID, Query } from "appwrite";
import { 
  getTermsByDesignation as getConfigTerms, 
  DESIGNATIONS_REQUIRING_TERMS,
  type RoleTerms 
} from "@/config/terms";
import { DESIGNATION_LABELS } from "@/validations/staff";

/**
 * Get all active designations from database
 * Falls back to config if DB is not available
 */
export async function getDesignations() {
  try {
    if (!COLLECTIONS.DESIGNATIONS) {
      // Fallback to config
      return Object.entries(DESIGNATION_LABELS).map(([id, label]) => ({
        designation_id: id,
        label_bn: label,
        label_en: id,
        category: getCategoryFromId(id),
        has_terms: DESIGNATIONS_REQUIRING_TERMS.includes(id),
        is_active: true,
        sort_order: 0,
      }));
    }

    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS,
      [
        Query.orderAsc("sort_order"),
      ]
    );

    // Convert Appwrite Document objects to plain JS objects
    return response.documents.map((doc: any) => ({
      $id: doc.$id,
      designation_id: doc.designation_id,
      label_bn: doc.label_bn,
      label_en: doc.label_en,
      category: doc.category,
      has_terms: doc.has_terms ?? true,
      is_active: doc.is_active ?? true,
      sort_order: doc.sort_order ?? 100,
    }));
  } catch (error) {
    console.error("Error fetching designations:", error);
    // Fallback to config
    return Object.entries(DESIGNATION_LABELS).map(([id, label]) => ({
      designation_id: id,
      label_bn: label,
      label_en: id,
      category: getCategoryFromId(id),
      has_terms: DESIGNATIONS_REQUIRING_TERMS.includes(id),
      is_active: true,
      sort_order: 0,
    }));
  }
}

/**
 * Get terms for a specific designation from database
 * Falls back to config if DB is not available
 */
export async function getTermsByDesignation(designationId: string): Promise<RoleTerms | null> {
  try {
    if (!COLLECTIONS.TERMS_CONDITIONS) {
      return getConfigTerms(designationId);
    }

    const { databases } = await createAdminClient();

    // First, find the designation document to get its $id
    let designationDocId = designationId;

    const designationsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS,
      [Query.limit(100)]
    );

    const matchingDesignation = designationsResponse.documents.find((doc: any) =>
      (doc.designation_id || "").toLowerCase() === designationId.toLowerCase() ||
      (doc.label_en || "").toLowerCase() === designationId.toLowerCase() ||
      doc.$id === designationId
    );

    if (matchingDesignation) {
      designationDocId = matchingDesignation.$id;
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS,
      [
        Query.equal("designation_id", designationDocId),
        Query.limit(10),
      ]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];

      let sections = doc.sections;
      if (typeof sections === "string") {
        try {
          sections = JSON.parse(sections);
        } catch (e) {
          sections = [];
        }
      }

      return {
        title: doc.title,
        sections: sections as RoleTerms["sections"],
      };
    }

    return getConfigTerms(designationId);
  } catch (error) {
    return getConfigTerms(designationId);
  }
}

/**
 * Get all terms for all designations in a single batch query
 * Much faster than calling getTermsByDesignation for each designation
 */
export async function getAllTerms(): Promise<Record<string, RoleTerms>> {
  try {
    if (!COLLECTIONS.TERMS_CONDITIONS) {
      // Fallback to config - get all designations and their terms
      const designations = await getDesignations();
      const allTerms: Record<string, RoleTerms> = {};

      for (const des of designations) {
        const desId = des.$id || des.designation_id || "";
        if (desId) {
          const terms = getConfigTerms(desId);
          if (terms) {
            allTerms[desId] = terms;
          }
        }
      }
      return allTerms;
    }

    const { databases } = await createAdminClient();

    // Get all terms in a single query
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS,
      [Query.limit(100)] // Assuming max 100 designations
    );

    const allTerms: Record<string, RoleTerms> = {};

    for (const doc of response.documents) {
      const designationId = doc.designation_id;
      if (designationId) {
        let sections = doc.sections;
        if (typeof sections === "string") {
          try {
            sections = JSON.parse(sections);
          } catch (e) {
            sections = [];
          }
        }

        allTerms[designationId] = {
          title: doc.title,
          sections: sections as RoleTerms["sections"],
        };
      }
    }

    return allTerms;
  } catch (error) {
    console.error("Error fetching all terms:", error);
    // Fallback to config
    const designations = await getDesignations();
    const allTerms: Record<string, RoleTerms> = {};

    for (const des of designations) {
      const desId = des.$id || des.designation_id || "";
      if (desId) {
        const terms = getConfigTerms(desId);
        if (terms) {
          allTerms[desId] = terms;
        }
      }
    }
    return allTerms;
  }
}

/**
 * Update terms for a specific designation
 */
export async function updateTerms(
  designationId: string,
  title: string,
  sections: RoleTerms["sections"],
  updatedBy: string
) {
  try {
    if (!COLLECTIONS.TERMS_CONDITIONS) {
      throw new Error("Terms collection not configured");
    }

    const { databases } = await createAdminClient();
    
    // Check if document exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS,
      [
        Query.equal("designation_id", designationId),
        Query.limit(1),
      ]
    );

    if (existing.documents.length > 0) {
      // Update existing
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        existing.documents[0].$id,
        {
          title,
          sections,
          updated_at: new Date().toISOString(),
          updated_by: updatedBy,
        }
      );
    } else {
      // Create new
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        ID.unique(),
        {
          designation_id: designationId,
          title,
          sections,
          is_active: true,
          updated_at: new Date().toISOString(),
          updated_by: updatedBy,
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating terms:", error);
    throw error;
  }
}

/**
 * Update designation label
 */
export async function updateDesignation(
  designationId: string,
  labelBn: string,
  labelEn: string
) {
  try {
    if (!COLLECTIONS.DESIGNATIONS) {
      throw new Error("Designations collection not configured");
    }

    const { databases } = await createAdminClient();
    
    // Find document
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS,
      [
        Query.equal("designation_id", designationId),
        Query.limit(1),
      ]
    );

    if (existing.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.DESIGNATIONS,
        existing.documents[0].$id,
        {
          label_bn: labelBn,
          label_en: labelEn,
        }
      );
      return { success: true };
    }

    throw new Error("Designation not found");
  } catch (error) {
    console.error("Error updating designation:", error);
    throw error;
  }
}

/**
 * Create new designation
 * Falls back to localStorage if DB not configured
 */
export async function createDesignation(
  labelBn: string,
  labelEn: string,
  category: string,
  hasTerms: boolean = true,
  isActive: boolean = true,
  sortOrder: number = 100
) {
  // If DB not configured, return success with data for localStorage
  if (!COLLECTIONS.DESIGNATIONS) {
    console.log("Designations DB not configured. Returning data for localStorage:", {
      labelBn,
      labelEn,
      category,
      hasTerms,
      isActive,
      sortOrder,
    });
    return { 
      success: true, 
      saved: false,
      data: {
        label_bn: labelBn,
        label_en: labelEn || labelBn,
        category,
        has_terms: hasTerms,
        is_active: isActive,
        sort_order: sortOrder,
      }
    };
  }

  try {
    const { databases } = await createAdminClient();
    
    // Appwrite will generate $id automatically
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS,
      ID.unique(),
      {
        label_bn: labelBn,
        label_en: labelEn || labelBn,
        category,
        has_terms: hasTerms,
        is_active: isActive,
        sort_order: sortOrder,
      }
    );

    return { success: true, saved: true, docId: result.$id };
  } catch (error) {
    console.error("Error creating designation:", error);
    throw error;
  }
}

/**
 * Save terms for a designation
 */
export async function saveTerms(
  designationId: string,
  title: string,
  sections: { title: string; content: string[] }[],
  isActive: boolean = true
) {
  try {
    if (!COLLECTIONS.TERMS_CONDITIONS) {
      console.log("Terms collection not configured. Returning data for localStorage:", {
        designationId,
        title,
        sections,
        isActive,
      });
      return { 
        success: true, 
        saved: false,
        data: {
          designation_id: designationId,
          title,
          sections,
          is_active: isActive,
        }
      };
    }

    const { databases } = await createAdminClient();
    
    // Convert sections array to JSON string for Appwrite
    const sectionsJson = JSON.stringify(sections);
    
    // Check if document exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS,
      [
        Query.equal("designation_id", designationId),
        Query.limit(1),
      ]
    );

    // Send sections as string (JSON) to Appwrite
    const docData: any = {
      designation_id: designationId,
      title,
      sections: sectionsJson,
      is_active: isActive,
    };

    if (existing.documents.length > 0) {
      // Update existing
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        existing.documents[0].$id,
        docData
      );
      return { success: true, saved: true, docId: existing.documents[0].$id };
    } else {
      // Create new
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        ID.unique(),
        docData
      );
      return { success: true, saved: true, docId: result.$id };
    }
  } catch (error) {
    console.error("Error saving terms:", error);
    throw error;
  }
}

/**
 * Helper function to determine category from designation ID
 */
function getCategoryFromId(id: string): string {
  const leadership = ["principal", "secondary_principal", "headmaster"];
  const teachers = [
    "assistant_teacher", "general_teacher", "residential_teacher",
    "unResidential_teacher", "unpaid_teacher", "hifz_teacher",
    "nazera_teacher", "it_teacher"
  ];
  const it = ["web_developer", "digital_marketer", "graphics_designer", "content_writer", "librarian", "lab_assistant"];
  const admin = ["accountant", "office_assistant", "staff"];
  const support = ["boarding_manager", "guard", "caretaker", "driver", "cleaner"];

  if (leadership.includes(id)) return "leadership";
  if (teachers.includes(id)) return "teachers";
  if (it.includes(id)) return "it";
  if (admin.includes(id)) return "admin";
  if (support.includes(id)) return "support";
  return "other";
}
