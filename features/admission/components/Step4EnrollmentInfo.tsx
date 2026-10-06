'use client';

/**
 * features/admission/components/Step4EnrollmentInfo.tsx
 * REDESIGNED — Premium Minimal UX, Aligned with Global Theme (#00AEEF)
 */

import { useMemo, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  Trash2,
  School,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  BookOpen,
  StickyNote,
  FlaskConical,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  CheckCheck,
  Check,
  Loader2
} from 'lucide-react';
import { useIsSubmitting } from '@/store/admissionFormStore';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/DatePicker';
import { convertEnglishToBengali } from '@/lib/utils';
import { cn } from '@/lib/utils';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { VoiceInputBn, VoiceInputEn } from '@/components/ui/voice-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import type { AdmissionFormValues } from '../schemas/form';
import { SESSION_OPTIONS } from '../schemas';
import type { AppwriteDoc, DepartmentDoc } from '../types';

import {
  departmentsQueryOptions,
  sessionsQueryOptions,
  sectionsQueryOptions,
  classesByDeptOptions,
  boardingTypesQueryOptions,
  boardingRoomsQueryOptions,
} from '../api/queries';
import { getNextStudentId } from '../api/service';

const floorMap: Record<string, string> = {
  'Ground Floor': 'নিচ তলা', '1st Floor': '১ম তলা', '2nd Floor': '২য় তলা',
  '3rd Floor': '৩য় তলা', '4th Floor': '৪র্থ তলা', '5th Floor': '৫ম তলা', '6th Floor': '৬ষ্ঠ তলা',
};

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
    <div
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all overflow-hidden shadow-sm',
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
    </div>
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

