'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  User,
  MapPin,
  Wallet,
  Phone,
  BookOpen,
  Star,
  PhoneCall,
  HomeIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import Step1PersonalFamily from './steps/Step1PersonalFamily';
import Step2AddressID from './steps/Step2AddressID';
import Step3DynamicProfessional from './steps/Step3DynamicProfessional';
import Step4ExperienceSkills from './steps/Step4ExperienceSkills';
import Step5ContactReference from './steps/Step5ContactReference';
import Step6PaymentAgreement from './steps/Step6PaymentAgreement';

import { createApplication } from '@/lib/actions/application';
import {
  useStaffFormStore,
  useCurrentStep,
  useIncompleteSteps,
  useStep3Data,
} from '@/store/staffFormStore';
import { Badge } from '../ui/badge';

// New restructured steps based on suggestions
const STEPS = [
  {
    number: 1,
    label: 'প্রোফাইল',
    labelEn: 'Profile',
    icon: User,
    color: 'primary',
  },
  {
    number: 2,
    label: 'ঠিকানা ও পরিচয়',
    labelEn: 'Address & ID',
    icon: MapPin,
    color: 'primary',
  },
  {
    number: 3,
    label: 'শিক্ষাগত যোগ্যতা',
    labelEn: 'Education',
    icon: BookOpen,
    color: 'primary',
  },
  {
    number: 4,
    label: 'অভিজ্ঞতা ও দক্ষতা',
    labelEn: 'Experience',
    icon: Star,
    color: 'primary',
  },
  {
    number: 5,
    label: 'যোগাযোগ ও রেফারেন্স',
    labelEn: 'Contact',
    icon: Phone,
    color: 'primary',
  },
  {
    number: 6,
    label: 'পেমেন্ট ও চুক্তি',
    labelEn: 'Payment',
    icon: Wallet,
    color: 'primary',
  },
] as const;

// Color mapping for each step
const STEP_COLORS: Record<
  string,
  { bg: string; text: string; border: string; light: string; dark: string }
> = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    light: 'bg-primary/10',
    dark: 'bg-primary/20',
  },
};

