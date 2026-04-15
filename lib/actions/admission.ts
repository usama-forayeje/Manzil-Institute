"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { DATABASE_ID, COLLECTIONS } from "@/config/appwrite";
import { Query } from "appwrite";

// ─── Server-side Cache ───────────────────────────────────────
let admissionCache: Record<string, AdmissionData> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Invalidate admission cache
 */
export async function invalidateAdmissionCache(): Promise<void> {
  admissionCache = {};
  cacheTimestamp = 0;
}

/**
 * Types for Admission Data
 */
export interface AdmissionProcessStep {
  step: string;
  title: string;
  description: string;
  duration: string;
  color: string;
  requirements: string[];
}

export interface AdmissionRequirements {
  age: string;
  academic: string[];
  documents: string[];
}

export interface FeeItem {
  name: string;
  amount: string;
}

export interface FeeStructure {
  oneTime: FeeItem[];
  monthly: {
    tuition: FeeItem[];
    residential: FeeItem[];
    food: FeeItem[];
  };
}

export interface ImportantDate {
  event: string;
  date: string;
  status: "open" | "upcoming" | "completed";
}

export interface AdmissionContact {
  phone: string[];
  email: string;
  address: string;
  officeHours: string;
}

export interface AdmissionOverview {
  title: string;
  description: string;
}

export interface AdmissionData {
  overview: AdmissionOverview;
  process: AdmissionProcessStep[];
  requirements: {
    level1: AdmissionRequirements;
    level2: AdmissionRequirements;
    level3: AdmissionRequirements;
    huffaz: AdmissionRequirements;
  };
  feeStructure: FeeStructure;
  importantDates: ImportantDate[];
  contact: AdmissionContact;
}

/**
 * Get admission data from Appwrite database with caching
 * Falls back to empty structure if DB not available
 */
