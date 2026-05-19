'use client';

import React, { useMemo } from 'react';
import { 
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/react-table';
import { 
  Trash2, 
  Edit, 
  Check,
  Loader2,
  GraduationCap,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

// Reusable Components
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useClasses } from '@/features/academic/hooks/use-classes';
import { StatsCard } from '@/features/fees/components/StatsCard';

export default function ClassesPage() {
  const {
    classes,
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
  } = useClasses();

  // Columns Configuration
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => (
        <p className="font-mono text-zinc-400 font-black pl-4">
          #{row.getValue('level') || 0}
        </p>
      ),
    },
    {
      accessorKey: 'nameBn',
      header: 'নাম (বাংলা)',
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
    data: classes,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto py-6">
      <FeatureHeader 
        title="ক্লাস ব্যবস্থাপনা"
        description="প্রতিষ্ঠানের সকল ক্লাস বা জামাতসমূহ পরিচালনা করুন"
        icon={GraduationCap}
        onAdd={handleOpenAdd}
        addLabel="নতুন ক্লাস"
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="ক্লাস খুঁজুন..."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard 
          title="মোট ক্লাস" 
          value={classes.length} 
          footerText="সর্বমোট জামাত" 
          icon={GraduationCap} 
          color="blue" 
          isLoading={isLoading} 
          prefix=""
        />
        <StatsCard 
          title="মোট বিভাগ" 
          value={departments.length} 
          footerText="সিস্টেম বিভাগ" 
          icon={LayoutGrid} 
          color="sky" 
          isLoading={isLoading} 
          prefix=""
        />
        <StatsCard 
          title="সক্রিয় ক্লাস" 
          value={classes.filter(c => c.isActive).length} 
          footerText="সচল জামাতসমূহ" 
          icon={Check} 
          color="emerald" 
          isLoading={isLoading} 
          prefix=""
        />
      </div>

      <FeatureTable 
        table={table}
        isLoading={isLoading}
        emptyIcon={GraduationCap}
        emptyText="কোনো ক্লাস খুঁজে পাওয়া যায়নি"
        emptySubtext="নতুন ক্লাস যোগ করতে উপরের বাটনে ক্লিক করুন"
        columnCount={4}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md kalpurush-font p-0 overflow-hidden rounded-md border-0 flex flex-col shadow-2xl bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800">
          <DialogHeader className="p-8 bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-md bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20">
                <GraduationCap className="h-6 w-6 text-[#00AEEF]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-zinc-900 dark:text-zinc-100">{selectedId ? 'ক্লাস আপডেট করুন' : 'নতুন ক্লাস যুক্ত করুন'}</DialogTitle>
                <DialogDescription className="text-zinc-500 font-bold text-[10px] mt-1 uppercase tracking-wider">Academic Class Configuration Wizard</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">বিভাগ (Department)</Label>
                <Select 
                  value={formData.departmentId} 
                  onValueChange={val => setFormData(p => ({ ...p, departmentId: val }))}
                >
                  <SelectTrigger className="h-12 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent focus:ring-[#00AEEF] transition-all">
                    <SelectValue placeholder="বিভাগ নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border-zinc-100 dark:border-zinc-800">
                    {departments.map(dept => (
                      <SelectItem key={dept.$id} value={dept.$id} className="rounded-sm py-2.5">{dept.nameBn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">ক্লাসের নাম (ইংরেজি)</Label>
                <Input 
                  placeholder="যেমন: Class One" 
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="h-12 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent focus:ring-[#00AEEF] transition-all font-black text-base"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">ক্লাসের নাম (বাংলা)</Label>
                <Input 
                  placeholder="যেমন: প্রথম শ্রেণী" 
                  value={formData.nameBn}
                  onChange={e => setFormData(p => ({ ...p, nameBn: e.target.value }))}
                  className="h-12 rounded-md font-black text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">Level (Sorting)</Label>
                <Input 
                  type="number"
                  placeholder="1" 
                  value={formData.level}
                  onChange={e => setFormData(p => ({ ...p, level: Number(e.target.value) }))}
                  className="h-12 rounded-md font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 pl-1">স্ট্যাটাস</Label>
                <div className="flex items-center h-12 px-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-md border border-transparent transition-all">
                  <div className="flex-1 text-[10px] font-black uppercase text-zinc-400 italic">Active Status</div>
                  <Switch checked={formData.isActive} onCheckedChange={c => setFormData(p => ({ ...p, isActive: c }))} className="scale-90 data-[state=checked]:bg-[#00AEEF]" />
                </div>
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
               {selectedId ? 'পরিবর্তন সেভ করুন' : 'ক্লাস যোগ করুন'}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
