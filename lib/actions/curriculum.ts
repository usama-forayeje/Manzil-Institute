"use server";

import { createAdminClient } from "@/lib/appwrite/server";
import { DATABASE_ID, COLLECTIONS } from "@/config/appwrite";
import { Query } from "appwrite";

// ─── Server-side Cache ───────────────────────────────────────
let micCache: Record<string, MICCurriculumData> = {};
let mncCache: Record<string, MNCCurriculumData> = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Invalidate curriculum cache
 */
export async function invalidateCurriculumCache(): Promise<void> {
  micCache = {};
  mncCache = {};
  cacheTimestamp = 0;
}

/**
 * Types for Curriculum Data - MIC (Manzil International Curriculum)
 */
export interface MICCurriculumLevel {
  level: string;
  title: string;
  age: string;
  duration: string;
  color: string;
  icon: string;
  darseNizami: string;
  generalEducation: string[];
  internationalEducation: string[];
  technicalActivities: string[];
  languageSports: string[];
  economyTarbiyah: string[];
  foodSurvival: string[];
}

export interface MICKeyFeature {
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface MICSectionTitles {
  curriculumLevels: string;
  keyFeatures: string;
  specialPrograms: string;
  ctaTitle: string;
  ctaDescription: string;
  contactButton: string;
  downloadButton: string;
}

export interface MICOverview {
  totalLevels: number;
  levelsLabel: string;
  totalYears: number;
  yearsLabel: string;
  ageRange: string;
  ageRangeLabel: string;
  streamsLabel: string;
}

export interface MICCurriculumData {
  overview: MICOverview;
  title: string;
  subtitle: string;
  levels: MICCurriculumLevel[];
  sectionTitles: MICSectionTitles;
  keyFeatures: MICKeyFeature[];
}

/**
 * Types for Curriculum Data - MNC (Madrasa)
 */
export interface MNCCurriculumLevel {
  level: string;
  title: string;
  age: string;
  duration: string;
  color: string;
  icon: string;
  madrasaLabel: string;
  generalLabel: string;
  technicalLabel: string;
  description: string;
  subjects: {
    madrasa: string[];
    general: string[];
    technical: string[];
  };
}

export interface MNCSectionTitles {
  curriculumLevels: string;
  specialPrograms: string;
  kitabVibag: string;
  seventhHour: string;
  technicalNctb: string;
  hifzSection: string;
  ctaTitle: string;
  ctaDescription: string;
  contactButton: string;
  downloadButton: string;
}

export interface MNCOverview {
  totalLevels: number;
  levelsLabel: string;
  totalYears: number;
  yearsLabel: string;
  ageRange: string;
  ageRangeLabel: string;
  streamsLabel: string;
}

export interface MNCCurriculumData {
  overview: MNCOverview;
  sectionTitles: MNCSectionTitles;
  levels: MNCCurriculumLevel[];
}

/**
 * Get MIC (Manzil International Curriculum) data from Appwrite with caching
 */
export async function getMICCurriculum(language: string = "en"): Promise<MICCurriculumData> {
  const now = Date.now();

  // Return cached data if still fresh
  if (micCache[language] && (now - cacheTimestamp) < CACHE_DURATION) {
    return micCache[language];
  }

  // Default fallback
  const defaultData: Record<string, MICCurriculumData> = {
    en: {
      overview: {
        totalLevels: 6,
        levelsLabel: "Levels",
        totalYears: 22,
        yearsLabel: "Years",
        ageRange: "4-25",
        ageRangeLabel: "Years",
        streamsLabel: "Streams",
      },
      title: "Manzil International Curriculum",
      subtitle: "MIC - An Integrated Education System",
      levels: [],
      sectionTitles: {
        curriculumLevels: "Complete Curriculum Roadmap (22 Years)",
        keyFeatures: "Key Features of MIC System",
        specialPrograms: "Special Programs",
        ctaTitle: "Join the Future of Integrated Education",
        ctaDescription: "Start your journey with Manzil International Curriculum today",
        contactButton: "Apply Now",
        downloadButton: "Download Full Curriculum",
      },
      keyFeatures: [],
    },
    bn: {
      overview: {
        totalLevels: 6,
        levelsLabel: "লেভেল",
        totalYears: 22,
        yearsLabel: "বছর",
        ageRange: "৪-২৫",
        ageRangeLabel: "বছর",
        streamsLabel: "স্ট্রিম",
      },
      title: "মানযিল আন্তর্জাতিক কারিকুলাম",
      subtitle: "এমআইসি - একটি সমন্বিত শিক্ষা ব্যবস্থা",
      levels: [],
      sectionTitles: {
        curriculumLevels: "সম্পূর্ণ কারিকুলাম রোডম্যাপ (২২ বছর)",
        keyFeatures: "এমআইসি ব্যবস্থার প্রধান বৈশিষ্ট্য",
        specialPrograms: "বিশেষ প্রোগ্রামসমূহ",
        ctaTitle: "সমন্বিত শিক্ষার ভবিষ্যতে যোগ দিন",
        ctaDescription: "আজই শুরু করুন মানযিল আন্তর্জাতিক কারিকুলামের যাত্রা",
        contactButton: "এখনই আবেদন করুন",
        downloadButton: "সম্পূর্ণ কারিকুলাম ডাউনলোড",
      },
      keyFeatures: [],
    },
  };

  if (!COLLECTIONS.CURRICULUM_DATA) {
    return defaultData[language] || defaultData.en;
  }

  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CURRICULUM_DATA,
      [Query.equal("curriculum_type", "mic"), Query.equal("language", language), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      
      // Parse JSON fields
      let levels: MICCurriculumLevel[] = [];
      let keyFeatures: MICKeyFeature[] = [];

      if (doc.levels && typeof doc.levels === "string") {
        try { levels = JSON.parse(doc.levels); } catch { levels = []; }
      } else if (Array.isArray(doc.levels)) {
        levels = doc.levels;
      }

      if (doc.keyFeatures && typeof doc.keyFeatures === "string") {
        try { keyFeatures = JSON.parse(doc.keyFeatures); } catch { keyFeatures = []; }
      } else if (Array.isArray(doc.keyFeatures)) {
        keyFeatures = doc.keyFeatures;
      }

      let sectionTitles: MICSectionTitles = defaultData[language].sectionTitles;
      if (doc.sectionTitles && typeof doc.sectionTitles === "string") {
        try { sectionTitles = JSON.parse(doc.sectionTitles); } catch { sectionTitles = defaultData[language].sectionTitles; }
      } else if (doc.sectionTitles) {
        sectionTitles = doc.sectionTitles;
      }

      let overview: MICOverview = defaultData[language].overview;
      if (doc.overview && typeof doc.overview === "string") {
        try { overview = JSON.parse(doc.overview); } catch { overview = defaultData[language].overview; }
      } else if (doc.overview) {
        overview = doc.overview;
      }

      const result = {
        overview,
        title: doc.title || defaultData[language].title,
        subtitle: doc.subtitle || defaultData[language].subtitle,
        levels,
        sectionTitles,
        keyFeatures,
      };

      // Cache the result
      micCache[language] = result;
      cacheTimestamp = now;

      return result;
    }

    // Cache default data
    micCache[language] = defaultData[language] || defaultData.en;
    cacheTimestamp = now;

    return defaultData[language] || defaultData.en;
  } catch (error) {
    console.error("Error fetching MIC curriculum:", error);
    return defaultData[language] || defaultData.en;
  }
}