/** Individual enrollment row card */
function EnrollmentCard({
  index, remove, departments, sessions, sessionsRes, sections, canRemove,
}: {
  index: number; remove: (i: number) => void;
  departments: Array<{ id: string; code?: string; nameBn?: string }> | AppwriteDoc<DepartmentDoc>[];
  sessions: string[]; sessionsRes: any; sections: string[]; canRemove: boolean;
}) {
  const { control, watch, setValue, trigger } = useFormContext<AdmissionFormValues>();
  const deptId = watch(`enrollment.enrollments.${index}.departmentId` as any) as string;
  const classId = watch(`enrollment.enrollments.${index}.classId` as any) as string;
  const session = watch(`enrollment.enrollments.${index}.session` as any) as string;
  const fee = watch(`enrollment.enrollments.${index}.monthlyFee` as any) as number;

  const isComplete = Boolean(deptId && classId && session);

  const { data: classRes, isLoading: isClassesLoading } = useQuery(classesByDeptOptions(deptId));
  const classes = useMemo(() => {
    if (!classRes?.success || !classRes.classes) return [];
    return classRes.classes.map((c: any) => ({ id: c.$id, name: c.name, nameBn: c.nameBn, monthlyFee: c.monthlyFee }));
  }, [classRes]);

  const handleDeptChange = (val: string) => {
    const dept = (departments as any[]).find((d) => d.id === val || d.$id === val);
    if (!dept) return;
    setValue(`enrollment.enrollments.${index}.departmentId` as any, dept.id ?? dept.$id, { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.departmentCode` as any, dept.code || '', { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.departmentName` as any, dept.nameBn || dept.name || '', { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.classId` as any, '', { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.className` as any, '', { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.monthlyFee` as any, 0, { shouldValidate: true });
  };

  const handleClassChange = (val: string) => {
    const cls = classes.find((c: any) => c.id === val);
    if (!cls) return;
    setValue(`enrollment.enrollments.${index}.classId` as any, cls.id, { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.className` as any, cls.nameBn || cls.name, { shouldValidate: true });
    setValue(`enrollment.enrollments.${index}.monthlyFee` as any, cls.monthlyFee || 0, { shouldValidate: true });
    trigger(`enrollment.enrollments.${index}.monthlyFee` as any);
  };

  return (
    <div
      className={cn(
        'group rounded-2xl border transition-all duration-300 overflow-hidden',
        isComplete
          ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800'
          : 'bg-white dark:bg-zinc-950 border-dashed border-zinc-200 dark:border-zinc-800'
      )}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
            isComplete ? "bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          )}>
            {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
          </div>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">ভর্তি তথ্য</span>
          {fee > 0 && (
            <div className="px-2 py-0.5 rounded-full bg-[#00AEEF]/10 text-[#00AEEF] text-[10px] font-black">
              ৳{fee.toLocaleString('bn-BD')}
            </div>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group/del"
          >
            <Trash2 className="h-4 w-4 transition-transform group-hover/del:scale-110" />
          </button>
        )}
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Department */}
        <FormField control={control} name={`enrollment.enrollments.${index}.departmentId` as any} render={({ field: f }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">বিভাগ *</FormLabel>
            <Select onValueChange={handleDeptChange} value={f.value || ''}>
              <FormControl>
                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <SelectValue placeholder="নির্বাচন" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font">
                {(departments as any[]).map((d) => (
                  <SelectItem key={d.id ?? d.$id} value={d.id ?? d.$id} className="cursor-pointer">{d.nameBn ?? d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        {/* Class */}
        <FormField control={control} name={`enrollment.enrollments.${index}.classId` as any} render={({ field: f }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">শ্রেণী *</FormLabel>
            <Select onValueChange={handleClassChange} value={f.value || ''} disabled={!deptId || isClassesLoading}>
              <FormControl>
                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <SelectValue placeholder={isClassesLoading ? 'লোড হচ্ছে...' : 'নির্বাচন'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font">
                {classes.map((c: any) => (
                  <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.nameBn ?? c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        {/* Session */}
        <FormField control={control} name={`enrollment.enrollments.${index}.session` as any} render={({ field: f }) => (
          <FormItem>
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">সেশন *</FormLabel>
            <Select onValueChange={(val) => {
              f.onChange(val);
              setValue(`enrollment.enrollments.${index}.session` as any, val, { shouldValidate: true });
            }} value={f.value || ''}>
              <FormControl>
                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-mono cursor-pointer">
                  <SelectValue placeholder="সেশন" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font font-mono">
                {sessions.map((s) => <SelectItem key={s} value={s} className="cursor-pointer">{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />

        {/* Section */}
        <FormField control={control} name={`enrollment.enrollments.${index}.section` as any} render={({ field: f }) => (
          <FormItem>
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">সেকশন</FormLabel>
            <Select onValueChange={f.onChange} value={f.value || ''}>
              <FormControl>
                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 cursor-pointer">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="kalpurush-font">
                {sections.map((s) => <SelectItem key={s} value={s} className="cursor-pointer">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormItem>
        )} />

        {/* Monthly Fee */}
        <FormField control={control} name={`enrollment.enrollments.${index}.monthlyFee` as any} render={({ field: f }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">মাসিক বেতন</FormLabel>
            <FormControl>
              <div className="relative group/fee">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400 group-hover/fee:text-[#00AEEF]">৳</span>
                <Input
                  type="number"
                  className="h-11 pl-8 rounded-xl font-black text-[#00AEEF] bg-white dark:bg-zinc-950 border-zinc-200"
                  {...f}
                  onChange={(e) => f.onChange(Number(e.target.value))}
                  value={f.value ?? 0}
                />
              </div>
            </FormControl>
          </FormItem>
        )} />

        {/* Roll No */}
        <FormField control={control} name={`enrollment.enrollments.${index}.rollNo` as any} render={({ field: f }) => (
          <FormItem className="lg:col-span-2">
            <FormLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">রোল নং</FormLabel>
            <FormControl>
              <Input placeholder="যদি থাকে" className="h-11 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200" {...f} value={f.value ?? ''} />
            </FormControl>
          </FormItem>
        )} />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Step4EnrollmentInfo({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const isSubmitting = useIsSubmitting();
  const form = useFormContext<AdmissionFormValues>();
  const { control, watch, setValue, trigger } = form;

  const deptQuery = useQuery(departmentsQueryOptions);
  const sessionQuery = useQuery(sessionsQueryOptions);
  const sectionQuery = useQuery(sectionsQueryOptions);
  const boardQuery = useQuery(boardingTypesQueryOptions);
  const roomsQuery = useQuery(boardingRoomsQueryOptions);

  const departments = useMemo(() => {
    if (!deptQuery.data?.success) return [];
    return deptQuery.data.departments.map((d: any) => ({ id: d.$id, code: d.code, nameBn: d.nameBn }));
  }, [deptQuery.data]);

  const sessions = useMemo(() => {
    if (!sessionQuery.data?.success) return [];
    return (sessionQuery.data.sessions || []).map((s: any) => (s.sessionName || '').trim()).filter(Boolean);
  }, [sessionQuery.data]);

  const sections = useMemo(() => {
    if (!sectionQuery.data?.success) return [];
    return sectionQuery.data.sections.map((s: any) => s.sectionNameBn || s.sectionName);
  }, [sectionQuery.data]);

  const boardingTypes = useMemo(() => {
    if (!boardQuery.data?.success || !boardQuery.data.boardingTypes?.length) return [];
    return boardQuery.data.boardingTypes;
  }, [boardQuery.data]);

  const hallOptions = useMemo(() => {
    const rooms = roomsQuery.data?.rooms ?? [];
    if (rooms.length > 0) {
      return rooms.map((r: any) => ({
        value: r.roomNo ?? r.$id,
        hallName: r.roomName || r.roomNameBn || 'নামহীন কক্ষ',
        floorLabel: floorMap[r.floor] || r.floor || '',
        roomNoBn: convertEnglishToBengali(r.roomNo || ''),
        label: `${r.roomName || r.roomNameBn} — ${floorMap[r.floor] || r.floor} (${convertEnglishToBengali(r.roomNo || '')})`
      }));
    }
    return ['১ম তলা', '২য় তলা', '৩য় তলা'].map(h => ({ value: h, label: h, hallName: h, floorLabel: '', roomNoBn: '' }));
  }, [roomsQuery.data]);

  const currentBoardingType = watch('enrollment.boardingType');
  const showHallField = useMemo(() => {
    if (!currentBoardingType) return false;
    const bt = boardingTypes.find((b: any) => b.$id === currentBoardingType || b.id === currentBoardingType);
    const label = (bt?.nameBn ?? bt?.name ?? currentBoardingType).toLowerCase();
    return ['residential', 'boarding', 'আবাসিক', 'বোর্ডিং', 'hostel'].some((k) => label.includes(k));
  }, [currentBoardingType, boardingTypes]);

  const { fields, append, remove } = useFieldArray({ control, name: 'enrollment.enrollments' as any });

  const DEFAULT_ENROLLMENT = {
    departmentId: '', departmentCode: '', departmentName: '',
    classId: '', className: '', section: '',
    session: '', shift: '', monthlyFee: 0, rollNo: '',
  };

  const addEnrollment = () => {
    if (fields.length >= 3) { toast.warning('সর্বোচ্চ ৩টি বিভাগে ভর্তি করা যায়'); return; }
    append({ ...DEFAULT_ENROLLMENT });
  };

  const handleRemove = (i: number) => {
    // Get current enrollments synchronously
    const currentEnrollments = form.getValues('enrollment.enrollments') as any[];

    // Guard: must have more than 1 to allow removal
    if (currentEnrollments.length <= 1) {
      toast.warning('কমপক্ষে একটি বিভাগ থাকতে হবে');
      return;
    }

    // 1. Build new array WITHOUT the removed item (synchronous)
    const newEnrollments = currentEnrollments.filter((_, idx) => idx !== i);

    // 2. Save updated draft IMMEDIATELY (before remove causes re-render)
    //    This prevents stale draft from being restored when steps change
    try {
      const allValues = form.getValues();
      const updatedDraft = {
        ...allValues,
        enrollment: {
          ...allValues.enrollment,
          enrollments: newEnrollments,
        },
        payment: {
          ...allValues.payment,
          feeItems: [],  // Reset so Step 5 re-fetches
        },
      };
      sessionStorage.setItem('mii-admission-draft-v2', JSON.stringify(updatedDraft));
    } catch (e) {
      console.warn('Draft save failed:', e);
    }

    // 3. Now remove from RHF field array (causes re-render)
    form.clearErrors('enrollment.enrollments' as any);
    remove(i);

    // 4. Reset feeItems in RHF state
    setValue('payment.feeItems', []);
  };

  const handleNextWithCleanup = async () => {
    // 1. Clear all errors first to avoid "ghost" errors from deleted rows
    form.clearErrors('enrollment');

    // 2. Give React Hook Form a moment to sync the array state
    await new Promise(resolve => setTimeout(resolve, 50));

    // 3. Trigger validation only for the current state of enrollment
    const isValid = await trigger('enrollment', { shouldFocus: true });

    if (isValid) {
      // CRITICAL: Reset feeItems so Step 5 always re-fetches based on current enrollments
      setValue('payment.feeItems', []);
      onNext();
    } else {
      const errors = form.formState.errors.enrollment;
      console.error('[Validation Fail] Enrollment Errors:', errors);

      toast.error('ভর্তির তথ্য অসম্পূর্ণ', {
        description: 'লাল চিহ্নিত সব ফিল্ডগুলো নির্ভুলভাবে পূরণ করুন'
      });

      // Scroll to the first error item
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBoardingTypeChange = useCallback((val: string) => {
    setValue('enrollment.boardingType', val, { shouldValidate: true });
  }, [setValue]);

  if (deptQuery.isLoading || sessionQuery.isLoading || boardQuery.isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pt-12">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div
      className="kalpurush-font max-w-3xl mx-auto px-4 pb-24 pt-8"
    >
      <div className="space-y-8">

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <StepDots current={4} total={5} />
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide ml-1">
              ধাপ ৪ / ৫
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            ভর্তির তথ্য নিশ্চিতকরণ
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium max-w-lg leading-relaxed">
            বিভাগ, শ্রেণী এবং আবাসন তথ্য নির্ভুলভাবে নির্বাচন করুন।
          </p>
        </div>

        {/* ── Section 1: Core Info ────────────────────────── */}
        <SectionCard
          number="৪.১"
          title="ভর্তির মূল বিবরণ"
          subtitle="ভর্তির তারিখ ও আবাসন ধরণ নির্ধারণ করুন"
          icon={BookOpen}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField control={control} name="enrollment.admissionDate" render={({ field: f }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ভর্তির তারিখ *</FormLabel>
                <DatePicker
                  date={f.value ? new Date(f.value) : undefined}
                  setDate={(date) => f.onChange(date?.toISOString() || '')}
                  placeholder="তারিখ নির্বাচন"
                />
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="enrollment.boardingType" render={({ field: f }) => {
              const matchedBt = boardingTypes.find((bt: any) => (bt.$id ?? bt.id) === f.value || bt.code?.toLowerCase() === f.value?.toLowerCase());
              const selectValue = matchedBt ? (matchedBt.$id ?? matchedBt.id) : (f.value || '');

              return (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">আবাসন ধরণ *</FormLabel>
                  <Select onValueChange={(v) => { f.onChange(v); handleBoardingTypeChange(v); }} value={selectValue}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="kalpurush-font">
                      {boardingTypes.map((bt: any) => (
                        <SelectItem key={bt.$id ?? bt.id} value={bt.$id ?? bt.id}>{bt.nameBn ?? bt.name}</SelectItem>
                      ))}
                      {selectValue && !boardingTypes.some((bt: any) => (bt.$id ?? bt.id) === selectValue) && (
                        <SelectItem value={selectValue}>
                          {selectValue === 'day' ? 'অনাবাসিক (ডে)' : selectValue === 'residential' ? 'আবাসিক' : selectValue}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }} />
          </div>

          {showHallField && (
            <div
              className="pt-2"
            >
              <FormField control={control} name="enrollment.hallName" render={({ field: f }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">হল / কক্ষ নির্বাচন</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      const opt = hallOptions.find((o: any) => o.value === val);
                      f.onChange(opt?.label ?? val);
                      setValue('enrollment.hallId', val);
                    }}
                    value={hallOptions.find((o: any) => o.label === f.value)?.value || f.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                        <SelectValue placeholder="রুম নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="kalpurush-font max-h-72">
                      {hallOptions.map((opt: any) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center justify-between gap-4 w-full">
                            <span className="font-bold">{opt.hallName}</span>
                            <span className="text-[10px] text-zinc-400">{opt.floorLabel}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
            </div>
          )}

          <div className="pt-2">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <div className="space-y-0.5">
                <p className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100">অ্যাডমিশন আইডি</p>
                <p className="text-[10px] text-zinc-400 font-medium tracking-tight">ম্যানুয়ালি আইডি সেট করতে চাইলে সুইচ অন করুন।</p>
              </div>
              <div className="flex items-center gap-3">
                {watch('enrollment.useManualIDs') && (
                  <div className="overflow-hidden">
                    <VoiceInputEn
                      component={Input}
                      className="h-9 text-xs font-mono font-bold uppercase tracking-wider text-[#00AEEF] border-[#00AEEF]/20"
                      value={watch('enrollment.customStudentId') || ''}
                      onChange={(e: any) => setValue('enrollment.customStudentId', e.target.value)}
                      placeholder="MII-XXXX"
                    />
                  </div>
                )}
                <Checkbox
                  checked={watch('enrollment.useManualIDs')}
                  onCheckedChange={(c) => {
                    setValue('enrollment.useManualIDs', c === true);
                    if (c === true && !watch('enrollment.customStudentId')) {
                      getNextStudentId().then(id => setValue('enrollment.customStudentId', id));
                    }
                  }}
                  className="h-5 w-5 data-[state=checked]:bg-[#00AEEF] border-[#00AEEF]/20"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 2: Enrollments ────────────────────────── */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF]">
                <GraduationCap className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">বিভাগ ও শ্রেণী</h3>
                <p className="text-[10px] text-zinc-400 font-medium">একাধিক বিভাগে ভর্তি করাতে টেক যোগ করুন</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEnrollment}
              disabled={fields.length >= 3}
              className="h-9 px-4 rounded-xl border-[#00AEEF]/20 text-[#00AEEF] hover:bg-[#00AEEF]/5 gap-2 font-bold transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" /> বিভাগ যোগ
            </Button>
          </div>

          {fields.map((field, index) => (
            <EnrollmentCard
              key={field.id}
              index={index}
              remove={handleRemove}
              departments={departments}
              sessions={sessions}
              sessionsRes={sessionQuery.data}
              sections={sections}
              canRemove={fields.length > 1}
            />
          ))}
        </div>

        {/* ── Section 3: Previous School ────────────────────── */}
        <SectionCard
          number="৪.২"
          title="পূর্ববর্তী শিক্ষা প্রতিষ্ঠান"
          subtitle="ছাত্রের আগের মাদরাসা বা স্কুলের বিবরণ দিন"
          icon={School}
        >
          <div className="space-y-5">
            <FormField control={control} name="enrollment.previousSchoolName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">প্রতিষ্ঠানের নাম</FormLabel>
                <FormControl>
                  <VoiceInputBn {...field} component={Input} placeholder="মাদরাসার নাম লিখুন" className="h-11 rounded-xl" value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={control} name="enrollment.previousSchoolAddress" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">মাদরাসা/স্কুল ঠিকানা</FormLabel>
                <FormControl>
                  <VoiceInputBn {...field} component={Input} placeholder="পূর্ববর্তী প্রতিষ্ঠানের ঠিকানা" className="h-11 rounded-xl" value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={control} name="enrollment.previousClassName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">উত্তীর্ণ শ্রেণী</FormLabel>
                  <FormControl>
                    <VoiceInputBn {...field} component={Input} placeholder="শ্রেণী" className="h-11 rounded-xl" value={field.value ?? ''} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="enrollment.previousResult" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ফলাফল / GPA</FormLabel>
                  <FormControl>
                    <VoiceInputBn {...field} component={Input} placeholder="উদাঃ ৫.০০" className="h-11 rounded-xl" value={field.value ?? ''} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        </SectionCard>

        {/* ── Section 4: Entrance Exam ──────────────────────── */}
        <SectionCard
          number="৪.৩"
          title="ভর্তি পরীক্ষার তথ্য"
          subtitle="মাদরাসা কর্তৃপক্ষ কর্তৃক গৃহীত পরীক্ষার ডাটা"
          icon={FlaskConical}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
            <FormField control={control} name="enrollment.admissionTestMarks" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">প্রাপ্ত নম্বর</FormLabel>
                <FormControl>
                  <Input placeholder="উদাঃ ৮০" className="h-11 rounded-xl" {...field} value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={control} name="enrollment.admissionTestResult" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ফলাফল</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'passed'}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="kalpurush-font">
                    <SelectItem value="passed">উত্তীর্ণ (Pass)</SelectItem>
                    <SelectItem value="waiting">অপেক্ষমান</SelectItem>
                    <SelectItem value="failed">অকৃতকার্য</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField control={control} name="enrollment.examinerName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">পরীক্ষক (উস্তাদ)</FormLabel>
                <FormControl>
                  <VoiceInputBn {...field} component={Input} placeholder="পরীক্ষকের নাম" className="h-11 rounded-xl" value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={control} name="enrollment.admissionTestRemarks" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">বিশেষ মন্তব্য</FormLabel>
                <FormControl>
                  <VoiceInputBn {...field} component={Input} placeholder="..." className="h-11 rounded-xl" value={field.value ?? ''} />
                </FormControl>
              </FormItem>
            )} />
          </div>
        </SectionCard>

        {/* ── Section 5: Notes ────────────────────────────── */}
        <SectionCard
          number="৪.৪"
          title="অতিরিক্ত মন্তব্য"
          subtitle="ছাত্র সম্পর্কে বিশেষ কোনো তথ্য থাকলে লিখুন"
          icon={StickyNote}
        >
          <FormField
            control={control}
            name="enrollment.notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VoiceInputBn
                    {...field}
                    component={Textarea}
                    placeholder="এখানে লিখুন..."
                    className="min-h-[100px] rounded-2xl resize-none bg-zinc-50/50 focus:bg-white border-zinc-200 transition-all p-4"
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onPrev}
            className="flex-1 h-14 rounded-2xl font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 group"
          >
            <ChevronLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            পূর্ববর্তী
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleNextWithCleanup}
            className="flex-[2] h-14 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-1" />
                ভর্তি সম্পন্ন হচ্ছে...
              </>
            ) : (
              <>
                ভর্তি সম্পন্ন করুন
                <Check className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}

const DEFAULT_ENROLLMENT = {
  departmentId: '', departmentCode: '', departmentName: '',
  classId: '', className: '', section: '',
  session: '', shift: '',
  monthlyFee: 0, rollNo: '',
};