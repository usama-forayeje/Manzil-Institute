'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getStudents, deleteStudent } from '@/lib/actions/student';
import { studentsQueryOptions, studentKeys } from '@/features/students/api/queries';

export function useStudents() {
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const studentsQuery = useQuery(studentsQueryOptions({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    search: globalFilter
  }));

  const queryData = studentsQuery.data as any;
  const students = queryData?.success ? (queryData.students as any[]) : [];
  const total = queryData?.success ? (queryData.total as number) : 0;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteStudent(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে');
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
    isLoading: studentsQuery.isLoading,
    isFetching: studentsQuery.isFetching,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    handleDelete,
    isPending: deleteMutation.isPending,
    activeDeleteId: deleteMutation.isPending ? deleteMutation.variables : null
  };
}
