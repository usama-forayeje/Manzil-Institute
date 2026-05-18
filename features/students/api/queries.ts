import { useInfiniteQuery, queryOptions } from '@tanstack/react-query';
import { getStudentsInfinite } from './service';
import { getStudents } from '@/lib/actions/student';
import { useStudentTableStore } from '../store/useStudentTableStore';
import { StudentTableResponse, ApiResponse } from '../types';

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: any) => [...studentKeys.lists(), filters] as const,
};

export const studentsQueryOptions = (filters: any = {}) => queryOptions({
  queryKey: studentKeys.list(filters),
  queryFn: () => getStudents(filters),
});

export function useInfiniteStudents(overrides?: { search?: string; status?: string; departmentId?: string; classId?: string; boardingType?: string }) {
  const store = useStudentTableStore();
  
  const filters = {
    search: overrides?.search ?? store.search,
    status: overrides?.status ?? store.status,
    departmentId: overrides?.departmentId ?? store.departmentId,
    classId: overrides?.classId ?? store.classId,
    boardingType: overrides?.boardingType ?? store.boardingType,
  };

  return useInfiniteQuery<ApiResponse<StudentTableResponse>, Error>({
    queryKey: studentKeys.list(filters),
    queryFn: ({ pageParam }) => getStudentsInfinite({ 
      pageParam: pageParam as string | undefined, 
      ...filters 
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      // Small fix: Ensure we only return nextCursor if we actually have data
      if (lastPage.success && lastPage.data && lastPage.data.documents.length === 20) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    staleTime: 30000, 
    refetchOnWindowFocus: false,
  });
}
