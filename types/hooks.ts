// Hook return types

import { UseQueryResult } from '@tanstack/react-query';
import type { AdmissionData, MICCurriculumData, MNCCurriculumData, Language } from './api';

// useAdmissionData hook
export type UseAdmissionDataResult = UseQueryResult<AdmissionData>;

// useMICCurriculumData hook
export type UseMICCurriculumDataResult = UseQueryResult<MICCurriculumData>;

// useMNCCurriculumData hook
export type UseMNCCurriculumDataResult = UseQueryResult<MNCCurriculumData>;

// useTranslation hook
export interface UseTranslationResult {
  t: (key: string) => string;
  lang: Language;
  setLang: (lang: Language) => void;
}

// usePrefetchAdmissionData hook
export type UsePrefetchAdmissionDataResult = () => void;