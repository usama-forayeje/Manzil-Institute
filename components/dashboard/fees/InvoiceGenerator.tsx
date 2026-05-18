'use client';

import { useState, useMemo, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Banknote, Calendar, Building2, Loader2, CheckCircle2, AlertCircle,
  ChevronRight, ChevronLeft, Users, Search, Check, X, Filter,
  RotateCcw, Sparkles, TriangleAlert, Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  feeTypesQueryOptions, 
  feeFilterOptionsQueryOptions 
} from '@/features/fees/api/queries';
import { 
  departmentsQueryOptions, 
  boardingTypesQueryOptions,
  sectionsQueryOptions,
  sessionsQueryOptions
} from '@/features/admission/api/queries';
import {
  previewInvoiceGeneration,
  generateBulkInvoices,
  type InvoicePreviewRow,
} from '@/lib/actions/fees';

// ─── Bengali helpers ─────────────────────────────────────────
const toBn = (n: number) =>
  n.toLocaleString('en-IN').replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

const MONTHS = [
  { en: 'January', bn: 'জানুয়ারি' }, { en: 'February', bn: 'ফেব্রুয়ারি' },
  { en: 'March', bn: 'মার্চ' }, { en: 'April', bn: 'এপ্রিল' },
  { en: 'May', bn: 'মে' }, { en: 'June', bn: 'জুন' },
  { en: 'July', bn: 'জুলাই' }, { en: 'August', bn: 'আগস্ট' },
  { en: 'September', bn: 'সেপ্টেম্বর' }, { en: 'October', bn: 'অক্টোবর' },
  { en: 'November', bn: 'নভেম্বর' }, { en: 'December', bn: 'ডিসেম্বর' },
];

const INVOICE_TYPE_LABELS: Record<string, string> = {
  monthly: 'মাসিক বেতন', session: 'সেশন / বার্ষিক ফি',
  exam: 'পরীক্ষার ফি', admission: 'ভর্তি ফি', other: 'অন্যান্য / ইভেন্ট',
};

type Step = 1 | 2 | 3;

interface Config {
  feeTypeId: string;
  feeTypeCode: string;
  feeTypeName: string;
  feeTypeBn: string;
  feeTypeDefault: number;
  invoiceType: string;
  needsMonth: boolean;
  session: string;
  month: string;
  classId: string;
  boardingType: string;
  departmentCode: string;
  section: string;
}

interface GenerateResult { generatedCount: number; skippedCount: number }

