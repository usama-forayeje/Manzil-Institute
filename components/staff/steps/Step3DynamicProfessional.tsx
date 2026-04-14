"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  GraduationCap, 
  Plus, 
  Trash2,
  CheckCircle2,
  FileUp,
  Loader2,
  Award,
  FileArchive,
  X,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, compressImage } from "@/lib/utils";
import { useStaffFormStore, useStep3Data } from "@/store/staffFormStore";
import { professionalEducationSchema, type ProfessionalEducationData, TEACHER_DESIGNATIONS, NON_TEACHER_DESIGNATIONS, DESIGNATION_LABELS } from "@/validations/staff";
import { Separator } from "@/components/ui/separator";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { VoiceInputBn } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { getDesignations } from "@/lib/actions/terms";

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
});

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

function SectionHeader({ icon: Icon, title, subtitle, color = "violet" }: { icon: any; title: string; subtitle?: string; color?: string }) {
  const colorMap = {
    violet: "text-violet-800 dark:text-violet-300",
    emerald: "text-emerald-800 dark:text-emerald-300", 
    rose: "text-rose-800 dark:text-rose-300",
    amber: "text-amber-800 dark:text-amber-300",
    sky: "text-sky-800 dark:text-sky-300",
  };
  const subtitleColorMap = {
    violet: "text-violet-600 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
    sky: "text-sky-600 dark:text-sky-400",
  };
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-800/50">
      <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
        <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
      </div>
      <div>
        <h3 className={cn("font-bold text-base", colorMap[color as keyof typeof colorMap] || colorMap.violet)}>{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Step3DynamicProfessional({ onNext, onPrev }: StepProps) {
  const savedData = useStep3Data();
  const { setStep3Data, markIncomplete } = useStaffFormStore();
  
  // Load designations from DB
  const [dbDesignations, setDbDesignations] = useState<any[]>([]);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(true);
  
  // File states
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [certificatePreviews, setCertificatePreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  const certRef = useRef<HTMLInputElement>(null);

  const form = useForm<Pick<ProfessionalEducationData,
    | 'designation'
    | 'designationCustom'
    | 'employmentType'
    | 'education'
    | 'isHafiz'
  >>({
    resolver: zodResolver(professionalEducationSchema.pick({
      designation: true,
      designationCustom: true,
      employmentType: true,
      education: true,
      isHafiz: true,
    })) as any,
    defaultValues: {
      designation: savedData.designation ?? "",
      designationCustom: savedData.designationCustom ?? "",
      employmentType: savedData.employmentType ?? "permanent",
      education: savedData.education ?? [{ degree: "", institution: "", year: "" }],
      isHafiz: savedData.isHafiz ?? false,
    } as any,
  });

  // Load designations
  useEffect(() => {
    console.log("Loading designations...");
    getDesignations()
      .then((designations: any[]) => {
        console.log("Designations loaded:", designations?.length || 0, "items");
        console.log("First designation:", designations?.[0]);
        setDbDesignations(designations || []);
      })
      .catch((error) => {
        console.error("Failed to load designations:", error);
        setDbDesignations([]);
      })
      .finally(() => {
        setIsLoadingDesignations(false);
      });
  }, []);

  // Restore form data on mount
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        designation: savedData.designation ?? "",
        designationCustom: savedData.designationCustom ?? "",
        department: savedData.department ?? "",
        employmentType: savedData.employmentType ?? "permanent",
        education: savedData.education ?? [{ degree: "", institution: "", year: "" }],
        isHafiz: savedData.isHafiz ?? false,
      } as any);
      if (savedData.certificateFiles) {
        setCertificateFiles(savedData.certificateFiles as File[]);
      }
      // Restore certificate previews from base64 URLs
      if ((savedData as any).certificateUrls && Array.isArray((savedData as any).certificateUrls)) {
        setCertificatePreviews((savedData as any).certificateUrls);
      }
    }
  }, []);

  // Auto-save form data with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const subscription = form.watch((value) => {
        setStep3Data({ ...value, certificateFiles, certificateUrls: certificatePreviews } as any);
      });
      return () => subscription.unsubscribe();
    }, 500);
    return () => clearTimeout(timeout);
  }, [form, setStep3Data, certificateFiles, certificatePreviews]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education"
  });

  const designation = form.watch("designation");
  const isTeacher = TEACHER_DESIGNATIONS.includes(designation);
  const isStaff = NON_TEACHER_DESIGNATIONS.includes(designation);

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    try {
      setIsCompressing(true);
      const compressedFiles = await Promise.all(
        files.map(f => compressImage(f, 0.85))
      );
      setCertificateFiles(prev => [...prev, ...compressedFiles]);
      
      // Generate preview URLs for the new files
      const newPreviews = await Promise.all(
        compressedFiles.map(f => fileToBase64(f))
      );
      setCertificatePreviews(prev => [...prev, ...newPreviews]);
      
      toast.success(`✅ ${files.length} টি ফাইল আপলোড হয়েছে`);
    } catch (err) {
      console.error("Multiple compression failed:", err);
      toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
    } finally {
      setIsCompressing(false);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificateFiles(prev => prev.filter((_, i) => i !== index));
    setCertificatePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log('Step3 onSubmit called', {
      designation: data.designation,
      designationType: typeof data.designation,
      dbDesignationsCount: dbDesignations.length,
      firstDesignation: dbDesignations[0] ? {
        $id: dbDesignations[0].$id,
        designation_id: dbDesignations[0].designation_id,
        label_en: dbDesignations[0].label_en
      } : null
    });
    
    if (!data.designation) {
      console.log('No designation selected');
      markIncomplete(3);
      toast.error("⚠️ অনুগ্রহ করে পদবী নির্বাচন করুন");
      return;
    } 

    // Check if at least one education entry is filled
    const hasEducation = data.education?.some(
      (edu: any) => edu.degree && edu.institution && edu.year
    );
    
    console.log('Has education:', hasEducation, 'Education data:', data.education);
    
    if (!hasEducation) {
      console.log('No education filled');
      markIncomplete(3);
      toast.error("⚠️ অনুগ্রহ করে কমপক্ষে একটি শিক্ষাগত যোগ্যতা যোগ করুন");
      return;
    } 

    console.log('Saving Step3 data and calling onNext');
    
    // Convert certificate files to base64
    let certificateUrls: string[] = [];
    for (const file of certificateFiles) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      certificateUrls.push(base64);
    }
    setStep3Data({
      ...data,
      certificateFiles: certificateFiles.length > 0 ? certificateFiles : undefined,
      certificateUrls: certificatePreviews,
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
                <div className="bg-white/90 dark:bg-zinc-900/90 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-violet-500/30">
                  <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-400">ফাইল প্রসেসিং হচ্ছে...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Role Selection */}
          <div className="space-y-4">
            <SectionHeader 
              icon={Award} 
              title="পদবী ও কর্মসংস্থান" 
              subtitle="আপনার পদবী নির্বাচন করুন"
              color="violet"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-violet-50/30 to-purple-50/20 dark:from-violet-950/20 dark:to-purple-950/10 border border-violet-100/50 dark:border-violet-900/30">
              <FormField<any>
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-violet-800 dark:text-violet-300">
                      আপনার পদবী নির্বাচন করুন <span className="text-red-500">*</span>
                      <HelpTooltip content="আপনি যে পদের জন্য আবেদন করছেন তা সিলেক্ট করুন। শিক্ষক হলে 'Teacher' এবং অন্যান্য হলে সংশ্লিষ্ট পদটি বেছে নিন।" />
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined} disabled={isLoadingDesignations}>
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
                        {dbDesignations.length > 0 ? (
                          dbDesignations.filter((d: any) => d.is_active !== false).map((d: any) => (
                            <SelectItem key={d.$id || d.designation_id || d.label_en} value={d.$id || d.designation_id || d.label_en}>
                              {d.label_bn}
                            </SelectItem>
                          ))
                        ) : (
                          Object.entries(DESIGNATION_LABELS).map(([v, l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField<any>
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-violet-800 dark:text-violet-300">
                      চাকরির ধরন <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800">
                          <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="permanent">স্থায়ী (Full-time)</SelectItem>
                        <SelectItem value="contract">চুক্তিভিত্তিক (Contractual)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 p-4 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-violet-950/20"
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

          {/* Section: Dynamic Education */}
          <div className="space-y-6">
            <SectionHeader 
              icon={GraduationCap} 
              title="শিক্ষাগত যোগ্যতা" 
              subtitle="আপনার শিক্ষাগত যোগ্যতা যোগ করুন"
              color="violet"
            />
            
            <div className="space-y-6">
              {fields.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/60 to-white/40 dark:from-zinc-800/40 dark:to-zinc-800/20 border border-violet-100/50 dark:border-violet-900/30 shadow-lg backdrop-blur-md transition-all hover:shadow-xl"
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
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-violet-500 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                      {index === 0 ? "সর্বোচ্চ শিক্ষা" : `শিক্ষা ${index + 1}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-violet-800 dark:text-violet-300">
                            পরীক্ষার নাম <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <VoiceInputBn 
                              placeholder="যেমন: অনার্স / কামিল / মাস্টার্স" 
                              className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800" 
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
                              className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800" 
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
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-violet-800 dark:text-violet-300">
                            শিক্ষাপ্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <VoiceInputBn 
                              placeholder="যেমন: জামিয়া রাহমানিয়া আরাবিয়া / ঢাকা বিশ্ববিদ্যালয়" 
                              className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800" 
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
              onClick={() => append({ degree: "", institution: "", year: "" })}
              className="w-full border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-xl h-14 text-base font-bold"
            >
              <Plus className="h-5 w-5 mr-2" />
              নতুন শিক্ষাগত যোগ্যতা যোগ করুন
            </Button>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Educational Certificates */}
          <div className="space-y-6">
            <SectionHeader 
              icon={BookOpen} 
              title="শিক্ষাগত সনদসমূহ" 
              subtitle="আপনার শিক্ষাগত সনদপত্র আপলোড করুন (ঐচ্ছিক)"
              color="cyan"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificateFiles.map((file, idx) => (
                <div key={idx} className="relative p-4 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/20 dark:bg-cyan-950/20 flex items-center gap-3 shadow-sm">
                  <div className="h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center shrink-0">
                    <FileArchive className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-cyan-800 dark:text-cyan-300 truncate">{file.name}</p>
                    <p className="text-[10px] text-cyan-600/70 dark:text-cyan-400/70">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeCertificate(idx)} 
                    className="h-8 w-8 rounded-md bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={() => certRef.current?.click()} 
                className="h-[70px] rounded-xl border-2 border-dashed border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all hover:bg-cyan-50/20 dark:hover:bg-cyan-950/20 group"
              >
                <Plus className="h-5 w-5 text-cyan-400 group-hover:text-cyan-600" />
                <span className="text-sm font-bold text-cyan-500 group-hover:text-cyan-700">নতুন সনদ যুক্ত করুন</span>
              </button>
              <input ref={certRef} type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleMultipleFiles} />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 relative z-50">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onPrev} 
              className="text-zinc-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 rounded-xl px-6 h-12 font-bold transition-all"
            >
              ← ফিরে যান
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              onClick={(e) => { 
                console.log('Submit button clicked'); 
                // Force form submission
                form.handleSubmit((data) => {
                  console.log('Form validated successfully:', data);
                  onSubmit(data);
                })((e as any));
              }}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold px-8 h-12 relative z-50"
            >
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
