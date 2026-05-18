'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  upsertSection, 
  deleteSection,
  type SectionParams 
} from '@/lib/actions/academic';
import { sectionsQueryOptions, academicKeys } from '@/features/academic/api/queries';

export function useSections() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const [formData, setFormData] = useState({
    sectionName: '',
    sectionNameBn: '',
    capacity: 40,
    isActive: true,
  });

  const sectionQuery = useQuery(sectionsQueryOptions);
  const sections = sectionQuery.data?.success ? (sectionQuery.data.sections as any[]) : [];

  const upsertMutation = useMutation({
    mutationFn: async (payload: SectionParams) => {
      const res = await upsertSection(payload);
      if (!res.success) throw new Error(res.error || 'সেভ করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success(selectedId ? 'শাখা সফলভাবে আপডেট হয়েছে' : 'নতুন শাখা যুক্ত করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.sections() });
      setIsDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteSection(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('শাখা সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.sections() });
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleOpenAdd = () => {
    setSelectedId(null);
    setFormData({
      sectionName: '',
      sectionNameBn: '',
      capacity: 40,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (sec: any) => {
    setSelectedId(sec.$id);
    setFormData({
      sectionName: sec.sectionName || '',
      sectionNameBn: sec.sectionNameBn || '',
      capacity: sec.capacity || 40,
      isActive: sec.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.sectionNameBn || !formData.sectionName) {
      toast.error('শাখার নাম (ইংরেজি ও বাংলা) আবশ্যক');
      return;
    }
    upsertMutation.mutate({ ...formData, docId: selectedId || undefined });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' শাখাটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  return {
    sections,
    isLoading: sectionQuery.isLoading,
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