// ════════════════════════════════════════════════════════════════
export default function InvoiceGenerator() {
  const [step, setStep] = useState<Step>(1);
  const [config, setConfig] = useState<Config>({
    feeTypeId: '', feeTypeCode: '', feeTypeName: '', feeTypeBn: '', feeTypeDefault: 0,
    invoiceType: 'monthly', needsMonth: true,
    session: new Date().getFullYear().toString(),
    month: new Date().toLocaleString('en-US', { month: 'long' }),
    classId: 'all', boardingType: 'all', departmentCode: 'all', section: 'all',
  });

  const [previewRows, setPreviewRows] = useState<InvoicePreviewRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [amountOverrides, setAmountOverrides] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isPreviewing, startPreview] = useTransition();
  const [isGenerating, startGenerate] = useTransition();

  // ─── Data queries ─────────────────────────────────────────
  const feeTypesQuery = useQuery(feeTypesQueryOptions);
  const deptQuery = useQuery(departmentsQueryOptions);
  const boardingQuery = useQuery(boardingTypesQueryOptions);
  const sectionsQuery = useQuery(sectionsQueryOptions);
  const sessionsListQuery = useQuery(sessionsQueryOptions);
  
  const feeTypes: any[] = feeTypesQuery.data?.success ? (feeTypesQuery.data.feeTypes as any[]) : [];
  const departments: any[] = deptQuery.data?.success ? (deptQuery.data.departments as any[]) : [];
  const boardingTypes: any[] = boardingQuery.data?.success ? (boardingQuery.data.boardingTypes as any[]) : [];
  const sections: any[] = (sectionsQuery.data as any)?.success ? (sectionsQuery.data as any).sections : [];
  const dbSessions: any[] = (sessionsListQuery.data as any)?.success ? (sessionsListQuery.data as any).sessions : [];
  
  const sessions = dbSessions.length > 0 
    ? dbSessions.map((s: any) => s.sessionName || s.$id)
    : [new Date().getFullYear().toString()];

  // ─── Filtered preview rows ────────────────────────────────
  const filteredRows = useMemo(() => {
    if (!searchFilter.trim()) return previewRows;
    const t = searchFilter.toLowerCase();
    return previewRows.filter(r =>
      r.studentName.toLowerCase().includes(t) ||
      r.studentId.toLowerCase().includes(t) ||
      r.studentClass.toLowerCase().includes(t)
    );
  }, [previewRows, searchFilter]);

  const newRows = useMemo(() => filteredRows.filter(r => !r.hasExistingInvoice), [filteredRows]);
  const skippedRows = useMemo(() => filteredRows.filter(r => r.hasExistingInvoice), [filteredRows]);

  const selectedNewCount = useMemo(
    () => newRows.filter(r => selectedIds.has(r.studentDocId)).length, [newRows, selectedIds]
  );
  const totalSelectedAmount = useMemo(
    () => newRows
      .filter(r => selectedIds.has(r.studentDocId))
      .reduce((s, r) => s + (amountOverrides[r.studentDocId] ?? r.feeAmount), 0),
    [newRows, selectedIds, amountOverrides]
  );

  // ─── Handlers ─────────────────────────────────────────────
  const handleFeeTypeChange = (id: string) => {
    const ft = feeTypes.find(f => f.$id === id);
    if (!ft) return;
    const cat: string = ft.category || ft.feeCategory || 'other';
    const needsMonth = cat === 'monthly';
    setConfig(c => ({
      ...c,
      feeTypeId: id,
      feeTypeCode: ft.code || ft.feeCode || '',
      feeTypeName: ft.name || ft.feeName || '',
      feeTypeBn: ft.nameBn || ft.feeNameBn || '',
      feeTypeDefault: ft.defaultAmount || 0,
      invoiceType: cat,
      needsMonth,
    }));
  };

  const handlePreview = () => {
    if (!config.feeTypeId) { toast.error('ফি টাইপ বেছে নিন'); return; }
    if (!config.session) { toast.error('সেশন বেছে নিন'); return; }
    if (config.needsMonth && !config.month) { toast.error('মাস বেছে নিন'); return; }

    startPreview(async () => {
      const res = await previewInvoiceGeneration({
        feeTypeId: config.feeTypeId,
        feeTypeCode: config.feeTypeCode,
        feeTypeName: config.feeTypeName,
        feeTypeBn: config.feeTypeBn,
        invoiceType: config.invoiceType,
        session: config.session,
        month: config.needsMonth ? config.month : undefined,
        classId: config.classId !== 'all' ? config.classId : undefined,
        boardingType: config.boardingType !== 'all' ? config.boardingType : undefined,
        departmentCode: config.departmentCode !== 'all' ? config.departmentCode : undefined,
        section: config.section !== 'all' ? config.section : undefined,
      });
      if (!res.success) { toast.error(res.error || 'প্রিভিউ ব্যর্থ হয়েছে'); return; }
      setPreviewRows(res.previewRows ?? []);
      // auto-select all new rows
      const newSet = new Set((res.previewRows ?? []).filter(r => !r.hasExistingInvoice).map(r => r.studentDocId));
      setSelectedIds(newSet);
      setAmountOverrides({});
      setStep(2);
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === newRows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(newRows.map(r => r.studentDocId)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleGenerate = () => {
    if (selectedIds.size === 0) { toast.error('কমপক্ষে একজন শিক্ষার্থী বেছে নিন'); return; }
    startGenerate(async () => {
      const res = await generateBulkInvoices({
        feeTypeId: config.feeTypeId,
        feeTypeCode: config.feeTypeCode,
        feeTypeName: config.feeTypeName,
        feeTypeBn: config.feeTypeBn,
        invoiceType: config.invoiceType,
        session: config.session,
        month: config.needsMonth ? config.month : undefined,
        targetStudentIds: [...selectedIds],
        amountOverrides,
        recordedBy: 'admin',
      });
      if (!res.success) { toast.error(res.error || 'জেনারেশন ব্যর্থ'); return; }
      setResult({ generatedCount: res.generatedCount ?? 0, skippedCount: res.skippedCount ?? 0 });
      setStep(3);
    });
  };

  const handleReset = () => {
    setStep(1); setPreviewRows([]); setSelectedIds(new Set());
    setAmountOverrides({}); setResult(null); setSearchFilter('');
  };

  // ─── Step Indicator ───────────────────────────────────────
  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as Step[]).map((s) => {
        const labels = ['কনফিগার', 'প্রিভিউ', 'সম্পন্ন'];
        const done = step > s;
        const active = step === s;
        return (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300',
              done ? 'bg-emerald-500 text-white' : active ? 'bg-[#00AEEF] text-white shadow-lg shadow-cyan-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
            )}>
              {done ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className={cn(
              'text-xs font-black kalpurush-font hidden sm:block',
              active ? 'text-[#00AEEF]' : done ? 'text-emerald-500' : 'text-zinc-400'
            )}>{labels[s - 1]}</span>
            {s < 3 && <div className={cn('h-px w-8 sm:w-16 transition-colors', done ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700')} />}
          </div>
        );
      })}
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // STEP 1: CONFIGURATION
  // ═══════════════════════════════════════════════════════════
  if (step === 1) return (
    <div className="space-y-6 solaiman-lipi">
      <StepIndicator />

      {/* Main Configuration */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#00AEEF]" /> ইনভয়েস কনফিগারেশন
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fee Type Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="h-3.5 w-3.5" /> ফি টাইপ
            </label>
            <Select value={config.feeTypeId} onValueChange={handleFeeTypeChange}>
              <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 transition-all font-bold text-base">
                <SelectValue placeholder={feeTypesQuery.isLoading ? "লোড হচ্ছে..." : "ফি টাইপ নির্বাচন করুন"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl kalpurush-font max-h-[300px]">
                {feeTypes.filter(f => f.isActive !== false).map(ft => (
                  <SelectItem key={ft.$id} value={ft.$id} className="font-bold py-3">
                    {ft.nameBn || ft.name} (৳{toBn(ft.defaultAmount || 0)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Session Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> সেশন (Session)
            </label>
            <Select value={config.session} onValueChange={v => setConfig(c => ({ ...c, session: v }))}>
              <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 transition-all font-bold text-base">
                <SelectValue placeholder={sessionsListQuery.isLoading ? "লোড হচ্ছে..." : "সেশন নির্বাচন করুন"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl kalpurush-font max-h-[300px]">
                {sessions.map((s: string) => <SelectItem key={s} value={s} className="font-bold py-3">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Month Selection */}
          {config.needsMonth && (
            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> মাস (Month)
              </label>
              <Select value={config.month} onValueChange={v => setConfig(c => ({ ...c, month: v }))}>
                <SelectTrigger className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/20 transition-all font-bold text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl kalpurush-font max-h-[300px]">
                  {MONTHS.map(m => (
                    <SelectItem key={m.en} value={m.en} className="font-bold py-3">{m.bn} ({m.en})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
        <h3 className="text-sm font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" /> ফিল্টার <span className="text-[10px] normal-case font-medium">(ঐচ্ছিক — সব ফাঁকা রাখলে সবার জন্য জেনারেট হবে)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Department */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">বিভাগ</label>
            <Select value={config.departmentCode} onValueChange={v => setConfig(c => ({ ...c, departmentCode: v }))}>
              <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent font-bold text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl kalpurush-font">
                <SelectItem value="all" className="font-bold">সব বিভাগ</SelectItem>
                {departments.map((d: any) => (
                  <SelectItem key={d.$id} value={d.$id} className="font-bold">
                    {d.nameBn || d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boarding Type */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">বোর্ডিং টাইপ</label>
            <Select value={config.boardingType} onValueChange={v => setConfig(c => ({ ...c, boardingType: v }))}>
              <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent font-bold text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl kalpurush-font">
                <SelectItem value="all" className="font-bold">সব ধরন</SelectItem>
                {boardingTypes.map((bt: any) => (
                  <SelectItem key={bt.$id} value={bt.code || bt.$id} className="font-bold">
                    {bt.nameBn || bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section */}
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-wider">সেকশন</label>
            <Select value={config.section} onValueChange={v => setConfig(c => ({ ...c, section: v }))}>
              <SelectTrigger className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent font-bold text-sm">
                <SelectValue placeholder={sectionsQuery.isLoading ? "লোড হচ্ছে..." : "সব সেকশন"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl kalpurush-font">
                <SelectItem value="all" className="font-bold">সব সেকশন</SelectItem>
                {sections.map((s: any) => (
                  <SelectItem key={s.$id} value={s.sectionName || s.$id} className="font-bold">
                    {s.sectionNameBn || s.sectionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <Button
          onClick={handlePreview}
          disabled={isPreviewing || !config.feeTypeId}
          className="h-14 px-10 rounded-2xl bg-[#00AEEF] hover:bg-[#0081B1] text-white font-black text-base kalpurush-font shadow-xl shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 gap-3"
        >
          {isPreviewing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Users className="h-5 w-5" />}
          {isPreviewing ? 'লোড হচ্ছে...' : 'শিক্ষার্থীদের দেখুন →'}
        </Button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // STEP 2: PREVIEW + SELECT
  // ═══════════════════════════════════════════════════════════
  if (step === 2) return (
    <div className="space-y-5 solaiman-lipi">
      <StepIndicator />

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'মোট শিক্ষার্থী', value: toBn(previewRows.length), color: 'text-zinc-800 dark:text-zinc-100' },
          { label: 'নতুন ইনভয়েস', value: toBn(newRows.length), color: 'text-[#00AEEF]' },
          { label: 'আগে থেকে আছে', value: toBn(skippedRows.length), color: 'text-amber-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 text-center shadow-sm">
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest kalpurush-font mb-1">{label}</p>
            <p className={cn('text-2xl font-black tracking-tighter', color)}>{value}</p>
          </div>
        ))}
      </div>

      {/* Summary chip */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <Badge variant="outline" className="h-8 px-3 rounded-xl font-bold text-[11px] kalpurush-font border-[#00AEEF]/30 text-[#00AEEF]">
          {config.feeTypeBn || config.feeTypeName} — {config.session}{config.needsMonth ? ` / ${config.month}` : ''}
        </Badge>
        {config.departmentCode !== 'all' && (
          <Badge variant="outline" className="h-8 px-3 rounded-xl font-bold text-[11px] kalpurush-font">বিভাগ: {config.departmentCode}</Badge>
        )}
        {config.boardingType !== 'all' && (
          <Badge variant="outline" className="h-8 px-3 rounded-xl font-bold text-[11px] kalpurush-font">বোর্ডিং: {config.boardingType}</Badge>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAll}
              className={cn(
                'h-9 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border',
                selectedIds.size === newRows.length && newRows.length > 0
                  ? 'bg-[#00AEEF] text-white border-[#00AEEF]'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-[#00AEEF]/50'
              )}
            >
              {selectedIds.size === newRows.length && newRows.length > 0 ? '✓ সব নিষ্ক্রিয়' : 'সব সক্রিয়'}
            </button>
            <span className="text-xs font-bold text-zinc-500 kalpurush-font">
              {toBn(selectedNewCount)} জন বাছাই, মোট ৳{toBn(totalSelectedAmount)}
            </span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="নাম বা আইডি দিয়ে খুঁজুন..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="pl-9 h-9 rounded-xl text-sm font-bold bg-zinc-50 dark:bg-zinc-950/50 border-transparent"
            />
          </div>
        </div>

        {/* New rows */}
        {newRows.length > 0 && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {newRows.map(row => {
              const checked = selectedIds.has(row.studentDocId);
              const isEditing = editingId === row.studentDocId;
              const amount = amountOverrides[row.studentDocId] ?? row.feeAmount;
              const isOverridden = amountOverrides[row.studentDocId] !== undefined;

              return (
                <div
                  key={row.studentDocId}
                  className={cn(
                    'flex items-center gap-4 px-5 py-3 transition-all duration-200',
                    checked ? 'bg-[#00AEEF]/[0.03]' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  )}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleOne(row.studentDocId)}
                    className={cn(
                      'h-5 w-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all',
                      checked ? 'bg-[#00AEEF] border-[#00AEEF]' : 'border-zinc-300 dark:border-zinc-600 hover:border-[#00AEEF]'
                    )}
                  >
                    {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </button>

                  {/* Student info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-zinc-800 dark:text-zinc-100 kalpurush-font truncate">{row.studentName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-[#00AEEF]">{row.studentId}</span>
                      <span className="text-[10px] text-zinc-400">•</span>
                      <span className="text-[10px] font-bold text-zinc-500 kalpurush-font">{row.studentClass} {row.studentSection && `(${row.studentSection})`}</span>
                      {row.boardingType && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 rounded">{row.boardingType}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Amount (editable) */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          defaultValue={amount}
                          autoFocus
                          className="w-24 h-8 text-sm font-bold text-center rounded-lg"
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val >= 0) {
                              setAmountOverrides(prev => ({ ...prev, [row.studentDocId]: val }));
                            }
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className={cn('text-base font-black tracking-tighter', isOverridden ? 'text-amber-500' : 'text-zinc-800 dark:text-zinc-100')}>
                          ৳{toBn(amount)}
                        </span>
                        {isOverridden && (
                          <span className="text-[9px] text-zinc-400 line-through">৳{toBn(row.feeAmount)}</span>
                        )}
                        <button
                          onClick={() => setEditingId(row.studentDocId)}
                          className="h-6 w-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00AEEF] transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Already-exists rows */}
        {skippedRows.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800">
            <div className="px-5 py-2 bg-amber-50/50 dark:bg-amber-500/5 flex items-center gap-2">
              <TriangleAlert className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 kalpurush-font uppercase tracking-wider">আগের ইনভয়েস আছে (স্কিপ হবে)</span>
            </div>
            {skippedRows.map(row => (
              <div key={row.studentDocId} className="flex items-center gap-4 px-5 py-3 opacity-50">
                <div className="h-5 w-5 rounded border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                  <X className="h-3 w-3 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-zinc-600 dark:text-zinc-400 kalpurush-font truncate">{row.studentName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400">{row.studentId}</span>
                    <span className="text-[10px] text-zinc-400">•</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400">
                      {row.existingStatus === 'paid' ? 'পরিশোধিত' : row.existingStatus === 'partial' ? 'আংশিক' : 'বকেয়া'}
                    </Badge>
                  </div>
                </div>
                <span className="text-sm font-bold text-zinc-400">৳{toBn(row.feeAmount)}</span>
              </div>
            ))}
          </div>
        )}

        {previewRows.length === 0 && (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-zinc-500 kalpurush-font">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 rounded-xl font-bold gap-2">
          <ChevronLeft className="h-4 w-4" /> পেছনে যান
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || selectedNewCount === 0}
          className="h-12 px-8 rounded-xl bg-[#00AEEF] hover:bg-[#0081B1] text-white font-black kalpurush-font shadow-xl shadow-cyan-500/20 active:scale-95 disabled:opacity-50 gap-2"
        >
          {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          {isGenerating ? 'তৈরি হচ্ছে...' : `${toBn(selectedNewCount)} জনের ইনভয়েস তৈরি করুন`}
        </Button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // STEP 3: SUCCESS
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 solaiman-lipi">
      <StepIndicator />

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-emerald-100 dark:border-emerald-900/40 p-10 shadow-xl flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mb-5">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 kalpurush-font mb-2">সফলভাবে সম্পন্ন!</h2>
        <p className="text-zinc-500 text-sm font-medium mb-8">ইনভয়েস তৈরির প্রসেস সফলভাবে শেষ হয়েছে।</p>

        <div className="grid grid-cols-2 gap-6 w-full max-w-xs mb-8">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-500/20">
            <p className="text-[11px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest kalpurush-font mb-1">নতুন তৈরি</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">{toBn(result?.generatedCount ?? 0)}</p>
            <p className="text-xs font-bold text-emerald-600/70 dark:text-emerald-400/70 kalpurush-font mt-1">টি ইনভয়েস</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest kalpurush-font mb-1">স্কিপ হয়েছে</p>
            <p className="text-3xl font-black text-zinc-500 tracking-tighter">{toBn(result?.skippedCount ?? 0)}</p>
            <p className="text-xs font-bold text-zinc-400 kalpurush-font mt-1">আগে থেকে ছিল</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Button onClick={handleReset} variant="outline" className="flex-1 h-12 rounded-xl font-bold kalpurush-font gap-2">
            <RotateCcw className="h-4 w-4" /> নতুন জেনারেট
          </Button>
          <Button
            asChild
            className="flex-1 h-12 rounded-xl bg-[#00AEEF] hover:bg-[#0081B1] text-white font-bold kalpurush-font"
          >
            <a href="/dashboard/admin/fees/due">বকেয়া তালিকা দেখুন →</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
