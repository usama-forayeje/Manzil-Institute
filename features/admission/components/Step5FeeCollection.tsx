'use client';

/**
 * Step5FeeCollection.tsx — Premium Redesign (Full Feature Aligned)
 * Optimized for fiscal clarity, refined interactions, and includes First Month Fee logic.
 */

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Banknote, 
  Smartphone, 
  Building2,
  ChevronRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2, 
  Tag,
  Wallet,
  Receipt,
  RotateCcw,
  BadgePercent,
  Calculator,
  ShieldCheck,
  ChevronLeft,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

import type { AdmissionFormValues } from '../schemas/form';
import type { FeeItemData } from '../schemas/payment';
import { getAdmissionFees } from '../api/service';
import { cn } from '@/lib/utils';
import { VoiceInputBn } from '@/components/ui/voice-input';

// ── Animations ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// ── Types ──────────────────────────────────────────────────────────────────

type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'cash', label: 'নগদ', icon: Banknote, color: 'text-emerald-600' },
  { id: 'bkash', label: 'bKash', icon: Smartphone, color: 'text-pink-600' },
  { id: 'nagad', label: 'Nagad', icon: Smartphone, color: 'text-orange-600' },
  { id: 'rocket', label: 'Rocket', icon: Smartphone, color: 'text-violet-600' },
  { id: 'bank', label: 'Bank', icon: Building2, color: 'text-blue-600' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionCard({
  number,
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
}: {
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-500 overflow-hidden shadow-sm',
        className
      )}
    >
      <div className="p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00AEEF]/10 text-[10px] font-bold text-[#00AEEF] dark:bg-[#00AEEF]/20">
                {number}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                {title}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium line-clamp-1">
              {subtitle}
            </p>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-5">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i + 1 === current
              ? 'w-6 bg-[#00AEEF]'
              : i + 1 < current
              ? 'w-1.5 bg-zinc-900 dark:bg-zinc-100'
              : 'w-1.5 bg-zinc-200 dark:bg-zinc-700'
          )}
        />
      ))}
    </div>
  );
}

