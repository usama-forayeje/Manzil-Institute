'use client';

import { 
  Users, 
  Home, 
  Building2, 
  ArrowRightLeft, 
  LayoutGrid, 
  ChevronRight,
  TrendingUp,
  UserCheck,
  DoorOpen,
  PieChart,
  Activity,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteStudents } from '@/features/students/api/queries';
import { boardingRoomsQueryOptions } from '@/features/admission/api/queries';
import { convertEnglishToBengali, cn } from '@/lib/utils';
import { useEffect } from 'react';
import { syncBoardingCounts } from '@/lib/actions/boarding';
import { Button } from '@/components/ui/button';

export default function BoardingHubPage() {
  // Sync counts on load to ensure accuracy
  useEffect(() => {
    syncBoardingCounts();
  }, []);

  // Queries for stats
  const { data: studentsData, isLoading: isLoadingStudents } = useInfiniteStudents({ status: 'active' });
  const { data: roomsData, isLoading: isLoadingRooms } = useQuery(boardingRoomsQueryOptions);

  const rooms = roomsData?.rooms || [];
  const totalRooms = rooms.length;
  const totalSeats = rooms.reduce((acc: number, curr: any) => acc + (curr.capacity || 0), 0);
  const occupiedSeats = rooms.reduce((acc: number, curr: any) => acc + (curr.occupiedSeats || 0), 0);
  const totalStudents = occupiedSeats; 
  const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  const quickLinks = [
    {
      title: 'আবাসিক শিক্ষার্থী',
      bnLabel: 'শিক্ষার্থী তালিকা ও ব্যবস্থাপনা',
      icon: Users,
      href: '/dashboard/admin/boarding/students',
      color: 'text-[#00AEEF]',
      bg: 'bg-[#00AEEF]/10',
      description: 'ছাত্রদের রুম বরাদ্দ, ট্রান্সফার এবং বোর্ডিং স্ট্যাটাস আপডেট করুন।'
    },
    {
      title: 'বোর্ডিং ধরন',
      bnLabel: 'ক্যাটাগরি কনফিগারেশন',
      icon: ArrowRightLeft,
      href: '/dashboard/admin/boarding/types',
      color: 'text-indigo-600',
      bg: 'bg-indigo-600/10',
      description: 'আবাসিক, অনিয়মিত বা ডে-বোর্ডিং সহ বিভিন্ন চার্জ সেটআপ করুন।'
    },
    {
      title: 'হল ও রুম সেটিংস',
      bnLabel: 'কক্ষ ও আসন বিন্যাস',
      icon: Building2,
      href: '/dashboard/admin/hall/rooms',
      color: 'text-emerald-600',
      bg: 'bg-emerald-600/10',
      description: 'নতুন রুম যোগ করুন এবং হলের ধারণক্ষমতা নির্ধারণ করুন।'
    },
    {
      title: 'আবাসিক রিপোর্ট',
      bnLabel: 'বিশ্লেষণ ও পরিসংখ্যান',
      icon: PieChart,
      href: '/dashboard/admin/reports/financial',
      color: 'text-orange-600',
      bg: 'bg-orange-600/10',
      description: 'বোর্ডিং ফি আদায় এবং শিক্ষার্থী উপস্থিতির ডিটেইল রিপোর্ট দেখুন।'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 solaimanlipi-font pb-20">
      
      {/* ══════════════ HEADER ══════════════ */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-10 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#00AEEF]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-400/5 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Home className="h-8 w-8 text-white" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] font-black uppercase text-[#00AEEF] border-[#00AEEF]/30 bg-[#00AEEF]/5">Residency Suite</Badge>
              </div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                আবাসিক ব্যবস্থাপনা
              </h1>
              <p className="mt-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest max-w-lg">
                ছাত্রাবাস, রুম বরাদ্দ এবং বোর্ডিং ফি কাঠামো নিয়ন্ত্রণের একীভূত হাব।
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Button className="h-10 rounded-lg bg-[#00AEEF] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-500/20">
               <Activity className="h-4 w-4" /> ডাটা সিঙ্ক হচ্ছে
             </Button>
          </div>
        </div>
      </div>

      {/* ══════════════ STATS ══════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard 
          title="মোট নিবাসী" 
          value={totalStudents} 
          footerText="সক্রিয় আবাসিক ছাত্র"
          icon={UserCheck} 
          color="blue" 
          isLoading={isLoadingStudents}
          unit="জন"
        />
        <DashboardStatCard 
          title="মোট রুম" 
          value={totalRooms} 
          footerText="সবগুলো হল মিলে"
          icon={DoorOpen} 
          color="indigo" 
          isLoading={isLoadingRooms}
          unit="টি"
        />
        <DashboardStatCard 
          title="অকুপেন্সি হার" 
          value={occupancyRate} 
          footerText={`${convertEnglishToBengali(occupiedSeats)}/${convertEnglishToBengali(totalSeats)} আসন`}
          icon={TrendingUp} 
          color="emerald" 
          isLoading={isLoadingRooms}
          unit="%"
        />
        <DashboardStatCard 
          title="ফাঁকা আসন" 
          value={totalSeats - occupiedSeats} 
          footerText="নতুন বরাদ্দের যোগ্য"
          icon={LayoutGrid} 
          color="rose" 
          isLoading={isLoadingRooms}
          unit="টি"
        />
      </div>

      {/* ══════════════ NAVIGATION GRID ══════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quickLinks.map((link, idx) => (
          <Link key={idx} href={link.href}>
            <div className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 transition-all hover:-translate-y-1 hover:border-[#00AEEF]/40 hover:shadow-xl hover:shadow-[#00AEEF]/5 cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <link.icon className="h-32 w-32" />
              </div>
              
              <div className="flex items-start gap-6 relative z-10">
                <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm", link.bg)}>
                  <link.icon className={cn("h-7 w-7", link.color)} strokeWidth={1.5} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5 focus:shadow-md">
                    <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">
                      {link.title}
                    </h3>
                    <div className="h-8 w-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-[#00AEEF] group-hover:text-white transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-[#00AEEF] uppercase tracking-[0.2em] mb-3">
                    {link.bnLabel}
                  </p>
                  <p className="text-[13px] font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed pr-8">
                    {link.description}
                  </p>
                </div>
              </div>

              {/* Decorative progress-like bar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#00AEEF] to-blue-500 transition-all duration-500 group-hover:w-full" />
            </div>
          </Link>
        ))}
      </div>

      {/* ══════════════ FOOTER TIP ══════════════ */}
      <div className="relative overflow-hidden bg-zinc-900 dark:bg-black rounded-xl p-8 border border-zinc-800">
        <div className="absolute top-0 right-0 opacity-10">
           <LayoutGrid size={120} />
        </div>
        <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
           <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
             <CheckCircle2 className="text-[#00AEEF] h-7 w-7" />
           </div>
           <div>
             <h4 className="text-white font-black text-lg tracking-tight">সিস্টেম ইন্টেগ্রিটি গাইড</h4>
             <p className="text-zinc-400 text-xs mt-1.5 max-w-xl leading-loose font-medium">
               বোর্্ডিং ব্যবস্থাপনায় রুম বরাদ্দ বা ট্রান্সফার করার সময় আসন সংখ্যা স্বয়ংক্রিয়ভাবে আপডেট হয়। কোনো গরমিল দেখা দিলে উপরে দেওয়া ‘ডাটা সিঙ্ক’ বাটনে ক্লিক করুন।
             </p>
           </div>
        </div>
      </div>

    </div>
  );
}

function DashboardStatCard({ title, value, icon: Icon, color, isLoading, unit, footerText }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', glow: 'bg-blue-400/10' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', glow: 'bg-indigo-400/10' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', glow: 'bg-emerald-400/10' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', glow: 'bg-rose-400/10' }
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:-translate-y-0.5 transition-transform group cursor-default">
      <div className={cn("pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full", c.glow)} />
      <div className="flex items-center justify-between mb-5">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm", c.bg)}>
          <Icon className={cn("h-5 w-5", c.text)} />
        </div>
        <Badge variant="outline" className="text-[9px] font-black uppercase border-zinc-200 dark:border-zinc-800 text-zinc-400">
          Live Data
        </Badge>
      </div>
      
      <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      
      {isLoading ? (
        <Skeleton className="h-8 w-24 rounded" />
      ) : (
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
            {convertEnglishToBengali(value)}
          </h3>
          <span className="text-xs font-bold text-zinc-400">{unit}</span>
        </div>
      )}

      <p className={cn("mt-3 text-[10px] font-bold uppercase tracking-tight", c.text)}>
        {footerText}
      </p>
    </div>
  );
}
