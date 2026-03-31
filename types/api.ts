// API response types and data structures

// Language type
export type Language = 'en' | 'bn';

// Admission Data Types
export interface AdmissionData {
  overview: {
    title: string;
    description: string;
  };
  process: AdmissionStep[];
  requirements: AdmissionRequirements;
  feeStructure: FeeStructure;
  importantDates: ImportantDate[];
  contact: ContactInfo;
}

export interface AdmissionStep {
  step: string;
  title: string;
  description: string;
  duration: string;
  color: string;
  requirements: string[];
}

export interface AdmissionRequirements {
  level1: LevelRequirement;
  level2: LevelRequirement;
  level3: LevelRequirement;
  huffaz: LevelRequirement;
}

export interface LevelRequirement {
  age: string;
  academic: string[];
  documents: string[];
}

export interface FeeStructure {
  oneTime: FeeItem[];
  monthly: {
    tuition: FeeItem[];
    residential: FeeItem[];
    food: FeeItem[];
  };
}

export interface FeeItem {
  name: string;
  amount: string;
}

export interface ImportantDate {
  event: string;
  date: string;
  status: 'open' | 'upcoming' | 'completed';
}

export interface ContactInfo {
  phone: string[];
  email: string;
  address: string;
  officeHours: string;
}

// MIC Curriculum Data Types
export interface MICCurriculumData {
  overview: {
    totalLevels: number;
    levelsLabel: string;
    totalYears: number;
    yearsLabel: string;
    ageRange: string;
    ageRangeLabel: string;
    streamsLabel: string;
  };
  title: string;
  subtitle: string;
  levels: MICLevel[];
  sectionTitles: MICSectionTitles;
  keyFeatures: KeyFeature[];
}

export interface MICLevel {
  level: string;
  title: string;
  age: string;
  duration: string;
  color: string;
  icon: string;
  darseNizami: string | string[];
  generalEducation: string[];
  internationalEducation: string[];
  technicalActivities: string[];
  languageSports: string[];
  economyTarbiyah: string[];
  foodSurvival: string[];
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

export interface KeyFeature {
  title: string;
  description: string;
  color: string;
  icon: string;
}

// MNC Curriculum Data Types
export interface MNCCurriculumData {
  overview: {
    totalLevels: number;
    levelsLabel: string;
    totalYears: number;
    yearsLabel: string;
    ageRange: string;
    ageRangeLabel: string;
    streamsLabel: string;
  };
  sectionTitles: MNCSectionTitles;
  kitabVibag: KitabVibag;
  seventhHourClasses: SeventhHourClass[];
  technicalNctb: TechnicalNCTB;
  hifzSection: HifzSection;
  levels: MNCLevel[];
  specialPrograms: SpecialProgram[];
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

export interface KitabVibag {
  kafiaJamat: JamatPeriod;
  hedayetunNahwJamat: JamatPeriod;
  nahbemirMizanJamat: JamatPeriod;
  taiserKhususiJamat: JamatPeriod;
}

export interface JamatPeriod {
  name: string;
  periods: Period[];
}

export interface Period {
  hour: string;
  subject: string;
}

export interface SeventhHourClass {
  subject: string;
  category: string;
}

export interface TechnicalNCTB {
  class5: ClassSubjects;
  class6: ClassSubjects;
  class7: ClassSubjects;
  class8: ClassSubjects;
  class9: ClassSubjects;
  class10: ClassSubjects;
}

export interface ClassSubjects {
  nctb: string[];
  technical: string[] | { group1: string[]; group2: string[] };
}

export interface HifzSection {
  title: string;
  description: string;
  features: HifzFeature[];
}

export interface HifzFeature {
  title: string;
  description: string;
  schedule?: string[];
  topics?: string[];
  methods?: string[];
}

export interface MNCLevel {
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

export interface SpecialProgram {
  title: string;
  duration: string;
  color: string;
  description: string;
  features: string[];
}

// Curriculum Levels Array (from curriculumLevels in useData.js)
export interface CurriculumLevel {
  id: number;
  level: LocalizedString;
  age: LocalizedString;
  duration: LocalizedString;
  color: string;
  madrasa: string[] | LocalizedMadrasa;
  general: LocalizedGeneral;
  technical: LocalizedTechnical;
  others: LocalizedOthers;
}

export interface LocalizedString {
  bn: string;
  en: string;
}

export interface LocalizedMadrasa {
  bn: string[];
  en: string[];
}

export interface LocalizedGeneral {
  bn: string[];
  en: string[];
}

export interface LocalizedTechnical {
  bn: string[];
  en: string[];
}

export interface LocalizedOthers {
  bn: string[];
  en: string[];
}

// Translation types
export interface Translations {
  en: Record<string, string>;
  bn: Record<string, string>;
}