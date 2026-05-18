'use client';

import React from 'react';
import { LucideIcon, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onAdd?: () => void;
  addLabel?: string;
  globalFilter?: string;
  onGlobalFilterChange?: (val: string) => void;
  searchPlaceholder?: string;
  extraActions?: React.ReactNode;
}

export function FeatureHeader({
  title,
  description,
  icon: Icon,
  onAdd,
  addLabel = 'যুক্ত করুন',
  globalFilter,
  onGlobalFilterChange,
  searchPlaceholder = 'খুঁজুন...',
  extraActions
}: FeatureHeaderProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00AEEF] to-[#0081B1] rounded-xl blur opacity-5 group-hover:opacity-10 transition duration-500"></div>
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 rounded-md border border-zinc-100 dark:border-zinc-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-md bg-gradient-to-br from-[#00AEEF] to-[#0081B1] p-0.5 shadow-lg shadow-cyan-500/10">
            <div className="h-full w-full rounded-[3px] bg-white dark:bg-zinc-900 flex items-center justify-center">
              <Icon className="h-6 w-6 text-[#00AEEF]" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-50 kalpurush-font tracking-tight leading-none mb-1">{title}</h1>
            <p className="text-xs text-zinc-500 font-medium tracking-tight">{description}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {onGlobalFilterChange && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <Input 
                placeholder={searchPlaceholder} 
                value={globalFilter ?? ''}
                onChange={e => onGlobalFilterChange(e.target.value)}
                className="pl-9 h-11 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border-transparent focus:bg-white dark:focus:bg-zinc-800 transition-all font-medium py-0"
              />
            </div>
          )}
          {extraActions}
          {onAdd && (
            <Button 
              onClick={onAdd}
              className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-md px-6 h-11 kalpurush-font font-black shadow-lg shadow-cyan-500/10 transition-all hover:scale-[1.02] active:scale-95 border-0"
            >
              <Plus className="h-4 w-4 mr-2" /> {addLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
