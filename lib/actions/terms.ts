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

// Cache for server-side data to avoid repeated DB calls
let designationsCache: any[] | null = null;
let termsCache: Record<string, RoleTerms> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Invalidate cache function - must be async because this file has "use server" directive
export async function invalidateTermsCache(): Promise<void> {
  designationsCache = null;
  termsCache = null;
  cacheTimestamp = 0;
}

/**
 * Get all active designations from database with caching
 * Falls back to config if DB is not available
 */
export async function getDesignations() {
  const now = Date.now();

  // Return cached data if still fresh
  if (designationsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return designationsCache;
  }

  try {
    if (!COLLECTIONS.DESIGNATIONS) {
      console.log("❌ DESIGNATIONS collection not configured");
      // Fallback to config
      const fallbackData = Object.entries(DESIGNATION_LABELS).map(([id, label]) => ({
        designation_id: id,
        label_bn: label,
        label_en: id,
        category: getCategoryFromId(id),
        has_terms: DESIGNATIONS_REQUIRING_TERMS.includes(id),
        is_active: true,
        sort_order: 0,
      }));

      // Cache fallback data too
      designationsCache = fallbackData;
      cacheTimestamp = now;
      return fallbackData;
    }

    console.log("🔍 Loading designations from database collection:", COLLECTIONS.DESIGNATIONS);

    console.log("🔍 Querying designations collection:");
    console.log("- DATABASE_ID:", DATABASE_ID);
    console.log("- COLLECTIONS.DESIGNATIONS:", COLLECTIONS.DESIGNATIONS);

    try {
      const { databases } = await createAdminClient();
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DESIGNATIONS,
        [
          Query.orderAsc("sort_order"),
        ]
      );

      console.log("🔍 Database response:", {
        total: response.total,
        documentsCount: response.documents?.length || 0,
        firstDoc: response.documents?.[0] ? {
          $id: response.documents[0].$id,
          label_en: response.documents[0].label_en,
          label_bn: response.documents[0].label_bn
        } : null
      });

      // If no documents found, use fallback
      if (response.documents.length === 0) {
        console.log("⚠️ No designation documents found, using fallback data");
        const fallbackData = Object.entries(DESIGNATION_LABELS).map(([id, label]) => ({
          $id: `fallback_${id}`, // Fake ID for fallback
          designation_id: id,
          label_bn: label,
          label_en: id,
          category: getCategoryFromId(id),
          has_terms: DESIGNATIONS_REQUIRING_TERMS.includes(id),
          is_active: true,
          sort_order: 0,
        }));

        designationsCache = fallbackData;
        cacheTimestamp = now;
        return fallbackData;
      }

      // Convert Appwrite Document objects to plain JS objects
      const data = response.documents.map((doc: any) => ({
        $id: doc.$id,
        designation_id: doc.designation_id,
        label_bn: doc.label_bn,
        label_en: doc.label_en,
        category: doc.category,
        has_terms: doc.has_terms ?? true,
        is_active: doc.is_active ?? true,
        sort_order: doc.sort_order ?? 100,
      }));

      console.log("✅ Loaded designations from database:", data.length, "items");
      console.log("First item:", data[0]);

      // Cache the data
      designationsCache = data;
      cacheTimestamp = now;
      return data;

    } catch (dbError) {
      console.error("❌ Database error loading designations:", dbError);
      console.log("⚠️ Falling back to hardcoded designations due to database error");

      // Fallback to config
      const fallbackData = Object.entries(DESIGNATION_LABELS).map(([id, label]) => ({
        $id: `fallback_${id}`, // Fake ID for fallback
        designation_id: id,
        label_bn: label,
        label_en: id,
        category: getCategoryFromId(id),
        has_terms: DESIGNATIONS_REQUIRING_TERMS.includes(id),
        is_active: true,
        sort_order: 0,
      }));

      designationsCache = fallbackData;
      cacheTimestamp = now;
      return fallbackData;
    }

    // Convert Appwrite Document objects to plain JS objects
    const data = response.documents.map((doc: any) => ({
      $id: doc.$id,
      designation_id: doc.designation_id,
      label_bn: doc.label_bn,
      label_en: doc.label_en,
      category: doc.category,
      has_terms: doc.has_terms ?? true,
      is_active: doc.is_active ?? true,
      sort_order: doc.sort_order ?? 100,
    }));

    console.log("✅ Loaded designations from database:", data.length, "items");

    // Cache the data
    designationsCache = data;
    cacheTimestamp = now;

    return data;
  } catch (error) {
    console.error("Error fetching designations:", error);
    // Fallback to config
    const fallbackData = Object.entries(DESIGNATION_LABELS).map(([id, label]) => ({
      designation_id: id,
      label_bn: label,
      label_en: id,
      category: getCategoryFromId(id),
      has_terms: DESIGNATIONS_REQUIRING_TERMS.includes(id),
      is_active: true,
      sort_order: 0,
    }));

    // Cache fallback data too
    designationsCache = fallbackData;
    cacheTimestamp = now;
    return fallbackData;
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
 * Get all terms for all designations in a single batch query with caching
 * Much faster than calling getTermsByDesignation for each designation
 */
/**
 * Get terms for a specific designation from database
 */
export async function getTermsByDesignationFromDB(designationId: string): Promise<RoleTerms | null> {
  if (!COLLECTIONS.TERMS_CONDITIONS || !designationId) {
    return null;
  }

  const normalizedInput = designationId.trim();

  try {
    const { databases } = await createAdminClient();

    let resolvedDesignationIds: string[] = [normalizedInput];

    if (COLLECTIONS.DESIGNATIONS) {
      const designationsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DESIGNATIONS,
        [Query.limit(500)]
      );

      const normalizedLookup = normalizedInput.toLowerCase();
      const matchedDesignation = designationsResponse.documents.find((doc: any) => {
        const docId = (doc.$id || "").toLowerCase();
        const designationKey = (doc.designation_id || "").toLowerCase();
        const labelEn = (doc.label_en || "").toLowerCase();
        const labelBn = (doc.label_bn || "").toLowerCase();

        return (
          docId === normalizedLookup ||
          designationKey === normalizedLookup ||
          labelEn === normalizedLookup ||
          labelBn === normalizedLookup
        );
      });

      if (matchedDesignation) {
        resolvedDesignationIds = [
          matchedDesignation.$id,
          matchedDesignation.designation_id,
          matchedDesignation.label_en,
        ].filter(Boolean);
      }
    }

    for (const resolvedId of resolvedDesignationIds) {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        [
          Query.equal("designation_id", resolvedId),
          Query.limit(1),
        ]
      );

      if (response.documents.length === 0) continue;

      const doc = response.documents[0];
      let sections = doc.sections;

      if (typeof sections === "string") {
        try {
          sections = JSON.parse(sections);
        } catch {
          sections = [];
        }
      }

      return {
        title: doc.title,
        sections: sections as RoleTerms["sections"],
      };
    }
  } catch (error) {
    console.error(`Error fetching terms for designation ${designationId}:`, error);
  }

  return null;
}

