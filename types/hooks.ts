// Hook return types

import { UseQueryResult } from '@tanstack/react-query';
import type { AdmissionData, MICCurriculumData, MNCCurriculumData, Language } from './api';

// useAdmissionData hook
export type UseAdmissionDataResult = UseQueryResult<AdmissionData>;

// useMICCurriculum hook
export type UseMICCurriculumResult = UseQueryResult<MICCurriculumData>;

// useMNCCurriculum hook
export type UseMNCCurriculumResult = UseQueryResult<MNCCurriculumData>;

// useTranslation hook
export interface UseTranslationResult {
  t: (key: string) => string;
  lang: Language;
  setLang: (lang: Language) => void;
}