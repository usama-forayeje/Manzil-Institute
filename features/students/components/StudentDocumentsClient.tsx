'use client';

import React, { useState, useMemo } from 'react';
import { useInfiniteStudents } from '@/features/students/api/queries';
import { StudentListItem } from '@/features/students/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Search,
  FileText,
  User,
  X,
  ZoomIn,
  CheckCircle2,
  AlertCircle,
  ImageOff,
  ExternalLink,
  FileImage,
  ShieldCheck,
  Baby,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

// ── Document field definitions ──────────────────────────────────
const DOC_FIELDS = [
  { key: 'photo',                  label: 'ছবি',           labelEn: 'Photo',           icon: User },
  { key: 'studentDocFrontUrl',     label: 'জন্ম সনদ (সামনে)', labelEn: 'Birth Cert. Front', icon: Baby },
  { key: 'studentDocBackUrl',      label: 'জন্ম সনদ (পিছনে)', labelEn: 'Birth Cert. Back',  icon: Baby },
  { key: 'fatherNidFrontUrl',      label: 'পিতার NID (সামনে)', labelEn: "Father's NID Front", icon: ShieldCheck },
  { key: 'fatherNidBackUrl',       label: 'পিতার NID (পিছনে)', labelEn: "Father's NID Back",  icon: ShieldCheck },
  { key: 'motherNidFrontUrl',      label: 'মাতার NID (সামনে)', labelEn: "Mother's NID Front", icon: ShieldCheck },
  { key: 'motherNidBackUrl',       label: 'মাতার NID (পিছনে)', labelEn: "Mother's NID Back",  icon: ShieldCheck },
  { key: 'transferCertificateUrl', label: 'ট্রান্সফার সার্টিফিকেট', labelEn: 'Transfer Certificate', icon: FileText },
] as const;

type DocKey = (typeof DOC_FIELDS)[number]['key'];