// Enhanced Step Indicator with better visual design
function StepIndicator({
  current,
  onStepClick,
}: {
  current: number;
  onStepClick: (step: number) => void;
}) {
  const incompleteSteps = useIncompleteSteps();
  const colors = STEP_COLORS[STEPS[current - 1].color];

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between px-1 sm:px-2">
        <div className="text-left">
          <h2 className="text-lg sm:text-2xl font-black text-zinc-800 dark:text-white">
            স্টেপ {current}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">
            {STEPS[current - 1].labelEn} • {STEPS[current - 1].label}
          </p>
        </div>
        <div className="text-right">
          <div className={cn('text-lg sm:text-xl font-black', colors.text)}>
            {Math.round((current / STEPS.length) * 100)}%
          </div>
          <p className="text-xs text-zinc-500">সম্পন্ন</p>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative h-1.5 sm:h-2 w-full bg-zinc-200/60 dark:bg-zinc-700/60 rounded-lg overflow-hidden border border-zinc-300/50 dark:border-zinc-600/50">
        <motion.div
          className={cn('absolute top-0 left-0 h-full rounded-lg', colors.bg)}
          initial={{ width: 0 }}
          animate={{ width: `${(current / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Step Pills - scrollable on mobile */}
      <div className="flex justify-between gap-1 overflow-x-auto pb-2 -mx-2 px-2">
        {STEPS.map(step => {
          const Icon = step.icon;
          const isDone = current > step.number;
          const isActive = current === step.number;
          const isIncomplete = incompleteSteps.includes(step.number);
          const stepColors = STEP_COLORS[step.color];

          return (
            <div
              key={step.number}
              className="flex flex-col items-center flex-1 cursor-pointer group min-w-0"
              onClick={() => onStepClick(step.number)}
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive
                    ? 'var(--color-primary)'
                    : isDone
                      ? 'var(--zinc-500)'
                      : 'var(--background)',
                  scale: isActive ? 1.1 : 1,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl flex items-center justify-center border-2 transition-all shadow-lg',
                  isDone && 'bg-zinc-500 border-zinc-500 text-white',
                  isActive &&
                    cn(stepColors.bg, stepColors.border, 'text-white'),
                  !isDone &&
                    !isActive &&
                    'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 group-hover:border-zinc-300 dark:group-hover:border-zinc-600'
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </motion.div>

              {/* Incomplete indicator */}
              {isIncomplete && !isActive && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">!</span>
                </div>
              )}

              {/* Step label - show on larger screens */}
              <span
                className={cn(
                  'hidden lg:block text-xs font-bold mt-2 transition-colors',
                  isActive && 'text-primary',
                  isDone && 'text-zinc-500',
                  !isDone && !isActive && 'text-zinc-400'
                )}
              >
                <span className="text-[10px] sm:text-xs font-bold mt-1 sm:mt-2 truncate text-center hidden xs:block">
                  {step.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Enhanced Success Screen
function SuccessScreen({ staffId }: { staffId: string }) {
  const hasConfettiFired = useRef(false);

  useEffect(() => {
    if (hasConfettiFired.current) return;
    hasConfettiFired.current = true;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: false,
    });

    myConfetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'],
      gravity: 0.8,
      ticks: 300,
    });

    const end = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        setTimeout(() => {
          if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
          }
        }, 1000);
        return;
      }

      myConfetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'],
        gravity: 0.9,
        ticks: 200,
      });

      myConfetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'],
        gravity: 0.9,
        ticks: 200,
      });
    }, 200);
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center py-8 sm:py-16 px-4 kalpurush-font"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative inline-block mb-6 sm:mb-8"
      >
        <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
          <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
        </div>
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-white mb-3 kalpurush-font"
      >
        🎉 আপনার আবেদন সফল হয়েছে!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-zinc-500 mb-2"
      >
        আপনার আবেদন আইডি:
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="inline-block px-6 py-3 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/30 mb-6"
      >
        <span className="text-2xl font-black text-primary">{staffId}</span>
      </motion.div>

      {/* Office Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mb-6 p-4 rounded-xl bg-primary/5 dark:bg-primary/10/20 border border-primary/20 dark:border-primary max-w-md mx-auto kalpurush-font"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <PhoneCall className="h-5 w-5 text-primary" />
          <span className="font-bold text-primary dark:text-primary/70">
            যোগাযোগের জন্য
          </span>
        </div>
        <p className="text-sm text-primary dark:text-primary/70">
          যোগাযোগের জন্য অফিসে সরাসরি যোগাযোগ করুন বা নিচের নম্বরে কল করুন:
        </p>
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <a
            href="tel:+88014070460000"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary text-white rounded-lg font-bold transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            014070460000
          </a>
          <a
            href="tel:+8801822478883"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary text-white rounded-lg font-bold transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            01822478883
          </a>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-sm text-zinc-500 mb-8 max-w-md mx-auto"
      >
        আবেদন করার জন্য আপনাকে ধন্যবাদ । আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ
        করবে। ধন্যবাদ!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleGoHome}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 rounded-xl px-8 h-12 font-bold"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          হোমপেজে ফিরে যান
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function StaffForm() {
  const currentStep = useCurrentStep();
  const step3Data = useStep3Data();
  const {
    step1Data,
    step2Data,
    step3Data: step3,
    step4Data,
    step5Data,
    step6Data,
    nextStep,
    prevStep,
    setSubmitting,
    setSubmittedStaffId,
    submittedStaffId,
  } = useStaffFormStore();
  const [uploadPhase, setUploadPhase] = useState<string>('idle');
  const mutation = useMutation({
    mutationFn: createApplication,
    onError: error => {
      const errorMessage = error.message || 'অজানা ত্রুটি';

      if (
        errorMessage.startsWith('DUPLICATE_APPLICATION:') ||
        error.name === 'DuplicateApplicationError'
      ) {
        const actualMessage = errorMessage.replace(
          'DUPLICATE_APPLICATION:',
          ''
        );
        toast.warning('ডুপ্লিকেট আবেদন', {
          description:
            actualMessage +
            '\n\nফর্ম রিসেট করে নতুন তথ্য দিয়ে আবার চেষ্টা করুন।',
          duration: 10000,
          action: {
            label: 'ফর্ম রিসেট করুন',
            onClick: () => {
              useStaffFormStore.getState().reset();
              toast.success('ফর্ম রিসেট হয়েছে! নতুন তথ্য দিয়ে আবেদন করুন।');
            },
          },
        });
      } else if (
        errorMessage.includes('bucket') ||
        errorMessage.includes('storage')
      ) {
        toast.error('স্টোরেজ কনফিগারেশন ত্রুটি', {
          description:
            'ফাইল আপলোড সিস্টেম সেটআপ করা হয়নি। আবেদন সেভ হয়েছে কিন্তু ফাইলগুলো আপলোড হয়নি।',
          duration: 6000,
        });
      } else {
        toast.error('সাবমিশন ব্যর্থ হয়েছে', {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
    onSuccess: data => {
      useStaffFormStore.getState().reset();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mms-staff-form-v2');
      }
      setSubmittedStaffId(data.applicationId);
    },
  });

  // Get current step color
  const colors = STEP_COLORS[STEPS[currentStep - 1].color];

  const handleSubmit = useCallback(async () => {
    setUploadPhase('submitting');

    const cleanData: any = {
      ...step1Data,
      ...step2Data,
      ...step3Data,
      ...step4Data,
      ...step5Data,
      ...step6Data,
    };

    if (
      typeof cleanData.photoUrl === 'string' &&
      cleanData.photoUrl.startsWith('blob:')
    ) {
      delete cleanData.photoUrl;
    }
    if (
      typeof cleanData.nidFrontCopyUrl === 'string' &&
      cleanData.nidFrontCopyUrl.startsWith('blob:')
    ) {
      delete cleanData.nidFrontCopyUrl;
    }
    if (
      typeof cleanData.nidBackCopyUrl === 'string' &&
      cleanData.nidBackCopyUrl.startsWith('blob:')
    ) {
      delete cleanData.nidBackCopyUrl;
    }

    if (!cleanData.email || cleanData.email.trim() === '') {
      cleanData.email = null;
    }

    if (mutation.isPending) {
      return;
    }

    mutation.mutate(cleanData as any);
  }, [
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5Data,
    step6Data,
    mutation,
  ]);

  if (submittedStaffId) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-gradient-to-br from-white via-white/95 to-white/90 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 p-8 rounded-xl border border-white/30 dark:border-zinc-700/50 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <SuccessScreen staffId={submittedStaffId} />
        </div>
      </div>
    );
  }

  return (
    <div className="kalpurush-font max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Enhanced Header Card */}
      <div className="bg-gradient-to-br from-white via-white/95 to-white/90 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 p-4 sm:p-6 md:p-8 rounded-xl border border-white/30 dark:border-zinc-700/50 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <StepIndicator
          current={currentStep}
          onStepClick={step =>
            useStaffFormStore.getState().goToStep(step as any)
          }
        />
      </div>

      {/* Enhanced Content Card */}
      <div className="bg-gradient-to-br from-white via-white/95 to-white/90 dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800/90 p-4 sm:p-6 md:p-8 rounded-xl border border-white/30 dark:border-zinc-700/50 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        {/* Step Header */}
        <div
          className={cn(
            'flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl transition-all duration-300',
            colors.light,
            colors.dark
          )}
        >
          <div
            className={cn(
              'h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center shadow-lg shrink-0',
              colors.bg,
              'text-white'
            )}
          >
            {currentStep === 1 && <User className="h-6 w-6 sm:h-7 sm:w-7" />}
            {currentStep === 2 && <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />}
            {currentStep === 3 && (
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
            )}
            {currentStep === 4 && <Star className="h-6 w-6 sm:h-7 sm:w-7" />}
            {currentStep === 5 && <Phone className="h-6 w-6 sm:h-7 sm:w-7" />}
            {currentStep === 6 && <Wallet className="h-6 w-6 sm:h-7 sm:w-7" />}
          </div>
          <div className="flex-1 w-full">
            <h2
              className={cn(
                'text-lg sm:text-xl md:text-2xl font-black',
                colors.text
              )}
            >
              {STEPS[currentStep - 1].label}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              ধাপ {currentStep} / {STEPS.length} —{' '}
              {STEPS[currentStep - 1].labelEn}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'sm:flex px-3 py-1.5 sm:px-4 sm:py-2 font-bold border-2 text-sm',
              colors.border,
              colors.text
            )}
          >
            {currentStep}/{STEPS.length}
          </Badge>
        </div>

        {/* Step Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {currentStep === 1 && <Step1PersonalFamily onNext={nextStep} />}
            {currentStep === 2 && (
              <Step2AddressID onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 3 && (
              <Step3DynamicProfessional onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 4 && (
              <Step4ExperienceSkills onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 5 && (
              <Step5ContactReference onNext={nextStep} onPrev={prevStep} />
            )}
            {currentStep === 6 && (
              <Step6PaymentAgreement
                onPrev={prevStep}
                onSubmit={handleSubmit}
                isLoading={mutation.isPending}
                designation={step3Data?.designation}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
