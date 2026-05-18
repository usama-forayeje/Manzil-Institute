'use client';

import React, { useMemo } from 'react';
import { 
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/react-table';
import { 
  Layers, 
  Trash2, 
  Edit, 
  Check,
  Users,
  Target,
  Loader2,
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
import { cn, convertEnglishToBengali } from '@/lib/utils';

// Reusable Components
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';
import { FeatureStats } from '@/components/dashboard/shared/FeatureStats';
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useSections } from '@/features/academic/hooks/use-sections';

export default function SectionsPage() {
  const {
    sections,
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
  } = useSections();

  // Columns Configuration
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'sectionName',
      header: 'শাখার নাম (ইংরেজি)',
      cell: ({ row }) => (
        <p className="text-[10px] font-mono tracking-wider text-zinc-400 font-black uppercase pl-4">
          {row.getValue('sectionName')}
        </p>
      ),
    },
    {
      accessorKey: 'sectionNameBn',
      header: 'শাখার নাম (বাংলা)',
      cell: ({ row }) => (
        <p className="font-bold text-zinc-800 dark:text-zinc-100 kalpurush-font text-lg leading-tight">
          {row.getValue('sectionNameBn')}
        </p>
      ),
    },
    {
      accessorKey: 'capacity',
      header: () => <div className="text-center">Capacity</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="h-3 w-3 text-zinc-300" />
          <span className="font-mono font-bold text-zinc-600 dark:text-zinc-400">
            {convertEnglishToBengali(row.original.capacity || 0)}
          </span>
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
            onClick={() => handleDelete(row.original.$id, row.original.sectionNameBn)}
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
    data: sections,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const stats = [
    { label: 'মোট শাখা', value: sections.length, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', isBn: true },
    { label: 'সক্রিয় শাখা', value: sections.filter(s => s.isActive).length, icon: Check, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-500/10', isBn: true },
    { label: 'সড় ধারণক্ষমতা', value: sections.reduce((acc, s) => acc + (s.capacity || 0), 0), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10', isBn: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto py-6">
      <FeatureHeader 
        title="শাখা ব্যবস্থাপনা"
        description="শ্রেণীর বিভিন্ন শাখা বা সেকশনসমূহ পরিচালনা করুন"
        icon={Layers}
        onAdd={handleOpenAdd}
        addLabel="নতুন শাখা"
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="শাখা খুঁজুন..."
      />

      <FeatureStats stats={stats} />

      <FeatureTable 
        table={table}
        isLoading={isLoading}
        emptyIcon={Layers}
        emptyText="কোনো শাখা খুঁজে পাওয়া যায়নি"
        emptySubtext="নতুন শাখা যোগ করতে উপরের বাটনে ক্লিক করুন"
        columnCount={5}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md kalpurush-font p-0 overflow-hidden rounded-md border-0 flex flex-col shadow-2xl bg-white dark:bg-zinc-900">
          <DialogHeader className="p-8 bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-md bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20">
                <Layers className="h-6 w-6 text-[#00AEEF]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedId ? 'শাখা আপডেট করুন' : 'নতুন শাখা যুক্ত করুন'}</DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] mt-1 uppercase tracking-wider">Academic Section Configuration Wizard</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">শাখার নাম (ইংরেজি)</Label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                <Input 
                  placeholder="যেমন: Section A" 
                  value={formData.sectionName}
                  onChange={e => setFormData(p => ({ ...p, sectionName: e.target.value }))}
                  className="pl-10 h-12 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent font-black text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">শাখার নাম (বাংলা)</Label>
              <Input 
                placeholder="যেমন: জামাত-ক" 
                value={formData.sectionNameBn}
                onChange={e => setFormData(p => ({ ...p, sectionNameBn: e.target.value }))}
                className="h-12 rounded-md font-black text-base"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">ধারণক্ষমতা (Capacity)</Label>
              <div className="relative">
                 <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                 <Input 
                  type="number"
                  placeholder="40" 
                  value={formData.capacity}
                  onChange={e => setFormData(p => ({ ...p, capacity: Number(e.target.value) }))}
                  className="pl-10 h-12 rounded-md font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-md border border-zinc-100 dark:border-zinc-800">
               <div className="space-y-0.5">
                 <p className="text-xs font-black uppercase tracking-tight">Active Status</p>
                 <p className="text-[9px] text-zinc-400 font-bold uppercase italic italic">সক্রিয় স্ট্যাটাস</p>
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
               {selectedId ? 'পরিবর্তন সেভ করুন' : 'শাখা যোগ করুন'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