/**
 * Get MNC (Madrasa) curriculum data from Appwrite with caching
 */
export async function getMNCCurriculum(language: string = "en"): Promise<MNCCurriculumData> {
  const now = Date.now();

  // Return cached data if still fresh
  if (mncCache[language] && (now - cacheTimestamp) < CACHE_DURATION) {
    return mncCache[language];
  }

  const defaultData: Record<string, MNCCurriculumData> = {
    en: {
      overview: {
        totalLevels: 7,
        levelsLabel: "Stages",
        totalYears: 7,
        yearsLabel: "Years",
        ageRange: "10-20",
        ageRangeLabel: "Years",
        streamsLabel: "Streams",
      },
      sectionTitles: {
        curriculumLevels: "Curriculum Stages",
        specialPrograms: "Special Programs",
        kitabVibag: "Kitab Vibag (Textbook Section)",
        seventhHour: "7th Hour Special Classes",
        technicalNctb: "Technical & NCTB Classes",
        hifzSection: "Hifz-ul-Quran Program",
        ctaTitle: "Ready to Join Our Educational Journey?",
        ctaDescription: "Start your comprehensive Islamic and modern education today",
        contactButton: "Apply Now",
        downloadButton: "Download Brochure",
      },
      levels: [],
    },
    bn: {
      overview: {
        totalLevels: 7,
        levelsLabel: "পর্যায়",
        totalYears: 7,
        yearsLabel: "বছর",
        ageRange: "১০-২০",
        ageRangeLabel: "বছর",
        streamsLabel: "স্ট্রিম",
      },
      sectionTitles: {
        curriculumLevels: "কারিকুলাম পর্যায়",
        specialPrograms: "বিশেষ প্রোগ্রাম",
        kitabVibag: "কিতাব বিভাগ (পাঠ্য বইয়ের অংশ)",
        seventhHour: "৭ম ঘণ্টার বিশেষ ক্লাস",
        technicalNctb: "কারিগরি ও এনসিটিবি ক্লাস",
        hifzSection: "হিফজুল কুরআন প্রোগ্রাম",
        ctaTitle: "আমাদের শিক্ষা যাত্রায় যোগ দিতে প্রস্তুত?",
        ctaDescription: "আজই শুরু করুন আপনার সমন্বিত ইসলামিক ও আধুনিক শিক্ষা",
        contactButton: "এখনই আবেদন করুন",
        downloadButton: "ব্রোশার ডাউনলোড",
      },
      levels: [],
    },
  };

  if (!COLLECTIONS.CURRICULUM_DATA) {
    return defaultData[language] || defaultData.en;
  }

  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CURRICULUM_DATA,
      [Query.equal("curriculum_type", "mnc"), Query.equal("language", language), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      
      let levels: MNCCurriculumLevel[] = [];
      if (doc.levels && typeof doc.levels === "string") {
        try { levels = JSON.parse(doc.levels); } catch { levels = []; }
      } else if (Array.isArray(doc.levels)) {
        levels = doc.levels;
      }

      let sectionTitles: MNCSectionTitles = defaultData[language].sectionTitles;
      if (doc.sectionTitles && typeof doc.sectionTitles === "string") {
        try { sectionTitles = JSON.parse(doc.sectionTitles); } catch { sectionTitles = defaultData[language].sectionTitles; }
      } else if (doc.sectionTitles) {
        sectionTitles = doc.sectionTitles;
      }

      let overview: MNCOverview = defaultData[language].overview;
      if (doc.overview && typeof doc.overview === "string") {
        try { overview = JSON.parse(doc.overview); } catch { overview = defaultData[language].overview; }
      } else if (doc.overview) {
        overview = doc.overview;
      }

      const result = { overview, sectionTitles, levels };

      // Cache the result
      mncCache[language] = result;
      cacheTimestamp = now;

      return result;
    }

    // Cache default data
    mncCache[language] = defaultData[language] || defaultData.en;
    cacheTimestamp = now;

    return defaultData[language] || defaultData.en;
  } catch (error) {
    console.error("Error fetching MNC curriculum:", error);
    return defaultData[language] || defaultData.en;
  }
}

