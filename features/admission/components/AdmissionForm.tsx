'use client';

/**
 * AdmissionForm.tsx — Industry-Standard Multi-Step Form
 * Production-Grade with focus management and scroll-to-error
 */

import { useEffect, useCallback, useState, lazy, Suspense, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  User,
  MapPin,
  GraduationCap,
  Wallet,
  Loader2,
  FileText,
  RotateCcw,
  Printer,
  CheckCircle2 as CheckCircle2Icon,
} from 'lucide-react';
import { AdmissionApplicationForm } from './AdmissionApplicationForm';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

import {
  admissionFormSchema,
  ADMISSION_DEFAULT_VALUES,
  STEP_FIELDS,
  type AdmissionFormValues,
} from '../schemas/form';

import {
  useAdmissionUIStore,
  useCurrentStep,
  useIsSubmitting,
  useCompletedSteps,
  type AdmissionFormStep,
} from '@/store/admissionFormStore';

import { createAdmission, updateStudentAdmission } from '../api/service';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Lazy-load steps
const Step1PersonalInfo = lazy(() => import('./Step1PersonalInfo'));
const Step2ContactAddress = lazy(() => import('./Step2ContactAddress'));
const Step3Documents = lazy(() => import('./Step3Documents'));
const Step4EnrollmentInfo = lazy(() => import('./Step4EnrollmentInfo'));
const Step5FeeCollection = lazy(() => import('./Step5FeeCollection'));
const Step6Success = lazy(() => import('./Step6Success'));

const DRAFT_KEY = 'mii-admission-draft-v2';

function printElement(el: HTMLElement) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('পপআপ ব্লক করা আছে। অনুগ্রহ করে এই সাইটের পপআপ অনুমতি দিন।');
    return;
  }

  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((lnk) => lnk.outerHTML)
    .join('\n');

  const styleTags = Array.from(document.querySelectorAll('style'))
    .map((s) => s.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="${window.location.origin}">
        <title>Print</title>
        ${styleLinks}
        ${styleTags}
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; background: white; }
          @media print { body { margin: 0; } }
          body > *:not(#my-print-content) { display: none !important; }
        </style>
      </head>
      <body>
        <div id="my-print-content">${el.innerHTML}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.addEventListener('afterprint', () => printWindow.close());
  };
}

function loadDraft(): Partial<AdmissionFormValues> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveDraft(values: AdmissionFormValues & { currentStep?: number }, isEditMode: boolean) {
  if (isEditMode) return; // Don't save draft in edit mode
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...values, currentStep: values.currentStep }));
  } catch (err) {
    console.warn('Failed to save draft to sessionStorage:', err);
  }
}

interface StepMeta {
  number: AdmissionFormStep;
  label: string;
  labelEn: string;
  icon: typeof User;
}

const STEPS: StepMeta[] = [
  { number: 1, label: 'প্রোফাইল', labelEn: 'Profile', icon: User },
  { number: 2, label: 'ঠিকানা', labelEn: 'Address', icon: MapPin },
  { number: 3, label: 'নথিপত্র', labelEn: 'Documents', icon: FileText },
  { number: 4, label: 'ভর্তি', labelEn: 'Enrollment', icon: GraduationCap },
  { number: 5, label: 'পেমেন্ট', labelEn: 'Payment', icon: Wallet },
];

