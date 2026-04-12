"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Camera, X, User, Users } from "lucide-react";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { VoiceInputBn, VoiceInputEn } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { personalFamilySchema, type PersonalFamilyData, MARITAL_STATUS_LABELS, RELIGION_LABELS } from "@/validations/staff";
import { useStaffFormStore, useStep1Data } from "@/store/staffFormStore";

interface StepProps { onNext: () => void; }

export default function Step1PersonalFamily({ onNext }: StepProps) {
  const savedData = useStep1Data();
  const { setStep1Data, markIncomplete } = useStaffFormStore();

  const [photoUrl, setPhotoUrl] = useState<string | null>((savedData as any).photoBase64 ?? savedData.photoUrl ?? null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PersonalFamilyData>({
    resolver: zodResolver(personalFamilySchema) as any,
    defaultValues: {
      nameEn: savedData.nameEn ?? "", nameBn: savedData.nameBn ?? "", fatherNameBn: savedData.fatherNameBn ?? "", fatherNameEn: savedData.fatherNameEn ?? "",
      motherNameBn: savedData.motherNameBn ?? "", motherNameEn: savedData.motherNameEn ?? "", gender: savedData.gender ?? undefined,
      maritalStatus: savedData.maritalStatus ?? undefined, religion: savedData.religion ?? undefined, nationality: savedData.nationality ?? "বাংলাদেশী",
    } as PersonalFamilyData,
  });

  // Restore data on mount
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        nameEn: savedData.nameEn ?? "", nameBn: savedData.nameBn ?? "", fatherNameBn: savedData.fatherNameBn ?? "",
        fatherNameEn: savedData.fatherNameEn ?? "", motherNameBn: savedData.motherNameBn ?? "", motherNameEn: savedData.motherNameEn ?? "",
        gender: savedData.gender ?? undefined, maritalStatus: savedData.maritalStatus ?? undefined, religion: savedData.religion ?? undefined,
      } as PersonalFamilyData);
      if ((savedData as any).photoBase64) setPhotoUrl((savedData as any).photoBase64);
      else if (savedData.photoUrl) setPhotoUrl(savedData.photoUrl);
    }
  }, []);

  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value) => { setStep1Data(value as Partial<PersonalFamilyData>); });
    return () => subscription.unsubscribe();
  }, [form, setStep1Data]);

  // Cleanup ObjectURL on unmount
  useEffect(() => {
    return () => {
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }, []);

  const handlePhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setError("photoUrl" as any, { message: "ছবির সাইজ ৫ MB এর বেশি হবে না" });
      return;
    }

    // Cleanup old blob URL
    if (photoUrl && photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoUrl);
    }

    const blobUrl = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoUrl(blobUrl);
  }, [form, photoUrl]);

  const removePhoto = useCallback(() => {
    if (photoUrl && photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoFile(null);
    setPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [photoUrl]);

  const onSubmit: SubmitHandler<PersonalFamilyData> = async (data) => {
    if (!photoUrl) {
      markIncomplete(1);
      toast.error("⚠️ অনুগ্রহ করে আবেদনকারীর ছবি আপলোড করুন");
      return;
    }

    const result = personalFamilySchema.safeParse(data);
    if (!result.success) {
      markIncomplete(1);
      toast.error("⚠️ অনুগ্রহ করে নিচের তথ্যগুলো পূরণ করুন:\n" + result.error.issues.map((i) => i.message).join("\n"));
      return;
    }

    // Convert to base64 for storage
    let photoBase64: string | undefined;
    if (photoFile) {
      try {
        photoBase64 = await fileToBase64(photoFile);
      } catch (err) {
        toast.error("ছবি প্রসেসিং এ সমস্যা হয়েছে");
        return;
      }
    }

    setStep1Data({ ...data, photoUrl: photoUrl, photoBase64 } as any);
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="kalpurush-font">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-10">
          {/* Profile Photo */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
              <div className="h-32 w-32 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300 overflow-hidden border-4 border-white dark:border-zinc-800 shadow-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ring-4 ring-cyan-500/20">
                {photoUrl ? (
                  <Image src={photoUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <User className="h-12 w-12 text-zinc-400" />
                )}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all hover:scale-110 active:scale-95">
                <Camera className="h-5 w-5" />
              </button>
              {photoUrl && (
                <button type="button" onClick={removePhoto} className="absolute -top-2 -right-2 h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-all">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2">
                আবেদনকারীর ছবি <span className="text-cyan-500">*</span>
                <HelpTooltip content="আবেদনকারীর একটি সাম্প্রতিক রঙ্গিন ছবি (পাসপোর্ট সাইজ) আপলোড করুন।" />
              </h3>
              <p className="text-xs text-zinc-500 font-medium">স্বচ্ছ ও মার্জিত ব্যাকগ্রাউন্ড বিশিষ্ট ছবি কাম্য</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Info */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                <User className="h-5 w-5" />
                <span>প্রাথমিক তথ্য</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField<PersonalFamilyData> control={form.control as any} name="nameBn" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 dark:text-zinc-400">পূর্ণ নাম (বাংলা) <span className="text-cyan-500">*</span></FormLabel>
                    <FormControl><VoiceInputBn placeholder="যেমন: মোহাম্মদ আব্দুর রহিম" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField<PersonalFamilyData> control={form.control as any} name="nameEn" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 dark:text-zinc-400 english-text">Full Name (English) <span className="text-cyan-500">*</span></FormLabel>
                    <FormControl><VoiceInputEn placeholder="Example: Mohammad Abdur Rahim" className="bg-white/50 dark:bg-zinc-900/50 english-text" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <Separator className="md:col-span-2 opacity-50" />

            {/* Family Info */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
                <Users className="h-5 w-5" />
                <span>পারিবারিক তথ্য</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField<PersonalFamilyData> control={form.control as any} name="fatherNameBn" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 dark:text-zinc-400">পিতার নাম (বাংলা) <span className="text-cyan-500">*</span></FormLabel>
                    <FormControl><VoiceInputBn placeholder="পিতার নাম লিখুন" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField<PersonalFamilyData> control={form.control as any} name="fatherNameEn" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 dark:text-zinc-400 english-text">Father's Name (English) <span className="text-cyan-500">*</span></FormLabel>
                    <FormControl><VoiceInputEn placeholder="Father's name" className="bg-white/50 dark:bg-zinc-900/50 english-text" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField<PersonalFamilyData> control={form.control as any} name="motherNameBn" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 dark:text-zinc-400">মাতার নাম (বাংলা) <span className="text-cyan-500">*</span></FormLabel>
                    <FormControl><VoiceInputBn placeholder="মাতার নাম লিখুন" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField<PersonalFamilyData> control={form.control as any} name="motherNameEn" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-600 dark:text-zinc-400 english-text">Mother's Name (English) <span className="text-cyan-500">*</span></FormLabel>
                    <FormControl><VoiceInputEn placeholder="Mother's name" className="bg-white/50 dark:bg-zinc-900/50 english-text" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <Separator className="md:col-span-2 opacity-50" />

            {/* Other Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:col-span-2">
              <FormField<PersonalFamilyData> control={form.control as any} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 dark:text-zinc-400">লিঙ্গ <span className="text-cyan-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="male">পুরুষ</SelectItem><SelectItem value="female">মহিলা</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField<PersonalFamilyData> control={form.control as any} name="maritalStatus" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 dark:text-zinc-400">বৈবাহিক অবস্থা <span className="text-cyan-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger></FormControl>
                    <SelectContent>{Object.entries(MARITAL_STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField<PersonalFamilyData> control={form.control as any} name="religion" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-600 dark:text-zinc-400">ধর্ম <span className="text-cyan-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder="নির্বাচন করুন" /></SelectTrigger></FormControl>
                    <SelectContent>{Object.entries(RELIGION_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[150px] shadow-lg shadow-cyan-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold">
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
