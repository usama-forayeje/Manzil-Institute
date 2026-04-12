"use client";

import { useCallback, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  User, 
  MapPin, 
  Briefcase, 
  Wallet, 
  ChevronRight, 
  Sparkles,
  Printer,
  PlusCircle,
  Home,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button }   from "@/components/ui/button";
import { cn }       from "@/lib/utils";

import Step1PersonalFamily   from "./steps/Step1PersonalFamily";
import Step2AddressID        from "./steps/Step2AddressID";
import Step3DynamicProfessional from "./steps/Step3DynamicProfessional";
import Step4PaymentReference from "./steps/Step4PaymentReference";

import { createApplication } from "@/lib/actions/application";
import { useStaffFormStore, useCurrentStep, useIncompleteSteps } from "@/store/staffFormStore";
import type { PaymentReferenceData } from "@/validations/staff";
import { Badge } from "../ui/badge";

// ─── Step config ───────────────────────────────────────────
const STEPS = [
  { number: 1, label: "ব্যক্তিগত ও পরিবার", icon: User },
  { number: 2, label: "ঠিকানা ও পরিচয়", icon: MapPin },
  { number: 3, label: "শিক্ষা ও পেশা", icon: Briefcase },
  { number: 4, label: "পেমেন্ট ও রেফারেন্স", icon: Wallet },
] as const;

