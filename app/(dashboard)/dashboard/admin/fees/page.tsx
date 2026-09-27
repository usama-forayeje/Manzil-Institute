'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Banknote,
  TrendingUp,
  AlertTriangle,
  Users,
  ArrowRight,
  CreditCard,
  FileText,
  Receipt,
  Clock,
  CircleDollarSign,
  User,
  Filter,
  PieChart as PieIcon,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  AreaChart,
  Area,
  LabelList,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import {
  feeDashboardQueryOptions,
  feeFilterOptionsQueryOptions,
} from '@/features/fees/api/queries';
import { CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { bn as bnLocale } from 'date-fns/locale';
import { type DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { convertEnglishToBengali } from '@/lib/utils';
import { StatsCard } from '@/features/fees/components/StatsCard';

// ─── Helpers ───────────────────────────────────────────────────
const toBn = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '০';
  const val = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(val)) return '০';
  const formatted = Math.round(val).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('bn-BD', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ─── Chart Configs ──────────────────────────────────────────────
const trendChartConfig = {
  collected: { label: 'সংগৃহীত', color: '#10b981' },
  due: { label: 'বকেয়া', color: '#3b82f6' },
} satisfies ChartConfig;

const sourceChartConfig = {
  value: { label: 'পরিমাণ' },
  cash: { label: 'নগদ', color: '#10b981' },
  bkash: { label: 'বিকাশ', color: '#e11d48' },
  nagad: { label: 'নগদ (Nagad)', color: '#f59e0b' },
  bank: { label: 'ব্যাংক', color: '#3b82f6' },
} satisfies ChartConfig;

// ─── Custom Tooltip ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-3 text-xs font-black">
      <p className="text-zinc-500 dark:text-zinc-400 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-zinc-700 dark:text-zinc-300">
            {entry.dataKey === 'collected' ? 'সংগৃহীত' : 'বকেয়া'}:
          </span>
          <span className="text-zinc-900 dark:text-zinc-100">৳{toBn(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom Pie Label ───────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  if (!value) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cx + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '11px', fontWeight: 900 }}
    >
      ৳{toBn(value)}
    </text>
  );
};

