import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper for Bengali conversion in components
const toBn = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '---';
  const formatted = Number(num).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

interface StatsCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  isLoading?: boolean;
  color?: 'emerald' | 'rose' | 'sky' | 'indigo' | 'zinc';
  badgeText?: string;
  footerText?: string;
  progress?: number;
  prefix?: string;
  suffix?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  isLoading,
  color = 'zinc',
  badgeText,
  footerText,
  progress,
  prefix = '৳',
  suffix = '',
}: StatsCardProps) {
  const colorMap: Record<string, any> = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
      prog: 'bg-emerald-500',
      glow: 'bg-emerald-400/10'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      prog: 'bg-blue-500',
      glow: 'bg-blue-400/10'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      text: 'text-rose-600 dark:text-rose-400',
      badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
      prog: 'bg-rose-500',
      glow: 'bg-rose-400/10'
    },
    sky: {
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      text: 'text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/20',
      prog: 'bg-sky-500',
      glow: 'bg-sky-400/10'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
      prog: 'bg-indigo-500',
      glow: 'bg-indigo-400/10'
    },
    zinc: {
      bg: 'bg-zinc-50 dark:bg-zinc-900',
      text: 'text-zinc-600 dark:text-zinc-400',
      badge: 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
      prog: 'bg-zinc-500',
      glow: 'bg-zinc-400/10'
    }
  };

  const c = colorMap[color] ?? colorMap.zinc;

  return (
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform group cursor-default">
      <div className={cn("pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full", c?.glow || 'bg-zinc-400/10')} />
      <div className="flex items-center justify-between mb-5">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform", c?.bg || 'bg-zinc-50')}>
          <Icon className={cn("h-5 w-5", c?.text || 'text-zinc-600')} />
        </div>
        {badgeText && (
          <Badge className={cn("text-[10px] font-black rounded-md", c?.badge)}>
            {badgeText}
          </Badge>
        )}
      </div>
      <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
        {title}
      </p>
      {isLoading ? (
        <Skeleton className="h-7 w-32 rounded" />
      ) : (
        <p className={cn("text-2xl font-black tracking-tighter", color === 'rose' ? c?.text : 'text-zinc-900 dark:text-zinc-50')}>
          {typeof value === 'number' || (!isNaN(Number(value)) && value !== '' && value !== null) 
            ? `${prefix}${toBn(value)}${suffix}` 
            : value}
        </p>
      )}

      {footerText && (
        <p className={cn("mt-2 text-[11px] font-bold uppercase tracking-tight", c.text)}>
          {footerText}
        </p>
      )}

      {progress !== undefined && (
        <div className="mt-3 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000", c.prog)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