// ─── Step Indicator ────────────────────────────────────────
function StepIndicator({ current, onStepClick }: { current: number; onStepClick: (step: number) => void }) {
  const incompleteSteps = useIncompleteSteps();

  return (
    <div className="w-full space-y-6">
      {/* Visual Progress Bar - Creative Design with Percentage */}
      <div className="relative h-6 w-full">
        {/* Percentage Label */}
        <div className="absolute -top-1 left-0 text-xs font-bold text-cyan-600 dark:text-cyan-400 z-20">
          {Math.round((current / STEPS.length) * 100)}%
        </div>
        <div className="absolute top-3 left-0 h-3 w-full bg-zinc-100/50 dark:bg-zinc-800/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 dark:bg-zinc-700/30 shadow-inner">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] z-10"
            initial={{ width: 0 }}
            animate={{ width: `${(current / STEPS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            {/* Shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Glow at the tip */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-4 bg-white/40 blur-md rounded-full shadow-[0_0_15px_#fff]" />
          </motion.div>
          
          {/* Background Track Markers */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
            {STEPS.map((_, i) => (
              <div key={i} className="h-full w-px bg-white dark:bg-zinc-600" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between relative px-2 sm:px-4">
        {STEPS.map((step) => {
          const Icon     = step.icon;
          const isDone   = current > step.number;
          const isActive = current === step.number;
          const isIncomplete = incompleteSteps.includes(step.number);

          return (
            <div key={step.number} className="flex flex-1 flex-col items-center gap-2 z-10">
              <div className="relative">
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onStepClick(step.number as any)}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isDone ? "#06b6d4" : isActive ? "#06b6d4" : "var(--background)",
                    borderColor: isDone || isActive ? "#06b6d4" : isIncomplete ? "#ef4444" : "var(--border)",
                    color: isDone || isActive ? "#ffffff" : isIncomplete ? "#ef4444" : "var(--muted-foreground)"
                  }}
                  className={cn(
                    "h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-md backdrop-blur-sm cursor-pointer",
                    isActive && "shadow-cyan-500/40 ring-4 ring-cyan-500/10",
                    isIncomplete && !isActive && "shadow-red-500/40 ring-4 ring-red-500/10 animate-pulse"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> : <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
                </motion.div>
                {/* Red Alert Badge for Incomplete Steps */}
                {isIncomplete && !isDone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50"
                  >
                    <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                  </motion.div>
                )}
              </div>
              <span 
                className={cn(
                  "text-[10px] sm:text-xs font-bold kalpurush-font tracking-tight transition-all cursor-pointer hover:text-cyan-500",
                  isActive ? "text-cyan-600 dark:text-cyan-400 scale-105" : isIncomplete ? "text-red-500 dark:text-red-400" : "text-zinc-400 dark:text-zinc-500"
                )}
                onClick={() => onStepClick(step.number as any)}
              >
                {step.label}
                {isIncomplete && !isDone && (
                  <span className="block text-[9px] text-red-500 mt-0.5">⚠ অসম্পূর্ণ</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────
function SuccessScreen({ staffId }: { staffId: string }) {
  const { reset } = useStaffFormStore();

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Royal/Luxury Colors
      const colors = ['#06b6d4', '#3b82f6', '#fbbf24', '#ffffff'];

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: colors
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: colors
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center gap-6 kalpurush-font"
    >
      <div className="relative">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="h-28 w-28 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]"
        >
          <CheckCircle2 className="h-14 w-14 text-white" />
        </motion.div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-dashed border-cyan-500/30 rounded-full"
        />
        <Sparkles className="absolute -top-2 -right-2 h-10 w-10 text-yellow-400 animate-bounce" />
      </div>

      <div className="space-y-3">
        <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">আবেদন সফল হয়েছে!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">আপনার আবেদনপত্রটি আমাদের সিস্টেমে সংরক্ষিত হয়েছে।</p>
      </div>

      <div className="relative group w-full max-w-sm px-6 py-10 rounded-[2.5rem] bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-white/50 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all hover:shadow-cyan-500/10">
        <p className="text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] font-black mb-3">স্টাফ ট্র্যাকিং আইডি</p>
        <p className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white font-mono">{staffId}</p>
        <div className="mt-4 flex justify-center gap-2">
          {[1,2,3].map(i => <div key={i} className="h-1 w-8 rounded-full bg-cyan-500/20" />)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
        <Button variant="outline" size="lg" onClick={reset} className="rounded-2xl border-zinc-200 dark:border-zinc-800 h-16 px-10 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 text-lg font-bold">
          <PlusCircle className="mr-3 h-6 w-6" /> পুনরায় শুরু করুন
        </Button>
        <Button size="lg" onClick={() => window.print()} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-2xl h-16 px-10 shadow-xl shadow-cyan-600/30 transition-all active:scale-95 group text-lg font-bold">
          <Printer className="mr-3 h-6 w-6 group-hover:translate-y-[-2px] transition-transform" /> ফরমটি প্রিন্ট করুন
        </Button>
      </div>

      <p className="text-zinc-400 text-sm italic mt-4">আইডি নম্বরটি ভবিষ্যতের রেফারেন্সের জন্য সংরক্ষণ করুন।</p>
    </motion.div>
  );
}

// ─── Main StaffForm Component ──────────────────────────────
export default function StaffForm() {
  const currentStep = useCurrentStep();
  const {
    step1Data,
    step2Data,
    step3Data,
    nextStep,
    prevStep,
    setSubmitting,
    setSubmittedStaffId,
    submittedStaffId,
  } = useStaffFormStore();

  const mutation = useMutation({
    mutationFn: createApplication,
    onMutate: () => setSubmitting(true),
    onSuccess: (data) => {
      setSubmitting(false);
      setSubmittedStaffId(data.staffId);
    },
    onError: (err) => {
      setSubmitting(false);
      console.error("Submission error:", err);
    }
  });

  const handleFinalSubmit = useCallback((step4Data: PaymentReferenceData) => {
    mutation.mutate({
      ...step1Data,
      ...step2Data,
      ...step3Data,
      ...step4Data,
    } as any);
  }, [step1Data, step2Data, step3Data, mutation]);

  if (submittedStaffId) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
        <Card className="rounded-[3rem] border-white/20 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl shadow-2xl overflow-hidden ring-1 ring-white/20">
          <CardContent className="p-8">
            <SuccessScreen staffId={submittedStaffId} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-10 space-y-8 animate-fade-in relative">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 -left-10 h-72 w-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 -right-10 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header section */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white kalpurush-font">
          মানযিল ইনস্টিটিউট
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-lg mx-auto kalpurush-font">
          আপনার তথ্যগুলো নির্ভুলভাবে প্রদান করে মানযিল ইনস্টিটিউটের একীভূত ম্যানেজমেন্ট সিস্টেমে যুক্ত হোন।
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="px-4">
        <StepIndicator current={currentStep} onStepClick={(step) => useStaffFormStore.getState().goToStep(step as any)} />
      </div>

      {/* Form Container */}
      <Card className="rounded-[2.5rem] border-white/30 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] ring-1 ring-white/20 overflow-hidden">
        <CardHeader className="p-8 pb-0 border-none">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 kalpurush-font flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-mono">{currentStep}</span>
              {STEPS[currentStep - 1].label}
            </h2>
            <Badge variant="outline" className="rounded-full px-4 py-1.5 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 font-bold kalpurush-font">
              ধাপ {currentStep} / 4
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 sm:p-10 pt-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <Step1PersonalFamily key="s1" onNext={nextStep} />}
            {currentStep === 2 && <Step2AddressID key="s2" onNext={nextStep} onPrev={prevStep} />}
            {currentStep === 3 && <Step3DynamicProfessional key="s3" onNext={nextStep} onPrev={prevStep} />}
            {currentStep === 4 && (
              <Step4PaymentReference 
                key="s4" 
                onPrev={prevStep} 
                onSubmit={handleFinalSubmit} 
                isLoading={mutation.isPending} 
                designation={step3Data.designation}
              />
            )}
          </AnimatePresence>

          {/* Premium Loading Overlay */}
          <AnimatePresence>
            {mutation.isPending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-[2.5rem]"
              >
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-cyan-500 animate-spin" />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"
                  />
                </div>
                <h3 className="mt-6 text-xl font-black text-zinc-800 dark:text-zinc-200 animate-pulse kalpurush-font">প্রক্রিয়া করা হচ্ছে...</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">ফাইলগুলো আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।</p>
              </motion.div>
            )}
          </AnimatePresence>

          {mutation.isError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold kalpurush-font flex items-center gap-3"
            >
              <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">!</div>
              দুঃখিত! ফর্মটি জমা দেওয়া সম্ভব হয়নি। আপনার ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।
            </motion.div>
          )}
        </CardContent>
      </Card>

      <footer className="text-center py-6">
        <p className="text-sm text-zinc-400 font-medium kalpurush-font">
          &copy; ২০২৬ মানযিল ইন্টারন্যাশনাল ইন্সটিটিউট | আইটি বিভাগ
        </p>
      </footer>
    </div>
  );
}