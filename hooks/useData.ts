import { useQuery } from '@tanstack/react-query';
import { getAdmissionData } from '@/lib/actions/admission';
import { getMICCurriculum, getMNCCurriculum } from '@/lib/actions/curriculum';
import type { Language, AdmissionData, MICCurriculumData, MNCCurriculumData } from '@/types/api';

// Simulate API delay for better UX
const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Default fallback data (same as in actions) - used for initial render
const defaultAdmissionData: Record<Language, any> = {
  en: {
    overview: { title: "Admission", description: "Loading..." },
    process: [],
    requirements: { level1: { age: "", academic: [], documents: [] }, level2: { age: "", academic: [], documents: [] }, level3: { age: "", academic: [], documents: [] }, huffaz: { age: "", academic: [], documents: [] } },
    feeStructure: { oneTime: [], monthly: { tuition: [], residential: [], food: [] } },
    importantDates: [],
    contact: { phone: [], email: "", address: "", officeHours: "" },
  },
  bn: {
    overview: { title: "ভর্তি", description: "লোড হচ্ছে..." },
    process: [],
    requirements: { level1: { age: "", academic: [], documents: [] }, level2: { age: "", academic: [], documents: [] }, level3: { age: "", academic: [], documents: [] }, huffaz: { age: "", academic: [], documents: [] } },
    feeStructure: { oneTime: [], monthly: { tuition: [], residential: [], food: [] } },
    importantDates: [],
    contact: { phone: [], email: "", address: "", officeHours: "" },
  },
};

const defaultMICData: Record<Language, any> = {
  en: {
    overview: { totalLevels: 6, levelsLabel: "Levels", totalYears: 22, yearsLabel: "Years", ageRange: "4-25", ageRangeLabel: "Years", streamsLabel: "Streams" },
    title: "Manzil International Curriculum",
    subtitle: "Loading...",
    levels: [],
    sectionTitles: { curriculumLevels: "", keyFeatures: "", specialPrograms: "", ctaTitle: "", ctaDescription: "", contactButton: "Apply Now", downloadButton: "Download" },
    keyFeatures: [],
  },
  bn: {
    overview: { totalLevels: 6, levelsLabel: "লেভেল", totalYears: 22, yearsLabel: "বছর", ageRange: "৪-২৫", ageRangeLabel: "বছর", streamsLabel: "স্ট্রিম" },
    title: "মানযিল আন্তর্জাতিক কারিকুলাম",
    subtitle: "লোড হচ্ছে...",
    levels: [],
    sectionTitles: { curriculumLevels: "", keyFeatures: "", specialPrograms: "", ctaTitle: "", ctaDescription: "", contactButton: "আবেদন করুন", downloadButton: "ডাউনলোড" },
    keyFeatures: [],
  },
};

const defaultMNCData: Record<Language, any> = {
  en: {
    overview: { totalLevels: 7, levelsLabel: "Stages", totalYears: 7, yearsLabel: "Years", ageRange: "10-20", ageRangeLabel: "Years", streamsLabel: "Streams" },
    sectionTitles: { curriculumLevels: "", specialPrograms: "", kitabVibag: "", seventhHour: "", technicalNctb: "", hifzSection: "", ctaTitle: "", ctaDescription: "", contactButton: "Apply Now", downloadButton: "Download" },
    levels: [],
  },
  bn: {
    overview: { totalLevels: 7, levelsLabel: "পর্যায়", totalYears: 7, yearsLabel: "বছর", ageRange: "১০-২০", ageRangeLabel: "বছর", streamsLabel: "স্ট্রিম" },
    sectionTitles: { curriculumLevels: "", specialPrograms: "", kitabVibag: "", seventhHour: "", technicalNctb: "", hifzSection: "", ctaTitle: "", ctaDescription: "", contactButton: "আবেদন করুন", downloadButton: "ডাউনলোড" },
    levels: [],
  },
};

/**
 * Hook to fetch admission data from Appwrite database
 */
export function useAdmissionData(language: Language = 'en') {
  return useQuery<AdmissionData>({
    queryKey: ['admission-data', language],
    queryFn: async () => {
      const data = await getAdmissionData(language);
      return (data as any) || defaultAdmissionData[language] || defaultAdmissionData.en;
    },
    initialData: (defaultAdmissionData[language] || defaultAdmissionData.en) as AdmissionData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Hook to fetch MIC (Manzil International Curriculum) data from Appwrite
 */
export function useMICCurriculum(language: Language = 'en') {
  return useQuery<MICCurriculumData>({
    queryKey: ['mic-curriculum', language],
    queryFn: async () => {
      const data = await getMICCurriculum(language);
      return (data as any) || defaultMICData[language] || defaultMICData.en;
    },
    initialData: (defaultMICData[language] || defaultMICData.en) as MICCurriculumData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Hook to fetch MNC (Madrasa) curriculum data from Appwrite
 */
export function useMNCCurriculum(language: Language = 'en') {
  return useQuery<MNCCurriculumData>({
    queryKey: ['mnc-curriculum', language],
    queryFn: async () => {
      const data = await getMNCCurriculum(language);
      return (data as any) || defaultMNCData[language] || defaultMNCData.en;
    },
    initialData: (defaultMNCData[language] || defaultMNCData.en) as MNCCurriculumData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}