// ── Lightbox ────────────────────────────────────────────────────
function Lightbox({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <span className="font-bold text-sm text-zinc-700 dark:text-zinc-200 kalpurush-font">{label}</span>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AEEF] hover:underline text-xs font-semibold flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" /> পূর্ণ সাইজে দেখুন
            </a>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 min-h-[400px]">
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(src)}`}
            alt={label}
            className="max-h-[70vh] max-w-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

// ── Document Thumbnail ──────────────────────────────────────────
function DocThumb({
  url,
  label,
  onClick,
}: {
  url?: string;
  label: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return (
      <div
        title={label}
        className="flex flex-col items-center justify-center h-20 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-dashed border-zinc-200 dark:border-zinc-700 gap-1 cursor-default"
      >
        <ImageOff className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium text-center leading-tight px-1">{label}</span>
      </div>
    );
  }

  return (
    <button
      title={label}
      onClick={onClick}
      className="relative group flex flex-col items-center justify-center h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:border-[#00AEEF] dark:hover:border-[#00AEEF] transition-all cursor-pointer bg-zinc-100 dark:bg-zinc-800"
    >
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-800 animate-pulse">
           <div className="h-4 w-4 border-2 border-zinc-300 dark:border-zinc-600 border-t-[#00AEEF] rounded-full animate-spin" />
        </div>
      )}
      <img
        src={`/api/image-proxy?url=${encodeURIComponent(url)}`}
        alt={label}
        className={cn("w-full h-full object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
        <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
      </div>
    </button>
  );
}

// ── Student Document Card ───────────────────────────────────────
function StudentDocCard({ student }: { student: StudentListItem }) {
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  const docs = student as any;
  const uploadedCount = DOC_FIELDS.filter((f) => !!docs[f.key]).length;
  const totalCount = DOC_FIELDS.length;
  const isComplete = uploadedCount === totalCount;

  return (
    <>
      {lightbox && (
        <Lightbox src={lightbox.src} label={lightbox.label} onClose={() => setLightbox(null)} />
      )}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-zinc-950/50 transition-all duration-300">
        {/* Student header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <AvatarImage src={student.photo} className="object-cover" />
            <AvatarFallback className="bg-[#00AEEF]/10 text-[#00AEEF] font-bold text-xs">
              {student.nameEn?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm kalpurush-font truncate text-zinc-900 dark:text-zinc-100">{student.nameBn || student.nameEn}</p>
            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">{student.studentId}</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'text-[10px] font-bold shrink-0 border gap-1',
              isComplete
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                : uploadedCount === 0
                ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="h-2.5 w-2.5" />
            ) : (
              <AlertCircle className="h-2.5 w-2.5" />
            )}
            {uploadedCount}/{totalCount}
          </Badge>
        </div>

        {/* Document thumbnails grid */}
        <div className="grid grid-cols-4 gap-2">
          {DOC_FIELDS.map((field) => {
            const url = docs[field.key] as string | undefined;
            return (
              <DocThumb
                key={field.key}
                url={url}
                label={field.label}
                onClick={() => url && setLightbox({ src: url, label: field.label })}
              />
            );
          })}
        </div>

        {/* Footer link to student profile */}
        <div className="mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800/50 flex justify-end">
          <a
            href={`/dashboard/admin/students/${student.$id}`}
            className="text-[10px] font-bold text-[#00AEEF] hover:text-[#008bc0] dark:hover:text-[#33beff] hover:underline flex items-center gap-1 transition-colors"
          >
            প্রোফাইল দেখুন <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </>
  );
}

// ── Loading skeleton cards ──────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 dark:bg-zinc-800" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-1/2 dark:bg-zinc-800" />
          <Skeleton className="h-2.5 w-1/3 dark:bg-zinc-800" />
        </div>
        <Skeleton className="h-5 w-10 rounded-full dark:bg-zinc-800" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

// ── Filter options ──────────────────────────────────────────────
type FilterMode = 'all' | 'complete' | 'incomplete' | 'missing';

// ── Main Page Component ─────────────────────────────────────────
export default function StudentDocumentsClient() {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');

  const { data, isLoading } = useInfiniteStudents();

  const allStudents = useMemo(
    () => data?.pages.flatMap((p: any) => p.data?.documents ?? []) ?? [],
    [data]
  );

  const filteredStudents = useMemo(() => {
    let result = allStudents;

    if (search) {
      result = result.filter(
        (s: StudentListItem) =>
          s.nameEn?.toLowerCase().includes(search.toLowerCase()) ||
          s.nameBn?.includes(search) ||
          s.studentId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterMode !== 'all') {
      result = result.filter((s: StudentListItem) => {
        const docs = s as any;
        const uploadedCount = DOC_FIELDS.filter((f) => !!docs[f.key]).length;
        if (filterMode === 'complete') return uploadedCount === DOC_FIELDS.length;
        if (filterMode === 'incomplete') return uploadedCount > 0 && uploadedCount < DOC_FIELDS.length;
        if (filterMode === 'missing') return uploadedCount === 0;
        return true;
      });
    }

    return result;
  }, [allStudents, search, filterMode]);

  const stats = useMemo(() => {
    const complete = allStudents.filter((s: StudentListItem) => {
      const docs = s as any;
      return DOC_FIELDS.filter((f) => !!docs[f.key]).length === DOC_FIELDS.length;
    }).length;
    const missing = allStudents.filter((s: StudentListItem) => {
      const docs = s as any;
      return DOC_FIELDS.filter((f) => !!docs[f.key]).length === 0;
    }).length;
    return { total: allStudents.length, complete, missing, incomplete: allStudents.length - complete - missing };
  }, [allStudents]);

  const FILTER_TABS: { key: FilterMode; label: string; count: number; color: string; darkColor: string }[] = [
    { key: 'all',        label: 'সকল',       count: stats.total,      color: 'text-zinc-600', darkColor: 'dark:text-zinc-400' },
    { key: 'complete',   label: 'সম্পূর্ণ',   count: stats.complete,   color: 'text-emerald-600', darkColor: 'dark:text-emerald-400' },
    { key: 'incomplete', label: 'আংশিক',      count: stats.incomplete, color: 'text-amber-600', darkColor: 'dark:text-amber-400' },
    { key: 'missing',    label: 'কোনো ডকুমেন্ট নেই', count: stats.missing,   color: 'text-red-600', darkColor: 'dark:text-red-400' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto min-h-screen">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black kalpurush-font text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileImage className="h-6 w-6 text-[#00AEEF]" />
            শিক্ষার্থীদের ডকুমেন্টস
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 kalpurush-font mt-1">
            ছাত্র-ছাত্রীদের সকল আপলোড করা ফাইল ও ছবি একসাথে দেখুন।
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <Input
            placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 kalpurush-font rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterMode(tab.key)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold kalpurush-font transition-all border',
              filterMode === tab.key
                ? 'bg-[#00AEEF] text-white border-[#00AEEF]'
                : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            )}
          >
            {tab.label}
            <span className={cn('ml-1.5 opacity-70', filterMode === tab.key ? 'text-white' : cn(tab.color, tab.darkColor))}>
              ({tab.count})
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400 dark:text-zinc-600 gap-3 opacity-60">
          <FileText className="h-12 w-12" />
          <p className="kalpurush-font text-base font-bold">কোনো শিক্ষার্থী পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredStudents.map((student: StudentListItem) => (
            <StudentDocCard key={student.$id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
