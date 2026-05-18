'use client';

import { Search, Plus, RotateCcw} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStudentTableStore } from '../store/useStudentTableStore';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function StudentTableToolbar() {
  const { search, setSearch, status, setFilters, resetFilters } = useStudentTableStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
      <div className="relative flex-1 group sm:max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <Input
          placeholder="ছাত্রের নাম বা আইডি দিয়ে খুঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12 rounded-lg border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition-all kalpurush-font"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-[#00AEEF]/5 shrink-0"
          onClick={resetFilters}
          title="রিসেট"
        >
          <RotateCcw className="h-4 w-4 text-zinc-400" />
        </Button>

        <Select value={status || 'active'} onValueChange={(val) => setFilters({ status: val })}>
          <SelectTrigger className="h-12 w-[160px] rounded-lg border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md kalpurush-font font-bold text-zinc-700 dark:text-zinc-300 transition-all hover:bg-[#00AEEF]/5 shrink-0 focus:ring-2 focus:ring-[#00AEEF]/20">
            <SelectValue placeholder="সব স্ট্যাটাস" />
          </SelectTrigger>
          <SelectContent className="kalpurush-font text-zinc-700 dark:text-zinc-300">
            <SelectItem value="active">সক্রিয় শিক্ষার্থী</SelectItem>
            <SelectItem value="inactive">নিষ্ক্রিয় শিক্ষার্থী</SelectItem>
            <SelectItem value="graduated">উত্তীর্ণ শিক্ষার্থী</SelectItem>
            <SelectItem value="disqualified">বাতিলকৃত</SelectItem>
            <SelectItem value="suspended">বহিস্কৃত</SelectItem>
            <SelectItem value="transferred">স্থানান্তরিত</SelectItem>
            <SelectItem value="all" className="font-bold border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">সবার তালিকা (All)</SelectItem>
          </SelectContent>
        </Select>

        <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0" />

        <Button 
          asChild 
          className="h-12 px-6 gap-2 rounded-lg bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white shadow-lg shadow-[#00AEEF]/20 shrink-0 kalpurush-font font-black"
        >
          <Link href="/dashboard/admin/students/admission">
            <Plus className="h-5 w-5" /> নতুন ভর্তি
          </Link>
        </Button>
      </div>
    </div>
  );
}
