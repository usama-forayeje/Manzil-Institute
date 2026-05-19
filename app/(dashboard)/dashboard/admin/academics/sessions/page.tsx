'use client';

import React, { useMemo } from 'react';
import { 
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/react-table';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check,
  Calendar,
  Clock,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Reusable Components
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useSessions } from '@/features/academic/hooks/use-sessions';
import { DatePicker } from '@/components/ui/DatePicker';

export default function SessionsPage() {
  const {
    sessions,
    isLoading,
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
    isPending,
    activeDeleteId
  } = useSessions();

  // Columns Configuration
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'sessionName',
      header: 'শিক্ষাবর্ষ (Session)',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 pl-4">
          <div className="h-8 w-8 rounded-md bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
            <Calendar className={cn("h-4 w-4", row.original.isCurrent ? "text-[#00AEEF]" : "text-zinc-400")} />
          </div>
          <p className={cn("font-black tracking-tight", row.original.isCurrent ? "text-zinc-900 dark:text-zinc-50 text-base" : "text-zinc-500 text-sm")}>
            {row.getValue('sessionName')}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: 'সময়কাল',
      cell: ({ row }) => {
        const start = row.getValue('startDate') as string;
        const end = row.original.endDate as string;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400">
               <Clock className="h-3 w-3" />
               <span>{start ? format(new Date(start), 'MMM yyyy') : '--'} — {end ? format(new Date(end), 'MMM yyyy') : '--'}</span>
            </div>
            <p className="text-[9px] text-zinc-400 font-bold italic kalpurush-font leading-none">{start ? format(new Date(start), 'MMMM yyyy', { locale: bn }) : ''}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'isCurrent',
      header: () => <div className="text-center">Current</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.getValue('isCurrent') ? (
            <div className="bg-cyan-50 dark:bg-cyan-500/10 text-[#00AEEF] px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-cyan-100/50 dark:border-cyan-500/20 shadow-sm">
              Current
            </div>
          ) : (
            <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <div className={cn(
            "h-8 w-8 rounded-md flex items-center justify-center transition-all shadow-sm",
            row.getValue('isActive')
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" 
              : "bg-zinc-50 text-zinc-300 dark:bg-zinc-800"
          )}>
             <Check className={cn("h-4 w-4", !row.getValue('isActive') && "opacity-20")} />
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pr-4">
          <Button
            variant="ghost" size="icon"
            onClick={() => handleOpenEdit(row.original)}
            className="h-9 w-9 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-[#00AEEF]"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={() => handleDelete(row.original.$id, row.original.sessionName)}
            className="h-9 w-9 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600"
            disabled={isPending}
          >
            {activeDeleteId === row.original.$id ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    }
  ], [isPending, activeDeleteId, handleOpenEdit, handleDelete]);

  const table = useReactTable({
    data: sessions,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto py-6">
      <FeatureHeader 
        title="সেশন ব্যবস্থাপনা"
        description="প্রতিষ্ঠানের শিক্ষাবর্ষসমূহ এবং সেশন ক্যালেন্ডার পরিচালনা করুন"
        icon={Calendar}
        onAdd={handleOpenAdd}
        addLabel="নতুন সেশন"
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="সেশন খুঁজুন..."
      />

      <FeatureTable 
        table={table}
        isLoading={isLoading}
        emptyIcon={Calendar}
        emptyText="কোনো সেশন খুঁজে পাওয়া যায়নি"
        emptySubtext="নতুন সেশন যোগ করতে উপরের বাটনে ক্লিক করুন"
        columnCount={5}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl kalpurush-font p-0 overflow-hidden rounded-xl border-0 flex flex-col shadow-2xl bg-white dark:bg-zinc-900">
          <DialogHeader className="p-6 md:p-8 bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20">
                <Calendar className="h-6 w-6 text-[#00AEEF]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedId ? 'সেশন আপডেট করুন' : 'নতুন সেশন যুক্ত করুন'}</DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] mt-1 uppercase tracking-wider">Academic Session Configuration Wizard</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">শিক্ষাবর্ষের নাম (যেমন: 2026-2027)</Label>
                <Input 
                  placeholder="2026-2027" 
                  value={formData.sessionName}
                  onChange={e => setFormData(p => ({ ...p, sessionName: e.target.value }))}
                  className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border-transparent focus:ring-[#00AEEF] focus:border-[#00AEEF]/20 font-black text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">শুরুর তারিখ</Label>
                <DatePicker 
                  date={formData.startDate ? new Date(formData.startDate) : undefined}
                  setDate={(date) => setFormData(p => ({ ...p, startDate: date ? format(date, 'yyyy-MM-dd') : '' }))}
                  placeholder="শুরুর তারিখ..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">শেষ তারিখ</Label>
                <DatePicker 
                  date={formData.endDate ? new Date(formData.endDate) : undefined}
                  setDate={(date) => setFormData(p => ({ ...p, endDate: date ? format(date, 'yyyy-MM-dd') : '' }))}
                  placeholder="শেষের তারিখ..."
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100/50 dark:border-cyan-500/10 transition-colors hover:bg-cyan-50/80 mt-2">
                 <div className="space-y-0.5">
                   <p className="text-xs font-black uppercase tracking-tight text-[#00AEEF]">Set Current Session</p>
                   <p className="text-[9px] text-zinc-400 font-bold uppercase italic">বর্তমান শিক্ষাবর্ষ হিসেবে সেভ করুন</p>
                 </div>
                 <Switch checked={formData.isCurrent} onCheckedChange={c => setFormData(p => ({ ...p, isCurrent: c }))} className="scale-90 data-[state=checked]:bg-[#00AEEF]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors hover:bg-zinc-50 mt-2">
                 <div className="space-y-0.5">
                   <p className="text-xs font-black uppercase tracking-tight">Active Status</p>
                   <p className="text-[9px] text-zinc-400 font-bold uppercase italic italic">সক্রিয় স্ট্যাটাস</p>
                 </div>
                 <Switch checked={formData.isActive} onCheckedChange={c => setFormData(p => ({ ...p, isActive: c }))} className="scale-90 data-[state=checked]:bg-[#00AEEF]" />
              </div>

            </div>
          </div>

          <DialogFooter className="p-8 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/50 gap-3">
             <Button 
               variant="ghost" type="button"
               onClick={() => setIsDialogOpen(false)}
               className="rounded-md px-8 h-12 font-black uppercase text-[10px] tracking-widest text-zinc-400"
               disabled={isPending}
             >
               বাতিল
             </Button>
             <Button
               type="button"
               onClick={handleSave}
               disabled={isPending}
               className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-12 h-12 font-black uppercase text-[10px] tracking-[0.1em] shadow-xl shadow-cyan-500/10 active:scale-95 transition-all flex items-center gap-2 border-0"
             >
               {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
               {selectedId ? 'পরিবর্তন সেভ করুন' : 'সেশন যোগ করুন'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
