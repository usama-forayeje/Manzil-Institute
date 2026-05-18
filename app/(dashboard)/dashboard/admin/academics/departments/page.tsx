'use client';

import React, { useMemo } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/react-table';
import { 
  Building, 
  Trash2, 
  Edit, 
  Check,
  Barcode,
  BookOpen,
  Loader2,
  LayoutGrid
} from 'lucide-react';
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
import { FeatureStats } from '@/components/dashboard/shared/FeatureStats';
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useDepartments } from '@/features/academic/hooks/use-departments';

export default function DepartmentsPage() {
  const {
    departments,
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
  } = useDepartments();

  // Columns Configuration
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <p className="text-[10px] uppercase font-mono tracking-widest text-[#00AEEF] font-black bg-cyan-50 dark:bg-cyan-500/10 px-2 py-1 rounded-sm w-fit ml-4">
          {row.getValue('code')}
        </p>
      ),
    },
    {
      accessorKey: 'nameBn',
      header: 'বিভাগের নাম',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <p className="font-bold text-zinc-800 dark:text-zinc-100 kalpurush-font text-lg leading-tight mb-0.5">
            {row.original.nameBn}
          </p>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight italic">{row.original.name}</p>
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
              ? "bg-cyan-50 text-[#00AEEF] dark:bg-[#00AEEF]/10" 
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
            onClick={() => handleDelete(row.original.$id, row.original.nameBn)}
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
    data: departments,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const stats = [
    { label: 'মোট বিভাগ', value: departments.length, icon: Building, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', isBn: true },
    { label: 'সক্রিয় বিভাগ', value: departments.filter(d => d.isActive).length, icon: Check, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-500/10', isBn: true },
    { label: 'সিস্টেম মড্যুল', value: 'একাডেমিক', icon: LayoutGrid, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto py-6">
      <FeatureHeader 
        title="বিভাগ ব্যবস্থাপনা"
        description="প্রতিষ্ঠানের সকল মূল বিভাগ এবং কারিকুলাম নিয়ন্ত্রণ করুন"
        icon={Building}
        onAdd={handleOpenAdd}
        addLabel="নতুন বিভাগ"
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="বিভাগ খুঁজুন..."
      />

      <FeatureStats stats={stats} />

      <FeatureTable 
        table={table}
        isLoading={isLoading}
        emptyIcon={Building}
        emptyText="কোনো বিভাগ খুঁজে পাওয়া যায়নি"
        emptySubtext="নতুন বিভাগ যোগ করতে উপরের বাটনে ক্লিক করুন"
        columnCount={4}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md kalpurush-font p-0 overflow-hidden rounded-md border-0 flex flex-col shadow-2xl bg-white dark:bg-zinc-900">
          <DialogHeader className="p-8 bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-md bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20">
                <Building className="h-6 w-6 text-[#00AEEF]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedId ? 'বিভাগ আপডেট করুন' : 'নতুন বিভাগ যুক্ত করুন'}</DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] mt-1 uppercase tracking-wider">Department Configuration Wizard</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">বিভাগ কোড (Unique)</Label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                <Input 
                  placeholder="যেমন: HIFZ" 
                  value={formData.code}
                  onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  disabled={!!selectedId}
                  className="pl-10 h-12 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent font-mono font-black text-base dark:text-[#00AEEF]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">বিভাগের নাম (বাংলা)</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                <Input 
                  placeholder="যেমন: হিফজুল কুরআন" 
                  value={formData.nameBn}
                  onChange={e => setFormData(p => ({ ...p, nameBn: e.target.value }))}
                  className="pl-10 h-12 rounded-md font-black text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">Name (English)</Label>
              <Input 
                placeholder="Hifzul Quran" 
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="h-12 rounded-md font-semibold text-zinc-500 uppercase tracking-tight text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-md border border-zinc-100 dark:border-zinc-800">
               <div className="space-y-0.5">
                 <p className="text-xs font-black uppercase tracking-tight">Active Status</p>
                 <p className="text-[9px] text-zinc-400 font-bold uppercase italic">সক্রিয় স্ট্যাটাস</p>
               </div>
               <Switch checked={formData.isActive} onCheckedChange={c => setFormData(p => ({ ...p, isActive: c }))} className="scale-90 data-[state=checked]:bg-[#00AEEF]" />
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
               {selectedId ? 'পরিবর্তন সেভ করুন' : 'বিভাগ যোগ করুন'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
