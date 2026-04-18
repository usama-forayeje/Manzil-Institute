'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  GraduationCap,
  Plus,
  Trash2,
  FileArchive,
  Loader2,
  Award,
  X,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn, compressImage } from '@/lib/utils';
import { fileToBase64, validateFile } from '@/lib/utils/file';
import {
  professionalEducationSchema,
  type ProfessionalEducationData,
  DESIGNATION_LABELS,
} from '@/validations/staff';
import { useStaffFormStore, useStep3Data } from '@/store/staffFormStore';
import { getDesignations } from '@/lib/actions/terms';
import { VoiceInputBn } from '@/components/ui/voice-input';

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

type FormValues = Pick<
  ProfessionalEducationData,
  'designation' | 'designationCustom' | 'employmentType' | 'education'
>;

export default function Step3DynamicProfessional({
  onNext,
  onPrev,
}: StepProps) {
  const savedData = useStep3Data();
  const { setStep3Data, patchStep3Data, markIncomplete } = useStaffFormStore();

  // Designations from DB
  const [dbDesignations, setDbDesignations] = useState<any[]>([]);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(true);

  // Certificate state
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [certPreviews, setCertPreviews] = useState<string[]>(
    savedData?.certificateUrls ?? []
  );
  const [isCompressing, setIsCompressing] = useState(false);
  const certRef = useRef<HTMLInputElement>(null);

  // ── Form ───────────────────────────────────────────────────
  const form = useForm<FormValues>({
    resolver: zodResolver(
      professionalEducationSchema.pick({
        designation: true,
        designationCustom: true,
        employmentType: true,
        education: true,
      })
    ),
    defaultValues: {
      designation: savedData?.designation ?? '',
      designationCustom: savedData?.designationCustom ?? '',
      employmentType: savedData?.employmentType ?? 'permanent',
      education: savedData?.education ?? [
        { degree: '', institution: '', year: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
  });

  // Load designations from DB
  useEffect(() => {
    getDesignations()
      .then((result: any) => {
        const docs = result?.documents || [];
        setDbDesignations(docs);
      })
      .catch(() => setDbDesignations([]))
      .finally(() => setIsLoadingDesignations(false));
  }, []);

  const hasRestored = useRef(false);

  // Restore on mount (ONCE)
  useEffect(() => {
    if (hasRestored.current) return;

    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        designation: savedData.designation ?? '',
        designationCustom: savedData.designationCustom ?? '',
        employmentType: savedData.employmentType ?? 'permanent',
        education: savedData.education ?? [
          { degree: '', institution: '', year: '' },
        ],
      });
      if (
        Array.isArray(savedData.certificateUrls) &&
        savedData.certificateUrls.length > 0
      ) {
        setCertPreviews(savedData.certificateUrls);
      }
    }
    hasRestored.current = true;
  }, [form, savedData]);

  // FIXED: Single consolidated auto-save effect (race condition fixed)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const sub = form.watch(value => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        patchStep3Data({
          ...value,
          certificateFiles: certFiles,
          certificateUrls: certPreviews,
        });
      }, 600);
    });
    return () => {
      sub.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, patchStep3Data, certFiles, certPreviews]);

  // ── Certificate handlers ───────────────────────────────────
  const handleCertFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Validate all files first
    for (const file of files) {
      const validation = validateFile(file, {
        maxSizeMB: 5,
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf',
        ],
      });
      if (!validation.valid) {
        toast.error(validation.error || 'ফাইল সাইজ বা টাইপ সঠিক নয়');
        return;
      }
    }

    setIsCompressing(true);
    try {
      // Process files: compress images, pass PDFs as-is
      const processed = await Promise.all(
        files.map(async file => {
          const processedFile = file.type.startsWith('image/')
            ? await compressImage(file, 0.85)
            : file;
          const preview = await fileToBase64(processedFile);
          return { file: processedFile, preview };
        })
      );

      setCertFiles(prev => [...prev, ...processed.map(p => p.file)]);
      setCertPreviews(prev => [...prev, ...processed.map(p => p.preview)]);
      toast.success(`✅ ${files.length} টি সনদ আপলোড হয়েছে`);
    } catch {
      toast.error('❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে');
    } finally {
      setIsCompressing(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeCert = (idx: number) => {
    setCertFiles(prev => prev.filter((_, i) => i !== idx));
    setCertPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit: SubmitHandler<FormValues> = data => {
    if (!data.designation) {
      markIncomplete(3);
      toast.error('⚠️ পদবী নির্বাচন করুন');
      return;
    }
    const hasEdu = data.education?.some(
      e => e.degree && e.institution && e.year
    );
    if (!hasEdu) {
      markIncomplete(3);
      toast.error('⚠️ কমপক্ষে একটি শিক্ষাগত যোগ্যতা যোগ করুন');
      return;
    }
    setStep3Data({
      ...data,
      certificateFiles: certFiles,
      certificateUrls: certPreviews,
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
                <div className="bg-white/90 dark:bg-zinc-900/90 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-violet-500/30">
                  <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-400">
                    ফাইল প্রসেসিং হচ্ছে...
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Designation & Employment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200/50">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                <Award className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-violet-800 dark:text-violet-300">
                পদবী ও কর্মসংস্থান
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-violet-50/30 dark:bg-violet-950/10 border border-violet-100/50">
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-violet-800 dark:text-violet-300 flex items-center gap-2">
                      পদবী নির্বাচন করুন <span className="text-red-500">*</span>
                      <HelpTooltip content="যে পদের জন্য আবেদন করছেন" />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={isLoadingDesignations}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800">
                          {isLoadingDesignations ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              লোড হচ্ছে...
                            </span>
                          ) : (
                            <SelectValue placeholder="সিলেক্ট করুন" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dbDesignations.length > 0
                          ? dbDesignations
                              .filter(d => d.is_active !== false)
                              .map(d => (
                                <SelectItem
                                  key={d.$id || d.designation_id}
                                  value={d.$id || d.designation_id}
                                >
                                  {d.label_bn}
                                </SelectItem>
                              ))
                          : Object.entries(DESIGNATION_LABELS).map(
                              ([v, l], i) => (
                                <SelectItem
                                  key={`designation-${v}-${i}`}
                                  value={v}
                                >
                                  {l}
                                </SelectItem>
                              )
                            )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-violet-800 dark:text-violet-300">
                      চাকরির ধরন <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800">
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">
                          স্থায়ী (Full-time)
                        </SelectItem>
                        <SelectItem value="contract">
                          চুক্তিভিত্তিক (Contractual)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Education */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200/50">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-violet-800 dark:text-violet-300">
                শিক্ষাগত যোগ্যতা
              </h3>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative p-5 rounded-2xl border border-violet-100/50 dark:border-violet-900/30 bg-white/60 dark:bg-zinc-800/40 shadow-sm"
                >
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute -top-3 -right-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-violet-500 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                      {index === 0 ? 'সর্বোচ্চ শিক্ষা' : `শিক্ষা ${index + 1}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-violet-800 dark:text-violet-300">
                            ডিগ্রী / পরীক্ষা{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                index === 0
                                  ? 'অনার্স (স্নাতক)'
                                  : 'মাস্টার্স / এম.এ'
                              }
                              className="bg-white/70 dark:bg-zinc-950/50 border-violet-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.year`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-violet-800 dark:text-violet-300">
                            পাসের সন <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="২০২৩"
                              className="bg-white/70 dark:bg-zinc-950/50 border-violet-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-violet-800 dark:text-violet-300">
                            শিক্ষাপ্রতিষ্ঠান{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <VoiceInputBn
                              placeholder={
                                index === 0
                                  ? 'ঢাকা বিশ্ববিদ্যালয়'
                                  : 'জামিয়া রাহমানিয়া'
                              }
                              className="bg-white/70 dark:bg-zinc-950/50 border-violet-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ degree: '', institution: '', year: '' })}
              className="w-full border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 hover:bg-violet-50 rounded-xl h-12 font-bold"
            >
              <Plus className="h-5 w-5 mr-2" /> নতুন শিক্ষাগত যোগ্যতা যোগ করুন
            </Button>
          </div>

          <Separator className="opacity-30" />

          {/* Certificates */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200/50">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/50">
                <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-bold text-cyan-800 dark:text-cyan-300">
                শিক্ষাগত সনদসমূহ (ঐচ্ছিক)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Show restored previews (with image thumbnails) */}
              {certPreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative p-3 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/20 flex items-center gap-3 shadow-sm group"
                >
                  {/* Thumbnail if it's an image */}
                  {preview.startsWith('data:image/') ? (
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-cyan-200">
                      <Image
                        src={preview}
                        alt={`Certificate ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center shrink-0">
                      <FileArchive className="h-6 w-6 text-cyan-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-cyan-800 dark:text-cyan-300 truncate">
                      {certFiles[idx]?.name ?? `সনদ ${idx + 1}`}
                    </p>
                    <p className="text-[10px] text-cyan-600/70">
                      {certFiles[idx]
                        ? `${(certFiles[idx].size / 1024).toFixed(1)} KB`
                        : '✓ সংরক্ষিত'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCert(idx)}
                    className="h-7 w-7 rounded-md bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Add button */}
              <button
                type="button"
                onClick={() => certRef.current?.click()}
                className="h-[74px] rounded-xl border-2 border-dashed border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all hover:bg-cyan-50/20 group"
              >
                <Plus className="h-5 w-5 text-cyan-400 group-hover:text-cyan-600" />
                <span className="text-sm font-bold text-cyan-500 group-hover:text-cyan-700">
                  সনদ যুক্ত করুন
                </span>
              </button>
              <input
                ref={certRef}
                type="file"
                multiple
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleCertFiles}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onPrev}
              className="text-zinc-500 hover:text-violet-600 rounded-xl px-6 h-12 font-bold"
            >
              ← ফিরে যান
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg rounded-xl font-bold px-8 h-12"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