function FeeRow({
  item,
  index,
  onToggle,
  onDiscount,
}: {
  item: FeeItemData;
  index: number;
  onToggle: (i: number, val: boolean) => void;
  onDiscount: (i: number, val: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        'group flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-300',
        item.isIncluded
          ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 shadow-sm'
          : 'bg-transparent border-dashed border-zinc-100 dark:border-zinc-900 opacity-40'
      )}
    >
      <Switch
        checked={item.isIncluded || false}
        onCheckedChange={(v) => onToggle(index, v)}
        className="data-[state=checked]:bg-[#00AEEF] shrink-0 scale-90"
      />

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-xs font-bold truncate leading-none mb-0.5',
          item.isIncluded ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-600'
        )}>
          {item.feeTypeName}
        </p>
        <span className="text-[10px] text-zinc-400 font-medium">
          মূল টাকা: ৳{item.amount.toLocaleString('bn-BD')}
        </span>
      </div>

      <AnimatePresence>
        {item.isIncluded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <div className="relative group/input">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-amber-500">৳</span>
              <input
                type="number"
                min={0}
                max={item.amount}
                value={item.discount || 0}
                onChange={(e) => onDiscount(index, Number(e.target.value))}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-20 h-8 pl-6 pr-2 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-right transition-all group-hover/input:border-amber-500/30"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-w-[60px] text-right">
        <p className={cn(
          'text-[13px] font-black tracking-tight',
          item.isIncluded ? 'text-[#00AEEF]' : 'text-zinc-300 dark:text-zinc-800'
        )}>
          ৳{(item.amount - (item.discount || 0)).toLocaleString('bn-BD')}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Step5FeeCollection({
  onPrev,
  onSubmit,
  isSubmitting,
}: {
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}) {
  const form = useFormContext<AdmissionFormValues>();
  const { watch, setValue } = form;

  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const feeItems = watch('payment.feeItems') || [];
  const selectedMethod = watch('payment.paymentMethod') || 'cash';
  const paidAmount = watch('payment.paidAmount') || 0;
  
  const includeFirstMonth = watch('payment.includeFirstMonth') || false;
  const firstMonthDiscount = watch('payment.firstMonthDiscount') || 0;
  const enrollmentList = watch('enrollment.enrollments') || [];
  
  // Calculate Base Monthly Fee from Step 4
  const baseMonthlyFee = useMemo(() => 
    enrollmentList.reduce((acc, curr) => acc + (curr.monthlyFee || 0), 0),
  [enrollmentList]);

  // ═══════════════════════════════════════════════════════════════
  // 1. Calculations
  // ═══════════════════════════════════════════════════════════════
  const admissionTotal = useMemo(() => 
    feeItems.reduce((acc, f) => f.isIncluded ? acc + f.amount : acc, 0), 
  [feeItems]);

  const admissionDiscount = useMemo(() => 
    feeItems.reduce((acc, f) => f.isIncluded ? acc + (f.discount || 0) : acc, 0), 
  [feeItems]);

  const totalAmount = admissionTotal + (includeFirstMonth ? baseMonthlyFee : 0);
  const totalDiscount = admissionDiscount + (includeFirstMonth ? firstMonthDiscount : 0);
  const netAmount = totalAmount - totalDiscount;
  const dueAmount = netAmount - paidAmount;

  // Sync to RHF
  useEffect(() => {
    setValue('payment.totalAmount', totalAmount);
    setValue('payment.netAmount', netAmount);
  }, [totalAmount, netAmount, setValue]);

  const hasFetched = useRef(false);

  const enrollmentData = watch('enrollment');
  const firstEnrollment = enrollmentData?.enrollments?.[0];
  
  const deptId = firstEnrollment?.departmentId || '';
  const boardType = enrollmentData?.boardingType || '';
  const clsId = firstEnrollment?.classId || '';

  // ═══════════════════════════════════════════════════════════════
  // 2. Fetch Fees
  // ═══════════════════════════════════════════════════════════════
  const fetchFees = useCallback(async () => {
    // Only fetch if not already loading and haven't fetched yet for these specific values
    if (isLoadingFees || hasFetched.current) return;

    // CRITICAL: If no department ID, don't fetch as it will return empty from DB
    if (!deptId) {
      console.warn('[Fee Fetch] Skipping - No Department ID found');
      return;
    }

    setIsLoadingFees(true);
    setError(null);
    hasFetched.current = true;

    try {
      console.log('[Fee Fetch] Calling API with:', { deptId, boardType, clsId });
      const res = await getAdmissionFees(deptId, boardType, clsId);
      
      if (res.success && res.fees && res.fees.length > 0) {
        const items = res.fees.map((f: any) => ({
          ...f,
          isIncluded: f.isRequired ?? true,
          discount: 0
        }));
        setValue('payment.feeItems', items);
      } else if (res.success && (!res.fees || res.fees.length === 0)) {
        setError('এই ক্যাটাগরির জন্য কোনো ভর্তি ফি সেট করা নেই।');
      } else {
        setError(res.error || 'ফি তালিকা লোড করতে ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setError('সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে');
    } finally {
      setIsLoadingFees(false);
    }
  }, [isLoadingFees, setValue, deptId, boardType, clsId]);

  // Reset hasFetched if the input parameters change significantly
  useEffect(() => {
    hasFetched.current = false;
  }, [deptId, boardType, clsId]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  // ═══════════════════════════════════════════════════════════════
  // 3. Handlers
  // ═══════════════════════════════════════════════════════════════
  const handleToggle = (idx: number, val: boolean) => {
    const fresh = [...feeItems];
    fresh[idx].isIncluded = val;
    setValue('payment.feeItems', fresh);
  };

  const handleDiscount = (idx: number, val: number) => {
    const fresh = [...feeItems];
    fresh[idx].discount = Math.min(val, fresh[idx].amount);
    setValue('payment.feeItems', fresh);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="kalpurush-font max-w-3xl mx-auto px-4 pb-24 pt-8"
    >
      <div className="space-y-8">

        {/* ── Page Header ──────────────────────────────────── */}
        <motion.div variants={fadeUp} className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <StepDots current={5} total={5} />
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide ml-1">
              ধাপ ৫ / ৫
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            ফি আদায় ও পেমেন্ট
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium max-w-lg leading-relaxed">
            ভর্তি ফি নিশ্চিত করুন এবং পেমেন্টের তথ্য নির্ভুলভাবে সংগ্রহ করুন।
          </p>
        </motion.div>

        {/* ── Section 5.1: Fees Breakdown ─────────────────── */}
        <SectionCard
          number="৫.১"
          title="ভর্তি ফি বিবরণ"
          subtitle="প্রয়োজনীয় ফি সিলেক্ট এবং ডিসকাউন্ট প্রদান করুন"
          icon={Receipt}
        >
          {isLoadingFees ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 flex flex-col items-center text-center gap-3">
              <AlertCircle className="h-8 w-8 text-rose-500" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-900 dark:text-rose-400">{error}</p>
                <button onClick={() => fetchFees()} className="text-xs font-black text-rose-600 underline uppercase tracking-widest">Retry Fetch</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {feeItems.map((item, i) => (
                <FeeRow key={i} index={i} item={item} onToggle={handleToggle} onDiscount={handleDiscount} />
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Section Extra: First Month Fee ──────────────── */}
        <SectionCard
          number="৫.২"
          title="মাসিক বেতন (প্রথম মাস)"
          subtitle="ভর্তির সময় প্রথম মাসের বেতন যোগ করতে চাইলে এটি অন করুন"
          icon={Calculator}
        >
           <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-[#00AEEF]/5 border border-[#00AEEF]/10">
                 <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                      includeFirstMonth ? "bg-[#00AEEF] text-white shadow-lg" : "bg-zinc-100 text-zinc-400"
                    )}>
                       <RotateCcw className={cn("h-6 w-6", includeFirstMonth && "animate-spin-slow")} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">প্রথম মাসের বেতন যুক্ত করুন</p>
                       <p className="text-[10px] text-zinc-400 font-medium">নির্ধারিত মাসিক বেতন: ৳{baseMonthlyFee.toLocaleString('bn-BD')}</p>
                    </div>
                 </div>
                 <Switch 
                   checked={includeFirstMonth} 
                   onCheckedChange={(v) => setValue('payment.includeFirstMonth', v)} 
                   className="data-[state=checked]:bg-[#00AEEF]"
                 />
              </div>

              <AnimatePresence>
                 {includeFirstMonth && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="overflow-hidden"
                   >
                     <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 dark:bg-amber-500/5 flex flex-col sm:flex-row items-center gap-4">
                       <div className="flex-1">
                          <p className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-2">
                             <BadgePercent className="h-3 w-3" /> মাসিক বেতনে ছাড় (ডিসকাউন্ট)
                          </p>
                          <p className="text-[10px] text-amber-600/70 font-semibold leading-tight">ভর্তির সময় বিশেষ ডিসকাউন্ট দিতে চাইলে এখানে টাকার পরিমাণ লিখুন।</p>
                       </div>
                       <div className="relative shrink-0">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-amber-500">৳</span>
                          <Input 
                            type="number"
                            placeholder="0"
                            className="h-11 w-32 pl-8 rounded-xl border-amber-200 bg-white dark:bg-zinc-950 font-black text-amber-600 text-right"
                            value={firstMonthDiscount || ''}
                            onChange={(e) => setValue('payment.firstMonthDiscount', Number(e.target.value))}
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                          />
                       </div>
                     </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </SectionCard>

        {/* ── Section 5.3: Payment Info ───────────────────── */}
        <SectionCard
          number="৫.৩"
          title="পেমেন্ট গেটওয়ে"
          subtitle="পেমেন্ট মাধ্যম এবং টাকার পরিমাণ নিশ্চিত করুন"
          icon={Wallet}
        >
          {/* Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-inner">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">মোট ধার্যকৃত</span>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">৳{totalAmount.toLocaleString('bn-BD')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">মোট ডিসকাউন্ট</span>
              <p className="text-sm font-bold text-amber-600">৳{totalDiscount.toLocaleString('bn-BD')}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#00AEEF] uppercase tracking-widest">পরিশোধ্য নিট</span>
              <p className="text-sm font-black text-[#00AEEF]">৳{netAmount.toLocaleString('bn-BD')}</p>
            </div>
            <div className="space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">বকেয়া</span>
              <p className={cn("text-base font-black tracking-tight", dueAmount > 0 ? "text-rose-500" : "text-emerald-500")}>
                ৳{dueAmount.toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Method Grid */}
            <div className="space-y-3">
              <FormLabel className="text-xs font-semibold text-zinc-500 flex items-center gap-2">
                 <ShieldCheck className="h-3 w-3 text-[#00AEEF]" /> পেমেন্ট মাধ্যম নির্বাচন করুন
              </FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setValue('payment.paymentMethod', m.id)}
                          className={cn(
                            "relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                            selectedMethod === m.id
                              ? "bg-white dark:bg-zinc-900 border-[#00AEEF] shadow-xl shadow-[#00AEEF]/10 scale-[1.05]"
                              : "bg-transparent border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                          )}
                        >
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        selectedMethod === m.id ? "bg-[#00AEEF]/10" : "bg-zinc-50 dark:bg-zinc-900"
                      )}>
                        <Icon className={cn("h-5 w-5", selectedMethod === m.id ? m.color : "text-zinc-400")} />
                      </div>
                      <span className={cn("text-[11px] font-bold", selectedMethod === m.id ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400")}>
                        {m.label}
                      </span>
                      {selectedMethod === m.id && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#00AEEF] flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-900">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <FormField control={form.control} name="payment.paidAmount" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-500">পরিশোধিত টাকা *</FormLabel>
                  <FormControl>
                    <div className="relative group/paid">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400 group-hover/paid:text-[#00AEEF] transition-colors">৳</span>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="টাকার পরিমাণ"
                        className="h-14 pl-10 rounded-2xl font-black text-lg bg-zinc-50/50 focus:bg-white transition-all border-zinc-200" 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button 
                        type="button" 
                        onClick={() => setValue('payment.paidAmount', netAmount)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-[#00AEEF] bg-[#00AEEF]/5 px-2.5 py-1.5 rounded-lg border border-[#00AEEF]/10 hover:bg-[#00AEEF] hover:text-white transition-all shadow-sm"
                      >
                         Full Amount
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="payment.transactionRef" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-500">ট্রানজেকশন / রেফারেন্স নং</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="TrxID বা চেক নম্বর" 
                      className="h-14 rounded-2xl bg-zinc-50/50 focus:bg-white transition-all border-zinc-200" 
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="payment.notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-zinc-500">অতিরিক্ত নোট / বিবরণ</FormLabel>
                <FormControl>
                  <VoiceInputBn 
                    {...field} 
                    component={Textarea} 
                    placeholder="পেমেন্ট সংক্রান্ত কোনো বিশেষ তথ্য থাকলে এখানে লিখুন..." 
                    className="min-h-[100px] rounded-2xl resize-none bg-zinc-50/50 focus:bg-white transition-all border-zinc-200 p-4" 
                    value={field.value ?? ''} 
                  />
                </FormControl>
              </FormItem>
            )} />
          </div>
        </SectionCard>

        {/* ── Navigation ─────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onPrev}
            className="flex-1 h-16 rounded-2xl font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 group"
          >
            <ChevronLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            পূর্ববর্তী
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className={cn(
              "flex-[2] h-16 rounded-2xl text-white text-base font-black shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3",
              isSubmitting 
                ? "bg-zinc-400 cursor-not-allowed"
                : paidAmount >= netAmount 
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" 
                  : "bg-primary text-primary-foreground shadow-primary/20"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                তথ্য জমা হচ্ছে...
              </>
            ) : (
              <>
                ভর্তি ফরম সাবমিট করুন
                {paidAmount >= netAmount ? (
                  <CheckCircle2 className="h-6 w-6 animate-in zoom-in duration-300" />
                ) : (
                  <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                )}
              </>
            )}
          </Button>
        </motion.div>

      </div>
    </motion.div>
  );
}