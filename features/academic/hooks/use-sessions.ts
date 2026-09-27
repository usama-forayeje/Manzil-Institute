'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  upsertSession, 
  deleteSession,
  type SessionParams 
} from '@/lib/actions/academic';
import { sessionsQueryOptions, academicKeys } from '@/features/academic/api/queries';
import { useRealtimeTable } from '@/lib/appwrite/realtime';
import { COLLECTIONS } from '@/config/appwrite';

export function useSessions() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');

  // Realtime updates (docs/appwrite.md §3.7)
  useRealtimeTable({
    tableId: COLLECTIONS.SESSIONS,
    queryKey: academicKeys.sessions(),
  });

  const [formData, setFormData] = useState({
    sessionName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    isActive: true,
    isCurrent: false,
  });


  const sessionsQuery = useQuery(sessionsQueryOptions);
  const sessions = sessionsQuery.data?.success ? (sessionsQuery.data.sessions as any[]) : [];

  const upsertMutation = useMutation({
    mutationFn: async (payload: SessionParams) => {
      const res = await upsertSession(payload);
      if (!res.success) throw new Error(res.error || 'সেভ করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success(selectedId ? 'সেশন সফলভাবে আপডেট হয়েছে' : 'নতুন সেশন যুক্ত করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.sessions() });
      setIsDialogOpen(false);
    },
    onError: (error: any) => toast.error(error.message)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteSession(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('সেশন সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: academicKeys.sessions() });
    },
    onError: (error: any) => toast.error(error.message)
  });

  const handleOpenAdd = () => {
    setSelectedId(null);
    setFormData({
      sessionName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      isActive: true,
      isCurrent: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (sess: any) => {
    setSelectedId(sess.$id);
    setFormData({
      sessionName: sess.sessionName || '',
      startDate: sess.startDate ? new Date(sess.startDate).toISOString().split('T')[0] : '',
      endDate: sess.endDate ? new Date(sess.endDate).toISOString().split('T')[0] : '',
      isActive: sess.isActive ?? true,
      isCurrent: sess.isCurrent ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.sessionName) {
      toast.error('সেশনের নাম আবশ্যক');
      return;
    }
    upsertMutation.mutate({ ...formData, docId: selectedId || undefined });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' সেশনটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  return {
    sessions,
    isLoading: sessionsQuery.isLoading,
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
