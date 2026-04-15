"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  GraduationCap, Plus, Trash2, FileArchive,
  Loader2, Award, X, BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input }       from "@/components/ui/input";
import { VoiceInputBn }from "@/components/ui/voice-input";
import { Button }      from "@/components/ui/button";
import { Checkbox }    from "@/components/ui/checkbox";
import { Separator }   from "@/components/ui/separator";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { cn, compressImage } from "@/lib/utils";
import {
  professionalEducationSchema, type ProfessionalEducationData,
  DESIGNATION_LABELS,
} from "@/validations/staff";
import { useStaffFormStore, useStep3Data } from "@/store/staffFormStore";
import { getDesignations } from "@/lib/actions/terms";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

interface StepProps { onNext: () => void; onPrev: () => void; }

type FormValues = Pick<ProfessionalEducationData,
  "designation" | "designationCustom" | "employmentType" | "education" | "isHafiz"
>;

export default function Step3DynamicProfessional({ onNext, onPrev }: StepProps) {
  const savedData        = useStep3Data();
  const { setStep3Data, markIncomplete } = useStaffFormStore();

  // Designations from DB
  const [dbDesignations,      setDbDesignations]      = useState<any[]>([]);
  const [isLoadingDesignations, setIsLoadingDesignations] = useState(true);

  // Certificate state
  // certificateFiles: current-session File objects (for upload)
  // certificatePreviews: base64 strings (persisted in store)
  const [certFiles,    setCertFiles]    = useState<File[]>([]);
  const [certPreviews, setCertPreviews] = useState<string[]>(
    (savedData.certificateUrls as string[]) ?? []
  );
  const [isCompressing, setIsCompressing] = useState(false);
  const certRef = useRef<HTMLInputElement>(null);

  // ── Form ───────────────────────────────────────────────────
  const form = useForm<FormValues>({
    resolver: zodResolver(
      professionalEducationSchema.pick({
        designation: true, designationCustom: true,
        employmentType: true, education: true, isHafiz: true,
      })
    ) as any,
    defaultValues: {
      designation:       savedData.designation       ?? "",
      designationCustom: savedData.designationCustom ?? "",
      employmentType:    savedData.employmentType    ?? "permanent",
      education:         savedData.education ?? [{ degree: "", institution: "", year: "" }],
      isHafiz:           savedData.isHafiz           ?? false,
    } as any,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control, name: "education" as any,
  });

  // Load designations
  useEffect(() => {
    getDesignations()
      .then((d: any[]) => setDbDesignations(d ?? []))
      .catch(() => setDbDesignations([]))
      .finally(() => setIsLoadingDesignations(false));
  }, []);

  // Restore on mount
  useEffect(() => {
    if (!savedData || !Object.keys(savedData).length) return;
    form.reset({
      designation:       savedData.designation       ?? "",
      designationCustom: savedData.designationCustom ?? "",
      employmentType:    savedData.employmentType    ?? "permanent",
      education:         savedData.education ?? [{ degree: "", institution: "", year: "" }],
      isHafiz:           savedData.isHafiz ?? false,
    } as any);
    // Restore certificate previews from store
    if (Array.isArray(savedData.certificateUrls) && savedData.certificateUrls.length > 0) {
      setCertPreviews(savedData.certificateUrls as string[]);
    }
  }, []);

  // Auto-save (debounced)
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    const sub = form.watch((value) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setStep3Data({
          ...value,
          certificateFiles: certFiles,
          certificateUrls:  certPreviews,
        } as any);
      }, 600);
    });
    return () => { sub.unsubscribe(); clearTimeout(timerRef.current); };
  }, [form, setStep3Data, certFiles, certPreviews]);

  // Sync cert previews to store whenever they change
  useEffect(() => {
    setStep3Data({
      ...form.getValues(),
      certificateFiles: certFiles,
      certificateUrls:  certPreviews,
    } as any);
  }, [certPreviews]); // eslint-disable-line

  // ── Certificate handlers ───────────────────────────────────
  const handleCertFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setIsCompressing(true);
    try {
      const compressed = await Promise.all(files.map((f) => compressImage(f, 0.7)));
      const previews   = await Promise.all(compressed.map(fileToBase64));
      setCertFiles((prev) => [...prev, ...compressed]);
      setCertPreviews((prev) => [...prev, ...previews]);
      toast.success(`✅ ${files.length} টি সনদ আপলোড হয়েছে`);
    } catch {
      toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
    } finally {
      setIsCompressing(false);
      if (e.target) e.target.value = "";
    }
  };

  const removeCert = (idx: number) => {
    setCertFiles((prev)    => prev.filter((_, i) => i !== idx));
    setCertPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!data.designation) {
      markIncomplete(3);
      toast.error("⚠️ পদবী নির্বাচন করুন");
      return;
    }
    const hasEdu = (data.education as any[])?.some(
      (e) => e.degree && e.institution && e.year
    );
    if (!hasEdu) {
      markIncomplete(3);
      toast.error("⚠️ কমপক্ষে একটি শিক্ষাগত যোগ্যতা যোগ করুন");
      return;
    }
    setStep3Data({ ...data, certificateFiles: certFiles, certificateUrls: certPreviews });
    onNext();
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="kalpurush-font">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Loading overlay */}
          <AnimatePresence>
            {isCompressing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 dark:bg-zinc-900/90 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-violet-500/30">
                  <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-400">ফাইল প্রসেসিং হচ্ছে...</span>
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
              <h3 className="font-bold text-violet-800 dark:text-violet-300">পদবী ও কর্মসংস্থান</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-violet-50/30 dark:bg-violet-950/10 border border-violet-100/50">
              <FormField control={form.control} name={"designation" as any} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-violet-800 dark:text-violet-300 flex items-center gap-2">
                    পদবী নির্বাচন করুন <span className="text-red-500">*</span>
                    <HelpTooltip content="যে পদের জন্য আবেদন করছেন" />
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingDesignations}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white/70 dark:bg-zinc-950/50 border-violet-200 dark:border-violet-800">
                        {isLoadingDesignations
                          ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />লোড হচ্ছে...</span>
                          : <SelectValue placeholder="সিলেক্ট করুন" />}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dbDesignations.length > 0
                        ? dbDesignations.filter((d) => d.is_active !== false).map((d) => (
                            <SelectItem key={d.$id || d.designation_id} value={d.$id || d.designation_id}>
                              {d.label_bn}
                            </SelectItem>
                          ))
                        : Object.entries(DESIGNATION_LABELS).map(([v, l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name={"employmentType" as any} render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-violet-800 dark:text-violet-300">চাকরির ধরন <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
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
              )} />

              <div className="md:col-span-2 p-4 rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/30">
                <FormField control={form.control} name={"isHafiz" as any} render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-4 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 border-violet-500 data-[state=checked]:bg-violet-500" />
                    </FormControl>
                    <FormLabel className="text-violet-800 dark:text-violet-300 font-bold text-base cursor-pointer">
                      🎓 আপনি কি হাফেজ-এ-কুরআন?
                    </FormLabel>
                  </FormItem>
                )} />
              </div>
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Education */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200/50">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="font-bold text-violet-800 dark:text-violet-300">শিক্ষাগত যোগ্যতা</h3>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="group relative p-5 rounded-2xl border border-violet-100/50 dark:border-violet-900/30 bg-white/60 dark:bg-zinc-800/40 shadow-sm">
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)}
                      className="absolute -top-3 -right-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg bg-violet-500 text-white flex items-center justify-center text-xs font-bold">{index + 1}</div>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{index === 0 ? "সর্বোচ্চ শিক্ষা" : `শিক্ষা ${index + 1}`}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`education.${index}.degree` as any} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-violet-800 dark:text-violet-300">পরীক্ষার নাম <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="অনার্স / কামিল / মাস্টার্স" className="bg-white/70 dark:bg-zinc-950/50 border-violet-200" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`education.${index}.year` as any} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-violet-800 dark:text-violet-300">পাসের সন <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="২০২৩" className="bg-white/70 dark:bg-zinc-950/50 border-violet-200" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`education.${index}.institution` as any} render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-violet-800 dark:text-violet-300">শিক্ষাপ্রতিষ্ঠানের নাম <span className="text-red-500">*</span></FormLabel>
                        <FormControl><VoiceInputBn placeholder="জামিয়া রাহমানিয়া / ঢাকা বিশ্ববিদ্যালয়" className="bg-white/70 dark:bg-zinc-950/50 border-violet-200" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </motion.div>
              ))}
            </div>

            <Button type="button" variant="outline"
              onClick={() => append({ degree: "", institution: "", year: "" } as any)}
              className="w-full border-2 border-dashed border-violet-300 dark:border-violet-700 text-violet-600 hover:bg-violet-50 rounded-xl h-12 font-bold">
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
              <h3 className="font-bold text-cyan-800 dark:text-cyan-300">শিক্ষাগত সনদসমূহ (ঐচ্ছিক)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Show restored previews (with image thumbnails) */}
              {certPreviews.map((preview, idx) => (
                <div key={idx} className="relative p-3 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/20 flex items-center gap-3 shadow-sm group">
                  {/* Thumbnail if it's an image */}
                  {preview.startsWith("data:image/") ? (
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-cyan-200">
                      <Image src={preview} alt={`Certificate ${idx + 1}`} fill className="object-cover" />
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
                      {certFiles[idx] ? `${(certFiles[idx].size / 1024).toFixed(1)} KB` : "✓ সংরক্ষিত"}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeCert(idx)}
                    className="h-7 w-7 rounded-md bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-200 shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              {/* Add button */}
              <button type="button" onClick={() => certRef.current?.click()}
                className="h-[74px] rounded-xl border-2 border-dashed border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all hover:bg-cyan-50/20 group">
                <Plus className="h-5 w-5 text-cyan-400 group-hover:text-cyan-600" />
                <span className="text-sm font-bold text-cyan-500 group-hover:text-cyan-700">সনদ যুক্ত করুন</span>
              </button>
              <input ref={certRef} type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleCertFiles} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={onPrev} className="text-zinc-500 hover:text-violet-600 rounded-xl px-6 h-12 font-bold">
              ← ফিরে যান
            </Button>
            <Button type="submit" size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg rounded-xl font-bold px-8 h-12">
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}