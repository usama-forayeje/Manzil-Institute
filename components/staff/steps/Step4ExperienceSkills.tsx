"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Briefcase,
  FileUp,
  FileBadge,
  Loader2,
  Globe,
  CheckCircle2,
  X,
  FileArchive,
  FileText,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, compressImage } from "@/lib/utils";
import { 
  FaFacebook, 
  FaInstagram, 
  FaXTwitter, 
  FaLinkedinIn, 
  FaGlobe 
} from "react-icons/fa6";
import { useStaffFormStore, useStep4Data, useStep3Data } from "@/store/staffFormStore";
import { HelpTooltip } from "@/components/ui/HelpTooltip";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VoiceInputBn } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import { TEACHER_DESIGNATIONS, NON_TEACHER_DESIGNATIONS } from "@/validations/staff";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

// Reusable Section Header Component
function SectionHeader({ 
  icon: Icon, 
  title, 
  subtitle,
  color = "cyan"
}: { 
  icon: any; 
  title: string; 
  subtitle?: string;
  color?: "cyan" | "amber" | "violet" | "rose";
}) {
  const colorMap = {
    cyan: "bg-cyan-500 text-white",
    amber: "bg-amber-500 text-white",
    violet: "bg-violet-500 text-white",
    rose: "bg-rose-500 text-white",
  };
  
  const subtitleColorMap = {
    cyan: "text-cyan-600 dark:text-cyan-400",
    amber: "text-amber-600 dark:text-amber-400",
    violet: "text-violet-600 dark:text-violet-400",
    rose: "text-rose-600 dark:text-rose-400",
  };

  return (
    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-gradient-to-r from-zinc-50 to-zinc-100/50 dark:from-zinc-800/30 dark:to-zinc-800/20 border-l-4 border-current">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shadow-lg", colorMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className={cn("font-bold text-base", subtitleColorMap[color])}>{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
    </div>
  );
}

// Type for social links
interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface Step4FormData {
  previousWorkplace: string;
  previousWorkDuration: string;
  totalExperienceYears: number;
  isHafiz: boolean;
  specialSkills: string;
  socialLinks: SocialLinks;
}

export default function Step4ExperienceSkills({ onNext, onPrev }: StepProps) {
  const savedData = useStep4Data();
  const { setStep4Data } = useStaffFormStore();
  
  // File states
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [experienceLetterFile, setExperienceLetterFile] = useState<File | null>(null);
  const [expLetterPreview, setExpLetterPreview] = useState<string | null>(null);
  const [tazkiyahFile, setTazkiyahFile] = useState<File | null>(null);
  const [tazkiyahPreview, setTazkiyahPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const cvRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);
  const tazkiyahRef = useRef<HTMLInputElement>(null);

  const form = useForm<Step4FormData>({
    defaultValues: {
      previousWorkplace: savedData?.previousWorkplace ?? "",
      previousWorkDuration: savedData?.previousWorkDuration ?? "",
      totalExperienceYears: savedData?.totalExperienceYears ?? 0,
      isHafiz: savedData?.isHafiz ?? false,
      specialSkills: savedData?.specialSkills ?? "",
      socialLinks: savedData?.socialLinks ?? { 
        facebook: "", 
        instagram: "", 
        twitter: "", 
        linkedin: "", 
        website: "" 
      },
    },
  });

  // Restore form data on mount
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        previousWorkplace: savedData.previousWorkplace ?? "",
        previousWorkDuration: savedData.previousWorkDuration ?? "",
        totalExperienceYears: savedData.totalExperienceYears ?? 0,
        isHafiz: savedData.isHafiz ?? false,
        specialSkills: savedData.specialSkills ?? "",
        socialLinks: savedData.socialLinks ?? { 
          facebook: "", 
          instagram: "", 
          twitter: "", 
          linkedin: "", 
          website: "" 
        },
      });
      if (savedData.cvFile) setCvFile(savedData.cvFile as File);
      if (savedData.experienceLetterFile) setExperienceLetterFile(savedData.experienceLetterFile as File);
      if (savedData.tazkiyahFile) setTazkiyahFile(savedData.tazkiyahFile as File);
      // Restore previews from base64 URLs
      if ((savedData as any).cvUrl) setCvPreview((savedData as any).cvUrl);
      if ((savedData as any).experienceLetterUrl) setExpLetterPreview((savedData as any).experienceLetterUrl);
      if ((savedData as any).tazkiyahUrl) setTazkiyahPreview((savedData as any).tazkiyahUrl);
    }
  }, []);

  // Auto-save form data with debounce
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStep4Data({ 
          ...value, 
          cvUrl: cvPreview, 
          experienceLetterUrl: expLetterPreview,
          tazkiyahUrl: tazkiyahPreview
        } as any);
      }, 500);
    });
    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, setStep4Data, cvPreview, expLetterPreview, tazkiyahPreview]);

  const step3Data = useStep3Data();
  const designation = step3Data?.designation ?? (savedData as any)?.designation ?? "";
  const isTeacher = TEACHER_DESIGNATIONS.includes(designation);
  const isStaff = NON_TEACHER_DESIGNATIONS.includes(designation);

  const handleCVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 0.85); // 85% quality compression
      setCvFile(compressed);
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => setCvPreview(reader.result as string);
      reader.readAsDataURL(compressed);
      toast.success("✅ CV আপলোড সম্পন্ন!");
    } catch {
      toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleExpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 0.85); // 85% quality compression
      setExperienceLetterFile(compressed);
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => setExpLetterPreview(reader.result as string);
      reader.readAsDataURL(compressed);
      toast.success("✅ অভিজ্ঞতা সনদ আপলোড সম্পন্ন!");
    } catch {
      toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleTazkiyahChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 0.85); // 85% quality compression
      setTazkiyahFile(compressed);
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => setTazkiyahPreview(reader.result as string);
      reader.readAsDataURL(compressed);
      toast.success("✅ তাজকিয়া সনদ আপলোড সম্পন্ন!");
    } catch {
      toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
    } finally {
      setIsCompressing(false);
    }
  };

  const onSubmit: SubmitHandler<Step4FormData> = async (data) => {
    try {
      let cvBase64: string | undefined;
      let expLetterBase64: string | undefined;
      let tazkiyahBase64: string | undefined;

      if (cvFile) {
        cvBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(cvFile);
        });
      }
      if (experienceLetterFile) {
        expLetterBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(experienceLetterFile);
        });
      }
      if (tazkiyahFile) {
        tazkiyahBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(tazkiyahFile);
        });
      }

      setStep4Data({
        ...data,
        cvFile: cvFile ?? undefined,
        experienceLetterFile: experienceLetterFile ?? undefined,
        tazkiyahFile: tazkiyahFile ?? undefined,
        cvUrl: cvPreview,
        experienceLetterUrl: expLetterPreview,
        tazkiyahUrl: tazkiyahPreview,
      } as any);
      onNext();
    } catch (err) {
      console.error(err);
      toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
    }
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
          
          {/* Loading Overlay */}
          <AnimatePresence>
            {isCompressing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
              >
                <div className="bg-white/90 dark:bg-zinc-900/90 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-cyan-500/30">
                  <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
                  <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400">ফাইল প্রসেসিং হচ্ছে...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Professional Experience */}
          <div className="space-y-6">
            <SectionHeader 
              icon={Briefcase} 
              title="পেশাদার অভিজ্ঞতা" 
              subtitle="আপনার কাজের অভিজ্ঞতা"
              color="amber"
            />
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/30 to-orange-50/20 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-100/50 dark:border-amber-900/30 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="previousWorkplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800 dark:text-amber-300">সর্বশেষ কর্মস্থল</FormLabel>
                      <FormControl>
                        <VoiceInputBn 
                          placeholder="প্রতিষ্ঠানের নাম" 
                          className="h-12 bg-white/70 dark:bg-zinc-950/50 border-amber-200 dark:border-amber-800" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="previousWorkDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800 dark:text-amber-300">কর্মকাল</FormLabel>
                      <FormControl>
                        <VoiceInputBn 
                          placeholder="যেমন: ২ বছর ৬ মাস" 
                          className="h-12 bg-white/70 dark:bg-zinc-950/50 border-amber-200 dark:border-amber-800" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalExperienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-800 dark:text-amber-300">মোট অভিজ্ঞতার বছর</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9০-৯]*"
                          min="0"
                          max="50"
                          placeholder="বছর সংখ্যা লিখুন"
                          className="h-12 bg-white/70 dark:bg-zinc-950/50 border-amber-200 dark:border-amber-800 text-lg font-bold"
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const banglaToEng: Record<string, string> = {
                              '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
                              '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
                            };
                            // Convert Bengali to English digits
                            const engVal = val.replace(/[০-৯]/g, d => banglaToEng[d] || d);
                            // Pass as string so validation transform can handle it
                            field.onChange(engVal);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Special Skills */}
          <div className="space-y-6">
            <SectionHeader 
              icon={Star} 
              title="বিশেষ দক্ষতা" 
              subtitle="আপনার অনন্য দক্ষতাগুলো"
              color="violet"
            />
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-50/30 to-purple-50/20 dark:from-violet-950/20 dark:to-purple-950/10 border border-violet-100/50 dark:border-violet-900/30 space-y-5">
              <FormField
                control={form.control}
                name="specialSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-violet-800 dark:text-violet-300 flex items-center gap-2">
                      বিশেষ দক্ষতা সমূহ
                      {isStaff && (
                        <span className="text-xs bg-violet-100 dark:bg-violet-900/50 px-2 py-0.5 rounded-full">
                          (যেমন: হাতের কাজ, বাগান করা, ড্রাইভিং)
                        </span>
                      )}
                      <HelpTooltip content="আপনার অর্জিত বিশেষ কোনো দক্ষতা থাকলে এখানে বিস্তারিত লিখুন।" />
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn 
                        component={Textarea}
                        placeholder="আপনার দক্ষতাগুলো লিখুন... যেমন: কম্পিউটার অপারেশন, ইসলামিক এডুকেশন, ক্যালিগ্রাফি, ইত্যাদি" 
                        className="min-h-[120px] bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hafiz Question - for all staff */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20"
              >
                  <FormField
                    control={form.control}
                    name="isHafiz"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-4 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                            className="h-6 w-6 border-violet-500 data-[state=checked]:bg-violet-500"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-violet-800 dark:text-violet-300 font-bold text-base cursor-pointer">
                            🎓 আপনি কি হাফেজ-এ-কুরআন?
                          </FormLabel>
                          <p className="text-xs text-violet-600/70 dark:text-violet-400/70">
                            হাফেজ হলে এই অপশনটি সিলেক্ট করুন
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Documents */}
          <div className="space-y-6">
            <SectionHeader 
              icon={FileText} 
              title="প্রয়োজনীয় কাগজপত্র" 
              subtitle="CV ও অভিজ্ঞতা সনদ"
              color="rose"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CV Upload */}
              <div className="space-y-3">
                <FormLabel className="text-rose-800 dark:text-rose-300 flex items-center gap-2 font-semibold">
                  <FileText className="h-4 w-4" />
                  জীবনবৃত্তান্ত / CV
                  <span className="text-red-500">*</span>
                  <HelpTooltip content="আপনার একটি পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) আপলোড করুন। PDF বা Image উভয়ই গ্রহণযোগ্য।" />
                </FormLabel>
                <div 
                  onClick={() => cvRef.current?.click()}
                  className={cn(
                    "relative group h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer",
                    cvFile 
                      ? "border-green-500 bg-green-50/30 dark:bg-green-950/20" 
                      : "border-rose-200 dark:border-rose-800 hover:border-rose-400 bg-white/50 dark:bg-zinc-950/50"
                  )}
                >
                  {cvFile ? (
                    <div className="flex flex-col items-center gap-2 text-center px-4">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                      <span className="text-sm font-bold text-green-600 truncate max-w-full">{cvFile.name}</span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> মুছে ফেলুন
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                      <div className="h-14 w-14 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                        <FileUp className="h-7 w-7 text-rose-500" />
                      </div>
                      <span className="text-sm font-bold text-rose-600">CV আপলোড করুন</span>
                      <span className="text-xs text-rose-400">PDF / Image</span>
                    </div>
                  )}
                  <input ref={cvRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleCVChange} />
                </div>
              </div>

              {/* Experience Letter Upload */}
              <div className="space-y-3">
                <FormLabel className="text-rose-800 dark:text-rose-300 flex items-center gap-2 font-semibold">
                  <FileBadge className="h-4 w-4" />
                  অভিজ্ঞতা সনদ / চারিত্রিক সনদ
                  <HelpTooltip content="পূর্ববর্তী প্রতিষ্ঠানের অভিজ্ঞতা সনদ অথবা চারিত্র্যিক সনদপত্র আপলোড করুন।" />
                </FormLabel>
                <div 
                  onClick={() => expRef.current?.click()}
                  className={cn(
                    "relative group h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer",
                    experienceLetterFile 
                      ? "border-green-500 bg-green-50/30 dark:bg-green-950/20" 
                      : "border-rose-200 dark:border-rose-800 hover:border-rose-400 bg-white/50 dark:bg-zinc-950/50"
                  )}
                >
                  {experienceLetterFile ? (
                    <div className="flex flex-col items-center gap-2 text-center px-4">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                      <span className="text-sm font-bold text-green-600 truncate max-w-full">{experienceLetterFile.name}</span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setExperienceLetterFile(null); }}
                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                      >
                        <X className="h-3 w-3" /> মুছে ফেলুন
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                      <div className="h-14 w-14 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                        <FileBadge className="h-7 w-7 text-rose-500" />
                      </div>
                      <span className="text-sm font-bold text-rose-600">সনদপত্র আপলোড করুন</span>
                      <span className="text-xs text-rose-400">PDF / Image</span>
                    </div>
                  )}
                  <input ref={expRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleExpChange} />
                </div>
              </div>

              {/* Tazkiyah for Teachers */}
              {isTeacher && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:col-span-2 space-y-3"
                >
                  <FormLabel className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-semibold">
                    <FileArchive className="h-4 w-4" />
                    তাজকিয়া সনদ (তাফসীর/হিফজ হলে)
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">ঐচ্ছিক</span>
                    <HelpTooltip content="যদি আপনি তাফসীর বা হিফজ হয়ে থাকেন, তাহলে সংশ্লিষ্ট তাজকিয়া সনদ আপলোড করুন।" />
                  </FormLabel>
                  <div 
                    onClick={() => tazkiyahRef.current?.click()}
                    className={cn(
                      "relative group h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer",
                      tazkiyahFile 
                        ? "border-green-500 bg-green-50/30 dark:bg-green-950/20" 
                        : "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 bg-white/50 dark:bg-zinc-950/50"
                    )}
                  >
                    {tazkiyahFile ? (
                      <div className="flex flex-col items-center gap-2 text-center px-4">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                        <span className="text-sm font-bold text-green-600 truncate max-w-full">{tazkiyahFile.name}</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setTazkiyahFile(null); }}
                          className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                        >
                          <X className="h-3 w-3" /> মুছে ফেলুন
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                        <div className="h-14 w-14 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                          <FileArchive className="h-7 w-7 text-emerald-500" />
                        </div>
                        <span className="text-sm font-bold text-emerald-600">তাজকিয়া সনদ আপলোড করুন</span>
                        <span className="text-xs text-emerald-400">PDF / Image</span>
                      </div>
                    )}
                    <input ref={tazkiyahRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleTazkiyahChange} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Social Media */}
          <div className="space-y-6">
            <SectionHeader 
              icon={Globe} 
              title="সামাজিক যোগাযোগ মাধ্যম" 
              subtitle="অনলাইন প্রোফাইল লিংক (ঐচ্ছিক)"
              color="cyan"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-gradient-to-br from-cyan-50/30 to-blue-50/20 dark:from-cyan-950/20 dark:to-blue-950/10 border border-cyan-100/50 dark:border-cyan-900/30">
              <FormField control={form.control} name="socialLinks.facebook" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <FaFacebook className="h-4 w-4 text-[#1877F2]" /> ফেজবুক
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="facebook.com/username" 
                      className="h-11 bg-white/70 dark:bg-zinc-950/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="socialLinks.linkedin" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <FaLinkedinIn className="h-4 w-4 text-[#0A66C2]" /> লিঙ্কডইন
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="linkedin.com/in/username" 
                      className="h-11 bg-white/70 dark:bg-zinc-950/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <FaXTwitter className="h-4 w-4" /> X (Twitter)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="x.com/username" 
                      className="h-11 bg-white/70 dark:bg-zinc-950/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <FaInstagram className="h-4 w-4 text-[#E4405F]" /> ইনস্টাগ্রাম
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="instagram.com/username" 
                      className="h-11 bg-white/70 dark:bg-zinc-950/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="socialLinks.website" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <FaGlobe className="h-4 w-4 text-cyan-500" /> পোর্টফোলিও / ওয়েবসাইট
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://yourwebsite.com" 
                      className="h-11 bg-white/70 dark:bg-zinc-950/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onPrev} 
              className="text-zinc-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 rounded-xl px-6 h-12 font-bold transition-all"
            >
              ← ফিরে যান
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold px-8 h-12"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
