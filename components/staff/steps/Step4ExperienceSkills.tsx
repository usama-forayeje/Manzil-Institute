'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Briefcase,
  FileUp,
  FileBadge,
  Loader2,
  Globe,
  CheckCircle2,
  X,
  FileText,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, compressImage } from '@/lib/utils';
import { fileToBase64, validateFile } from '@/lib/utils/file';
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
  FaGlobe,
} from 'react-icons/fa6';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { HelpTooltip } from '@/components/ui/HelpTooltip';

import {
  TEACHER_DESIGNATIONS,
  NON_TEACHER_DESIGNATIONS,
} from '@/validations/staff';
import {
  useStaffFormStore,
  useStep3Data,
  useStep4Data,
} from '@/store/staffFormStore';
import { VoiceInputBn } from '@/components/ui/voice-input';

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface FormData {
  previousWorkplace: string;
  previousWorkDuration: string;
  totalExperienceYears: number;
  isHafiz: boolean;
  specialSkills: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

// ── FileUploadSlot — defined outside to prevent focus loss ───
interface FileSlotProps {
  label: string;
  subLabel: string;
  required?: boolean;
  preview: string | null;
  fileName: string | null;
  isNew: boolean; // just uploaded this session
  onPick: () => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  color: 'rose' | 'amber';
  tooltip?: string;
}

function FileUploadSlot({
  label,
  subLabel,
  required,
  preview,
  fileName,
  isNew,
  onPick,
  onRemove,
  inputRef,
  onChange,
  icon,
  color,
  tooltip,
}: FileSlotProps) {
  const colors = {
    rose: {
      border: 'border-primary/20 dark:border-primary',
      hover: 'hover:border-primary',
      bg: 'bg-primary/5 dark:bg-primary/10',
      text: 'text-primary',
    },
    amber: {
      border: 'border-primary/20 dark:border-primary',
      hover: 'hover:border-primary',
      bg: 'bg-primary/5 dark:bg-primary/10',
      text: 'text-primary',
    },
  }[color];

  const hasContent = !!preview;

  return (
    <div className="space-y-3">
      <FormLabel
        className={cn('flex items-center gap-2 font-semibold', colors.text)}
      >
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
        {tooltip && <HelpTooltip content={tooltip} />}
      </FormLabel>
      <div
        onClick={onPick}
        className={cn(
          'relative group h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer',
          hasContent
            ? isNew
              ? 'border-primary bg-primary/5/30 dark:bg-primary/10/20'
              : 'border-primary bg-primary/5/30 dark:bg-primary/10/20'
            : cn(colors.border, colors.hover, 'bg-background/50 backdrop-blur-sm')
        )}
      >
        {hasContent ? (
          <div className="flex flex-col items-center gap-2 text-center px-4 group-hover:scale-105 transition-transform">
            <CheckCircle2
              className={cn(
                'h-10 w-10',
                isNew ? 'text-primary' : 'text-primary'
              )}
            />
            <span
              className={cn(
                'text-sm font-bold truncate max-w-full',
                isNew ? 'text-primary' : 'text-primary'
              )}
            >
              {isNew ? (fileName ?? 'আপলোড সম্পন্ন') : 'সংরক্ষিত আছে'}
            </span>
            <span
              className={cn(
                'text-xs',
                isNew ? 'text-primary' : 'text-primary'
              )}
            >
              {isNew ? '' : '(পরিবর্তন করতে ক্লিক করুন)'}
            </span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
            >
              <X className="h-3 w-3" /> মুছে ফেলুন
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
            <div
              className={cn(
                'h-14 w-14 rounded-xl flex items-center justify-center',
                colors.bg
              )}
            >
              <FileUp className={cn('h-7 w-7', colors.text)} />
            </div>
            <span className={cn('text-sm font-bold', colors.text)}>
              {subLabel}
            </span>
            <span className={cn('text-xs opacity-70', colors.text)}>
              PDF / Image
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default function Step4ExperienceSkills({ onNext, onPrev }: StepProps) {
  const savedData = useStep4Data();
  const step3Data = useStep3Data();
  const { setStep4Data, patchStep4Data } = useStaffFormStore();

  // File state — File objects are session-only, previews (base64) persist
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [expFile, setExpFile] = useState<File | null>(null);

  // Previews from store (persist across reloads)
  const [cvPreview, setCvPreview] = useState<string | null>(
    savedData?.cvUrl ?? null
  );
  const [expPreview, setExpPreview] = useState<string | null>(
    savedData?.experienceLetterUrl ?? null
  );

  const [isCompressing, setIsCompressing] = useState(false);

  const cvRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);

  const designation = step3Data?.designation ?? '';
  const isTeacher = TEACHER_DESIGNATIONS.includes(designation);

  // ── Form ───────────────────────────────────────────────────
  const form = useForm<FormData>({
    defaultValues: {
      previousWorkplace: savedData?.previousWorkplace ?? '',
      previousWorkDuration: savedData?.previousWorkDuration ?? '',
      totalExperienceYears: savedData?.totalExperienceYears ?? 0,
      isHafiz: savedData?.isHafiz ?? false,
      specialSkills: savedData?.specialSkills ?? '',
      socialLinks: savedData?.socialLinks ?? {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        website: '',
      },
    },
  });

  // FIXED: Single consolidated auto-save effect (race condition fixed)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const sub = form.watch(value => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        patchStep4Data({
          ...value,
          cvFile,
          experienceLetterFile: expFile,
          cvUrl: cvPreview,
          experienceLetterUrl: expPreview,
        } as any);
      }, 800);
    });
    return () => {
      sub.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, patchStep4Data, cvFile, expFile, cvPreview, expPreview]);

  // ── File handlers ──────────────────────────────────────────
  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: File) => void,
    previewSetter: (b: string) => void,
    label: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, { maxSizeMB: 5 });
    if (!validation.valid) {
      toast.error(validation.error || 'ফাইল সাইজ বা টাইপ সঠিক নয়');
      return;
    }

    setIsCompressing(true);
    let blobUrl: string | null = null;
    try {
      const compressed = await compressImage(file, 0.85);
      blobUrl = URL.createObjectURL(compressed);
      const base64 = await fileToBase64(compressed);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      setter(compressed);
      previewSetter(base64);
      toast.success(`${label} আপলোড সম্পন্ন হয়েছে`);
    } catch {
      toast.error('ফাইল প্রসেসিং এ সমস্যা হয়েছে');
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    } finally {
      setIsCompressing(false);
      if (e.target) e.target.value = '';
    }
  }

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit: SubmitHandler<FormData> = data => {
    if (!cvPreview) {
      toast.error('CV আপলোড আবশ্যিক');
      return;
    }
    setStep4Data({
      ...data,
      cvFile,
      experienceLetterFile: expFile,
      cvUrl: cvPreview,
      experienceLetterUrl: expPreview ?? undefined,
    });
    onNext();
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="kalpurush-font"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Loading overlay */}
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
                  <span className="text-sm font-bold text-primary">
                    ফাইল প্রসেসিং হচ্ছে...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Experience */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 dark:bg-primary/10/20 border border-primary/20/50">
              <div className="p-2 rounded-lg bg-primary/5 dark:bg-primary/10/50">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-primary dark:text-primary/70">
                পেশাদার অভিজ্ঞতা
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-primary/5/30 dark:bg-primary/10/10 border border-primary/20/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="previousWorkplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary dark:text-primary/70">
                        সর্বশেষ কর্মস্থল
                      </FormLabel>
                      <FormControl>
                        <VoiceInputBn
                          placeholder="প্রতিষ্ঠানের নাম"
                          className="bg-background/80 backdrop-blur-sm border-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="previousWorkDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary dark:text-primary/70">
                        কর্মকাল
                      </FormLabel>
                      <FormControl>
                        <VoiceInputBn
                          placeholder="যেমন: ২ বছর ৬ মাস"
                          className="bg-background/80 backdrop-blur-sm border-primary/20"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalExperienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary dark:text-primary/70">
                        মোট অভিজ্ঞতার বছর
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="বছর সংখ্যা"
                          className="bg-background/80 backdrop-blur-sm border-primary/20 h-11"
                          value={field.value || ''}
                          onChange={e => {
                            const bn: Record<string, string> = {
                              '০': '0',
                              '১': '1',
                              '২': '2',
                              '৩': '3',
                              '৪': '4',
                              '৫': '5',
                              '৬': '6',
                              '৭': '7',
                              '৮': '8',
                              '৯': '9',
                            };
                            const val = e.target.value.replace(
                              /[০-৯]/g,
                              d => bn[d] || d
                            );
                            field.onChange(parseInt(val, 10) || 0);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Hafiz + Skills */}
              <div className="p-4 rounded-xl border-2 border-primary/20 dark:border-primary bg-primary/5/30">
                <FormField
                  control={form.control}
                  name="isHafiz"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-5 w-5 border-primary data-[state=checked]:bg-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-primary dark:text-primary/70 font-bold cursor-pointer">
                        🎓 আপনি কি হাফেজ-এ-কুরআন?
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary dark:text-primary/70 flex items-center gap-2">
                      <Star className="h-4 w-4" /> বিশেষ দক্ষতা
                      <HelpTooltip content="বিশেষ কোনো দক্ষতা থাকলে লিখুন" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="যেমন: কম্পিউটার, ক্যালিগ্রাফি..."
                        className="bg-background/80 backdrop-blur-sm border-primary/20 min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Documents */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 dark:bg-primary/10/20 border border-primary/20/50">
              <div className="p-2 rounded-lg bg-primary/5 dark:bg-primary/10/50">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-primary dark:text-primary/70">
                প্রয়োজনীয় কাগজপত্র
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FileUploadSlot
                label="জীবনবৃত্তান্ত / CV"
                subLabel="CV আপলোড করুন"
                required
                preview={cvPreview}
                fileName={cvFile?.name ?? null}
                isNew={!!cvFile}
                onPick={() => cvRef.current?.click()}
                onRemove={() => {
                  setCvFile(null);
                  setCvPreview(null);
                }}
                inputRef={cvRef}
                onChange={e => handleFile(e, setCvFile, setCvPreview, 'CV')}
                icon={<FileText className="h-4 w-4" />}
                color="rose"
                tooltip="পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) আপলোড করুন। PDF বা Image উভয়ই গ্রহণযোগ্য।"
              />

              <FileUploadSlot
                label="অভিজ্ঞতা / চারিত্রিক সনদ"
                subLabel="সনদপত্র আপলোড করুন"
                preview={expPreview}
                fileName={expFile?.name ?? null}
                isNew={!!expFile}
                onPick={() => expRef.current?.click()}
                onRemove={() => {
                  setExpFile(null);
                  setExpPreview(null);
                }}
                inputRef={expRef}
                onChange={e =>
                  handleFile(e, setExpFile, setExpPreview, 'অভিজ্ঞতা সনদ')
                }
                icon={<FileBadge className="h-4 w-4" />}
                color="rose"
                tooltip="পূর্ববর্তী প্রতিষ্ঠানের অভিজ্ঞতা সনদ বা চারিত্রিক সনদ আপলোড করুন।"
              />
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Social links */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 dark:bg-primary/20 border border-primary/20">
              <div className="p-2 rounded-lg bg-primary/20 dark:bg-primary/50">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-primary dark:text-primary/70">
                সামাজিক যোগাযোগ মাধ্যম (ঐচ্ছিক)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-primary/5 dark:bg-primary/20 border border-primary/20">
              {[
                {
                  name: 'socialLinks.facebook' as const,
                  icon: <FaFacebook className="h-4 w-4 text-[#1877F2]" />,
                  placeholder: 'facebook.com/username',
                },
                {
                  name: 'socialLinks.linkedin' as const,
                  icon: <FaLinkedinIn className="h-4 w-4 text-[#0A66C2]" />,
                  placeholder: 'linkedin.com/in/username',
                },
                {
                  name: 'socialLinks.twitter' as const,
                  icon: <FaXTwitter className="h-4 w-4" />,
                  placeholder: 'x.com/username',
                },
                {
                  name: 'socialLinks.instagram' as const,
                  icon: <FaInstagram className="h-4 w-4 text-[#E4405F]" />,
                  placeholder: 'instagram.com/username',
                },
              ].map(({ name, icon, placeholder }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        {icon} {placeholder.split('.')[0]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={placeholder}
                          className="bg-background/80 backdrop-blur-sm h-11"
                          {...field}
                          value={String(field.value ?? '')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="socialLinks.website"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <FaGlobe className="h-4 w-4 text-primary" /> ওয়েবসাইট
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourwebsite.com"
                        className="bg-background/80 backdrop-blur-sm h-11"
                        {...field}
                        value={String(field.value ?? '')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onPrev}
              className="text-zinc-500 hover:text-primary rounded-xl px-6 h-12 font-bold"
            >
              ← ফিরে যান
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 min-w-[180px] rounded-xl font-bold px-8 h-12 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
