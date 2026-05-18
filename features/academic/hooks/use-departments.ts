'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  upsertDepartment, 
  deleteDepartment,
  type DepartmentParams 
} from '@/lib/actions/academic';
import { departmentsQueryOptions, academicKeys } from '@/features/academic/api/queries';

export function useDepartments() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nameBn: '',
    isActive: true,
  });

  const deptQuery = useQuery(departmentsQueryOptions);
  const departments = deptQuery.data?.success ? (deptQuery.data.departments as any[]) : [];

  const upsertMutation = useMutation({
    mutationFn: async (payload: DepartmentParams) => {
      const res = await upsertDepartment(payload);
      if (!res.success) throw new Error(res.error || 'সেভ করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success(selectedId ? 'বিভাগ সফলভাবে আপডেট হয়েছে' : 'নতুন বিভাগ যুক্ত করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.departments() });
      setIsDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteDepartment(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('বিভাগ সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.departments() });
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleOpenAdd = () => {
    setSelectedId(null);
    setFormData({ code: '', name: '', nameBn: '', isActive: true });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (dept: any) => {
    setSelectedId(dept.$id);
    setFormData({
      code: dept.code || '',
      name: dept.name || '',
      nameBn: dept.nameBn || '',
      isActive: dept.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nameBn || !formData.code) {
      toast.error('বাংলা নাম এবং কোড আবশ্যক');
      return;
    }
    upsertMutation.mutate({ ...formData, docId: selectedId || undefined });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' বিভাগটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  return {
    departments,
    isLoading: deptQuery.isLoading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    selectedId,
    globalFilter,
    setGlobalFilter,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
    isPending: upsertMutation.isPending || deleteMutation.isPending,
    activeDeleteId: deleteMutation.isPending ? deleteMutation.variables : null
  };
}
