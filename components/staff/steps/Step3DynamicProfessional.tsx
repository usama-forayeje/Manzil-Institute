"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Award, 
  FileUp,
  X,
  FileArchive,
  FileBadge,
  Loader2,
  Globe,
  Link,
  MessageCircle,
  Share2
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
import { useStaffFormStore, useStep3Data } from "@/store/staffFormStore";
import { HelpTooltip } from "@/components/ui/HelpTooltip";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input }  from "@/components/ui/input";
import { VoiceInputBn } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  professionalEducationSchema,
  type ProfessionalEducationData,
  DESIGNATION_LABELS,
  TEACHER_DESIGNATIONS,
} from "@/validations/staff";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3DynamicProfessional({ onNext, onPrev }: StepProps) {
  const savedData = useStep3Data();
  const { setStep3Data, setSubmitting, markIncomplete } = useStaffFormStore();

  // File states
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [experienceLetterFile, setExperienceLetterFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const cvRef = useRef<HTMLInputElement>(null);
  const certRef = useRef<HTMLInputElement>(null);
  const expRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfessionalEducationData>({
    resolver: zodResolver(professionalEducationSchema) as any,
    defaultValues: {
      designation:          savedData.designation      ?? "",
      designationCustom:    savedData.designationCustom ?? "",
      department:           savedData.department       ?? "",
      employmentType:       savedData.employmentType   ?? "permanent",
      education:            savedData.education        ?? [{ degree: "", institution: "", year: "" }],
      socialLinks:          savedData.socialLinks      ?? { facebook: "", instagram: "", twitter: "", linkedin: "", website: "" },
      totalExperienceYears: savedData.totalExperienceYears ?? 0,
      isHafiz:              savedData.isHafiz          ?? false,
      specialSkills:        savedData.specialSkills    ?? "",
      tazkiyahUrl:            savedData.tazkiyahUrl            ?? "",
    } as ProfessionalEducationData,
  });

  // Restore form data on mount (when navigating back to this step)
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        designation:          savedData.designation      ?? "",
        designationCustom:    savedData.designationCustom ?? "",
        department:           savedData.department       ?? "",
        employmentType:       savedData.employmentType   ?? "permanent",
        education:            savedData.education        ?? [{ degree: "", institution: "", year: "" }],
        socialLinks:          savedData.socialLinks      ?? { facebook: "", instagram: "", twitter: "", linkedin: "", website: "" },
        totalExperienceYears: savedData.totalExperienceYears ?? 0,
        isHafiz:              savedData.isHafiz          ?? false,
        specialSkills:        savedData.specialSkills    ?? "",
        tazkiyahUrl:            savedData.tazkiyahUrl            ?? "",
      } as ProfessionalEducationData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save form data on every change (real-time draft)
  useEffect(() => {
    const subscription = form.watch((value) => {
      setStep3Data(value as Partial<ProfessionalEducationData>);
    });
    return () => subscription.unsubscribe();
  }, [form, setStep3Data]);

  // Restore form data on mount (when navigating back to this step)
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        designation:          savedData.designation      ?? "",
        designationCustom:    savedData.designationCustom ?? "",
        department:           savedData.department       ?? "",
        employmentType:       savedData.employmentType   ?? "permanent",
        education:            savedData.education        ?? [{ degree: "", institution: "", year: "" }],
        socialLinks:          savedData.socialLinks      ?? { facebook: "", instagram: "", twitter: "", linkedin: "", website: "" },
        totalExperienceYears: savedData.totalExperienceYears ?? 0,
        isHafiz:              savedData.isHafiz          ?? false,
        specialSkills:        savedData.specialSkills    ?? "",
        tazkiyahUrl:            savedData.tazkiyahUrl            ?? "",
      } as ProfessionalEducationData);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save form data on every change (real-time draft)
  useEffect(() => {
    const subscription = form.watch((value) => {
      setStep3Data(value as Partial<ProfessionalEducationData>);
    });
    return () => subscription.unsubscribe();
  }, [form, setStep3Data]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education"
  });

  const designation = form.watch("designation");
  const isTeacher = TEACHER_DESIGNATIONS.includes(designation);
  const isStaff = ["staff", "guard", "caretaker"].includes(designation);

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    try {
      setIsCompressing(true);
      const compressedFiles = await Promise.all(
        files.map(f => compressImage(f, 0.85))
      );
      setCertificateFiles(prev => [...prev, ...compressedFiles]);
    } catch (err) {
      console.error("Multiple compression failed:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCVChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 0.85);
      setCvFile(compressed);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleExpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsCompressing(true);
      const compressed = await compressImage(file, 0.85);
      setExperienceLetterFile(compressed);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificateFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<ProfessionalEducationData> = (data) => {
    // First check if designation is selected
    if (!data.designation) {
      markIncomplete(3);
      toast.error("⚠️ অনুগ্রহ করে পদবী নির্বাচন করুন");
      return;
    }
    
    const result = professionalEducationSchema.safeParse({
      ...data,
      cvFile: cvFile ?? undefined,
      certificateFiles: certificateFiles.length > 0 ? certificateFiles : undefined,
      experienceLetterFile: experienceLetterFile ?? undefined,
    });
    if (!result.success) {
      markIncomplete(3);
      const missingFields = result.error.issues.map((issue: any) => issue.message);
      toast.error("⚠️ অনুগ্রহ করে নিচের তথ্যগুলো পূরণ করুন:\n" + missingFields.join("\n"));
      return;
    }
    setSubmitting(true);
    setStep3Data({
      ...data,
      cvFile: cvFile ?? undefined,
      certificateFiles: certificateFiles.length > 0 ? certificateFiles : undefined,
      experienceLetterFile: experienceLetterFile ?? undefined,
    });
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
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-10">
          
          {/* Section: Role Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <Briefcase className="h-5 w-5" />
              <span>পদবী ও কর্মসংস্থান (Role & Employment)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 shadow-xl backdrop-blur-md">
              <FormField<ProfessionalEducationData> control={form.control as any} name="designation" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    আপনার পদবী নির্বাচন করুন <span className="text-cyan-500">*</span>
                    <HelpTooltip content="আপনি যে পদের জন্য আবেদন করছেন তা সিলেক্ট করুন। শিক্ষক হলে 'Teacher' এবং অন্যান্য হলে সংশ্লিষ্ট পদটি বেছে নিন।" />
                  </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl><SelectTrigger className="h-12 bg-white/50 dark:bg-zinc-950/50"><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {Object.entries(DESIGNATION_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField<ProfessionalEducationData>
              control={form.control as any}
              name="employmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>চাকরির ধরন <span className="text-cyan-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl><SelectTrigger className="h-12 bg-white/50 dark:bg-zinc-950/50"><SelectValue placeholder="সিলেক্ট করুন" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="permanent">স্থায়ী (Full-time)</SelectItem>
                      <SelectItem value="contract">চুক্তিভিত্তিক (Contractual)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {designation && (
              <motion.div
                key={designation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <Separator className="opacity-30" />

                {/* Loading Overlay for Compression */}
                {isCompressing && (
                  <div className="fixed inset-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 dark:bg-zinc-900/90 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-cyan-500/30">
                      <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                      <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400">ফাইল প্রসেসিং হচ্ছে...</span>
                    </div>
                  </div>
                )}

                {/* Section: Dynamic Education */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
                      <GraduationCap className="h-5 w-5" />
                      <span>শিক্ষাগত যোগ্যতা (Education)</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => append({ degree: "", institution: "", year: "" })}
                      className="border-cyan-500/50 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 rounded-xl flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>যোগ করুন</span>
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {fields.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 shadow-lg backdrop-blur-md transition-all hover:shadow-xl hover:bg-white/50 dark:hover:bg-zinc-900/50"
                      >
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute -top-3 -right-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name={`education.${index}.degree`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-zinc-700 dark:text-zinc-300">শিক্ষাগত যোগ্যতা / পরীক্ষার নাম <span className="text-cyan-500">*</span></FormLabel>
                                <FormControl>
                                  <VoiceInputBn placeholder="যেমন: অনার্স / কামিল / মাস্টার্স" className="h-11 bg-white/50 dark:bg-zinc-950/50 border-white/10" {...field} />
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
                                <FormLabel className="text-zinc-700 dark:text-zinc-300">পাসের সন (Passing Year) <span className="text-cyan-500">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="২০২৩" className="h-11 bg-white/50 dark:bg-zinc-950/50 border-white/10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`education.${index}.institution`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="text-zinc-700 dark:text-zinc-300">শিক্ষাপ্রতিষ্ঠানের নাম (Madrasha/School/Uni) <span className="text-cyan-500">*</span></FormLabel>
                                <FormControl>
                                  <VoiceInputBn placeholder="যেমন: জামিয়া রাহমানিয়া আরাবিয়া / ঢাকা বিশ্ববিদ্যালয়" className="h-11 bg-white/50 dark:bg-zinc-950/50 border-white/10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {isTeacher && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl border border-cyan-100 dark:border-cyan-900 bg-cyan-50/20">
                      <FormField<ProfessionalEducationData> control={form.control as any} name="isHafiz" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-cyan-500" /></FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-cyan-800 dark:text-cyan-300 font-bold">আপনি কি হাফেজ-এ-কুরআন?</FormLabel>
                          </div>
                        </FormItem>
                      )} />
                    </motion.div>
                  )}
                </div>


                <Separator className="opacity-30" />

                {/* Section: Documents */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
                    <FileText className="h-5 w-5" />
                    <span>প্রয়োজনীয় কাগজপত্র (Required Documents)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <FormLabel className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                        জীবনবৃত্তান্ত / CV (PDF/Image)
                        <HelpTooltip content="আপনার একটি পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) আপলোড করুন।" />
                      </FormLabel>
                      <div className={cn(
                        "relative group h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-white/30 dark:bg-zinc-950/20",
                        cvFile ? "border-cyan-500 bg-cyan-50/10" : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400"
                      )}>
                        {cvFile ? (
                          <div className="flex flex-col items-center gap-1 w-full px-4 text-center">
                            <CheckCircle2 className="h-8 w-8 text-cyan-500" />
                            <span className="text-xs font-medium truncate max-w-full text-zinc-600 dark:text-zinc-300">{cvFile.name}</span>
                            <button type="button" onClick={() => setCvFile(null)} className="mt-1 text-[10px] font-bold text-red-500 hover:underline">মুছে ফেলুন</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => cvRef.current?.click()} className="flex flex-col items-center gap-2">
                            <FileUp className="h-6 w-6 text-zinc-400 group-hover:text-cyan-500 transition-colors" />
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-cyan-600">CV আপলোড করুন</span>
                          </button>
                        )}
                        <input ref={cvRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleCVChange} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <FormLabel className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                        অভিজ্ঞতা সনদ / চারিত্রিক সনদ
                        <HelpTooltip content="পূর্ববর্তী প্রতিষ্ঠানের অভিজ্ঞতা সনদ অথবা চারিত্র্যিক সনদপত্র আপলোড করুন।" />
                      </FormLabel>
                      <div className={cn(
                        "relative group h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-white/30 dark:bg-zinc-950/20",
                        experienceLetterFile ? "border-cyan-500 bg-cyan-50/10" : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400"
                      )}>
                        {experienceLetterFile ? (
                          <div className="flex flex-col items-center gap-1 w-full px-4 text-center">
                            <CheckCircle2 className="h-8 w-8 text-cyan-500" />
                            <span className="text-xs font-medium truncate max-w-full text-zinc-600 dark:text-zinc-300">{experienceLetterFile.name}</span>
                            <button type="button" onClick={() => setExperienceLetterFile(null)} className="mt-1 text-[10px] font-bold text-red-500 hover:underline">মুছে ফেলুন</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => expRef.current?.click()} className="flex flex-col items-center gap-2">
                            <FileBadge className="h-6 w-6 text-zinc-400 group-hover:text-cyan-500 transition-colors" />
                            <span className="text-xs font-bold text-zinc-500 group-hover:text-cyan-600">সনদপত্র আপলোড করুন</span>
                          </button>
                        )}
                        <input ref={expRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleExpChange} />
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <FormLabel className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                        শিক্ষাগত যোগ্যতার সনদসমূহ
                        <HelpTooltip content="আপনার সকল শিক্ষাগত যোগ্যতার সনদপত্র এখানে যোগ করুন।" />
                      </FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificateFiles.map((file, idx) => (
                          <div key={idx} className="relative p-3 rounded-xl border border-cyan-100 dark:border-cyan-900 bg-cyan-50/10 flex items-center gap-3">
                            <FileArchive className="h-6 w-6 text-cyan-500 shrink-0" />
                            <span className="text-[10px] font-medium truncate flex-1 text-zinc-600 dark:text-zinc-300">{file.name}</span>
                            <button type="button" onClick={() => removeCertificate(idx)} className="h-6 w-6 rounded-md bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200"><X className="h-3 w-3" /></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => certRef.current?.click()} className="h-[50px] rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50 group">
                          <Plus className="h-4 w-4 text-zinc-400 group-hover:text-cyan-500" />
                          <span className="text-xs font-bold text-zinc-500 group-hover:text-cyan-600">নতুন সনদ যুক্ত করুন</span>
                        </button>
                        <input ref={certRef} type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleMultipleFiles} />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="opacity-30" />

                {/* Section: Experience & Skills */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
                    <Award className="h-5 w-5" />
                    <span>পূর্ববর্তী অভিজ্ঞতা ও দক্ষতা (Experience)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField<ProfessionalEducationData> control={form.control as any} name="previousWorkplace" render={({ field }) => (
                      <FormItem>
                        <FormLabel>সর্বশেষ কর্মস্থল (যদি থাকে)</FormLabel>
                        <FormControl><VoiceInputBn placeholder="প্রতিষ্ঠানের নাম" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField<ProfessionalEducationData> control={form.control as any} name="totalExperienceYears" render={({ field }) => (
                      <FormItem>
                        <FormLabel>মোট অভিজ্ঞতার বছর</FormLabel>
                        <FormControl><Input type="number" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField<ProfessionalEducationData> control={form.control as any} name="specialSkills" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          বিশেষ দক্ষতা {isStaff && "(যেমন: হাতের কাজ, বাগান করা, ড্রাইভিং)"}
                          <HelpTooltip content="আপনার অর্জিত বিশেষ কোনো দক্ষতা থাকলে এখানে বিস্তারিত লিখুন।" />
                        </FormLabel>
                        <FormControl><VoiceInputBn component={Textarea} placeholder="আপনার দক্ষতাগুলো লিখুন..." className="bg-white/50 dark:bg-zinc-950/50 min-h-[100px]" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>

                <Separator className="opacity-30" />

                {/* Section: Social Media & Online Presence */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
                    <Globe className="h-5 w-5" />
                    <span>সামাজিক যোগাযোগ মাধ্যম ও অনলাইন প্রোফাইল (Online Presence)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 shadow-xl backdrop-blur-md">
                    <FormField control={form.control} name="socialLinks.facebook" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <FaFacebook className="h-4 w-4 text-[#1877F2]" /> ফেজবুক লিংক (Facebook)
                        </FormLabel>
                        <FormControl><Input placeholder="https://facebook.com/username" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="socialLinks.linkedin" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <FaLinkedinIn className="h-4 w-4 text-[#0A66C2]" /> লিঙ্কডইন লিংক (LinkedIn)
                        </FormLabel>
                        <FormControl><Input placeholder="https://linkedin.com/in/username" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <FaXTwitter className="h-4 w-4 text-black dark:text-white" /> X (Twitter) লিংক
                        </FormLabel>
                        <FormControl><Input placeholder="https://x.com/username" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <FaInstagram className="h-4 w-4 text-[#E4405F]" /> ইনস্টাগ্রাম লিংক (Instagram)
                        </FormLabel>
                        <FormControl><Input placeholder="https://instagram.com/username" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="socialLinks.website" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <FaGlobe className="h-4 w-4 text-cyan-500" /> ব্যক্তিগত ওয়েবসাইট (Portfolio/Website)
                        </FormLabel>
                        <FormControl><Input placeholder="https://yourwebsite.com" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={onPrev} className="text-zinc-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl px-6">
              ← ফিরে যান
            </Button>
            <Button type="submit" size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[150px] shadow-lg shadow-cyan-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold">
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
