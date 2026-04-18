'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Phone, ShieldCheck, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { HelpTooltip } from '@/components/ui/HelpTooltip';

import {
  useStaffFormStore,
  useStep5Data,
  useStep5Complete,
} from '@/store/staffFormStore';
import {
  RELATIONSHIP_LABELS,
  contactReferenceSchema,
  type ContactReferenceData,
} from '@/validations/staff';
import { cn } from '@/lib/utils';
import { VoiceInputBn } from '@/components/ui/voice-input';

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

// Reusable Section Header Component
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color = 'cyan',
}: {
  icon: any;
  title: string;
  subtitle?: string;
  color?: 'cyan' | 'amber' | 'violet' | 'rose';
}) {
  const colorMap = {
    cyan: 'bg-cyan-500 text-white',
    amber: 'bg-amber-500 text-white',
    violet: 'bg-violet-500 text-white',
    rose: 'bg-rose-500 text-white',
  };

  const subtitleColorMap = {
    cyan: 'text-cyan-600 dark:text-cyan-400',
    amber: 'text-amber-600 dark:text-amber-400',
    violet: 'text-violet-600 dark:text-violet-400',
    rose: 'text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-gradient-to-r from-zinc-50 to-zinc-100/50 dark:from-zinc-800/30 dark:to-zinc-800/20 border-l-4 border-current">
      <div
        className={cn(
          'h-10 w-10 rounded-xl flex items-center justify-center shadow-lg',
          colorMap[color]
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className={cn('font-bold text-base', subtitleColorMap[color])}>
          {title}
        </h3>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Step5ContactReference({ onNext, onPrev }: StepProps) {
  const savedData = useStep5Data();
  const step5Complete = useStep5Complete();
  const { setStep5Data, patchStep5Data, markIncomplete } = useStaffFormStore();

  const [isCompressing, setIsCompressing] = useState(false);

  const form = useForm<ContactReferenceData>({
    resolver: zodResolver(contactReferenceSchema),
    defaultValues: {
      phonePrimary: savedData?.phonePrimary ?? '',
      phoneSecondary: savedData?.phoneSecondary ?? '',
      email: savedData?.email ?? '',
      whatsappNo: savedData?.whatsappNo ?? '',
      emergencyContactNo: savedData?.emergencyContactNo ?? '',
      emergencyRelationship: savedData?.emergencyRelationship ?? '',
      referenceName: savedData?.referenceName ?? '',
      referencePhone: savedData?.referencePhone ?? '',
      referenceOccupation: savedData?.referenceOccupation ?? '',
    },
  });

  // Restore form data on mount
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        phonePrimary: savedData.phonePrimary ?? '',
        phoneSecondary: savedData.phoneSecondary ?? '',
        email: savedData.email ?? '',
        whatsappNo: savedData.whatsappNo ?? '',
        emergencyContactNo: savedData.emergencyContactNo ?? '',
        emergencyRelationship: savedData.emergencyRelationship ?? '',
        referenceName: savedData.referenceName ?? '',
        referencePhone: savedData.referencePhone ?? '',
        referenceOccupation: savedData.referenceOccupation ?? '',
      });
    }
  }, []);

  // Auto-save form data with debounce
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const subscription = form.watch(value => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        patchStep5Data(value);
      }, 500);
    });
    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, patchStep5Data]);

  const onSubmit: SubmitHandler<ContactReferenceData> = data => {
    setStep5Data(data);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="kalpurush-font"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Loading Overlay for Compression */}
          <AnimatePresence>
            {isCompressing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
              >
                <div className="bg-white/90 dark:bg-zinc-900/90 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-rose-500/30">
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                  <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                    ফাইল প্রসেসিং হচ্ছে...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Contact Details */}
          <div className="space-y-6">
            <SectionHeader
              icon={Phone}
              title="যোগাযোগ তথ্য"
              subtitle="আপনার যোগাযোগের নম্বর"
              color="rose"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-rose-50/30 to-pink-50/20 dark:from-rose-950/20 dark:to-pink-950/10 border border-rose-100/50 dark:border-rose-900/30">
              <FormField
                control={form.control}
                name="phonePrimary"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-rose-800 dark:text-rose-300">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                      <HelpTooltip content="আপনার সকল যোগাযোগ এই নম্বরে হবে" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-12 bg-white/70 dark:bg-zinc-950/50 border-rose-200 dark:border-rose-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsappNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-800 dark:text-rose-300">
                      হোয়াটসঅ্যাপ নম্বর
                      <HelpTooltip content="যদি আলাদা হয় তাহলে দিন" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-white/70 dark:bg-zinc-950/50 border-rose-200 dark:border-rose-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneSecondary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-rose-800 dark:text-rose-300">
                      অতিরিক্ত নম্বর
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-white/70 dark:bg-zinc-950/50 border-rose-200 dark:border-rose-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-rose-800 dark:text-rose-300">
                      ইমেইল ঠিকানা
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        className="h-11 bg-white/70 dark:bg-zinc-950/50 border-rose-200 dark:border-rose-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Emergency Contact */}
          <div className="space-y-6">
            <SectionHeader
              icon={ShieldCheck}
              title="জরুরি যোগাযোগ"
              subtitle="জরুরি অবস্থায় যোগাযোগের তথ্য"
              color="amber"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-amber-50/30 to-orange-50/20 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-100/50 dark:border-amber-900/30">
              <FormField
                control={form.control}
                name="emergencyContactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-800 dark:text-amber-300">
                      জরুরি নম্বর <span className="text-red-500">*</span>
                      <HelpTooltip content="পরিবারের কারো নম্বর দিন" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-white/70 dark:bg-zinc-950/50 border-amber-200 dark:border-amber-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-800 dark:text-amber-300">
                      সম্পর্ক <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white/70 dark:bg-zinc-950/50 border-amber-200 dark:border-amber-800">
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="father">পিতা (Father)</SelectItem>
                        <SelectItem value="mother">মাতা (Mother)</SelectItem>
                        <SelectItem value="spouse">
                          স্বামী/স্ত্রী (Spouse)
                        </SelectItem>
                        <SelectItem value="brother">ভাই (Brother)</SelectItem>
                        <SelectItem value="sister">বোন (Sister)</SelectItem>
                        <SelectItem value="uncle">চাচা/মামা (Uncle)</SelectItem>
                        <SelectItem value="other">অন্যান্য (Other)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Reference */}
          <div className="space-y-6">
            <SectionHeader
              icon={UserPlus}
              title="রেফারেন্স"
              subtitle="জানা-পরিচিত ব্যক্তির তথ্য"
              color="cyan"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-cyan-50/30 to-blue-50/20 dark:from-cyan-950/20 dark:to-blue-950/10 border border-cyan-100/50 dark:border-cyan-900/30">
              <FormField
                control={form.control}
                name="referenceName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-cyan-800 dark:text-cyan-300">
                      রেফারেন্স নাম <span className="text-red-500">*</span>
                      <HelpTooltip content="যিনি আপনাকে সম্পর্কে জানেন" />
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="রেফারেন্স ব্যক্তির নাম"
                        className="h-12 bg-white/70 dark:bg-zinc-950/50 border-cyan-200 dark:border-cyan-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referencePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-cyan-800 dark:text-cyan-300">
                      রেফারেন্স নম্বর <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-white/70 dark:bg-zinc-950/50 border-cyan-200 dark:border-cyan-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceOccupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-cyan-800 dark:text-cyan-300">
                      পেশা
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="চাকরি/ব্যবসা"
                        className="h-11 bg-white/70 dark:bg-zinc-950/50 border-cyan-200 dark:border-cyan-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onPrev}
              className="text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl px-6 h-12 font-bold transition-all"
            >
              ← ফিরে যান
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-500/30 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold px-8 h-12"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
