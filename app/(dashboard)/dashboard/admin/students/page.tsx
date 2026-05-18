'use client';

import React, { useMemo } from 'react';
import { 
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef
} from '@tanstack/react-table';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  ShieldCheck,
  Trash2,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, convertEnglishToBengali } from '@/lib/utils';
import Link from 'next/link';

// Reusable Components
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';
import { FeatureStats } from '@/components/dashboard/shared/FeatureStats';
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useStudents } from '@/features/students/hooks/use-students';

export default function StudentsListPage() {
  const {
    students,
    total,
    isLoading,
    globalFilter,
    setGlobalFilter,
    handleDelete,
    isPending,
    activeDeleteId
  } = useStudents();

  // Columns Configuration
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'name',
      header: 'শিক্ষার্থী',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 pl-4">
          <div className="h-10 w-10 rounded-md bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 shrink-0 overflow-hidden group-hover:border-[#00AEEF]/30 transition-colors">
            {row.original.photoUrl ? (
              <img src={row.original.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-zinc-300" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-black text-zinc-900 dark:text-zinc-50 kalpurush-font text-base leading-none mb-1 truncate">
              {row.original.nameBn || row.original.name}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest truncate">ID: {row.original.studentId || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'class',
      header: 'জামাত/শাখা',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <p className="font-bold text-zinc-700 dark:text-zinc-200 text-sm leading-tight">
            {row.original.currentClass?.nameBn || 'অনির্ধারিত'}
          </p>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight italic">
            শাখা: {row.original.currentSection?.sectionNameBn || 'নেই'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] border-0",
            row.original.status === 'active' 
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 shadow-sm" 
              : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 shadow-none"
          )}>
            {row.original.status || 'Active'}
          </Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pr-4">
          <Button
            variant="ghost" size="icon" asChild
            className="h-9 w-9 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900"
          >
            <Link href={`/dashboard/admin/students/${row.original.$id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={() => handleDelete(row.original.$id, row.original.nameBn)}
            className="h-9 w-9 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600"
            disabled={isPending}
          >
            {activeDeleteId === row.original.$id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
          <Link href={`/dashboard/admin/students/${row.original.$id}`} className="p-2 text-zinc-300 hover:text-[#00AEEF] transition-colors">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )
    }
  ], [isPending, activeDeleteId, handleDelete]);

  const table = useReactTable({
    data: students,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const stats = [
    { label: 'মোট শিক্ষার্থী', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', isBn: true },
    { label: 'নতুন ভর্তি (মাসে)', value: 0, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', isBn: true },
    { label: 'উপস্থিতি (আজ)', value: '০%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'সক্রিয় শিক্ষার্থী', value: total, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10', isBn: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto py-6">
      <FeatureHeader 
        title="শিক্ষার্থী তালিকা"
        description="প্রতিষ্ঠানের সকল শিক্ষার্থীর তথ্য এবং একাডেমিক রেকর্ড পরিচালনা করুন"
        icon={Users}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="ছাত্রের নাম বা আইডি দিয়ে খুঁজুন..."
        extraActions={
          <Button asChild className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-6 h-11 kalpurush-font font-black border-0">
             <Link href="/dashboard/admin/students/admission">
               <UserPlus className="h-4 w-4 mr-2" /> ভর্তি ফরম
             </Link>
          </Button>
        }
      />

      <FeatureStats stats={stats} />

      <FeatureTable 
        table={table}
        isLoading={isLoading}
        emptyIcon={Users}
        emptyText="কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি"
        emptySubtext="শিক্ষার্থী ভর্তি করতে 'ভর্তি ফরম' বাটনে ক্লিক করুন"
        columnCount={4}
      />
    </div>
  );
}
