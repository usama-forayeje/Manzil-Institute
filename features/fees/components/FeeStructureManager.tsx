'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Check,
  CreditCard,
  Banknote,
  Loader2,
  Search,
  LayoutGrid,
  Info,
  AlertCircle,
  FolderPlus,
  Layers,
  RotateCcw,
  Calendar,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { VoiceInputBn } from '@/components/ui/voice-input';
import { cn, convertEnglishToBengali } from '@/lib/utils';
import {
  feeTypesQueryOptions,
  feeCategoriesQueryOptions,
  feeKeys,
} from '../api/queries';
import {
  createFeeType,
  updateFeeType,
  deleteFeeType,
  toggleFeeTypeStatus,
} from '../api/service';
import {
  departmentsQueryOptions,
  boardingTypesQueryOptions,
} from '@/features/admission/api/queries';
import {
  FeeCategoryModal,
  COLOR_OPTIONS,
  BILLING_CYCLE_OPTIONS,
} from './FeeCategoryModal';
import type { FeeCategory } from '../types';

export default function FeeStructureManager() {
  const queryClient = useQueryClient();

  // Modals state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    code: '',
    category: 'monthly',
    billingCycle: 'monthly' as 'monthly' | 'one-time' | 'term' | 'yearly',
    defaultAmount: 0,
    isActive: true,
    isRequired: true,
    showInAdmissionForm: true,
    description: '',
    departmentIds: [] as string[],
    boardingTypes: [] as string[],
    breakdown: [] as Array<{ name: string; amount: number }>,
  });

  const [isAutoCode, setIsAutoCode] = useState(true);

  // Queries
  const feeQuery = useQuery(feeTypesQueryOptions);
  const categoriesQuery = useQuery(feeCategoriesQueryOptions);
  const deptQuery = useQuery(departmentsQueryOptions);
  const boardingQuery = useQuery(boardingTypesQueryOptions);

  const feeTypes = feeQuery.data?.success ? (feeQuery.data.feeTypes as any[]) : [];
  const categories = categoriesQuery.data?.categories || [];
  const departments = deptQuery.data?.success ? (deptQuery.data.departments as any[]) : [];
  const boardingTypes = boardingQuery.data?.success ? (boardingQuery.data.boardingTypes as any[]) : [];

  // Category Map for fast lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, FeeCategory>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  // Mutations
  const upsertMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = selectedId
        ? await updateFeeType(selectedId, payload)
        : await createFeeType(payload);
      if (!res.success) throw new Error(res.error || 'সেভ করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success(selectedId ? 'ফি কাঠামো সফলভাবে আপডেট করা হয়েছে' : 'নতুন ফি কাঠামো সফলভাবে যুক্ত হয়েছে');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures() });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteFeeType(id);
      if (!res.success) throw new Error(res.error || 'ডিলিট করতে সমস্যা হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('ফি কাঠামো সফলভাবে মুছে ফেলা হয়েছে');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures() });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: boolean }) => {
      const res = await toggleFeeTypeStatus(id, currentStatus);
      if (!res.success) throw new Error(res.error || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে');
      return res;
    },
    onSuccess: () => {
      toast.success('ফি স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures() });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // Filtered Fee Types
  const filteredFeeTypes = useMemo(() => {
    return feeTypes.filter((item) => {
      // 1. Search term (Code, Bangla Name, English Name)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchNameBn = (item.nameBn || item.feeNameBn || '').toLowerCase().includes(q);
        const matchNameEn = (item.name || item.feeName || '').toLowerCase().includes(q);
        const matchCode = (item.code || item.feeCode || '').toLowerCase().includes(q);
        if (!matchNameBn && !matchNameEn && !matchCode) return false;
      }

      // 2. Category filter
      if (selectedCategoryFilter !== 'all') {
        const itemCat = item.category || item.feeCategory;
        if (itemCat !== selectedCategoryFilter) return false;
      }

      // 3. Status filter
      if (selectedStatusFilter === 'active' && !item.isActive) return false;
      if (selectedStatusFilter === 'inactive' && item.isActive) return false;

      // 4. Department filter
      if (selectedDeptFilter !== 'all') {
        const itemDepts: string[] = item.departmentIds || item.applicableDepartments || [];
        if (itemDepts.length > 0 && !itemDepts.includes(selectedDeptFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [feeTypes, searchTerm, selectedCategoryFilter, selectedStatusFilter, selectedDeptFilter]);

  const hasActiveFilters = Boolean(
    searchTerm ||
    selectedCategoryFilter !== 'all' ||
    selectedStatusFilter !== 'all' ||
    selectedDeptFilter !== 'all'
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategoryFilter('all');
    setSelectedStatusFilter('all');
    setSelectedDeptFilter('all');
  };

  const handleOpenAdd = () => {
    setSelectedId(null);
    setIsAutoCode(true);
    setFormData({
      name: '',
      nameBn: '',
      code: '',
      category: categories[0]?.id || 'monthly',
      billingCycle: 'monthly',
      defaultAmount: 0,
      isActive: true,
      isRequired: true,
      showInAdmissionForm: true,
      description: '',
      departmentIds: [],
      boardingTypes: [],
      breakdown: [],
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedId(item.$id);
    setIsAutoCode(false);

    let parsedBreakdown: Array<{ name: string; amount: number }> = [];
    try {
      if (item.breakdown) {
        const parsed = typeof item.breakdown === 'string' ? JSON.parse(item.breakdown) : item.breakdown;
        if (Array.isArray(parsed)) parsedBreakdown = parsed;
      }
    } catch {}

    const itemCategory = item.category || item.feeCategory || 'monthly';
    const catObj = categoryMap.get(itemCategory);

    setFormData({
      name: item.name || item.feeName || '',
      nameBn: item.nameBn || item.feeNameBn || '',
      code: item.code || item.feeCode || '',
      category: itemCategory,
      billingCycle: item.billingCycle || catObj?.billingCycle || 'monthly',
      defaultAmount: item.defaultAmount || 0,
      isActive: item.isActive ?? true,
      isRequired: item.isRequired ?? true,
      showInAdmissionForm: item.showInAdmissionForm ?? true,
      description: item.description || '',
      departmentIds: item.departmentIds || item.applicableDepartments || [],
      boardingTypes: item.boardingTypes || item.applicableBoardingTypes || [],
      breakdown: parsedBreakdown,
    });
    setIsDialogOpen(true);
  };

  const handleNameEnChange = (val: string) => {
    setFormData((p) => ({ ...p, name: val }));
    if (isAutoCode && !selectedId) {
      const generated = val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 24);
      setFormData((p) => ({ ...p, code: generated }));
    }
  };

  const handleCategoryChange = (catId: string) => {
    const targetCat = categoryMap.get(catId);
    setFormData((p) => ({
      ...p,
      category: catId,
      billingCycle: targetCat?.billingCycle || p.billingCycle,
    }));
  };

  const handleSave = () => {
    if (!formData.nameBn.trim()) {
      toast.error('ফির বাংলা নাম আবশ্যক');
      return;
    }
    if (!formData.code.trim()) {
      toast.error('অনন্য ফি কোড আবশ্যক');
      return;
    }

    const validBreakdown = formData.breakdown.filter(
      (b) => b.name && b.name.trim() !== '' && Number(b.amount) > 0
    );

    const calculatedTotal =
      validBreakdown.length > 0
        ? validBreakdown.reduce((sum, b) => sum + Number(b.amount), 0)
        : Number(formData.defaultAmount);

    const payload = {
      name: formData.name.trim() || formData.code.trim() || formData.nameBn.trim(),
      nameBn: formData.nameBn.trim(),
      code: formData.code.trim().toUpperCase(),
      category: formData.category,
      billingCycle: formData.billingCycle,
      applicableTo: 'student',
      description: formData.description.trim(),
      defaultAmount: calculatedTotal,
      isActive: formData.isActive,
      isRequired: formData.isRequired,
      showInAdmissionForm: formData.showInAdmissionForm,
      departmentIds: formData.departmentIds,
      boardingTypes: formData.boardingTypes,
      breakdown: validBreakdown.length > 0 ? JSON.stringify(validBreakdown) : null,
    };

    upsertMutation.mutate(payload);
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' ফি কাঠামোটি মুছতে চান?`)) return;
    deleteMutation.mutate(id);
  };

  const toggleSelection = (list: string[], val: string, field: 'departmentIds' | 'boardingTypes') => {
    const newList = list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
    setFormData((prev) => ({ ...prev, [field]: newList }));
  };

  // Helper for Category badge class
  const getCategoryBadge = (catId: string) => {
    const cat = categoryMap.get(catId);
    if (!cat) {
      return {
        label: catId,
        badgeClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
        bgHex: '#71717a',
      };
    }
    const colorObj = COLOR_OPTIONS.find((c) => c.id === cat.color) || COLOR_OPTIONS[0];
    return {
      label: cat.nameBn,
      badgeClass: colorObj.badgeClass,
      bgHex: colorObj.bgHex,
    };
  };

  const getBillingCycleLabel = (cycle: string) => {
    const opt = BILLING_CYCLE_OPTIONS.find((b) => b.value === cycle);
    return opt?.label || cycle;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 kalpurush-font w-full min-w-0 max-w-full overflow-hidden py-2 sm:py-4">
      {/* Premium Header Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-12 w-12 sm:h-13 sm:w-13 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0081B1] p-0.5 shadow-md shadow-cyan-500/10 shrink-0">
              <div className="h-full w-full rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center">
                <Banknote className="h-6 w-6 sm:h-7 sm:w-7 text-[#00AEEF]" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                ফি কাঠামো ও খাত ব্যবস্থাপনা
              </h1>
              <p className="text-xs sm:text-[13px] text-zinc-500 font-medium mt-0.5">
                প্রতিষ্ঠানের সকল প্রকার নিয়মিত ফি, সেশন চার্জ, পরীক্ষার ফি ও ক্যাটাগরি কনফিগার করুন
              </p>
            </div>
          </div>

          {/* Action Buttons: 1. Category Manager, 2. Add New Fee */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCategoryModalOpen(true)}
              className="h-10 sm:h-11 px-4 text-xs sm:text-sm font-bold border-zinc-200 dark:border-zinc-700 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 text-zinc-700 dark:text-zinc-200 cursor-pointer shadow-xs rounded-xl"
            >
              <FolderPlus className="h-4 w-4 mr-2 text-[#00AEEF]" />
              ফি ক্যাটাগরি তৈরি ও পরিচালনা
            </Button>

            <Button
              type="button"
              onClick={handleOpenAdd}
              className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl px-5 h-10 sm:h-11 text-xs sm:text-sm font-black shadow-md shadow-[#00AEEF]/20 cursor-pointer border-0"
            >
              <Plus className="h-4 w-4 mr-1.5" /> নতুন ফি যোগ করুন
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Ultra-Compact Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3.5 shadow-2xs">
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">মোট ফি খাত</p>
            <p className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              {convertEnglishToBengali(feeTypes.length)}
              <span className="text-xs font-normal text-zinc-400 ml-1">টি</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3.5 shadow-2xs">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">সক্রিয় ফি</p>
            <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {convertEnglishToBengali(feeTypes.filter((f) => f.isActive).length)}
              <span className="text-xs font-normal text-zinc-400 ml-1">টি</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3.5 shadow-2xs">
          <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">ক্যাটাগরি সংখ্যা</p>
            <p className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
              {convertEnglishToBengali(categories.length)}
              <span className="text-xs font-normal text-zinc-400 ml-1">টি</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3.5 shadow-2xs">
          <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-[#00AEEF] flex items-center justify-center shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">ভর্তি ফরমে দৃশ্যমান</p>
            <p className="text-xl font-black font-mono text-[#00AEEF]">
              {convertEnglishToBengali(feeTypes.filter((f) => f.showInAdmissionForm).length)}
              <span className="text-xs font-normal text-zinc-400 ml-1">টি</span>
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 sm:p-4 shadow-2xs space-y-3 w-full min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 w-full items-center">
          {/* Search Box (4 cols) */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="ফি নাম বা কোড দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/60 font-bold"
            />
          </div>

          {/* Category Filter (3 cols) */}
          <div className="lg:col-span-3">
            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="h-9.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/60 font-bold cursor-pointer">
                <SelectValue placeholder="সকল ক্যাটাগরি" />
              </SelectTrigger>
              <SelectContent className="kalpurush-font">
                <SelectItem value="all" className="cursor-pointer text-xs font-bold">
                  সকল ক্যাটাগরি ({convertEnglishToBengali(feeTypes.length)}টি)
                </SelectItem>
                {categories.map((cat) => {
                  const count = feeTypes.filter((f) => (f.category || f.feeCategory) === cat.id).length;
                  return (
                    <SelectItem key={cat.id} value={cat.id} className="cursor-pointer text-xs font-bold">
                      {cat.nameBn} ({convertEnglishToBengali(count)})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Department Filter (2.5 cols) */}
          <div className="lg:col-span-3">
            <Select value={selectedDeptFilter} onValueChange={setSelectedDeptFilter}>
              <SelectTrigger className="h-9.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/60 font-bold cursor-pointer">
                <SelectValue placeholder="সকল বিভাগ" />
              </SelectTrigger>
              <SelectContent className="kalpurush-font">
                <SelectItem value="all" className="cursor-pointer text-xs font-bold">
                  সকল বিভাগ
                </SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.$id} value={d.code || d.$id} className="cursor-pointer text-xs font-bold">
                    {d.nameBn || d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter / Reset (2 cols) */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <Select
              value={selectedStatusFilter}
              onValueChange={(v: any) => setSelectedStatusFilter(v)}
            >
              <SelectTrigger className="h-9.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/60 font-bold cursor-pointer flex-1">
                <SelectValue placeholder="সকল অবস্থা" />
              </SelectTrigger>
              <SelectContent className="kalpurush-font">
                <SelectItem value="all" className="cursor-pointer text-xs font-bold">সকল অবস্থা</SelectItem>
                <SelectItem value="active" className="cursor-pointer text-xs font-bold text-emerald-600">শুধুমাত্র সক্রিয়</SelectItem>
                <SelectItem value="inactive" className="cursor-pointer text-xs font-bold text-rose-500">শুধুমাত্র নিষ্ক্রিয়</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetFilters}
                className="h-9.5 w-9.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg shrink-0 cursor-pointer"
                title="ফিল্টার রিসেট করুন"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        {feeQuery.isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredFeeTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="h-20 w-20 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
              <CreditCard className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-black text-zinc-700 dark:text-zinc-300">
                কোনো ফি কাঠামো খুঁজে পাওয়া যায়নি
              </p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'ফিল্টার অনুযায়ী কোনো ফি মেলেনি। ফিল্টার রিসেট করুন অথবা সার্চ কীওয়ার্ড পরিবর্তন করুন।'
                  : "নতুন ফি কাঠামো সেটআপ করতে 'নতুন ফি যোগ করুন' বাটনে ক্লিক করুন।"}
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs font-bold rounded-lg cursor-pointer mt-2"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> ফিল্টার রিসেট
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200/80 dark:border-zinc-800">
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="py-4 pl-6 text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    কোড ও নাম
                  </TableHead>
                  <TableHead className="py-4 text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    ক্যাটেগরি
                  </TableHead>
                  <TableHead className="py-4 text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    সাইকেল
                  </TableHead>
                  <TableHead className="py-4 text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    ডিফল্ট পরিমাণ
                  </TableHead>
                  <TableHead className="py-4 text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    প্রযোজ্যতা
                  </TableHead>
                  <TableHead className="py-4 text-center text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    সক্রিয় স্ট্যাটাস
                  </TableHead>
                  <TableHead className="py-4 pr-6 text-right text-[11px] font-black uppercase text-zinc-400 tracking-wider">
                    অ্যাকশন
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeeTypes.map((item) => {
                  const catBadge = getCategoryBadge(item.category || item.feeCategory);
                  let breakdownCount = 0;
                  try {
                    if (item.breakdown) {
                      const b = typeof item.breakdown === 'string' ? JSON.parse(item.breakdown) : item.breakdown;
                      if (Array.isArray(b)) breakdownCount = b.length;
                    }
                  } catch {}

                  const depts = item.departmentIds || item.applicableDepartments || [];
                  const isAllDepts = depts.length === 0;

                  return (
                    <TableRow
                      key={item.$id}
                      className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-all group"
                    >
                      {/* Name & Code */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col">
                          <p className="font-black text-zinc-900 dark:text-zinc-50 text-[14px] leading-tight mb-1">
                            {item.nameBn || item.feeNameBn}
                          </p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] uppercase font-mono font-bold bg-[#00AEEF]/10 text-[#00AEEF] px-1.5 py-0.2 rounded border border-[#00AEEF]/20">
                              {item.code || item.feeCode}
                            </span>
                            {item.name && (
                              <span className="text-[10px] text-zinc-400 font-medium">
                                ({item.name})
                              </span>
                            )}
                            {item.isRequired && (
                              <span className="text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-1 py-0 rounded border border-rose-200/50 flex items-center gap-0.5">
                                <AlertCircle className="h-2.5 w-2.5" /> বাধ্যতামূলক
                              </span>
                            )}
                            {item.showInAdmissionForm && (
                              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-1 py-0 rounded border border-indigo-200/50">
                                ভর্তি ফরম
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-4">
                        <Badge
                          variant="outline"
                          className={cn('text-[11px] font-bold px-2.5 py-0.5 shadow-none', catBadge.badgeClass)}
                        >
                          {catBadge.label}
                        </Badge>
                      </TableCell>

                      {/* Billing Cycle */}
                      <TableCell className="py-4">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                          {getBillingCycleLabel(item.billingCycle || 'monthly')}
                        </span>
                      </TableCell>

                      {/* Default Amount */}
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-base font-mono text-zinc-900 dark:text-zinc-50 leading-tight">
                            ৳{convertEnglishToBengali(Number(item.defaultAmount || 0).toLocaleString('en-IN'))}
                          </span>
                          {breakdownCount > 0 && (
                            <span className="text-[9px] font-bold text-[#00AEEF] mt-0.5">
                              {convertEnglishToBengali(breakdownCount)}টি আইটেম ব্রেকডাউন
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Targeting */}
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5 max-w-[160px]">
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 truncate">
                            {isAllDepts ? 'সকল বিভাগ' : `${convertEnglishToBengali(depts.length)}টি বিভাগ`}
                          </span>
                          {item.boardingTypes && item.boardingTypes.length > 0 && (
                            <span className="text-[9px] text-zinc-400">
                              {convertEnglishToBengali(item.boardingTypes.length)}টি বোর্ডিং টাইপ
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Active Status (Interactive Inline Toggle) */}
                      <TableCell className="py-4 text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={Boolean(item.isActive)}
                            onCheckedChange={() =>
                              toggleStatusMutation.mutate({
                                id: item.$id,
                                currentStatus: Boolean(item.isActive),
                              })
                            }
                            disabled={toggleStatusMutation.isPending}
                            className="data-[state=checked]:bg-[#00AEEF] cursor-pointer"
                            title={item.isActive ? 'সক্রিয় (ক্লিক করে নিষ্ক্রিয় করুন)' : 'নিষ্ক্রিয় (ক্লিক করে সক্রিয় করুন)'}
                          />
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(item)}
                            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 cursor-pointer transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.$id, item.nameBn || item.feeNameBn)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
                            title="মুছে ফেলুন"
                          >
                            {deleteMutation.isPending && deleteMutation.variables === item.$id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Fee Setup / Editor Wizard Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[96vw] !max-w-[96vw] sm:!max-w-[92vw] lg:!max-w-[950px] xl:!max-w-[1050px] max-h-[92vh] overflow-hidden p-0 flex flex-col kalpurush-font rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900">
          <DialogHeader className="p-5 sm:p-6 bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center border border-[#00AEEF]/20 text-[#00AEEF] shrink-0">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50">
                  {selectedId ? 'ফি কাঠামো সম্পাদনা' : 'নতুন ফি কাঠামো সেটআপ'}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 font-medium">
                  নির্দিষ্ট ফির বিবরণ, পরিমাণ, ক্যাটাগরি ও প্রযোজ্য নিয়মাবলী কনফিগার করুন
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Row 1: Bangla Name (with voice) & English Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  ফির নাম (বাংলা) <span className="text-rose-500">*</span>
                </Label>
                <VoiceInputBn
                  value={formData.nameBn}
                  onChange={(e: any) => {
                    const val = typeof e === 'string' ? e : e?.target?.value ?? (e ? String(e) : '');
                    setFormData((p) => ({ ...p, nameBn: val === '[object Object]' ? '' : val }));
                  }}
                  placeholder="যেমন: বার্ষিক সেশন ফি বা ১ম সাময়িক পরীক্ষা ফি"
                  className="h-10 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Name (English)
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  placeholder="e.g. Annual Session Fee"
                  className="h-10 text-xs font-medium"
                />
              </div>
            </div>

            {/* Row 2: Category Selector (with quick add modal) & Unique Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Selector with Quick "+ নতুন ক্যাটাগরি" Button */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    ক্যাটেগরি নির্বাচন <span className="text-rose-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="text-[11px] font-bold text-[#00AEEF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> নতুন ক্যাটাগরি
                  </button>
                </div>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 cursor-pointer">
                    <SelectValue placeholder="ক্যাটেগরি বেছে নিন" />
                  </SelectTrigger>
                  <SelectContent className="kalpurush-font max-h-60">
                    {categories.map((cat) => {
                      const colorObj = COLOR_OPTIONS.find((c) => c.id === cat.color) || COLOR_OPTIONS[0];
                      return (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="text-xs font-bold cursor-pointer py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: colorObj.bgHex }}
                            />
                            <span>{cat.nameBn}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">({cat.code})</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Unique Code */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    ফি কোড (একক পরিচিতি) <span className="text-rose-500">*</span>
                  </Label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    ইউনিক আইডি
                  </span>
                </div>
                <Input
                  value={formData.code}
                  onChange={(e) => {
                    setIsAutoCode(false);
                    setFormData((p) => ({
                      ...p,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
                    }));
                  }}
                  placeholder="যেমন: SESSION_2026"
                  className="h-10 text-xs font-mono font-bold tracking-wider"
                />
              </div>
            </div>

            {/* Row 3: Billing Cycle & Default Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  আদায়ের সাইকেল (Billing Cycle)
                </Label>
                <Select
                  value={formData.billingCycle}
                  onValueChange={(v: any) => setFormData((p) => ({ ...p, billingCycle: v }))}
                >
                  <SelectTrigger className="h-10 text-xs font-bold bg-white dark:bg-zinc-900 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="kalpurush-font">
                    {BILLING_CYCLE_OPTIONS.map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="text-xs font-bold cursor-pointer"
                      >
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Default Amount */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ডিফল্ট ফি পরিমাণ (৳)
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        breakdown: [...p.breakdown, { name: '', amount: 0 }],
                      }));
                    }}
                    className="text-[11px] font-bold text-[#00AEEF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> + ব্রেকডাউন যোগ করুন
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600">
                    ৳
                  </span>
                  <Input
                    type="number"
                    value={formData.defaultAmount || ''}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, defaultAmount: Number(e.target.value) || 0 }))
                    }
                    placeholder="0"
                    className="h-10 pl-8 pr-3 text-right font-mono font-black text-sm bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Itemized Breakdown List (if added) */}
            {formData.breakdown.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#00AEEF]" />
                    ইনভয়েস আইটেম ব্রেকডাউন (রসিদে আলাদা লাইন দেখাবে)
                  </p>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">
                    {convertEnglishToBengali(formData.breakdown.length)}টি আইটেম
                  </span>
                </div>

                <div className="space-y-2">
                  {formData.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder="যেমন: বাস ভাড়া বা পরীক্ষার খাতা"
                        value={item.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setFormData((p) => {
                            const updated = [...p.breakdown];
                            updated[idx] = { ...updated[idx], name: newName };
                            return { ...p, breakdown: updated };
                          });
                        }}
                        className="h-9 text-xs font-bold rounded-lg flex-1 bg-white dark:bg-zinc-900"
                      />
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">
                          ৳
                        </span>
                        <Input
                          type="number"
                          placeholder="টাকা"
                          value={item.amount || ''}
                          onChange={(e) => {
                            const newAmt = Number(e.target.value) || 0;
                            setFormData((p) => {
                              const updated = [...p.breakdown];
                              updated[idx] = { ...updated[idx], amount: newAmt };
                              const newTotal = updated.reduce((s, it) => s + (Number(it.amount) || 0), 0);
                              return { ...p, breakdown: updated, defaultAmount: newTotal };
                            });
                          }}
                          className="h-9 pl-7 pr-3 text-right font-mono font-black text-xs rounded-lg bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setFormData((p) => {
                            const updated = p.breakdown.filter((_, i) => i !== idx);
                            const newTotal = updated.reduce((s, it) => s + (Number(it.amount) || 0), 0);
                            return {
                              ...p,
                              breakdown: updated,
                              defaultAmount: updated.length > 0 ? newTotal : p.defaultAmount,
                            };
                          });
                        }}
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        breakdown: [...p.breakdown, { name: '', amount: 0 }],
                      }));
                    }}
                    className="h-7 text-xs font-bold gap-1 rounded-lg cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> আরও আইটেম যোগ করুন
                  </Button>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    ব্রেকডাউন মোট: ৳
                    {convertEnglishToBengali(
                      formData.breakdown.reduce((s, it) => s + (Number(it.amount) || 0), 0).toLocaleString('en-IN')
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Description / Remarks with Voice Input */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                ফি বিবরণ ও নির্দেশিকা (ঐচ্ছিক)
              </Label>
              <VoiceInputBn
                value={formData.description}
                onChange={(e: any) => {
                  const val = typeof e === 'string' ? e : e?.target?.value ?? (e ? String(e) : '');
                  setFormData((p) => ({ ...p, description: val === '[object Object]' ? '' : val }));
                }}
                placeholder="ফি আদায়ের নিয়ম, বিশেষ ছাড় বা প্রযোজ্য নির্দেশিকা..."
                className="h-14 text-xs"
              />
            </div>

            {/* Toggle Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">সক্রিয় স্ট্যাটাস</p>
                  <p className="text-[10px] text-zinc-400">ফি আদায়যোগ্য থাকবে</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, isActive: c }))}
                  className="data-[state=checked]:bg-[#00AEEF] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">বাধ্যতামূলক ফি</p>
                  <p className="text-[10px] text-zinc-400">সবার জন্য প্রদেয়</p>
                </div>
                <Switch
                  checked={formData.isRequired}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, isRequired: c }))}
                  className="data-[state=checked]:bg-rose-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/80 dark:border-zinc-700">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">ভর্তি ফরমে প্রদর্শন</p>
                  <p className="text-[10px] text-zinc-400">ভর্তির সময় যুক্ত হবে</p>
                </div>
                <Switch
                  checked={formData.showInAdmissionForm}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, showInAdmissionForm: c }))}
                  className="data-[state=checked]:bg-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Department Eligibility Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  প্রযোজ্য বিভাগসমূহ (নির্দিষ্ট না করলে সব বিভাগে প্রযোজ্য)
                </Label>
                <span className="text-[10px] text-zinc-400">
                  {formData.departmentIds.length === 0
                    ? 'সকল বিভাগে প্রযোজ্য'
                    : `${convertEnglishToBengali(formData.departmentIds.length)}টি বিভাগ নির্বাচিত`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {departments.map((d) => {
                  const isSelected = formData.departmentIds.includes(d.code || d.$id);
                  return (
                    <button
                      key={d.$id}
                      type="button"
                      onClick={() => toggleSelection(formData.departmentIds, d.code || d.$id, 'departmentIds')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs',
                        isSelected
                          ? 'bg-[#00AEEF] border-[#00AEEF] text-white shadow-[#00AEEF]/20'
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-[#00AEEF]/50'
                      )}
                    >
                      {d.nameBn || d.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boarding Types Eligibility Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  প্রযোজ্য বোর্ডিং ধরণ (নির্দিষ্ট না করলে সবার জন্য প্রযোজ্য)
                </Label>
                <span className="text-[10px] text-zinc-400">
                  {formData.boardingTypes.length === 0
                    ? 'সকলের জন্য প্রযোজ্য'
                    : `${convertEnglishToBengali(formData.boardingTypes.length)}টি বোর্ডিং টাইপ নির্বাচিত`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {boardingTypes.map((b) => {
                  const isSelected = formData.boardingTypes.includes(b.$id);
                  return (
                    <button
                      key={b.$id}
                      type="button"
                      onClick={() => toggleSelection(formData.boardingTypes, b.$id, 'boardingTypes')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs',
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-500/20'
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-indigo-400/50'
                      )}
                    >
                      {b.nameBn || b.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 sm:p-6 bg-zinc-50/70 dark:bg-zinc-800/40 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-row items-center justify-end gap-2.5">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl px-5 h-10 text-xs font-bold cursor-pointer"
              disabled={upsertMutation.isPending}
            >
              বাতিল
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={upsertMutation.isPending}
              className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl px-7 h-10 text-xs font-black shadow-md shadow-[#00AEEF]/20 cursor-pointer border-0"
            >
              {upsertMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {selectedId ? 'পরিবর্তন সংরক্ষণ করুন' : 'ফি কাঠামো তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standalone Fee Category Modal */}
      <FeeCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        feeTypes={feeTypes}
        onCategoryCreated={(newCat) => {
          setFormData((p) => ({ ...p, category: newCat.id }));
        }}
      />
    </div>
  );
}
