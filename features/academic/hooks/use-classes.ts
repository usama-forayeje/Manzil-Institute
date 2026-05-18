'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  upsertClass, 
  deleteClass,
  type ClassParams 
} from '@/lib/actions/academic';
import { academicKeys, classesQueryOptions, departmentsQueryOptions } from '@/features/academic/api/queries';

export function useClasses() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const classesQuery = useQuery(classesQueryOptions);
  const departmentsQuery = useQuery(departmentsQueryOptions);
  
  const classes = classesQuery.data?.success ? (classesQuery.data.classes as any[]) : [];
  const departments = departmentsQuery.data?.success ? (departmentsQuery.data.departments as any[]) : [];

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    isActive: true,
    level: 0,
    departmentId: '',
  });

  const upsertMutation = useMutation({
    mutationFn: async (payload: ClassParams) => {
      const res = await upsertClass(payload);
      if (!res.success) throw new Error(res.error || 'সেভ করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success(selectedId ? 'ক্লাস সফলভাবে আপডেট হয়েছে' : 'নতুন ক্লাস যুক্ত করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.classes() });
      setIsDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteClass(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('ক্লাস সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.classes() });
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleOpenAdd = () => {
    setSelectedId(null);
    setFormData({
      name: '',
      nameBn: '',
      isActive: true,
      level: classes.length + 1,
      departmentId: departments[0]?.$id || '',
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cls: any) => {
    setSelectedId(cls.$id);
    setFormData({
      name: cls.name || '',
      nameBn: cls.nameBn || '',
      isActive: cls.isActive ?? true,
      level: cls.level ?? 0,
      departmentId: cls.departmentId || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nameBn || !formData.name || !formData.departmentId) {
      toast.error('ক্লাসের নাম এবং বিভাগ নির্বাচন আবশ্যক');
      return;
    }
    upsertMutation.mutate({ ...formData, docId: selectedId || undefined });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' ক্লাসটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  return {
    classes,
    departments,
    isLoading: classesQuery.isLoading || departmentsQuery.isLoading,
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
