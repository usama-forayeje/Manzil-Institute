'use client';

import React, { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Users,
  UserPlus,
  TrendingUp,
  Trash2,
  Edit,
  Eye,
  Loader2,
  User,
  LogOut,
  Printer,
  RotateCcw,
  Building2,
  GraduationCap,
  UserCheck,
  CreditCard,
  Banknote,
  MoreHorizontal,
  Filter,
  FileEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, convertEnglishToBengali } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Reusable Components
import { FeatureHeader } from '@/components/dashboard/shared/FeatureHeader';
import { FeatureTable } from '@/components/dashboard/shared/FeatureTable';
import { useStudents, type StudentFilterTab } from '@/features/students/hooks/use-students';
import { DischargeStudentModal } from '@/features/students/components/DischargeStudentModal';
import { TransferCertificateModal } from '@/features/students/components/TransferCertificateModal';
import type { StudentListItem } from '@/features/students/types';

export default function StudentsListPage() {
  const router = useRouter();
  const {
    students,
    total,
    stats,
    isStatsLoading,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    classFilter,
    setClassFilter,
    sessionFilter,
    setSessionFilter,
    exitReasonFilter,
    setExitReasonFilter,
    departments,
    availableClasses,
    sessions,
    handleResetFilters,
    hasActiveAcademicFilters,
    handleDelete,
    handleReactivate,
    isPending,
    activeDeleteId,
    activeReactivateId,
  } = useStudents();

  // Academic sessions list (dynamic from DB with standard fallback options)
  const sessionOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const defaults = [
      `${currentYear - 2}-${currentYear - 1}`,
      `${currentYear - 1}-${currentYear}`,
      `${currentYear}-${currentYear + 1}`,
      `${currentYear + 1}-${currentYear + 2}`,
    ];
    const fromDb = (sessions || [])
      .map((s: any) => s.sessionName || s.name || s.year)
      .filter(Boolean);
    return Array.from(new Set([...fromDb, ...defaults]));
  }, [sessions]);

  // Modal states for discharge and printable TC
  const [dischargeTarget, setDischargeTarget] = useState<StudentListItem | null>(null);
  const [tcTarget, setTcTarget] = useState<{
    student: StudentListItem;
    dischargeData?: any;
  } | null>(null);

  // Columns Configuration
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'শিক্ষার্থীর তথ্য',
        cell: ({ row }) => {
          const photoUrl = row.original.photo || row.original.photoUrl;
          const studentId = row.original.studentId || 'N/A';
          const nameBn = row.original.nameBn || row.original.nameEn || row.original.name;

          return (
            <div className="flex items-center gap-3 pl-3 sm:pl-4">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-800 shrink-0 overflow-hidden ring-2 ring-transparent group-hover:ring-[#00AEEF]/10 transition-all">
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
                <User className={cn('h-5 w-5 text-zinc-300', photoUrl ? 'hidden' : '')} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-black text-zinc-900 dark:text-zinc-50 kalpurush-font text-[14px] sm:text-[15px] leading-tight mb-0.5 truncate">
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
            return (
              <div className="flex flex-col py-1">
                <p className="font-bold text-zinc-700 dark:text-zinc-200 text-xs sm:text-[13px] leading-tight">
                  {row.original.departmentName || 'বিভাগ নেই'} — {row.original.className || 'শ্রেণী নেই'}
                </p>
              </div>
            );
          }

          const first = enrollments[0];
          const extraCount = enrollments.length - 1;

          return (
            <div className="flex flex-col py-1">
              <p
                className="font-bold text-zinc-700 dark:text-zinc-200 text-xs sm:text-[13px] leading-tight truncate max-w-[180px] sm:max-w-[200px]"
                title={`${first.departmentName} — ${first.className}`}
              >
                <span className="text-[#00AEEF]">{first.departmentName}</span> — {first.className}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight italic">
                  গ্রুপ: {first.section || 'সাধারণ'}
                </p>
                {extraCount > 0 && (
                  <span
                    className="px-1.5 py-px border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold text-[9px] rounded-sm cursor-help hover:bg-zinc-100"
                    title={enrollments
                      .slice(1)
                      .map((e: any) => `${e.departmentName} — ${e.className}`)
                      .join('\n')}
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
        accessorKey: 'boardingType',
        header: 'বোর্ডিং ও হল',
        cell: ({ row }) => {
          const bType = row.original.boardingType || 'সাধারণ';
          const isRes =
            bType.includes('আবাসিক') ||
            bType.toLowerCase().includes('residential') ||
            Boolean(row.original.hallName);

          return (
            <div className="flex flex-col">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-bold w-fit px-2 py-0.5 rounded-md',
                  isRes
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                )}
              >
                {isRes && <Building2 className="h-3 w-3" />}
                {bType}
              </span>
              {row.original.hallName && (
                <span className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  হল: {row.original.hallName}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'guardianPhone',
        header: 'অভিভাবক ও যোগাযোগ',
        cell: ({ row }) => {
          const phone =
            row.original.guardianPhone ||
            row.original.fatherPhone ||
            row.original.phonePrimary ||
            row.original.phone ||
            'N/A';
          const gName =
            row.original.guardianName ||
            row.original.fatherNameBn ||
            row.original.fatherNameEn ||
            row.original.fatherName ||
            'অভিভাবক';
          return (
            <div className="flex flex-col">
              <p className="font-mono font-bold text-zinc-700 dark:text-zinc-300 text-xs">{phone}</p>
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter italic">
                {gName}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center">স্ট্যাটাস ও অবস্থা</div>,
        cell: ({ row }) => {
          const isAct = row.original.status === 'active';
          const dInfo = row.original.dischargeInfo;

          if (isAct) {
            return (
              <div className="flex items-center justify-center">
                <Badge className="rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] border-0 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 shadow-sm">
                  সক্রিয় (Active)
                </Badge>
              </div>
            );
          }

          // Departed statuses with reason details
          const reasonLabel =
            dInfo?.reasonBn ||
            (row.original.status === 'graduated'
              ? 'হিফজ সম্পন্ন / ফারেগ'
              : row.original.status === 'transferred'
              ? 'অন্যত্র স্থানান্তর / টিসি'
              : row.original.status === 'expelled'
              ? 'বহিষ্কৃত'
              : 'বিদায়ী');

          const badgeColor =
            row.original.status === 'graduated' || dInfo?.reason === 'graduated'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
              : row.original.status === 'transferred' || dInfo?.reason === 'transferred'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
              : row.original.status === 'expelled' || dInfo?.reason === 'expelled'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800';

          return (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <Badge
                onClick={() => setDischargeTarget(row.original)}
                title="বিদায়ের কারণ দেখতে বা পরিবর্তন করতে ক্লিক করুন"
                className={cn(
                  'rounded-md px-2 py-0.5 text-[10px] font-bold shadow-none cursor-pointer hover:opacity-80 transition-opacity',
                  badgeColor
                )}
              >
                {reasonLabel}
              </Badge>
              {dInfo?.date && (
                <span className="text-[9px] font-medium text-zinc-400">
                  {dInfo.date}
                </span>
              )}
              {dInfo?.remarks && (
                <span
                  className="text-[9px] text-zinc-400 truncate max-w-[130px] font-medium"
                  title={dInfo.remarks}
                >
                  {dInfo.remarks}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right pr-4">অ্যাকশন</div>,
        cell: ({ row }) => {
          const isAct = row.original.status === 'active';
          const student = row.original;
          const studentIdentifier = student.studentId || student.$id;

          return (
            <div className="flex items-center justify-end gap-1 pr-2">
              {/* Quick Profile View */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 rounded-md hover:bg-[#00AEEF]/10 text-zinc-400 hover:text-[#00AEEF] transition-all cursor-pointer"
                title="বিস্তারিত দেখুন"
              >
                <Link href={`/dashboard/admin/students/${student.$id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>

              {/* Direct Fee Collection Shortcut Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/dashboard/admin/fees/collect?studentId=${studentIdentifier}`)}
                className="h-8 w-8 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-600 transition-all cursor-pointer"
                title="ফি আদায় করুন"
              >
                <Banknote className="h-4 w-4" />
              </Button>

              {/* 3-Dots Comprehensive Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                    title="আরো অ্যাকশন"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 kalpurush-font p-1.5 shadow-xl border border-zinc-200 dark:border-zinc-800">
                  {/* Fee Collection */}
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/admin/fees/collect?studentId=${studentIdentifier}`)}
                    className="flex items-center gap-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer py-2 focus:bg-emerald-50 dark:focus:bg-emerald-950/40"
                  >
                    <Banknote className="h-4 w-4" />
                    <span>ফি আদায় ও খতিয়ান</span>
                  </DropdownMenuItem>

                  {/* ID Card */}
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/admin/id-cards?search=${student.studentId || ''}`)}
                    className="flex items-center gap-2.5 text-xs font-bold text-[#00AEEF] cursor-pointer py-2 focus:bg-[#00AEEF]/10"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>স্মার্ট আইডি কার্ড</span>
                  </DropdownMenuItem>

                  {/* Edit Info */}
                  <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/admin/students/${student.$id}/edit`)}
                    className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 cursor-pointer py-2"
                  >
                    <Edit className="h-4 w-4 text-amber-500" />
                    <span>তথ্য সম্পাদনা (Edit)</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Discharge or TC options */}
                  {isAct ? (
                    <DropdownMenuItem
                      onClick={() => setDischargeTarget(student)}
                      className="flex items-center gap-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 cursor-pointer py-2 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>বিদায় ও ছাড়পত্র (TC)</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => setDischargeTarget(student)}
                        className="flex items-center gap-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer py-2 focus:bg-amber-50 dark:focus:bg-amber-950/40"
                      >
                        <FileEdit className="h-4 w-4" />
                        <span>বিদায়ের কারণ ও ছাড়পত্র সম্পাদনা</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          setTcTarget({
                            student,
                            dischargeData: student.dischargeInfo,
                          })
                        }
                        className="flex items-center gap-2.5 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer py-2 focus:bg-blue-50 dark:focus:bg-blue-950/40"
                      >
                        <Printer className="h-4 w-4" />
                        <span>টিসি ও প্রশংসাপত্র প্রিন্ট</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          handleReactivate(
                            student.$id,
                            student.nameBn || student.nameEn || student.name
                          )
                        }
                        disabled={isPending}
                        className="flex items-center gap-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer py-2 focus:bg-emerald-50 dark:focus:bg-emerald-950/40"
                      >
                        {activeReactivateId === student.$id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                        <span>পুনর্বহাল (Reactivate)</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="my-1" />

                  {/* Delete Option */}
                  <DropdownMenuItem
                    onClick={() =>
                      handleDelete(student.$id, student.nameBn || student.name)
                    }
                    disabled={isPending}
                    className="flex items-center gap-2.5 text-xs font-bold text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer py-2 focus:bg-rose-50 dark:focus:bg-rose-950/40"
                  >
                    {activeDeleteId === student.$id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    )}
                    <span>মুছে ফেলুন</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [isPending, activeDeleteId, activeReactivateId, handleDelete, handleReactivate, router]
  );

  const table = useReactTable({
    data: students,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const tabOptions: Array<{
    key: StudentFilterTab;
    label: string;
    count: number;
    icon: any;
  }> = [
    { key: 'all', label: 'সকল শিক্ষার্থী', count: stats?.total ?? total, icon: Users },
    { key: 'active', label: 'সক্রিয় শিক্ষার্থী', count: stats?.active ?? 0, icon: TrendingUp },
    { key: 'departed', label: 'বিদায়ী / সাবেক', count: stats?.departed ?? 0, icon: LogOut },
    { key: 'residential', label: 'আবাসিক', count: stats?.residential ?? 0, icon: Building2 },
    { key: 'non_residential', label: 'অনাবাসিক', count: stats?.nonResidential ?? 0, icon: UserCheck },
  ];

  // Compact Stats Cards Configuration
  const metricCards = [
    {
      key: 'active',
      title: 'সক্রিয় শিক্ষার্থী',
      value: stats?.active ?? total,
      subtext: 'নিয়মিত অধ্যয়নরত',
      filterKey: 'active' as StudentFilterTab,
      icon: TrendingUp,
      bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'departed',
      title: 'বিদায়ী শিক্ষার্থী',
      value: stats?.departed ?? 0,
      subtext: 'হিফজ সমাপ্ত / টিসি / সাবেক',
      filterKey: 'departed' as StudentFilterTab,
      icon: LogOut,
      bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
      color: 'text-rose-600 dark:text-rose-400',
    },
    {
      key: 'residential',
      title: 'আবাসিক শিক্ষার্থী',
      value: stats?.residential ?? 0,
      subtext: 'ডরমিটরি ও হলে অবস্থানরত',
      filterKey: 'residential' as StudentFilterTab,
      icon: Building2,
      bg: 'bg-sky-50 dark:bg-sky-500/10 text-[#00AEEF]',
      color: 'text-[#00AEEF]',
    },
    {
      key: 'non_residential',
      title: 'অনাবাসিক শিক্ষার্থী',
      value: stats?.nonResidential ?? 0,
      subtext: 'অনাবাসিক ও ডে-কেয়ার',
      filterKey: 'non_residential' as StudentFilterTab,
      icon: UserCheck,
      bg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-500 w-full min-w-0 max-w-full overflow-hidden py-2 sm:py-4">
      <FeatureHeader
        title="শিক্ষার্থী তালিকা ও জীবনবৃত্তান্ত"
        description="প্রতিষ্ঠানের সকল সক্রিয়, আবাসিক, অনাবাসিক এবং বিদায়ী শিক্ষার্থীর একাডেমিক ও ছাড়পত্র রেকর্ড পরিচালনা করুন"
        icon={Users}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchPlaceholder="ছাত্রের নাম বা আইডি দিয়ে খুঁজুন..."
        extraActions={
          <Button
            asChild
            className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-4 sm:px-6 h-10 sm:h-11 kalpurush-font font-black border-0 shadow-md hover:shadow-lg transition-all cursor-pointer text-xs sm:text-sm"
          >
            <Link href="/dashboard/admin/students/admission">
              <UserPlus className="h-4 w-4 mr-1.5" /> ভর্তি ফরম
            </Link>
          </Button>
        }
      />

      {/* 4 Ultra-Compact, Fully Responsive Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3.5 w-full min-w-0">
        {metricCards.map((card) => {
          const isSelected = statusFilter === card.filterKey;
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              onClick={() => setStatusFilter(card.filterKey)}
              className={cn(
                'rounded-xl border transition-all duration-200 cursor-pointer select-none group relative overflow-hidden min-w-0 w-full',
                'p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-[86px] sm:min-h-[92px]',
                isSelected
                  ? 'bg-[#00AEEF]/5 border-[#00AEEF] shadow-sm ring-1 ring-[#00AEEF]/30'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
              )}
            >
              <div className="flex items-start justify-between gap-1.5 min-w-0">
                <span className="text-xs sm:text-[13px] font-black text-zinc-700 dark:text-zinc-200 kalpurush-font leading-snug truncate">
                  {card.title}
                </span>
                <div
                  className={cn(
                    'h-7 w-7 sm:h-7.5 sm:w-7.5 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5',
                    card.bg
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="mt-1.5 sm:mt-2 min-w-0">
                <div className="flex items-baseline gap-1">
                  {isStatsLoading ? (
                    <span className="text-lg font-bold text-zinc-300 animate-pulse">---</span>
                  ) : (
                    <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                      {convertEnglishToBengali(card.value)}
                    </span>
                  )}
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400">জন</span>
                </div>

                <p className="text-[10px] sm:text-[11px] font-medium text-zinc-400 dark:text-zinc-500 leading-tight mt-1 truncate">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 border-b border-zinc-200 dark:border-zinc-800 custom-scrollbar w-full min-w-0 max-w-full">
        {tabOptions.map((tab) => {
          const isSelected = statusFilter === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap kalpurush-font',
                isSelected
                  ? 'bg-[#00AEEF] text-white shadow-md shadow-[#00AEEF]/20'
                  : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 border border-zinc-200/80 dark:border-zinc-700/60'
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', isSelected ? 'text-white' : 'text-zinc-400')} />
              <span>{tab.label}</span>
              <span
                className={cn(
                  'px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full text-[10px] font-mono font-black',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                )}
              >
                {convertEnglishToBengali(tab.count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cascading Academic & Exit Reason Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2.5 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#00AEEF]/10 text-[#00AEEF] flex items-center justify-center">
              <Filter className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs sm:text-[13px] font-black text-zinc-800 dark:text-zinc-200 kalpurush-font">
              ফিল্টারিং ও শ্রেণী অনুসন্ধান
            </span>
            {hasActiveAcademicFilters && (
              <Badge variant="secondary" className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20 font-bold px-1.5 py-0.2">
                ফিল্টার সক্রিয়
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 kalpurush-font font-medium hidden sm:inline">
              মোট: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{convertEnglishToBengali(total)}</span> জন
            </span>
            {hasActiveAcademicFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 kalpurush-font font-bold cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                ফিল্টার মুছুন
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 w-full min-w-0">
          {/* 1. বিভাগ (Department) */}
          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font block">
              বিভাগ (Department)
            </label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full h-8.5 text-xs bg-zinc-50/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 cursor-pointer">
                <SelectValue placeholder="সকল বিভাগ" />
              </SelectTrigger>
              <SelectContent className="kalpurush-font">
                <SelectItem value="all" className="cursor-pointer text-xs">
                  সকল বিভাগ
                </SelectItem>
                {departments.map((dept: any) => (
                  <SelectItem key={dept.$id} value={dept.$id} className="cursor-pointer text-xs">
                    {dept.nameBn || dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. জামাত / শ্রেণী (Class/Jamat) - Strict Cascading */}
          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font block">
              জামাত / শ্রেণী (Class)
            </label>
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
              disabled={departmentFilter !== 'all' && availableClasses.length === 0}
            >
              <SelectTrigger className="w-full h-8.5 text-xs bg-zinc-50/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 cursor-pointer">
                <SelectValue placeholder={departmentFilter !== 'all' && availableClasses.length === 0 ? 'কোনো জামাত নেই' : 'সকল জামাত / শ্রেণী'} />
              </SelectTrigger>
              <SelectContent className="kalpurush-font">
                <SelectItem value="all" className="cursor-pointer text-xs">
                  সকল জামাত / শ্রেণী
                </SelectItem>
                {availableClasses.map((cls: any) => (
                  <SelectItem key={cls.$id} value={cls.$id} className="cursor-pointer text-xs">
                    {cls.nameBn || cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. শিক্ষাবর্ষ / সেশন (Session) */}
          <div className="space-y-1 min-w-0">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font block">
              শিক্ষাবর্ষ / সেশন (Session)
            </label>
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-full h-8.5 text-xs bg-zinc-50/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 cursor-pointer">
                <SelectValue placeholder="সকল শিক্ষাবর্ষ" />
              </SelectTrigger>
              <SelectContent className="kalpurush-font">
                <SelectItem value="all" className="cursor-pointer text-xs">
                  সকল শিক্ষাবর্ষ
                </SelectItem>
                {sessionOptions.map((sess: string) => (
                  <SelectItem key={sess} value={sess} className="cursor-pointer text-xs">
                    {sess}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. বিদায়ের কারণ (Exit Reason) - Shows when statusFilter === 'departed' */}
          {statusFilter === 'departed' ? (
            <div className="space-y-1 min-w-0">
              <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400 kalpurush-font block">
                বিদায়ের কারণ (Exit Reason)
              </label>
              <Select value={exitReasonFilter} onValueChange={setExitReasonFilter}>
                <SelectTrigger className="w-full h-8.5 text-xs bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 cursor-pointer text-rose-900 dark:text-rose-200">
                  <SelectValue placeholder="সকল কারণ" />
                </SelectTrigger>
                <SelectContent className="kalpurush-font">
                  <SelectItem value="all" className="cursor-pointer text-xs">
                    সকল বিদায়ের কারণ
                  </SelectItem>
                  <SelectItem value="graduated" className="cursor-pointer text-xs">
                    হিফজ সম্পন্ন / ফারেগ
                  </SelectItem>
                  <SelectItem value="transferred" className="cursor-pointer text-xs">
                    অন্যত্র স্থানান্তর / টিসি
                  </SelectItem>
                  <SelectItem value="personal" className="cursor-pointer text-xs">
                    পারিবারিক / ব্যক্তিগত কারণ
                  </SelectItem>
                  <SelectItem value="financial" className="cursor-pointer text-xs">
                    আর্থিক অসচ্ছলতা
                  </SelectItem>
                  <SelectItem value="health" className="cursor-pointer text-xs">
                    স্বাস্থ্যগত / অসুস্থতা
                  </SelectItem>
                  <SelectItem value="expelled" className="cursor-pointer text-xs">
                    শৃঙ্খলাভঙ্গজনিত বহিষ্কার
                  </SelectItem>
                  <SelectItem value="other" className="cursor-pointer text-xs">
                    অন্যান্য কারণ
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1 min-w-0">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font block">
                সারসংক্ষেপ
              </label>
              <div className="h-8.5 px-3 flex items-center justify-between text-xs bg-zinc-50/60 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-300 font-bold kalpurush-font">
                <span>বর্তমান ফিল্টারে:</span>
                <span className="font-mono text-[#00AEEF] font-black">{convertEnglishToBengali(total)} জন</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <FeatureTable
        table={table}
        isLoading={isLoading}
        emptyIcon={Users}
        emptyText={
          statusFilter === 'departed'
            ? 'কোনো বিদায়ী বা সাবেক শিক্ষার্থীর রেকর্ড নেই'
            : statusFilter === 'residential'
            ? 'কোনো আবাসিক শিক্ষার্থী পাওয়া যায়নি'
            : 'কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি'
        }
        emptySubtext={
          statusFilter === 'departed'
            ? 'সক্রিয় কোনো ছাত্রকে ছাড়পত্র দিলে এখানে দেখতে পাবেন'
            : "শিক্ষার্থী ভর্তি করতে 'ভর্তি ফরম' বাটনে ক্লিক করুন"
        }
        columnCount={6}
        infiniteScroll={true}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        totalCount={total}
      />

      {/* Discharge / Farewell Modal */}
      <DischargeStudentModal
        student={dischargeTarget}
        isOpen={Boolean(dischargeTarget)}
        onClose={() => setDischargeTarget(null)}
        onDischarged={(student, dischargeData) => {
          // Immediately prompt user to print TC
          setTcTarget({ student, dischargeData });
        }}
      />

      {/* Printable Transfer Certificate (TC) Modal */}
      <TransferCertificateModal
        student={tcTarget?.student || null}
        dischargeData={tcTarget?.dischargeData}
        isOpen={Boolean(tcTarget)}
        onClose={() => setTcTarget(null)}
      />
    </div>
  );
}