function StepLoader() {
  return (
    <div className="space-y-6 py-6 animate-pulse">
      <div className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-6">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  );
}

function StepIndicator({ current, onStepClick }: { current: number; onStepClick: (step: AdmissionFormStep) => void }) {
  const completedSteps = useCompletedSteps();
  const percent = `${Math.round((current / STEPS.length) * 100)}%`;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between px-1">
        <div className="text-left">
          <h2 className="text-lg sm:text-xl font-black text-zinc-800 dark:text-white kalpurush-font">
            ধাপ {current} — {STEPS[current - 1].label}
          </h2>
          <p className="text-xs text-zinc-500 font-medium english-text">
            {STEPS[current - 1].labelEn} • Step {current} of {STEPS.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl font-black text-primary">
            {Math.round((current / STEPS.length) * 100)}%
          </div>
          <p className="text-xs text-zinc-500 kalpurush-font">সম্পন্ন</p>
        </div>
      </div>
      <div className="relative h-1.5 w-full bg-zinc-200/60 dark:bg-zinc-700/60 rounded-lg overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-lg bg-primary"
          initial={{ width: 0 }}
          animate={{ width: percent }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="flex justify-between gap-1">
        {STEPS.map(step => {
          const Icon = step.icon;
          const isDone = completedSteps.includes(step.number);
          const isActive = current === step.number;
          return (
            <button
              key={step.number}
              type="button"
              onClick={() => onStepClick(step.number)}
              className="flex flex-col items-center flex-1 cursor-pointer group min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
              aria-current={isActive ? 'step' : undefined}
            >
              <motion.div
                initial={false}
                animate={{ scale: isActive ? 1.1 : 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center border-2 transition-all shadow-sm',
                  isDone && 'bg-emerald-500 border-emerald-500 text-white',
                  isActive && !isDone && 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20',
                  !isDone && !isActive && 'border-zinc-200 dark:border-zinc-700 text-zinc-400 group-hover:border-zinc-300'
                )}
              >
                {isDone ? <CheckCircle2Icon className="h-4 w-4 sm:h-5 sm:w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </motion.div>
              <span className={cn(
                'text-[10px] sm:text-xs font-bold mt-1.5 truncate kalpurush-font',
                isActive && 'text-primary',
                isDone && 'text-emerald-500',
                !isDone && !isActive && 'text-zinc-400'
              )}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface AdmissionFormProps {
  initialData?: Partial<AdmissionFormValues>;
  isEditMode?: boolean;
  studentId?: string; // Appwrite Document ID
  businessStudentId?: string; // MDS-2025-...
  admissionNo?: string; // ADM-2025-...
}

export default function AdmissionForm({ initialData, isEditMode = false, studentId, businessStudentId, admissionNo }: AdmissionFormProps) {
  const store = useAdmissionUIStore();
  const currentStep = useCurrentStep();
  const isSubmitting = useIsSubmitting();
  const applicationRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(1);
  const [mounted, setMounted] = useState(false);
  const draftLoaded = useRef(false);
  const router = useRouter();

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema) as any,
    defaultValues: initialData 
      ? { 
          ...ADMISSION_DEFAULT_VALUES, 
          ...initialData,
          personal: { ...ADMISSION_DEFAULT_VALUES.personal, ...initialData.personal },
          contact: { ...ADMISSION_DEFAULT_VALUES.contact, ...initialData.contact },
          enrollment: { ...ADMISSION_DEFAULT_VALUES.enrollment, ...initialData.enrollment },
        } 
      : ADMISSION_DEFAULT_VALUES,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  // Restore draft on mount (only if not in edit mode)
  useEffect(() => {
    setMounted(true);
    if (draftLoaded.current) return;
    draftLoaded.current = true;
    
    if (isEditMode && initialData) {
      form.reset({ 
        ...ADMISSION_DEFAULT_VALUES, 
        ...initialData,
        personal: { ...ADMISSION_DEFAULT_VALUES.personal, ...initialData.personal },
        contact: { ...ADMISSION_DEFAULT_VALUES.contact, ...initialData.contact },
        enrollment: { ...ADMISSION_DEFAULT_VALUES.enrollment, ...initialData.enrollment },
      });

      // Hydrate store for print templates
      if (businessStudentId || admissionNo) {
        store.setStep5Data({
          studentId: businessStudentId,
          admissionNo: admissionNo,
          studentNameEn: initialData.personal?.nameEn,
          studentNameBn: initialData.personal?.nameBn,
          admissionDate: initialData.enrollment?.admissionDate,
          hallName: initialData.enrollment?.hallName,
        });
      }
      return;
    }

    const draft = loadDraft();
    if (draft && Object.keys(draft).length > 0) {
      form.reset({ ...ADMISSION_DEFAULT_VALUES, ...draft } as AdmissionFormValues, { keepDefaultValues: false });
    }
  }, [form, isEditMode, initialData, store, businessStudentId, admissionNo]);

  // Auto-save draft (only if not in edit mode)
  useEffect(() => {
    if (isEditMode) return;
    let timer: ReturnType<typeof setTimeout>;
    const { unsubscribe } = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => saveDraft({ ...values, currentStep } as any, isEditMode), 800);
    });
    return () => { unsubscribe(); clearTimeout(timer); };
  }, [form, currentStep, isEditMode]);

  useEffect(() => {
    if (isEditMode) return;
    const handler = () => saveDraft({ ...form.getValues(), currentStep } as any, isEditMode);
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [form, currentStep, isEditMode]);

  // Focus first input on step change
  useEffect(() => {
    const fieldName = STEP_FIELDS[(currentStep as number) as 1 | 2 | 3 | 4 | 5]?.[0];
    const firstInput = fieldName ? document.querySelector(`[name^="${fieldName}"]`) as HTMLElement | null : null;
    firstInput?.focus();
  }, [currentStep]);

  // Scroll to first error
  const scrollToError = useCallback(() => {
    const firstError = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleNext = useCallback(async () => {
    const step = currentStep as 1 | 2 | 3 | 4 | 5;
    
    // In edit mode, we might want to skip payment step 5 or handle it differently
    // For now, let's allow proceeding.

    const fields = STEP_FIELDS[step];
    const isValid = await form.trigger(fields);
    if (!isValid) {
      scrollToError();
      const errors = form.formState.errors;
      
      // Recursive helper to find the first error message in the errors tree
      const getFirstErrorMessage = (errObj: any): string | null => {
        if (!errObj) return null;
        if (typeof errObj.message === 'string') return errObj.message;
        for (const key in errObj) {
          const msg = getFirstErrorMessage(errObj[key]);
          if (msg) return msg;
        }
        return null;
      };

      const customMsg = getFirstErrorMessage(errors);
      const errorMsg = customMsg ? `⚠️ ${customMsg}` : '⚠️ অনুগ্রহ করে সব প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন';
      
      toast.error(errorMsg, {
        description: 'দয়া করে লাল চিহ্নিত ঘরগুলো চেক করুন',
      });
      return;
    }
    
    if (!isEditMode) {
      saveDraft({ ...form.getValues(), currentStep }, isEditMode);
    }
    
    store.markStepComplete(currentStep);
    setDirection(1);
    store.nextStep();
  }, [currentStep, form, store, scrollToError, isEditMode]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    store.prevStep();
  }, [store]);

  const handleGoToStep = useCallback((step: AdmissionFormStep) => {
    if (step === currentStep) return;
    setDirection(step > currentStep ? 1 : -1);
    store.goToStep(step);
  }, [currentStep, store]);

  const handleReset = useCallback(() => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ফরমের সব তথ্য মুছে নতুন করে শুরু করতে চান?')) return;
    store.reset();
    form.reset(ADMISSION_DEFAULT_VALUES);
    setDirection(-1);
    toast.success('ফরমটি সফলভাবে রিসেট করা হয়েছে');
  }, [form, store]);

  const hasSubmitted = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (hasSubmitted.current || isSubmitting) return;
    
    const allSections: (keyof AdmissionFormValues)[] = ['personal', 'contact', 'documents', 'enrollment'];
    // For edit mode, we might skip full payment validation if already paid
    if (!isEditMode) allSections.push('payment');

    const isValid = await form.trigger(allSections);
    if (!isValid) {
      scrollToError();
      const errors = form.formState.errors;
      const failedSections: string[] = [];
      if (errors.personal) failedSections.push('প্রোফাইল (ধাপ ১)');
      if (errors.contact) failedSections.push('ঠিকানা (ধাপ ২)');
      if (errors.documents) failedSections.push('নথিপত্র (ধাপ ৩)');
      if (errors.enrollment) failedSections.push('ভর্তি তথ্য (ধাপ ৪)');
      if (!isEditMode && errors.payment) failedSections.push('পেমেন্ট (ধাপ ৫)');
      toast.error(`⚠️ নিম্নলিখিত ধাপে তথ্য অসম্পূর্ণ: ${failedSections.join(', ')}`, { duration: 5000 });
      return;
    }

    const values = form.getValues();
    hasSubmitted.current = true;
    store.setSubmitting(true);

    try {
      if (isEditMode && studentId) {
        // Handle student update logic via robust server action
        const result = await updateStudentAdmission(studentId, values);
        
        if (result.success && result.student) {
          toast.success('🎉 শিক্ষার্থীর তথ্য সফলভাবে আপডেট করা হয়েছে!');
          
          // Populate success screen data for printing
          store.setStep5Data({
            studentId: result.student.studentId,
            admissionNo: result.student.admissionNo,
            enrollmentIds: values.enrollment.enrollments.map(e => e.enrollmentDocId || ''),
            receiptNo: result.student.receiptNo || '---',
            studentNameEn: result.student.nameEn,
            studentNameBn: result.student.nameBn,
            paidAmount: values.payment.paidAmount,
            totalAmount: values.payment.netAmount,
            admissionDate: values.enrollment.admissionDate,
            hallName: values.enrollment.hallName,
          });

          setDirection(1);
          if (typeof window !== 'undefined') sessionStorage.removeItem(DRAFT_KEY);
          store.goToStep(6);
          
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('successId', result.student.studentId);
            window.history.pushState({}, '', url.toString());
          }
        } else {
          hasSubmitted.current = false;
          toast.error(result.error || 'আপডেট করতে সমস্যা হয়েছে');
        }
      } else {
        // Regular Create Admission logic
        const result = await createAdmission(values);
        if (result.success) {
          store.setStep5Data({
            studentId: result.studentId,
            admissionNo: result.admissionNo,
            enrollmentIds: result.enrollmentIds,
            receiptNo: result.receiptNo,
            studentNameEn: values.personal.nameEn,
            studentNameBn: values.personal.nameBn,
            paidAmount: values.payment.paidAmount,
            totalAmount: values.payment.netAmount,
            admissionDate: values.enrollment.admissionDate,
            hallName: values.enrollment.hallName,
          });
          setDirection(1);
          if (typeof window !== 'undefined') sessionStorage.removeItem(DRAFT_KEY);
          store.goToStep(6);
          
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('successId', result.studentId);
            window.history.pushState({}, '', url.toString());
          }
          toast.success('🎉 ভর্তি সফলভাবে সম্পন্ন হয়েছে!');
        } else {
          hasSubmitted.current = false;
          toast.error(result.error || 'ভর্তি প্রক্রিয়ায় সমস্যা হয়েছে');
        }
      }
    } catch (err: any) {
      hasSubmitted.current = false;
      toast.error(err?.message || 'সার্ভারে সমস্যা হয়েছে');
    } finally {
      store.setSubmitting(false);
    }
  }, [form, store, isSubmitting, scrollToError, isEditMode, studentId]);

  if (!mounted) return <StepLoader />;

  return (
    <FormProvider {...form}>
      <div className="min-h-screen relative overflow-hidden bg-zinc-50/20 dark:bg-[#09090b] kalpurush-font pb-20">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00AEEF]/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#00AEEF]/10 text-[#00AEEF] text-[10px] font-black uppercase tracking-widest border border-[#00AEEF]/20">
                 Admission System 2.0
              </motion.div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 kalpurush-font leading-tight">
                {isEditMode ? 'শিক্ষার্থী তথ্য আপডেট' : 'ভর্তি ফরম'}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-zinc-500 dark:text-zinc-400 font-bold english-text text-sm opacity-80">
                {isEditMode ? 'Update Student Information Profile' : 'Student Admission Application Form'}
              </motion.p>
            </div>

            {currentStep < 6 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
                {isEditMode && (
                  <Button 
                    variant="outline"
                    onClick={() => applicationRef.current && printElement(applicationRef.current)} 
                    className="h-11 rounded-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm"
                  >
                    <Printer className="size-4" />
                    Print Form
                  </Button>
                )}
                <Button 
                  variant="ghost"
                  onClick={isEditMode ? () => router.back() : handleReset} 
                  className="h-11 rounded-md text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-widest gap-2"
                >
                  <RotateCcw className="size-4" />
                  {isEditMode ? 'Cancel' : 'Reset'}
                </Button>
              </motion.div>
            )}
          </div>

          {currentStep < 6 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-md border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
              <StepIndicator current={currentStep} onStepClick={handleGoToStep} />
            </motion.div>
          )}

          <div className="bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00AEEF]/30 to-transparent" />
            <div className="relative p-6 sm:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={currentStep} custom={direction} initial={{ opacity: 0, x: direction * 40, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: direction * -40, filter: 'blur(8px)' }} transition={{ duration: 0.4, type: 'spring', stiffness: 120, damping: 20 }}>
                  <Suspense fallback={<StepLoader />}>
                    {currentStep === 1 && <Step1PersonalInfo onNext={handleNext} isEditMode={isEditMode} />}
                    {currentStep === 2 && <Step2ContactAddress onNext={handleNext} onPrev={handlePrev} />}
                    {currentStep === 3 && <Step3Documents onNext={handleNext} onPrev={handlePrev} />}
                    {currentStep === 4 && <Step4EnrollmentInfo onNext={handleNext} onPrev={handlePrev} />}
                    {currentStep === 5 && <Step5FeeCollection onSubmit={handleSubmit} onPrev={handlePrev} isSubmitting={isSubmitting} />}
                    {currentStep === 6 && <Step6Success />}
                  </Suspense>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {currentStep < 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-2 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-full">
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{isEditMode ? 'Editing Mode' : 'Autosave Enabled'}</p>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight opacity-50">Manzil International Institute — Secure Admission Cloud</p>
            </motion.div>
          )}

          <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none select-none overflow-hidden">
            <div ref={applicationRef} className="bg-white">
              <AdmissionApplicationForm />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
