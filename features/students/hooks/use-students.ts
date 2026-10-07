'use client';

import { useState, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteStudent } from '@/features/students/api/service';
import { getStudentsInfinite } from '@/features/students/api/service';
import { studentKeys } from '@/features/students/api/queries';
import { useStudentsRealtime } from './use-students-realtime';
import type { ApiResponse, StudentTableResponse } from '@/features/students/types';

export function useStudents() {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });

  // Connect Realtime updates
  useStudentsRealtime();

  // Direct infinite query — bypasses zustand store to avoid stale filter state
  const infiniteQuery = useInfiniteQuery<ApiResponse<StudentTableResponse>, Error>({
    queryKey: studentKeys.list({ search: globalFilter, status: 'active' }),
    queryFn: ({ pageParam }) => getStudentsInfinite({
      pageParam: pageParam as string | undefined,
      search: globalFilter || undefined,
      status: 'active',
      limit: 50, // 50 students per page for smooth infinite scroll
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.success || !lastPage.data) return undefined;
      if (!lastPage.data.documents || lastPage.data.documents.length === 0) return undefined;
      const totalCount = lastPage.data.total ?? 0;
      const loadedCount = allPages.flatMap((p) => p.data?.documents ?? []).length;
      if (loadedCount < totalCount && lastPage.data.nextCursor) {
        return lastPage.data.nextCursor;
      }
      return undefined;
    },
    staleTime: 5 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array, then paginate client-side
  const allStudents = useMemo(() => {
    if (!infiniteQuery.data?.pages) return [];
    return infiniteQuery.data.pages.flatMap(
      (page) => (page.success && page.data ? page.data.documents : [])
    );
  }, [infiniteQuery.data]);

  const students = allStudents;

  const total = useMemo(() => {
    const pages = infiniteQuery.data?.pages;
    if (!pages || pages.length === 0) return 0;
    return pages[0]?.data?.total ?? 0;
  }, [infiniteQuery.data]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteStudent(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' শিক্ষার্থীর রেকর্ডটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  return {
    students,
    total,
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: Boolean(infiniteQuery.hasNextPage),
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    handleDelete,
    isPending: deleteMutation.isPending,
    activeDeleteId: deleteMutation.isPending ? deleteMutation.variables : null
  };
}
