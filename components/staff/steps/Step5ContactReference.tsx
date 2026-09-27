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
  color = 'primary',
}: {
  icon: any;
  title: string;
  subtitle?: string;
  color?: 'primary' | 'amber' | 'violet' | 'rose';
}) {
  const colorMap = {
    primary: 'bg-primary text-white',
    amber: 'bg-primary text-white',
    violet: 'bg-primary text-white',
    rose: 'bg-primary text-white',
  };

  const subtitleColorMap = {
    primary: 'text-primary dark:text-primary',
    amber: 'text-primary dark:text-primary',
    violet: 'text-primary dark:text-primary',
    rose: 'text-primary dark:text-primary',
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
    resolver: zodResolver(contactReferenceSchema) as any,
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
        patchStep5Data(value as any);
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
                <div className="bg-white/90 dark:bg-zinc-900/90 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-primary/30">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-sm font-bold text-primary dark:text-primary">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-primary/5/30 to-primary/5/20 dark:from-primary/10/20 dark:to-primary/10/10 border border-primary/20/50 dark:border-primary/20/30">
              <FormField
                control={form.control}
                name="phonePrimary"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-primary dark:text-primary/70">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                      <HelpTooltip content="আপনার সকল যোগাযোগ এই নম্বরে হবে" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-12 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
                    <FormLabel className="text-primary dark:text-primary/70">
                      হোয়াটসঅ্যাপ নম্বর
                      <HelpTooltip content="যদি আলাদা হয় তাহলে দিন" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
                    <FormLabel className="text-primary dark:text-primary/70">
                      অতিরিক্ত নম্বর
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
                    <FormLabel className="text-primary dark:text-primary/70">
                      ইমেইল ঠিকানা
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-primary/5/30 to-orange-50/20 dark:from-primary/10/20 dark:to-orange-950/10 border border-primary/20/50 dark:border-primary/20/30">
              <FormField
                control={form.control}
                name="emergencyContactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary dark:text-primary/70">
                      জরুরি নম্বর <span className="text-red-500">*</span>
                      <HelpTooltip content="পরিবারের কারো নম্বর দিন" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
                    <FormLabel className="text-primary dark:text-primary/70">
                      সম্পর্ক <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary">
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
              color="primary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 dark:from-primary/20 dark:to-primary/20 border border-primary/20 dark:border-primary/30">
              <FormField
                control={form.control}
                name="referenceName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-primary dark:text-primary/70">
                      রেফারেন্স নাম <span className="text-red-500">*</span>
                      <HelpTooltip content="যিনি আপনাকে সম্পর্কে জানেন" />
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="রেফারেন্স ব্যক্তির নাম"
                        className="h-12 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
                    <FormLabel className="text-primary dark:text-primary/70">
                      রেফারেন্স নম্বর <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="০১XXXXXXXXX"
                        className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
                    <FormLabel className="text-primary dark:text-primary/70">
                      পেশা
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="চাকরি/ব্যবসা"
                        className="h-11 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
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
              className="text-zinc-500 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10/30 rounded-xl px-6 h-12 font-bold transition-all"
            >
              ← ফিরে যান
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white shadow-lg shadow-primary/30 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold px-8 h-12"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
