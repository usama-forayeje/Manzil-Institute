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
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useStudents } from '@/features/students/hooks/use-students';
import { StatsCard } from '@/features/fees/components/StatsCard';

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
      header: 'শিক্ষার্থীর তথ্য',
      cell: ({ row }) => {
        const photoUrl = row.original.photo || row.original.photoUrl;
        const studentId = row.original.studentId || 'N/A';
        const nameBn = row.original.nameBn || row.original.nameEn || row.original.name;
        
        return (
          <div className="flex items-center gap-3 pl-4">
            <div className="h-11 w-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 shrink-0 overflow-hidden ring-2 ring-transparent group-hover:ring-[#00AEEF]/10 transition-all">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="" 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <User className={cn("h-5 w-5 text-zinc-300", photoUrl ? "hidden" : "")} />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="font-black text-zinc-900 dark:text-zinc-50 kalpurush-font text-[15px] leading-tight mb-0.5 truncate">
                {nameBn}
              </p>
              <div className="flex items-center gap-1.5 pt-px">
                <span className="text-[9px] px-1.5 py-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono font-bold rounded border border-zinc-200 dark:border-zinc-700">
                  {studentId}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'class',
      header: 'বিভাগ ও শ্রেণী',
      cell: ({ row }) => {
        const enrollments = row.original.activeEnrollments || [];
        
        if (enrollments.length === 0) {
          return <p className="text-sm text-zinc-400 italic">ভর্তি তথ্য নেই</p>;
        }

        const first = enrollments[0];
        const extraCount = enrollments.length - 1;

        return (
          <div className="flex flex-col py-1">
            <p className="font-bold text-zinc-700 dark:text-zinc-200 text-[13px] leading-tight truncate max-w-[200px]" title={`${first.departmentName} — ${first.className}`}>
              <span className="text-[#00AEEF]">{first.departmentName}</span> — {first.className}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight italic">
                গ্রুপ: {first.sectionName}
              </p>
              {extraCount > 0 && (
                <span 
                  className="px-1.5 py-px border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold text-[9px] rounded-sm cursor-help hover:bg-zinc-100"
                  title={enrollments.slice(1).map((e: any) => `${e.departmentName} — ${e.className} (গ্রুপ: ${e.sectionName})`).join('\n')}
                >
                  +{extraCount} আরো...
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'guardianPhone',
      header: 'অভিভাবকের নম্বর',
      cell: ({ row }) => {
        const phone = row.original.guardianPhone || row.original.fatherPhone || row.original.phonePrimary || row.original.phone || 'N/A';
        const gName = row.original.guardianName || row.original.fatherNameBn || row.original.fatherNameEn || row.original.fatherName || 'অভিভাবক';
        return (
          <div className="flex flex-col">
            <p className="font-mono font-bold text-zinc-700 dark:text-zinc-300 text-xs">
              {phone}
            </p>
            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter italic">
              {gName}
            </p>
          </div>
        );
      },
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
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 shadow-none border border-rose-100 dark:border-rose-500/20"
          )}>
            {row.original.status || 'Active'}
          </Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-4">অ্যাকশন</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1 pr-2">
          <Button
            variant="ghost" size="icon" asChild
            className="h-8 w-8 rounded-md hover:bg-[#00AEEF]/10 text-zinc-400 hover:text-[#00AEEF] transition-all"
            title="বিস্তারিত দেখুন"
          >
            <Link href={`/dashboard/admin/students/${row.original.$id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost" size="icon" asChild
            className="h-8 w-8 rounded-md hover:bg-amber-50 dark:hover:bg-amber-500/10 text-zinc-400 hover:text-amber-600 transition-all"
            title="তথ্য এডিট করুন"
          >
            <Link href={`/dashboard/admin/students/${row.original.$id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={(e) => {
              e.preventDefault();
              handleDelete(row.original.$id, row.original.nameBn || row.original.name);
            }}
            className="h-8 w-8 rounded-md hover:bg-rose-50 dark:hover:bg-rose-500/10 text-zinc-400 hover:text-rose-600 transition-all"
            disabled={isPending}
            title="মুছে ফেলুন"
          >
            {activeDeleteId === row.original.$id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
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
          <Button asChild className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-6 h-11 kalpurush-font font-black border-0 shadow-md hover:shadow-lg transition-all">
             <Link href="/dashboard/admin/students/admission">
               <UserPlus className="h-4 w-4 mr-2" /> ভর্তি ফরম
             </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="মোট শিক্ষার্থী" 
          value={total} 
          footerText="সর্বমোট শিক্ষার্থী" 
          icon={Users} 
          color="blue" 
          isLoading={isLoading} 
          prefix=""
        />
        <StatsCard 
          title="নতুন ভর্তি (মাসে)" 
          value={0} 
          footerText="চলতি মাসের ভর্তি" 
          icon={UserPlus} 
          color="emerald" 
          isLoading={false} 
          prefix=""
        />
        <StatsCard 
          title="উপস্থিতি (আজ)" 
          value={0} 
          footerText="আজকের উপস্থিতি গড়" 
          icon={ShieldCheck} 
          color="indigo" 
          isLoading={false} 
          prefix=""
          suffix="%"
        />
        <StatsCard 
          title="সক্রিয় শিক্ষার্থী" 
          value={total} 
          footerText="সক্রিয় এনরোলমেন্ট" 
          icon={TrendingUp} 
          color="sky" 
          isLoading={isLoading} 
          prefix=""
        />
      </div>

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
