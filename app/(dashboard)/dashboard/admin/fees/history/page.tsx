'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Banknote,
  Loader2,
  Receipt,
  CheckCircle2,
  ListRestart
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
import { fetchPaymentHistory } from '@/lib/actions/fees';
import { PAYMENT_METHOD_LABELS } from '@/features/fees/types';
import type { FeeFilter } from '@/features/fees/types';

// ─── Bengali number helper ──────────────────────────────────
const toBn = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '---';
  const formatted = Number(num).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return { date: '---', time: '---' };
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
  };
};

const PAYMENT_METHOD_COLORS: Record<string, string> = {
  cash: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
  bkash: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/30',
  nagad: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30',
  bank: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
};

// Quick date presets
type DatePreset = 'today' | 'week' | 'month' | 'all';

function getDateRange(preset: DatePreset): { from?: string; to?: string } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  switch (preset) {
    case 'today':
      return { from: todayStart };
    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return { from: weekAgo.toISOString() };
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      return { from: monthStart };
    }
    default:
      return {};
  }
}

export default function FeeHistoryPage() {
  const [datePreset, setDatePreset] = useState<DatePreset>('month');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const dateRange = useMemo(() => getDateRange(datePreset), [datePreset]);

  // Remove page from filter so that useInfiniteQuery manages the param
  const filterWithoutPage: Record<string, any> = useMemo(() => ({
    paymentMethod: paymentMethodFilter === 'all' ? undefined : paymentMethodFilter,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    searchTerm: searchTerm.trim() || undefined,
  }), [paymentMethodFilter, dateRange, searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['feePayments', 'infinite', filterWithoutPage],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchPaymentHistory({
        ...filterWithoutPage,
        page: pageParam as number,
        limit: 30, // 30 items per scroll
      });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      // Calculate total loaded dynamically
      const totalLoaded = allPages.reduce((acc, p) => acc + (p.payments?.length || 0), 0);
      if (lastPage.total && totalLoaded < (lastPage.total as number)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const payments = useMemo(() => data?.pages.flatMap(page => page.payments || []) || [], [data]);
  const totalRecords = data?.pages[0]?.total || 0;
  // Calculate total amount ONLY based on fetched items so far for this session, 
  // or use the server's total if provided. Currently server total amount is per page,
  // so we aggregate all fetched pages' totalAmounts.
  const totalAmountLoaded = useMemo(() => data?.pages.reduce((acc, p) => acc + (p.totalAmount || 0), 0) || 0, [data]);

  // CSV Export
  const handleExport = () => {
    if (payments.length === 0) return;
    const headers = ['তারিখ', 'রসিদ নম্বর', 'শিক্ষার্থীর নাম', 'আইডি', 'শ্রেণী', 'পরিমাণ', 'মাধ্যম', 'ট্রানজেকশন রেফ', 'সংগ্রহকারী'];
    const rows = payments.map(p => [
      formatDateTime(p.paidAt || p.$createdAt || '').date,
      p.paymentId,
      p.studentName,
      p.studentId,
      p.studentClass,
      p.amount,
      PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod,
      p.transactionRef || '',
      p.recordedBy || '',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manzil_Payment_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-sans">
      {/* ═══ Header ═══ */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00AEEF] via-cyan-400 to-[#00AEEF] rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-700" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00AEEF0a_1px,transparent_1px),linear-gradient(to_bottom,#00AEEF0a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-50" />
          
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#005f82] p-[1px] shadow-lg shadow-[#00AEEF]/20">
              <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:bg-[#00AEEF]/[0.02] transition-colors">
                <Receipt className="h-8 w-8 text-[#00AEEF] absolute transform transition-transform group-hover:scale-110" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-2 kalpurush-font drop-shadow-sm">ফি ইতিহাস ও লেজার</h1>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide flex items-center gap-2">
                সকল পেমেন্ট রেকর্ড <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" /> ইনফিনিটি স্ক্রলিং
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-3">
            <Button
              onClick={handleExport}
              disabled={payments.length === 0}
              className="h-12 px-6 rounded-xl font-bold text-sm bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 border border-transparent hover:border-zinc-700 dark:hover:border-zinc-200"
            >
              <Download className="h-4 w-4 mr-2" /> এক্সপোর্ট CSV
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ Floating Stats ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : (
          <>
            <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
              <div className="relative flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20">
                    <ListRestart className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest kalpurush-font">মোট পেমেন্ট রেকর্ড</p>
                </div>
                <p className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">{toBn(totalRecords)} <span className="text-sm font-medium text-zinc-400 tracking-normal kalpurush-font">টি ট্রানজেকশন</span></p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white dark:bg-zinc-900/80 backdrop-blur-sm p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="relative flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20">
                    <Banknote className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest kalpurush-font">মোট সংগ্রহ (লোডেড)</p>
                </div>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">৳{toBn(totalAmountLoaded)}</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#00AEEF] text-white p-6 rounded-xl border border-[#00AEEF] shadow-lg shadow-[#00AEEF]/20 group hover:shadow-xl hover:shadow-[#00AEEF]/30 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
              <div className="relative flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded flex items-center justify-center bg-white/20">
                    <Calendar className="h-3.5 w-3.5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest kalpurush-font">সাম্প্রতিক ফিল্টার</p>
                </div>
                <p className="text-3xl font-black tracking-tighter">
                  {datePreset === 'all' ? 'সব সময়' : datePreset === 'month' ? 'এই মাস' : datePreset === 'week' ? 'এই সপ্তাহ' : 'আজ'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4 relative z-10 hidden sm:block">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Custom Toggle specific to fee history */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1.5 shadow-inner">
            {[
              { value: 'today', label: 'আজ' },
              { value: 'week', label: 'সপ্তাহ' },
              { value: 'month', label: 'মাস' },
              { value: 'all', label: 'সব' },
            ].map(preset => (
              <button
                key={preset.value}
                onClick={() => setDatePreset(preset.value as DatePreset)}
                className={cn(
                  "px-5 py-2.5 rounded-md text-[13px] kalpurush-font font-black transition-all duration-300 ease-out",
                  datePreset === preset.value
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-md transform scale-100'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-700/50'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
            <Input
              placeholder="স্টুডেন্ট আইডি বা রসিদ দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-11 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 focus:bg-white dark:focus:bg-zinc-900 transition-all font-bold text-sm shadow-sm"
            />
          </div>

          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-48 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 text-sm font-bold shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-zinc-400" />
                <SelectValue placeholder="সব মাধ্যম" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl kalpurush-font p-1.5 flex flex-col gap-1">
              <SelectItem value="all" className="font-bold text-[13px] rounded-lg">সব মাধ্যম (All)</SelectItem>
              <SelectItem value="cash" className="font-bold text-[13px] rounded-lg">নগদ (Cash)</SelectItem>
              <SelectItem value="bkash" className="font-bold text-[13px] rounded-lg">বিকাশ (bKash)</SelectItem>
              <SelectItem value="nagad" className="font-bold text-[13px] rounded-lg">নগদ (Nagad)</SelectItem>
              <SelectItem value="bank" className="font-bold text-[13px] rounded-lg">ব্যাংক (Bank)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Filter Bar (Simplified) */}
      <div className="sm:hidden space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-xl"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
           <Select value={datePreset} onValueChange={(v) => setDatePreset(v as DatePreset)}>
            <SelectTrigger className="h-12 rounded-xl text-sm font-bold kalpurush-font"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">আজ</SelectItem>
              <SelectItem value="week">সপ্তাহ</SelectItem>
              <SelectItem value="month">মাস</SelectItem>
              <SelectItem value="all">সব সময়</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="h-12 rounded-xl text-sm font-bold kalpurush-font"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব মাধ্যম</SelectItem>
              <SelectItem value="cash">নগদ</SelectItem>
              <SelectItem value="bkash">বিকাশ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ═══ Infinite Ledger Grid ═══ */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {isLoading ? (
          <div className="p-8 space-y-5">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl opacity-50" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 text-center">
            <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mb-6 animate-pulse">
              <Search className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            </div>
            <p className="text-xl font-black text-zinc-500 kalpurush-font mb-2">কোনো রেকর্ড পাওয়া যায়নি</p>
            <p className="text-sm text-zinc-400 font-medium">আপনার ফিল্টার অপশনগুলো পরিবর্তন করে দেখুন।</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-[#00AEEF]/[0.05] dark:bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-4 pl-6 pr-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest whitespace-nowrap">রসিদ / সময়</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest">শিক্ষার্থী</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest">মাধ্যম ও রেফারেন্স</th>
                  <th className="py-4 px-4 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest text-right">পরিমাণ</th>
                  <th className="py-4 px-6 font-black kalpurush-font text-zinc-500 dark:text-zinc-400 text-[11px] uppercase tracking-widest text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => {
                  const dt = formatDateTime(payment.paidAt || payment.$createdAt || '');
                  return (
                    <tr 
                      key={`${payment.$id}-${idx}`} 
                      className="group hover:bg-[#00AEEF]/[0.02] dark:hover:bg-zinc-800/40 transition-all duration-300"
                    >
                      {/* Receipt & Date */}
                      <td className="py-5 pl-6 pr-4 align-middle">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#00AEEF] transition-all duration-300">
                            <Receipt className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-0.5 group-hover:text-[#00AEEF] transition-colors">{payment.paymentId}</span>
                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">{dt.date}</span>
                            <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1 mt-0.5"><Clock className="h-3 w-3" /> {dt.time}</span>
                          </div>
                        </div>
                      </td>

                      {/* Student Info */}
                      <td className="py-5 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 kalpurush-font group-hover:text-[#00AEEF] transition-colors">{payment.studentName}</span>
                          <span className="text-[11px] font-mono font-bold text-[#00AEEF] mt-1">{payment.studentId}</span>
                          <span className="text-[11px] font-bold text-zinc-500 line-clamp-1 mt-0.5">{payment.studentClass}</span>
                        </div>
                      </td>

                      {/* Method & Ref */}
                      <td className="py-5 px-4 align-middle">
                        <div className="flex flex-col items-start gap-2">
                          <Badge variant="outline" className={cn(
                            "rounded-md px-2.5 py-1 text-[10px] font-black border uppercase tracking-wider backdrop-blur-sm",
                            PAYMENT_METHOD_COLORS[payment.paymentMethod] || 'bg-zinc-50 border-zinc-200 text-zinc-600'
                          )}>
                            {PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod}
                          </Badge>
                          {payment.transactionRef ? (
                           <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-500">
                             {payment.transactionRef}
                           </div>
                          ) : (
                            <span className="text-[10px] text-zinc-300 dark:text-zinc-700 italic kalpurush-font font-bold">কোনো রেফারেন্স নেই</span>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-5 px-4 align-middle text-right">
                        <span className="block text-xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter group-hover:scale-110 origin-right transition-transform mb-1">
                          ৳{toBn(payment.amount)}
                        </span>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[10px] font-bold text-zinc-400 kalpurush-font">সংগ্রহ: {payment.recordedBy}</span>
                          
                          {/* Precise Discount Badge from Invoice Join */}
                          {payment.discount > 0 && (
                            <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 text-[10px] font-black px-2 py-0 rounded">
                              ছাড়: ৳{toBn(payment.discount)}
                            </Badge>
                          )}

                          {/* Original Notes (if not just a discount note) */}
                          {payment.notes && !payment.notes.startsWith('ডিসকাউন্ট: ৳') && (
                            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded kalpurush-font max-w-[120px] truncate">
                              {payment.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-5 px-6 align-middle text-right">
                         <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                           <CheckCircle2 className="h-3.5 w-3.5" />
                           <span className="text-[11px] font-black kalpurush-font uppercase tracking-wide">সফল</span>
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Observer Target for Infinite Scroll */}
            <div ref={ref} className="py-12 flex justify-center items-center">
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-cyan-50 dark:bg-zinc-800 flex items-center justify-center animate-spin">
                     <Loader2 className="h-5 w-5 text-[#00AEEF]" />
                   </div>
                   <p className="text-xs font-bold text-zinc-400 kalpurush-font animate-pulse">আরও ডাটা লোড হচ্ছে...</p>
                </div>
              ) : hasNextPage ? (
                <div className="h-1 w-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              ) : payments.length > 0 ? (
                <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest kalpurush-font">সব রেকর্ড দেখানো হয়েছে</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
