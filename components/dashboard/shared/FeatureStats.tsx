'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn, convertEnglishToBengali } from '@/lib/utils';

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  isBn?: boolean;
}

interface FeatureStatsProps {
  stats: Stat[];
}

export function FeatureStats({ stats }: FeatureStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-md border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 group hover:border-[#00AEEF]/30 transition-colors shadow-sm">
          <div className={cn("h-10 w-10 rounded-md flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
            <stat.icon className={cn("h-4 w-4", stat.color)} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{stat.label}</p>
            <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-mono tracking-tighter">
              {stat.isBn && typeof stat.value === 'number' 
                ? convertEnglishToBengali(stat.value) 
                : stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
