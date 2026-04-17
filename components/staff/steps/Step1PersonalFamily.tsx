'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Camera, X, User, Users } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

import {
  personalFamilySchema,
  type PersonalFamilyData,
  MARITAL_STATUS_LABELS,
  RELIGION_LABELS,
} from '@/validations/staff';
import { useStaffFormStore, useStep1Data } from '@/store/staffFormStore';
import { compressImage } from '@/lib/utils';
import { VoiceInputBn, VoiceInputEn } from '@/components/ui/voice-input';

interface StepProps {
  onNext: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export default function Step1PersonalFamily({ onNext }: StepProps) {
  const savedData = useStep1Data();
  const { setStep1Data, markIncomplete } = useStaffFormStore();

  // ── Photo state ────────────────────────────────────────────
  // Prefer persisted base64 so it survives reloads
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    (savedData as any).photoBase64 ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form ───────────────────────────────────────────────────
  const form = useForm<PersonalFamilyData>({
    resolver: zodResolver(personalFamilySchema) as any,
    defaultValues: {
      nameEn: savedData.nameEn ?? '',
      nameBn: savedData.nameBn ?? '',
      fatherNameBn: savedData.fatherNameBn ?? '',
      fatherNameEn: savedData.fatherNameEn ?? '',
      motherNameBn: savedData.motherNameBn ?? '',
      motherNameEn: savedData.motherNameEn ?? '',
      gender: savedData.gender ?? undefined,
      maritalStatus: savedData.maritalStatus ?? undefined,
      religion: savedData.religion ?? undefined,
      nationality: savedData.nationality ?? 'বাংলাদেশী',
    } as PersonalFamilyData,
  });

  // Restore on mount
  useEffect(() => {
    if (!savedData || !Object.keys(savedData).length) return;
    form.reset({
      nameEn: savedData.nameEn ?? '',
      nameBn: savedData.nameBn ?? '',
      fatherNameBn: savedData.fatherNameBn ?? '',
      fatherNameEn: savedData.fatherNameEn ?? '',
      motherNameBn: savedData.motherNameBn ?? '',
      motherNameEn: savedData.motherNameEn ?? '',
      gender: savedData.gender ?? undefined,
      maritalStatus: savedData.maritalStatus ?? undefined,
      religion: savedData.religion ?? undefined,
      nationality: savedData.nationality ?? 'বাংলাদেশী',
    } as PersonalFamilyData);
    // Restore photo from persisted base64
    const b64 = (savedData as any).photoBase64;
    if (b64 && b64.startsWith('data:')) setPhotoPreview(b64);
  }, []);

  // Auto-save text fields (debounced, 800ms)
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const sub = form.watch(value => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStep1Data({
          ...(useStaffFormStore.getState().step1Data as any),
          ...(value as Partial<PersonalFamilyData>),
        } as any);
      }, 800);
    });
    return () => {
      sub.unsubscribe();
      clearTimeout(timerRef.current);
    };
  }, [form, setStep1Data]);

  // ── Photo handlers ─────────────────────────────────────────
  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('ছবির সাইজ ৫ MB এর বেশি হবে না');
        return;
      }

      try {
        const compressed = await compressImage(file, 0.7);
        const base64 = await fileToBase64(compressed);

        setPhotoPreview(base64);
        setStep1Data({
          ...(useStaffFormStore.getState().step1Data as any),
          photoBase64: base64,
          photoUrl: base64,
          photoFile: compressed,
        } as any);
      } catch {
        toast.error('❌ ছবি প্রসেসিং এ সমস্যা হয়েছে');
      }
    },
    [setStep1Data]
  );

  const removePhoto = useCallback(() => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setStep1Data({
      ...(useStaffFormStore.getState().step1Data as any),
      photoBase64: undefined,
      photoUrl: undefined,
      photoFile: undefined,
    } as any);
  }, [setStep1Data]);

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit: SubmitHandler<PersonalFamilyData> = data => {
    if (!photoPreview) {
      markIncomplete(1);
      toast.error('⚠️ আবেদনকারীর ছবি আপলোড করুন');
      return;
    }
    const base64 = (useStaffFormStore.getState().step1Data as any).photoBase64;
    if (!base64) {
      toast.error('⚠️ ছবি ডেটা পাওয়া যায়নি, আবার আপলোড করুন');
      return;
    }
    setStep1Data({ ...data, photoBase64: base64, photoUrl: base64 } as any);
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
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-10"
        >
          {/* ── Photo upload ─────────────────────────────────── */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="h-32 w-32 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300 overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ring-4 ring-cyan-500/20">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-zinc-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all hover:scale-110"
              >
                <Camera className="h-5 w-5" />
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2">
                আবেদনকারীর ছবি <span className="text-cyan-500">*</span>
                <HelpTooltip content="সাম্প্রতিক পাসপোর্ট সাইজের রঙিন ছবি আপলোড করুন।" />
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                স্বচ্ছ ব্যাকগ্রাউন্ড বিশিষ্ট ছবি কাম্য
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* ── Personal Info ─────────────────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <User className="h-5 w-5" />
              <span>প্রাথমিক তথ্য</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control as any}
                name="nameBn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      পূর্ণ নাম (বাংলা) <span className="text-cyan-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="মোহাম্মদ আব্দুর রহিম"
                        className="bg-white/50 dark:bg-zinc-900/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="english-text">
                      Full Name (English){' '}
                      <span className="text-cyan-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <VoiceInputEn
                        placeholder="Mohammad Abdur Rahim"
                        className="bg-white/50 dark:bg-zinc-900/50 english-text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* ── Family Info ───────────────────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <Users className="h-5 w-5" />
              <span>পারিবারিক তথ্য</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control as any}
                name="fatherNameBn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      পিতার নাম (বাংলা) <span className="text-cyan-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="পিতার নাম"
                        className="bg-white/50 dark:bg-zinc-900/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="fatherNameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="english-text">
                      Father's Name (English){' '}
                      <span className="text-cyan-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <VoiceInputEn
                        placeholder="Father's name"
                        className="bg-white/50 dark:bg-zinc-900/50 english-text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="motherNameBn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      মাতার নাম (বাংলা) <span className="text-cyan-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="মাতার নাম"
                        className="bg-white/50 dark:bg-zinc-900/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="motherNameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="english-text">
                      Mother's Name (English){' '}
                      <span className="text-cyan-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <VoiceInputEn
                        placeholder="Mother's name"
                        className="bg-white/50 dark:bg-zinc-900/50 english-text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* ── Gender / Marital / Religion ───────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <FormField
              control={form.control as any}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    লিঙ্গ <span className="text-cyan-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">পুরুষ</SelectItem>
                      <SelectItem value="female">মহিলা</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    বৈবাহিক অবস্থা <span className="text-cyan-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(MARITAL_STATUS_LABELS).map(([v, l]) => (
                        <SelectItem key={v} value={v}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="religion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ধর্ম <span className="text-cyan-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(RELIGION_LABELS).map(([v, l]) => (
                        <SelectItem key={v} value={v}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[150px] shadow-lg rounded-xl font-bold"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