export default function FeeDashboardPage() {
  const optionsQuery = useQuery(feeFilterOptionsQueryOptions());
  const sessions = optionsQuery.data?.options?.sessions || [];
  const feeTypes = optionsQuery.data?.options?.feeTypes || [];

  const [session, setSession] = useState('all');
  const [feeType, setFeeType] = useState('all');
  
  // Default to current month
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const dashboardQuery = useQuery(
    feeDashboardQueryOptions(
      session, 
      feeType, 
      dateRange?.from?.toISOString().split('T')[0], 
      dateRange?.to?.toISOString().split('T')[0]
    )
  );

  const stats = dashboardQuery.data?.stats;
  const recentPayments = dashboardQuery.data?.recentPayments || [];
  const monthlyTrend = dashboardQuery.data?.monthlyTrend || [];
  const classDueSummary = dashboardQuery.data?.classDueSummary || [];

  const isLoading = dashboardQuery.isLoading;

  const pieData = useMemo(() => {
    if (!stats?.revenueByMethod) return [];
    return [
      { name: 'নগদ', value: stats.revenueByMethod.cash || 0, fill: '#10b981' },
      { name: 'বিকাশ', value: stats.revenueByMethod.bkash || 0, fill: '#e11d48' },
      { name: 'নগদ (Nagad)', value: stats.revenueByMethod.nagad || 0, fill: '#f59e0b' },
      { name: 'ব্যাংক', value: stats.revenueByMethod.bank || 0, fill: '#3b82f6' },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const collectionRate = stats?.collectionRate || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 solaimanlipi-font pb-20">

      {/* ══════════════ HEADER ══════════════ */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-8 shadow-sm">
        {/* Glow blob */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-400/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Title */}
          <div className="flex items-center gap-5">
            <div className="relative h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Banknote className="h-7 w-7 text-white" strokeWidth={1.5} />
              {/* Pulse ring */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                ফি ড্যাশবোর্ড
              </h1>
              <p className="mt-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                রিয়েল-টাইম ডাটা সিঙ্ক্রোনাইজড
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 md:justify-end">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[260px] h-10 justify-start px-3 text-[13px] font-black rounded-lg bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900",
                    !dateRange && "text-zinc-500"
                  )}
                >
                  <CalendarIcon className="mr-2.5 h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <span className="flex items-center gap-1.5">
                        {format(dateRange.from, "dd MMM", { locale: bnLocale })}
                        <span className="text-zinc-300 dark:text-zinc-700">|</span>
                        {format(dateRange.to, "dd MMM, y", { locale: bnLocale })}
                      </span>
                    ) : (
                      format(dateRange.from, "dd MMM, y", { locale: bnLocale })
                    )
                  ) : (
                    <span>তারিখ নির্বাচন</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl border-zinc-200 dark:border-zinc-800" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={bnLocale}
                />
              </PopoverContent>
            </Popover>

            <Select value={session} onValueChange={setSession}>
              <SelectTrigger className="w-[140px] h-10 rounded-lg bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-bold text-xs ring-offset-emerald-500">
                <SelectValue placeholder="সেশন" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectItem value="all">সকল সেশন</SelectItem>
                {sessions.map((s: string) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={feeType} onValueChange={setFeeType}>
              <SelectTrigger className="w-[140px] h-10 rounded-lg bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-bold text-xs ring-offset-emerald-500">
                <SelectValue placeholder="ফি টাইপ" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                <SelectItem value="all">সব ফি</SelectItem>
                {feeTypes.map((t: any) => (
                  <SelectItem key={t.$id || t.name} value={t.name}>
                    {t.nameBn || t.name || t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          key="total-collected"
          title="মোট সংগ্রহ" 
          value={stats?.totalCollectedThisMonth ?? 0} 
          footerText={`${toBn(stats?.totalStudentsPaid ?? 0)} জন প্রদানকারী`} 
          icon={CircleDollarSign} 
          color="blue" 
          isLoading={isLoading} 
          prefix="৳"
        />
        <StatsCard 
          key="total-due"
          title="মোট বকেয়া" 
          value={stats?.totalDueAmount ?? 0} 
          footerText={`${toBn(stats?.totalUnpaidInvoices ?? 0)}টি ইনভয়েস`} 
          icon={AlertTriangle} 
          color="rose" 
          isLoading={isLoading} 
          prefix="৳"
        />
        <StatsCard 
          key="collection-rate"
          title="কালেকশন হার" 
          value={Math.round(stats?.collectionRate ?? 0)} 
          footerText={`${toBn(stats?.totalInvoicesThisMonth ?? 0)} মোট ইনভয়েস`} 
          icon={TrendingUp} 
          color="emerald" 
          isLoading={isLoading} 
          prefix=""
          suffix="%"
        />
        <StatsCard 
          key="active-students"
          title="মোট শিক্ষার্থী" 
          value={stats?.totalStudents ?? 0} 
          footerText="সক্রিয় এনরোলমেন্ট" 
          icon={Users} 
          color="indigo" 
          isLoading={isLoading} 
          prefix=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 flex flex-col">
          <Tabs defaultValue="area" className="w-full flex flex-col flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-zinc-800 flex items-center justify-center border border-emerald-100 dark:border-zinc-700">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 leading-none">
                    মাসিক প্রবৃদ্ধি বিশ্লেষণ
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 rounded-md py-0 px-2 font-black">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +৫.২%
                    </Badge>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      Monthly Trend
                    </span>
                  </div>
                </div>
              </div>

              <TabsList className="bg-zinc-100 dark:bg-zinc-950 rounded-lg h-9 border border-zinc-200 dark:border-zinc-800 p-1">
                <TabsTrigger
                  value="area"
                  className="rounded-md px-5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 text-zinc-400 cursor-pointer"
                >
                  AREA
                </TabsTrigger>
                <TabsTrigger
                  value="bar"
                  className="rounded-md px-5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 text-zinc-400 cursor-pointer"
                >
                  BAR
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 w-full min-h-[320px]">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-xl opacity-30" />
              ) : (
                <ChartContainer config={trendChartConfig} className="h-full w-full">
                  <TabsContent value="area" className="h-full w-full mt-0 outline-none">
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={monthlyTrend} margin={{ top: 16, right: 20, left: -10, bottom: 16 }}>
                        <defs>
                          <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradDue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.10} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                          dataKey="monthBn"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                          className="text-zinc-400"
                          tickMargin={12}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                          className="text-zinc-400"
                          tickMargin={10}
                          tickFormatter={(v) => toBn(v)}
                          width={70}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Area
                          dataKey="collected"
                          type="monotone"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fill="url(#gradCollected)"
                          animationDuration={800}
                        />
                        <Area
                          dataKey="due"
                          type="monotone"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fill="url(#gradDue)"
                          animationDuration={800}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="bar" className="h-full w-full mt-0 outline-none">
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={monthlyTrend} margin={{ top: 16, right: 20, left: -10, bottom: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                          dataKey="monthBn"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                          className="text-zinc-400"
                          tickMargin={12}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 700 }}
                          className="text-zinc-400"
                          tickMargin={10}
                          tickFormatter={(v) => toBn(v)}
                          width={70}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} animationDuration={800} />
                        <Bar dataKey="due" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} animationDuration={800} />
                        <Legend
                          formatter={(value) =>
                            value === 'collected' ? 'সংগৃহীত' : 'বকেয়া'
                          }
                          wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '8px' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </ChartContainer>
              )}
            </div>
          </Tabs>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center border border-indigo-100 dark:border-zinc-700">
              <PieIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 leading-none">
                কালেকশন মেথড
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                Method Segmentation
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[260px]">
            {isLoading ? (
              <Skeleton className="h-48 w-48 rounded-full mx-auto" />
            ) : pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    cornerRadius={6}
                    stroke="none"
                    labelLine={false}
                    label={renderPieLabel}
                    animationDuration={800}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`৳${toBn(Number(value))}`, name]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '0.5px solid #e4e4e7',
                      background: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 text-zinc-500 gap-3">
                <Activity className="h-10 w-10" />
                <p className="text-xs font-black uppercase tracking-widest">ডাটা পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none">
                  সাম্প্রতিক কার্যক্রম
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                  Operational History
                </p>
              </div>
            </div>
            <Link href="/dashboard/admin/fees/history">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white transition-all border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
              >
                View List <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50/30 dark:bg-zinc-950/20">
                  <th className="py-3 pl-6 pr-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    শিক্ষার্থী
                  </th>
                  <th className="py-3 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    পরিমাণ
                  </th>
                  <th className="py-3 px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    ফি-এর ধরন
                  </th>
                  <th className="py-3 pr-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">
                    সময়
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="space-y-1.5">
                              <Skeleton className="h-3.5 w-28 rounded" />
                              <Skeleton className="h-2.5 w-20 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
                        <td className="py-4 px-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                        <td className="py-4 pr-6 text-right"><Skeleton className="h-4 w-24 rounded ml-auto" /></td>
                      </tr>
                    ))
                  : recentPayments.map((p: any) => (
                      <tr
                        key={p.$id}
                        className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-default"
                      >
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                                {p.studentPhoto ? (
                                    <img src={p.studentPhoto} alt="" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-4 w-4 text-zinc-400" />
                                )}
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-zinc-900 dark:text-zinc-100 leading-none">
                                {p.studentName}
                              </p>
                              <p className="text-[10px] font-bold text-zinc-400 mt-1 border-l-2 border-emerald-500 pl-1.5 uppercase tracking-wide">
                                {p.studentId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                            ৳{toBn(p.amount)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 py-1 px-2.5 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 rounded-lg tracking-wide max-w-[150px] truncate"
                          >
                            {p.feeLabel || p.invoiceType}
                          </Badge>
                        </td>
                        <td className="py-4 pr-6 text-right">
                          <p className="text-[12px] font-black text-zinc-800 dark:text-zinc-100 leading-none">
                            {formatDate(p.paidAt)}
                          </p>
                          <p className="text-[10px] font-bold text-zinc-400 mt-1 flex items-center justify-end gap-1 uppercase tracking-wide">
                            <Clock className="h-2.5 w-2.5 text-indigo-400" />
                            {formatTime(p.paidAt)}
                          </p>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-950/30">
            <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-zinc-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-none">
                শ্রেণীওয়ারি বকেয়া
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                Status by Class
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-2 w-full rounded" />
                  </div>
                ))
              : classDueSummary.map((cls, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-700/50 p-4 hover:border-emerald-500/30 transition-all cursor-default"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[13px] font-black text-zinc-800 dark:text-zinc-200 leading-none">
                          {cls.className}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 mt-1.5 uppercase tracking-wide">
                          {toBn(cls.unpaidCount)} / {toBn(cls.totalStudents)} বকেয়া
                        </p>
                      </div>
                      <span className="text-[13px] font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-100 dark:border-rose-500/20">
                        ৳{toBn(cls.totalDue)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min((cls.unpaidCount / (cls.totalStudents || 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { href: '/dashboard/admin/fees/collect', icon: CreditCard, label: 'পেমেন্ট গ্রহণ', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { href: '/dashboard/admin/fees/generate', icon: Banknote, label: 'ইনভয়েস জেনারেট', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { href: '/dashboard/admin/fees/due', icon: AlertTriangle, label: 'বকেয়া তালিকা', color: 'text-rose-600', bg: 'bg-rose-50' },
          { href: '/dashboard/admin/fees/history', icon: FileText, label: 'ফি ইতিহাস', color: 'text-sky-600', bg: 'bg-sky-50' },
          { href: '/dashboard/admin/receipts', icon: Receipt, label: 'রসিদ প্রিন্ট', color: 'text-orange-600', bg: 'bg-orange-50' },
          { href: '/dashboard/admin/fees/structure', icon: Activity, label: 'ফি স্ট্রাকচার', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((link, i) => (
          <Link key={i} href={link.href}>
            <Button
              variant="outline"
              className="w-full h-24 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-emerald-500 transition-all flex flex-col items-center justify-center gap-2.5 shadow-sm group hover:-translate-y-0.5 cursor-pointer"
            >
              <div className={cn('p-2.5 rounded-lg transition-all group-hover:scale-110 group-hover:rotate-6', link.bg)}>
                <link.icon className={cn('h-5 w-5', link.color)} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wide leading-none">
                {link.label}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}