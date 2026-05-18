'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import {
  AlertTriangle,
  Search,
  Filter,
  Users,
  Phone,
  Clock,
  TrendingDown,
  Banknote,
  Loader2,
  Download,
  CreditCard,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dueStudentsQueryOptions, feeFilterOptionsQueryOptions } from '@/features/fees/api/queries';
import { MONTH_NAMES_BN } from '@/features/fees/types';
import type { DueStudentRow, FeeFilter } from '@/features/fees/types';

// ─── Bengali number helper ──────────────────────────────────
const toBn = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '---';
  const formatted = Number(num).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
};

function getAgingColor(months: number): string {
  if (months <= 1) return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
  if (months <= 2) return 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30';
  return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';
}

function getAgingLabel(months: number): string {
  if (months <= 1) return 'সাম্প্রতিক';
  if (months <= 2) return 'বিলম্বিত';
  return 'জরুরি';
}

export default function DueFeesPage() {
  const optionsQuery = useQuery(feeFilterOptionsQueryOptions());
  const options: any = optionsQuery.data?.options || { sessions: [], feeTypes: [], classes: [] };

  const [session, setSession] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [invoiceType, setInvoiceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // For pseudo infinity scroll
  const [displayLimit, setDisplayLimit] = useState(30);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '200px',
  });

  const filter: FeeFilter = useMemo(() => ({
    session: session === 'all' ? undefined : session,
    classId: classFilter === 'all' ? undefined : classFilter,
    invoiceType: invoiceType === 'all' ? undefined : invoiceType,
  }), [session, classFilter, invoiceType]);

  const dueQuery = useQuery(dueStudentsQueryOptions(filter));
  const dueStudents = dueQuery.data?.dueStudents || [];
  const totalDueAmount = dueQuery.data?.totalDueAmount || 0;

  // Apply local search AND class filter (since backend ignores classId currently)
  const filteredStudents = useMemo(() => {
    let result = dueStudents;
    
    // 1. Class filter
    if (classFilter !== 'all') {
      result = result.filter(s => s.studentClass === classFilter);
    }
    
    // 2. Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.studentName.toLowerCase().includes(term) ||
        s.studentId.toLowerCase().includes(term) ||
        s.studentPhone.includes(term)
      );
    }
    return result;
  }, [dueStudents, searchTerm, classFilter]);

  // Load more when scrolling down
  useEffect(() => {
    if (inView && displayLimit < filteredStudents.length) {
      setTimeout(() => {
        setDisplayLimit(prev => Math.min(prev + 30, filteredStudents.length));
      }, 100);
    }
  }, [inView, filteredStudents.length, displayLimit]);

  // Reset offset when filter changes
  useEffect(() => {
    setDisplayLimit(30);
  }, [searchTerm, classFilter, session, invoiceType]);

  const displayedStudents = useMemo(() => {
    return filteredStudents.slice(0, displayLimit);
  }, [filteredStudents, displayLimit]);

  // Stats
  const criticalCount = dueStudents.filter(s => s.monthsOverdue >= 3).length;
  const avgDue = dueStudents.length > 0
    ? Math.round(totalDueAmount / dueStudents.length)
    : 0;

  // CSV Export
  const handleExport = () => {
    if (filteredStudents.length === 0) return;
    const headers = ['আইডি', 'নাম', 'শ্রেণী', 'সেকশন', 'মোট বকেয়া', 'বকেয়া মাস', 'ফোন', 'অভিভাবক ফোন'];
    const rows = filteredStudents.map(s => [
      s.studentId, s.studentName, s.studentClass, s.studentSection,
      s.totalDue, s.monthsOverdue, s.studentPhone, s.guardianPhone,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `due-fees-${session}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-sans">
      {/* ═══ Header ═══ */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-700" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e11d4808_1px,transparent_1px),linear-gradient(to_bottom,#e11d4808_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-50" />
          
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 p-[1px] shadow-lg shadow-rose-500/20">
              <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:bg-rose-500/[0.02] transition-colors">
                <AlertTriangle className="h-8 w-8 text-rose-500 absolute transform transition-transform group-hover:scale-110" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-2 kalpurush-font drop-shadow-sm">বকেয়া ফি ড্যাশবোর্ড</h1>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide flex items-center gap-2">
                বকেয়াদার শিক্ষার্থী ও এজিং বিশ্লেষণ <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" /> ইনফিনিটি অটো-লোডিং
              </p>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center gap-3">
             <Select value={session} onValueChange={setSession}>
              <SelectTrigger className="w-40 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border-transparent text-sm font-bold shadow-inner">
                <SelectValue placeholder="সব সেশন" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl kalpurush-font p-1.5 flex flex-col gap-1 max-h-[300px]">
                <SelectItem value="all" className="font-bold text-[13px] rounded-lg">সব সেশন</SelectItem>
                {options.sessions.map((sess: string) => (
                  <SelectItem key={sess} value={sess} className="font-bold text-[13px] rounded-lg">{sess}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleExport}
              disabled={filteredStudents.length === 0}
              className="h-12 px-6 rounded-xl font-bold text-sm bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 border border-transparent hover:border-zinc-700 dark:hover:border-zinc-200"
            >
              <Download className="h-4 w-4 mr-2" /> এক্সপোর্ট CSV
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ Floating Stats ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {dueQuery.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <div className="relative overflow-hidden bg-rose-500 text-white p-6 rounded-xl border border-rose-500 shadow-lg shadow-rose-500/20 group hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
              <div className="relative flex flex-col gap-1">
                 <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded flex items-center justify-center bg-white/20">
                      <Banknote className="h-3.5 w-3.5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest kalpurush-font">মোট বকেয়া</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0 text-[10px] kalpurush-font">স্ট্যান্ডিং ডিউ</Badge>
                </div>
                <p className="text-3xl font-black tracking-tighter">৳{toBn(totalDueAmount)}</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
              <div className="relative flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-orange-100 dark:bg-orange-500/20">
                     <AlertTriangle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest kalpurush-font">৩+ মাস বকেয়া (জরুরি)</p>
                </div>
                <p className="text-3xl font-black text-orange-600 dark:text-orange-500 tracking-tighter">{toBn(criticalCount)} <span className="text-sm font-medium text-zinc-400 tracking-normal kalpurush-font">জন শিক্ষার্থী</span></p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              <div className="relative flex flex-col gap-1">
                 <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20">
                     <TrendingDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest kalpurush-font">গড় বকেয়া / ছাত্র</p>
                </div>
                <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">৳{toBn(avgDue)}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
            <Input
              placeholder="নাম, আইডি বা ফোন দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
               className="pl-11 h-12 w-full rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 focus:bg-white dark:focus:bg-zinc-900 transition-all font-bold text-sm shadow-sm"
            />
          </div>
          <Select value={invoiceType} onValueChange={setInvoiceType}>
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 text-sm font-bold shadow-sm">
              <div className="flex items-center gap-2 lg:truncate">
                <Filter className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <SelectValue placeholder="সব ধরনের ফি" className="truncate" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl kalpurush-font p-1.5 max-h-[300px]">
              <SelectItem value="all" className="font-bold text-[13px] rounded-lg">সব ধরনের ফি</SelectItem>
              {(options.feeTypes || []).map((ft: any) => (
                <SelectItem key={ft.$id} value={ft.$id} className="font-bold text-[13px] rounded-lg">
                  {ft.nameBn || ft.name || ft.$id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 text-sm font-bold shadow-sm">
              <div className="flex items-center gap-2 lg:truncate">
                <Filter className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <SelectValue placeholder="সব শ্রেণী" className="truncate" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl kalpurush-font p-1.5 max-h-[300px]">
              <SelectItem value="all" className="font-bold text-[13px] rounded-lg">সব শ্রেণী</SelectItem>
              {Array.from(new Set([
                ...((options.classes || []) as string[]),
                ...dueStudents.map((s: any) => s.studentClass).filter(Boolean)
              ])).sort().map(cls => (
                <SelectItem key={cls as string} value={cls as string} className="font-bold text-[13px] rounded-lg">{cls as string}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ═══ Infinite Due Table ═══ */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {dueQuery.isLoading ? (
          <div className="p-8 space-y-5">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl opacity-50" />)}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
            <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 animate-pulse border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
              <Users className="h-10 w-10 text-emerald-500" />
            </div>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-500 kalpurush-font mb-2">কোনো বকেয়াদার নেই!</p>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-500/70 font-medium">সব শিক্ষার্থীর বেতন পরিশোধিত অথবা ফিল্টারে কোনো তথ্য নেই।</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-rose-500/[0.05] dark:bg-rose-500/[0.02] backdrop-blur-xl sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-4 pl-6 pr-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap">শিক্ষার্থী</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap">শ্রেণী ও সেকশন</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap text-right">মোট বকেয়া</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap text-center">এজিং / মাস</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap">শেষ পেমেন্ট ও ফোন</th>
                  <th className="py-4 pr-6 pl-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student) => (
                  <tr 
                    key={student.studentDocId} 
                    className="group hover:bg-[#00AEEF]/[0.02] dark:hover:bg-zinc-800/40 transition-all duration-300"
                  >
                    {/* Student */}
                    <td className="py-5 pl-6 pr-4 align-middle">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#00AEEF] transition-all duration-300">
                          <Users className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 kalpurush-font group-hover:text-[#00AEEF] transition-colors">{student.studentName}</span>
                          <span className="text-[11px] font-mono font-bold text-[#00AEEF] bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded flex w-fit mt-1">{student.studentId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-5 px-4 align-middle">
                      <div className="flex flex-col">
                         <span className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                           <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                           {student.studentClass}
                         </span>
                         <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-wide px-4">{student.studentSection}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-5 px-4 align-middle text-right">
                       <span className="block text-xl font-black text-rose-600 dark:text-rose-500 tracking-tighter group-hover:scale-110 origin-right transition-transform mb-1">
                         ৳{toBn(student.totalDue)}
                       </span>
                       <span className="text-[10px] font-bold text-zinc-400 kalpurush-font">{toBn(student.invoiceCount)} টি ইনভয়েস</span>
                    </td>

                    {/* Aging */}
                    <td className="py-5 px-4 align-middle text-center">
                       <Badge variant="outline" className={cn(
                          "rounded-md px-3 py-1 text-[11px] font-black border uppercase tracking-wider backdrop-blur-sm",
                          getAgingColor(student.monthsOverdue)
                        )}>
                          {toBn(student.monthsOverdue)} মাস — {getAgingLabel(student.monthsOverdue)}
                        </Badge>
                    </td>

                    {/* Last Payment & Phone */}
                    <td className="py-5 px-4 align-middle">
                       <div className="flex flex-col gap-1.5">
                         {/* Last Payment */}
                         <div className="flex items-center gap-2">
                           <div className="h-5 w-5 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                             <Clock className="h-3 w-3 text-zinc-400" />
                           </div>
                           <span className="text-[11px] font-bold text-zinc-500">{formatDate(student.lastPaymentDate)}</span>
                         </div>
                         {/* Phone */}
                         <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                             <Phone className="h-3 w-3 text-indigo-500" />
                           </div>
                           <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">{student.studentPhone || student.guardianPhone || 'N/A'}</span>
                         </div>
                       </div>
                    </td>

                    {/* Action */}
                    <td className="py-5 pr-6 pl-4 align-middle text-right">
                       <Link href={`/dashboard/admin/fees/collect?studentId=${student.studentId}`}>
                         <Button
                           className="bg-[#00AEEF]/10 hover:bg-[#00AEEF] text-[#00AEEF] hover:text-white dark:bg-[#00AEEF]/20 dark:hover:bg-[#00AEEF] border-0 rounded-lg shadow-none px-4 h-9 font-bold text-[11px] transition-all group-hover:shadow-md group-hover:-translate-y-0.5 w-full sm:w-auto"
                         >
                           <CreditCard className="h-3.5 w-3.5 mr-1.5" /> সংগ্রহ করুন
                         </Button>
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pseudo-Infinite Scroll Observer */}
            {displayLimit < filteredStudents.length && (
              <div ref={ref} className="py-12 flex justify-center items-center">
                <div className="flex flex-col items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-zinc-800 flex items-center justify-center animate-spin">
                     <Loader2 className="h-5 w-5 text-rose-500" />
                   </div>
                   <p className="text-xs font-bold text-zinc-400 kalpurush-font animate-pulse">আরও ডাটা লোড হচ্ছে...</p>
                </div>
              </div>
            )}
            
            {/* End of list */}
            {filteredStudents.length > 0 && displayLimit >= filteredStudents.length && (
              <div className="py-8 flex justify-center items-center">
                <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest kalpurush-font">সব রেকর্ড দেখানো হয়েছে</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Total Summary Footer */}
        {filteredStudents.length > 0 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 backdrop-blur-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                 <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
               </div>
               <div>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest kalpurush-font mb-0.5">মোট স্টুডেন্ট</p>
                 <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 leading-none">{toBn(filteredStudents.length)} <span className="text-xs font-medium text-zinc-500 kalpurush-font font-normal">জন বকেয়াদার</span></p>
               </div>
             </div>
             
             <div className="flex items-center gap-3 text-right">
                <div>
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest kalpurush-font mb-0.5">ফিল্টারকৃত বকেয়া</p>
                 <p className="text-2xl font-black text-rose-600 dark:text-rose-500 leading-none tracking-tighter">৳{toBn(filteredStudents.reduce((sum, s) => sum + s.totalDue, 0))}</p>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