/**
 * Update curriculum data (admin only)
 */
export async function updateCurriculumData(
  curriculumType: "mic" | "mnc",
  language: string,
  data: Partial<MICCurriculumData | MNCCurriculumData>,
  updatedBy: string
) {
  if (!COLLECTIONS.CURRICULUM_DATA) {
    throw new Error("Curriculum data collection not configured");
  }

  try {
    const { databases } = await createAdminClient();

    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CURRICULUM_DATA,
      [
        Query.equal("curriculum_type", curriculumType),
        Query.equal("language", language),
        Query.limit(1),
      ]
    );

    const docData: Record<string, any> = {
      curriculum_type: curriculumType,
      language,
      title: (data as any).title,
      subtitle: (data as any).subtitle,
      overview: (data as any).overview ? JSON.stringify((data as any).overview) : null,
      levels: (data as any).levels ? JSON.stringify((data as any).levels) : null,
      sectionTitles: (data as any).sectionTitles ? JSON.stringify((data as any).sectionTitles) : null,
      keyFeatures: (data as any).keyFeatures ? JSON.stringify((data as any).keyFeatures) : null,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    };

    // Remove null values
    Object.keys(docData).forEach((key) => {
      if (docData[key] === null) delete docData[key];
    });

    if (existing.documents.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CURRICULUM_DATA,
        existing.documents[0].$id,
        docData
      );
      // Invalidate cache after update
      await invalidateCurriculumCache();
      return { success: true, docId: existing.documents[0].$id };
    } else {
      const result = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CURRICULUM_DATA,
        "unique()",
        docData
      );
      // Invalidate cache after create
      await invalidateCurriculumCache();
      return { success: true, docId: result.$id };
    }
  } catch (error) {
    console.error("Error updating curriculum data:", error);
    throw error;
  }
}