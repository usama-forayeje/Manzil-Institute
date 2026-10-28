'use client';

import { useState, useMemo, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  deleteStudent,
  getStudentsInfinite,
  getStudentStatsAction,
  reactivateStudentAction,
} from '@/features/students/api/service';
import { getAllDepartments, getAllClasses, getAllSessions } from '@/lib/actions/academic';
import { studentKeys } from '@/features/students/api/queries';
import { useStudentsRealtime } from './use-students-realtime';
import type { ApiResponse, StudentTableResponse } from '@/features/students/types';

export type StudentFilterTab = 'all' | 'active' | 'departed' | 'residential' | 'non_residential';

export function useStudents() {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentFilterTab>('active');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [exitReasonFilter, setExitReasonFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });

  // Connect Realtime updates
  useStudentsRealtime();

  // Debounce search input (350ms) to avoid query spam on fast typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  // Academic Reference Data (Departments, Classes, Sessions)
  const academicDataQuery = useQuery({
    queryKey: ['academic', 'references'],
    queryFn: async () => {
      const [dRes, cRes, sRes] = await Promise.all([
        getAllDepartments(),
        getAllClasses(),
        getAllSessions(),
      ]);
      return {
        departments: dRes.departments || [],
        classes: cRes.classes || [],
        sessions: sRes.sessions || [],
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const departments = academicDataQuery.data?.departments || [];
  const allClasses = academicDataQuery.data?.classes || [];
  const sessions = academicDataQuery.data?.sessions || [];

  // Cascading classes: Filter classes by selected department
  const availableClasses = useMemo(() => {
    if (!departmentFilter || departmentFilter === 'all') return allClasses;
    return allClasses.filter((c: any) => c.departmentId === departmentFilter);
  }, [allClasses, departmentFilter]);

  const handleDepartmentChange = (deptId: string) => {
    setDepartmentFilter(deptId);
    setClassFilter('all'); // Reset child class selection
  };

  const handleResetFilters = () => {
    setDepartmentFilter('all');
    setClassFilter('all');
    setSessionFilter('all');
    setExitReasonFilter('all');
    setGlobalFilter('');
  };

  // Real-time student statistics
  const statsQuery = useQuery({
    queryKey: ['students', 'stats'],
    queryFn: async () => {
      const res = await getStudentStatsAction();
      if (!res.success || !res.data) throw new Error(res.error || 'পরিসংখ্যান লোড করা যায়নি');
      return res.data;
    },
    staleTime: 10 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  // Direct infinite query — filtered by status, academic filters, and exitReason
  const infiniteQuery = useInfiniteQuery<ApiResponse<StudentTableResponse>, Error>({
    queryKey: studentKeys.list({
      search: debouncedFilter,
      status: statusFilter,
      departmentId: departmentFilter,
      classId: classFilter,
      session: sessionFilter,
      exitReason: exitReasonFilter,
    }),
    queryFn: ({ pageParam }) =>
      getStudentsInfinite({
        pageParam: pageParam as string | undefined,
        search: debouncedFilter || undefined,
        status: statusFilter,
        departmentId: departmentFilter !== 'all' ? departmentFilter : undefined,
        classId: classFilter !== 'all' ? classFilter : undefined,
        session: sessionFilter !== 'all' ? sessionFilter : undefined,
        exitReason: exitReasonFilter !== 'all' ? exitReasonFilter : undefined,
        limit: 30, // 30 students per page for smooth infinite scroll
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
    staleTime: 10 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  // Flatten all pages into a single array, then paginate client-side
  const allStudents = useMemo(() => {
    if (!infiniteQuery.data?.pages) return [];
    return infiniteQuery.data.pages.flatMap((page) =>
      page.success && page.data ? page.data.documents : []
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
      queryClient.invalidateQueries({ queryKey: ['students', 'stats'] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await reactivateStudentAction(id);
      if (!res.success) throw new Error(res.error || 'পুনর্বহাল করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('শিক্ষার্থীকে সফলভাবে পুনর্বহাল (সক্রিয়) করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['students', 'stats'] });
    },
    onError: (error: any) => toast.error(error.message),
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' শিক্ষার্থীর রেকর্ডটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  const handleReactivate = (id: string, name: string) => {
    if (!confirm(`আপনি কি '${name}' শিক্ষার্থীকে পুনরায় সক্রিয় (Reactivate) করতে চান?`)) return;
    reactivateMutation.mutate(id);
  };

  const hasActiveAcademicFilters = Boolean(
    (departmentFilter && departmentFilter !== 'all') ||
    (classFilter && classFilter !== 'all') ||
    (sessionFilter && sessionFilter !== 'all') ||
    (exitReasonFilter && exitReasonFilter !== 'all') ||
    globalFilter
  );

  return {
    students,
    total,
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    isLoading: infiniteQuery.isLoading,
    isFetching: infiniteQuery.isFetching,
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: Boolean(infiniteQuery.hasNextPage),
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter: handleDepartmentChange,
    classFilter,
    setClassFilter,
    sessionFilter,
    setSessionFilter,
    exitReasonFilter,
    setExitReasonFilter,
    handleResetFilters,
    departments,
    availableClasses,
    sessions,
    hasActiveAcademicFilters,
    pagination,
    setPagination,
    handleDelete,
    handleReactivate,
    isPending: deleteMutation.isPending || reactivateMutation.isPending,
    activeDeleteId: deleteMutation.isPending ? deleteMutation.variables : null,
    activeReactivateId: reactivateMutation.isPending ? reactivateMutation.variables : null,
  };
}
