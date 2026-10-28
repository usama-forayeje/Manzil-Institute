'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FolderPlus,
  Layers,
  Edit,
  Trash2,
  Plus,
  Check,
  Loader2,
  Lock,
  Search,
  Sparkles,
  RotateCcw,
  Palette,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { VoiceInputBn } from '@/components/ui/voice-input';
import { toast } from 'sonner';
import { cn, convertEnglishToBengali } from '@/lib/utils';
import { feeCategoriesQueryOptions, feeKeys } from '../api/queries';
import { saveFeeCategory, deleteFeeCategory } from '../api/service';
import type { FeeCategory } from '../types';

export const COLOR_OPTIONS: Array<{
  id: string;
  label: string;
  badgeClass: string;
  borderClass: string;
  bgHex: string;
}> = [
  { id: 'blue', label: 'নীল (Blue)', badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800', borderClass: 'border-blue-400', bgHex: '#3b82f6' },
  { id: 'cyan', label: 'সায়ান (Cyan)', badgeClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800', borderClass: 'border-cyan-400', bgHex: '#00AEEF' },
  { id: 'emerald', label: 'সবুজ (Green)', badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800', borderClass: 'border-emerald-400', bgHex: '#10b981' },
  { id: 'amber', label: 'হলুদ (Amber)', badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800', borderClass: 'border-amber-400', bgHex: '#f59e0b' },
  { id: 'orange', label: 'কমলা (Orange)', badgeClass: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-800', borderClass: 'border-orange-400', bgHex: '#f97316' },
  { id: 'purple', label: 'বেগুনী (Purple)', badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800', borderClass: 'border-purple-400', bgHex: '#a855f7' },
  { id: 'indigo', label: 'ইন্ডিগো (Indigo)', badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800', borderClass: 'border-indigo-400', bgHex: '#6366f1' },
  { id: 'teal', label: 'টিয়াল (Teal)', badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800', borderClass: 'border-teal-400', bgHex: '#14b8a6' },
  { id: 'rose', label: 'গোলাপী (Rose)', badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800', borderClass: 'border-rose-400', bgHex: '#f43f5e' },
  { id: 'zinc', label: 'ধূসর (Gray)', badgeClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700', borderClass: 'border-zinc-400', bgHex: '#71717a' },
];

export const BILLING_CYCLE_OPTIONS = [
  { value: 'monthly', label: 'মাসিক (Monthly) — প্রতি মাসে প্রদেয়' },
  { value: 'one-time', label: 'এককালীন (One-time) — একবার প্রদেয়' },
  { value: 'term', label: 'টার্ম / সেমিস্টার (Term-wise) — প্রতি পরীক্ষায়' },
  { value: 'yearly', label: 'বাৎসরিক / সেশন (Annual) — বছরে একবার' },
];

interface FeeCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated?: (category: FeeCategory) => void;
  feeTypes?: any[];
}

export function FeeCategoryModal({
  isOpen,
  onClose,
  onCategoryCreated,
  feeTypes = [],
}: FeeCategoryModalProps) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(feeCategoriesQueryOptions);
  const categories = data?.categories || [];

  const [searchFilter, setSearchFilter] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'form' | 'list'>('form');

  // Form State
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('blue');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'one-time' | 'term' | 'yearly'>('monthly');
  const [description, setDescription] = useState('');
  const [isAutoCode, setIsAutoCode] = useState(true);

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setNameBn('');
    setNameEn('');
    setCode('');
    setColor('blue');
    setBillingCycle('monthly');
    setDescription('');
    setIsAutoCode(true);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setMobileTab('form');
    }
  }, [isOpen]);

  // Handle English Name change and auto-generate uppercase code
  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (isAutoCode && !editingId) {
      const generated = val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 20);
      setCode(generated);
    }
  };

  // Select category to edit
  const handleStartEdit = (cat: FeeCategory) => {
    setEditingId(cat.id);
    setNameBn(cat.nameBn);
    setNameEn(cat.nameEn || '');
    setCode(cat.code);
    setColor(cat.color || 'blue');
    setBillingCycle(cat.billingCycle || 'monthly');
    setDescription(cat.description || '');
    setIsAutoCode(false);
    setMobileTab('form'); // Switch to form view on mobile/tablet
  };

  // Upsert mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: FeeCategory) => {
      const res = await saveFeeCategory(payload);
      if (!res.success) throw new Error(res.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
      return res;
    },
    onSuccess: (res) => {
      toast.success(
        editingId
          ? 'ক্যাটাগরি সফলভাবে ডাটাবেজে আপডেট করা হয়েছে'
          : 'নতুন ফি ক্যাটাগরি সফলভাবে ডাটাবেজে সংরক্ষণ করা হয়েছে'
      );
      queryClient.invalidateQueries({ queryKey: feeKeys.categories() });
      if (res.category && onCategoryCreated) {
        onCategoryCreated(res.category);
      }
      resetForm();
      setMobileTab('list');
    },
    onError: (err: any) => {
      toast.error(err.message || 'ডাটাবেজে সংরক্ষণ ব্যর্থ হয়েছে');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (catId: string) => {
      const res = await deleteFeeCategory(catId);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('ক্যাটাগরি ডাটাবেজ থেকে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: feeKeys.categories() });
      if (editingId) resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || 'ডিলিট ব্যর্থ হয়েছে');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) {
      toast.error('ক্যাটাগরির বাংলা নাম আবশ্যক');
      return;
    }
    if (!code.trim()) {
      toast.error('ক্যাটাগরি কোড আবশ্যক');
      return;
    }

    const payload: FeeCategory = {
      id: editingId || code.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim(),
      code: code.trim().toUpperCase(),
      color,
      billingCycle,
      description: description.trim(),
      isSystem: false,
    };

    saveMutation.mutate(payload);
  };

  const handleDelete = (cat: FeeCategory) => {
    if (cat.isSystem) {
      toast.error('সিস্টেমের ডিফল্ট ক্যাটাগরি মুছে ফেলা যাবে না');
      return;
    }
    const count = feeTypes.filter((f) => (f.category || f.feeCategory) === cat.id).length;
    if (count > 0) {
      if (
        !confirm(
          `এই ক্যাটাগরির অধীনে ${convertEnglishToBengali(count)}টি ফি কাঠামো রয়েছে! আপনি কি নিশ্চিতভাবে এটি মুছতে চান?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`'${cat.nameBn}' ক্যাটাগরি মুছে ফেলতে চান?`)) return;
    }

    deleteMutation.mutate(cat.id);
  };

  // Filtered categories for list
  const filteredCategories = useMemo(() => {
    if (!searchFilter.trim()) return categories;
    const q = searchFilter.toLowerCase();
    return categories.filter(
      (c) =>
        c.nameBn.toLowerCase().includes(q) ||
        c.nameEn?.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [categories, searchFilter]);

  // Selected color preview
  const currentColorObj =
    COLOR_OPTIONS.find((c) => c.id === color) || COLOR_OPTIONS[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          // Important flags override sm:max-w-lg from base Dialog component!
          'w-[96vw] !max-w-[96vw] sm:!max-w-[92vw] lg:!max-w-[1150px] xl:!max-w-[1260px]',
          'max-h-[94vh] overflow-hidden p-0 flex flex-col kalpurush-font rounded-3xl',
          'border border-zinc-200/80 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900'
        )}
      >
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#0081B1] p-0.5 shadow-md shadow-[#00AEEF]/20 shrink-0">
                <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center">
                  <FolderPlus className="h-6 w-6 text-[#00AEEF]" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                  ফি ক্যাটাগরি ও খাত ব্যবস্থাপনা
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
                  মাদ্রাসার সকল প্রকার ফির বিভাগ তৈরি ও কাস্টমাইজ করুন — এগুলো সরাসরি ডাটাবেজে স্থায়ীভাবে সংরক্ষিত হয়
                </DialogDescription>
              </div>
            </div>

            {/* Mobile / Tablet View Switcher Tab */}
            <div className="flex lg:hidden items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setMobileTab('form')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  mobileTab === 'form'
                    ? 'bg-white dark:bg-zinc-900 text-[#00AEEF] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{editingId ? 'সম্পাদনা ফরম' : 'ক্যাটাগরি তৈরি'}</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('list')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                  mobileTab === 'list'
                    ? 'bg-white dark:bg-zinc-900 text-[#00AEEF] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>তালিকা ({convertEnglishToBengali(categories.length)})</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body: Expansive 2-Column Desktop Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          {/* Left Form: Create / Edit Category (Takes 6 cols of wide modal) */}
          <div
            className={cn(
              'lg:col-span-6 flex flex-col bg-zinc-50/60 dark:bg-zinc-800/40 p-4 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 max-h-[75vh] overflow-y-auto custom-scrollbar',
              mobileTab === 'list' ? 'hidden lg:flex' : 'flex'
            )}
          >
            {/* Form Top Title */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200/80 dark:border-zinc-700/60 shrink-0 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#00AEEF]/10 text-[#00AEEF] flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 block leading-tight">
                    {editingId ? 'ক্যাটাগরি তথ্য সম্পাদনা করুন' : 'নতুন ফি ক্যাটাগরি এন্ট্রি ফরম'}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    বাংলা নাম, কোড ও আদায়ের সাইকেল নির্ধারণ করুন
                  </span>
                </div>
              </div>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={resetForm}
                  className="h-7 text-xs font-bold text-zinc-600 dark:text-zinc-300 border-zinc-300 hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  নতুন ফর্ম
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              {/* Field 1: Bangla Name (with voice input) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                  <span>ক্যাটাগরির নাম (বাংলা) <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-zinc-400 font-normal">মাইক্রোফোনে মুখে বলেও লিখতে পারেন</span>
                </Label>
                <VoiceInputBn
                  value={nameBn}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : e?.target?.value ?? (e ? String(e) : '');
                    setNameBn(val === '[object Object]' ? '' : val);
                  }}
                  placeholder="যেমন: পরীক্ষার ফি, কাফেলা ফি বা হোস্টেল ফি"
                  className="h-11 text-xs font-bold rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Responsive 2-Col Subgrid: English Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Name (English)
                  </Label>
                  <Input
                    value={nameEn}
                    onChange={(e) => handleNameEnChange(e.target.value)}
                    placeholder="e.g. Exam Fee"
                    className="h-11 text-xs font-medium rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      কোড / স্ল্যাগ <span className="text-rose-500">*</span>
                    </Label>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      (ইউনিক আইডি)
                    </span>
                  </div>
                  <Input
                    value={code}
                    onChange={(e) => {
                      setIsAutoCode(false);
                      setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
                    }}
                    placeholder="যেমন: EXAM_FEE"
                    className="h-11 text-xs font-mono font-bold tracking-wider rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                  />
                </div>
              </div>

              {/* Responsive 2-Col Subgrid: Billing Cycle & Color Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>ডিফল্ট আদায়ের সাইকেল</span>
                  </Label>
                  <Select
                    value={billingCycle}
                    onValueChange={(v: any) => setBillingCycle(v)}
                  >
                    <SelectTrigger className="h-11 text-xs font-bold bg-white dark:bg-zinc-900 rounded-xl border-zinc-200 dark:border-zinc-700 cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="kalpurush-font">
                      {BILLING_CYCLE_OPTIONS.map((c) => (
                        <SelectItem
                          key={c.value}
                          value={c.value}
                          className="text-xs font-bold cursor-pointer py-2.5"
                        >
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-zinc-400" />
                      <span>থিম কালার</span>
                    </Label>
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] font-bold px-2 py-0.5 shadow-none', currentColorObj.badgeClass)}
                    >
                      {nameBn || 'প্রিভিউ'}
                    </Badge>
                  </div>
                  <Select value={color} onValueChange={setColor}>
                    <SelectTrigger className="h-11 text-xs font-bold bg-white dark:bg-zinc-900 rounded-xl border-zinc-200 dark:border-zinc-700 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: currentColorObj.bgHex }}
                        />
                        <span>{currentColorObj.label}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="kalpurush-font">
                      {COLOR_OPTIONS.map((c) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs font-bold cursor-pointer py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3.5 w-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: c.bgHex }}
                            />
                            <span>{c.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Visual Color Palette Swatch Strip */}
              <div className="space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-700/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-500">কালার সোয়াচ ক্লিক করে পরিবর্তন করুন:</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{currentColorObj.label}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = color === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColor(c.id)}
                        title={c.label}
                        className={cn(
                          'h-7 w-7 rounded-full flex items-center justify-center transition-all cursor-pointer ring-offset-background',
                          isSelected
                            ? 'ring-2 ring-zinc-900 dark:ring-white scale-115 shadow-md'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        )}
                        style={{ backgroundColor: c.bgHex }}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description with Voice Input */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ক্যাটাগরি বিবরণ ও নির্দেশিকা (ঐচ্ছিক)
                </Label>
                <VoiceInputBn
                  value={description}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : e?.target?.value ?? (e ? String(e) : '');
                    setDescription(val === '[object Object]' ? '' : val);
                  }}
                  placeholder="এই ক্যাটাগরির আওতায় কোন ধরণের ফি আদায় করা হবে বিস্তারিত লিখুন..."
                  className="h-16 text-xs rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="w-full bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl h-11 text-xs sm:text-sm font-black shadow-lg shadow-[#00AEEF]/20 transition-all cursor-pointer mt-2 border-0"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {editingId ? 'পরিবর্তন সংরক্ষণ করুন' : 'ক্যাটাগরি ডাটাবেজে সংরক্ষণ করুন'}
              </Button>
            </form>
          </div>

          {/* Right List: Existing Categories (Takes 6 cols of wide modal) */}
          <div
            className={cn(
              'lg:col-span-6 flex flex-col space-y-3.5 min-h-0',
              mobileTab === 'form' ? 'hidden lg:flex' : 'flex'
            )}
          >
            {/* List Header with Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#00AEEF]" />
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  বিদ্যমান ক্যাটাগরি তালিকা ({convertEnglishToBengali(categories.length)}টি)
                </span>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="ক্যাটাগরি খুঁজুন..."
                  className="h-9 pl-8 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 font-bold"
                />
              </div>
            </div>

            {/* Scrollable Category Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar max-h-[72vh]">
              {isLoading ? (
                <div className="p-10 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#00AEEF]" />
                  ক্যাটাগরি লোড হচ্ছে...
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-10 text-center text-xs text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
                  কোনো ক্যাটাগরি পাওয়া যায়নি
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const colorObj =
                    COLOR_OPTIONS.find((c) => c.id === cat.color) || COLOR_OPTIONS[0];
                  const feeCount = feeTypes.filter(
                    (f) => (f.category || f.feeCategory) === cat.id
                  ).length;
                  const isSelectedForEdit = editingId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className={cn(
                        'p-4 rounded-2xl border transition-all flex items-center justify-between gap-3.5 group shadow-2xs',
                        isSelectedForEdit
                          ? 'bg-[#00AEEF]/5 border-[#00AEEF] ring-1 ring-[#00AEEF]/30'
                          : 'bg-white dark:bg-zinc-800/60 border-zinc-200/80 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600'
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="h-4 w-4 rounded-full shrink-0 shadow-xs ring-2 ring-white dark:ring-zinc-800"
                          style={{ backgroundColor: colorObj.bgHex }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[14px] font-black text-zinc-900 dark:text-zinc-50 truncate">
                              {cat.nameBn}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn('text-[10px] font-mono font-bold px-1.5 py-0 shadow-none', colorObj.badgeClass)}
                            >
                              {cat.code}
                            </Badge>
                            {cat.isSystem ? (
                              <span
                                className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-500 rounded-md font-bold flex items-center gap-1"
                                title="সিস্টেমের ডিফল্ট ক্যাটাগরি"
                              >
                                <Lock className="h-2.5 w-2.5" /> ডিফল্ট
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md font-bold">
                                কাস্টম
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1 flex-wrap">
                            {cat.nameEn && <span className="font-medium text-zinc-500 dark:text-zinc-400">{cat.nameEn}</span>}
                            <span>•</span>
                            <span className="font-medium">
                              ফি সংখ্যা:{' '}
                              <strong className="text-zinc-800 dark:text-zinc-200 font-mono">
                                {convertEnglishToBengali(feeCount)}
                              </strong>
                              টি
                            </span>
                            {cat.description && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[180px] text-zinc-400">
                                  {cat.description}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(cat)}
                          className="h-8.5 w-8.5 text-zinc-400 hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 rounded-xl cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!cat.isSystem && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat)}
                            disabled={deleteMutation.isPending}
                            className="h-8.5 w-8.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