export async function getAdmissionData(language: string = "en"): Promise<AdmissionData> {
  const now = Date.now();

  // Return cached data if still fresh
  if (admissionCache[language] && (now - cacheTimestamp) < CACHE_DURATION) {
    return admissionCache[language];
  }

  // Default fallback structure
  const defaultData: Record<string, AdmissionData> = {
    en: {
      overview: {
        title: "Admission Overview",
        description: "Comprehensive admission information for Manzil International Institute",
      },
      process: [],
      requirements: {
        level1: { age: "Below 6 years", academic: [], documents: [] },
        level2: { age: "Below 9 years", academic: [], documents: [] },
        level3: { age: "Below 12 years", academic: [], documents: [] },
        huffaz: { age: "Below 12 years", academic: [], documents: [] },
      },
      feeStructure: {
        oneTime: [],
        monthly: { tuition: [], residential: [], food: [] },
      },
      importantDates: [],
      contact: {
        phone: [],
        email: "",
        address: "",
        officeHours: "",
      },
    },
    bn: {
      overview: {
        title: "ভর্তি ওভারভিউ",
        description: "মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটের জন্য বিস্তারিত ভর্তি তথ্য",
      },
      process: [],
      requirements: {
        level1: { age: "৬ বছরের নিচে", academic: [], documents: [] },
        level2: { age: "৯ বছরের নিচে", academic: [], documents: [] },
        level3: { age: "১২ বছরের নিচে", academic: [], documents: [] },
        huffaz: { age: "১২ বছরের নিচে", academic: [], documents: [] },
      },
      feeStructure: {
        oneTime: [],
        monthly: { tuition: [], residential: [], food: [] },
      },
      importantDates: [],
      contact: {
        phone: [],
        email: "",
        address: "",
        officeHours: "",
      },
    },
  };

  // If collection not configured, return default
  if (!COLLECTIONS.ADMISSION_DATA) {
    return defaultData[language] || defaultData.en;
  }

  try {
    const { databases } = await createAdminClient();

    // Get admission data from database
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMISSION_DATA,
      [Query.equal("language", language), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      
      // Parse JSON fields if stored as string
      let processSteps: AdmissionProcessStep[] = [];
      let requirements: AdmissionData["requirements"] = defaultData[language].requirements;
      let feeStructure: FeeStructure = defaultData[language].feeStructure;
      let importantDates: ImportantDate[] = [];

      if (doc.process && typeof doc.process === "string") {
        try {
          processSteps = JSON.parse(doc.process);
        } catch {
          processSteps = [];
        }
      } else if (Array.isArray(doc.process)) {
        processSteps = doc.process;
      }

      if (doc.requirements && typeof doc.requirements === "string") {
        try {
          requirements = JSON.parse(doc.requirements);
        } catch {
          requirements = defaultData[language].requirements;
        }
      } else if (doc.requirements) {
        requirements = doc.requirements;
      }

      if (doc.feeStructure && typeof doc.feeStructure === "string") {
        try {
          feeStructure = JSON.parse(doc.feeStructure);
        } catch {
          feeStructure = defaultData[language].feeStructure;
        }
      } else if (doc.feeStructure) {
        feeStructure = doc.feeStructure;
      }

      if (doc.importantDates && typeof doc.importantDates === "string") {
        try {
          importantDates = JSON.parse(doc.importantDates);
        } catch {
          importantDates = [];
        }
      } else if (Array.isArray(doc.importantDates)) {
        importantDates = doc.importantDates;
      }

      // Parse contact info
      let contact: AdmissionContact = defaultData[language].contact;
      if (doc.contact && typeof doc.contact === "string") {
        try {
          contact = JSON.parse(doc.contact);
        } catch {
          contact = defaultData[language].contact;
        }
      } else if (doc.contact) {
        contact = doc.contact;
      }

      const result = {
        overview: {
          title: doc.title || defaultData[language].overview.title,
          description: doc.description || defaultData[language].overview.description,
        },
        process: processSteps,
        requirements,
        feeStructure,
        importantDates,
        contact,
      };

      // Cache the result
      admissionCache[language] = result;
      cacheTimestamp = now;

      return result;
    }

    // Cache default data for missing entries
    admissionCache[language] = defaultData[language] || defaultData.en;
    cacheTimestamp = now;

    return defaultData[language] || defaultData.en;
  } catch (error) {
    console.error("Error fetching admission data:", error);
    return defaultData[language] || defaultData.en;
  }
}

/**
 * Update admission data (admin only)
 */
export async function updateAdmissionData(
  language: string,
  data: Partial<AdmissionData>,
  updatedBy: string
) {
  if (!COLLECTIONS.ADMISSION_DATA) {
    throw new Error("Admission data collection not configured");
  }

  try {
    const { databases } = await createAdminClient();

    // Check if document exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ADMISSION_DATA,
      [Query.equal("language", language), Query.limit(1)]
    );

    const docData: Record<string, any> = {
      language,
      title: data.overview?.title,
      description: data.overview?.description,
      process: data.process ? JSON.stringify(data.process) : null,
      requirements: data.requirements ? JSON.stringify(data.requirements) : null,
      feeStructure: data.feeStructure ? JSON.stringify(data.feeStructure) : null,
      importantDates: data.importantDates ? JSON.stringify(data.importantDates) : null,
      contact: data.contact ? JSON.stringify(data.contact) : null,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    };

    // Remove null values
    Object.keys(docData).forEach((key) => {
      if (docData[key] === null) delete docData[key];
    });

    if (existing.documents.length > 0) {
      // Update existing
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ADMISSION_DATA,
        existing.documents[0].$id,
        docData
      );
      // Invalidate cache after update
      await invalidateAdmissionCache();
      return { success: true, docId: existing.documents[0].$id };
    } else {
      // Create new
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ADMISSION_DATA,
        "unique()",
        docData
      );
      // Invalidate cache after create
      await invalidateAdmissionCache();
      return { success: true, docId: result.$id };
    }
  } catch (error) {
    console.error("Error updating admission data:", error);
    throw error;
  }
}