export async function getAllTerms(): Promise<Record<string, RoleTerms>> {
  const now = Date.now();

  // Return cached data if still fresh
  if (termsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return termsCache;
  }

  // First, get all config terms as base (for fallback)
  const designations = await getDesignations();
  const allTerms: Record<string, RoleTerms> = {};

  // Try to load all terms from database
  if (COLLECTIONS.TERMS_CONDITIONS) {
    try {
      const { databases } = await createAdminClient();

      // Get all terms in a single query
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        [Query.limit(100)] // Assuming max 100 designations
      );

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

          // Store database terms
          allTerms[designationId] = {
            title: doc.title,
            sections: sections as RoleTerms["sections"],
          };
          // Also store with lowercase key for case-insensitive access
          allTerms[designationId.toLowerCase()] = allTerms[designationId];
        }
      }
    } catch (error) {
      console.error("Error fetching terms from database:", error);
      // Continue with config fallback
    }
  }

  // For designations that don't have database terms, use config as fallback
  for (const des of designations) {
    const desId = des.designation_id || des.$id || "";
    if (desId && !allTerms[desId] && !allTerms[desId.toLowerCase()]) {
      const configTerms = getConfigTerms(desId);
      if (configTerms) {
        allTerms[desId] = configTerms;
        // Also store with lowercase key for case-insensitive access
        allTerms[desId.toLowerCase()] = configTerms;
      }
    }
  }

  // Cache the data
  termsCache = allTerms;
  cacheTimestamp = now;

  return allTerms;
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

    // Invalidate cache after successful update
    invalidateTermsCache();

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

      // Invalidate cache after successful update
      invalidateTermsCache();

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
        designation_id: (labelEn || labelBn).toLowerCase().trim().replace(/\s+/g, "_"),
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
        designation_id: (labelEn || labelBn).toLowerCase().trim().replace(/\s+/g, "_"),
        label_bn: labelBn,
        label_en: labelEn || labelBn,
        category,
        has_terms: hasTerms,
        is_active: isActive,
        sort_order: sortOrder,
      }
    );

    // Invalidate cache after successful creation
    invalidateTermsCache();

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

      // Invalidate cache after successful update
      invalidateTermsCache();

      return { success: true, saved: true, docId: existing.documents[0].$id };
    } else {
      // Create new
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.TERMS_CONDITIONS,
        ID.unique(),
        docData
      );

      // Invalidate cache after successful creation
      invalidateTermsCache();

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
