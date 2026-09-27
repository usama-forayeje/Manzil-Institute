import { queryOptions } from '@tanstack/react-query';
import { 
  getAllDepartments, 
  getAllClasses, 
  getAllSessions, 
  getAllSections,
  getAllBoardingTypes
} from '@/lib/actions/academic';

export const academicKeys = {
  all: ['academic'] as const,
  departments: () => [...academicKeys.all, 'departments'] as const,
  classes: () => [...academicKeys.all, 'classes'] as const,
  sessions: () => [...academicKeys.all, 'sessions'] as const,
  sections: () => [...academicKeys.all, 'sections'] as const,
  boardingTypes: () => [...academicKeys.all, 'boardingTypes'] as const,
};

export const departmentsQueryOptions = queryOptions({
  queryKey: academicKeys.departments(),
  queryFn: () => getAllDepartments(),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const classesQueryOptions = queryOptions({
  queryKey: academicKeys.classes(),
  queryFn: () => getAllClasses(),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const sessionsQueryOptions = queryOptions({
  queryKey: academicKeys.sessions(),
  queryFn: () => getAllSessions(),
  staleTime: 15 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const sectionsQueryOptions = queryOptions({
  queryKey: academicKeys.sections(),
  queryFn: () => getAllSections(),
  staleTime: 15 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});

export const boardingTypesQueryOptions = queryOptions({
  queryKey: academicKeys.boardingTypes(),
  queryFn: () => getAllBoardingTypes(),
  staleTime: 15 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});
