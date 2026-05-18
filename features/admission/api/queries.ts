import { queryOptions } from '@tanstack/react-query';
import { 
  getDepartments, 
  getSessions, 
  getSections, 
  getClassesByDepartment,
  getBoardingTypes,
  getBoardingRooms
} from './service';

export const admissionKeys = {
  all: ['admission'] as const,
  departments: () => [...admissionKeys.all, 'departments'] as const,
  sessions: () => [...admissionKeys.all, 'sessions'] as const,
  sections: () => [...admissionKeys.all, 'sections'] as const,
  boardingTypes: () => [...admissionKeys.all, 'boarding-types'] as const,
  boardingRooms: () => [...admissionKeys.all, 'boarding-rooms'] as const,
  classes: (deptId: string) => [...admissionKeys.all, 'classes', deptId] as const,
};

export const departmentsQueryOptions = queryOptions({
  queryKey: admissionKeys.departments(),
  queryFn: () => getDepartments(),
  staleTime: 5 * 60 * 1000,
});

export const sessionsQueryOptions = queryOptions({
  queryKey: admissionKeys.sessions(),
  queryFn: () => getSessions(),
  staleTime: 10 * 60 * 1000,
});

export const sectionsQueryOptions = queryOptions({
  queryKey: admissionKeys.sections(),
  queryFn: () => getSections(),
  staleTime: 10 * 60 * 1000,
});

export const classesByDeptOptions = (deptId: string) => queryOptions({
  queryKey: admissionKeys.classes(deptId),
  queryFn: () => getClassesByDepartment(deptId),
  enabled: !!deptId,
  staleTime: 5 * 60 * 1000,
});

export const boardingTypesQueryOptions = queryOptions({
  queryKey: admissionKeys.boardingTypes(),
  queryFn: () => getBoardingTypes(),
  staleTime: 30 * 60 * 1000,
});

export const boardingRoomsQueryOptions = queryOptions({
  queryKey: admissionKeys.boardingRooms(),
  queryFn: () => getBoardingRooms(),
  staleTime: 10 * 60 * 1000,
});
