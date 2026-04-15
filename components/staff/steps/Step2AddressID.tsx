"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { useForm, type SubmitHandler, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { MapPin, IdCard, X, FileUp } from "lucide-react";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn, compressImage } from "@/lib/utils";
import { DatePicker } from "@/components/ui/DatePicker";
import { toast } from "sonner";

import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input }      from "@/components/ui/input";
import { VoiceInputBn } from "@/components/ui/voice-input";
import { Button }     from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox }   from "@/components/ui/checkbox";
import { Separator }  from "@/components/ui/separator";

import {
  addressIDSchema, type AddressIDData,
  DIVISIONS, DIVISION_LABELS,
  DISTRICTS_BY_DIVISION, UPAZILAS_BY_DISTRICT,
  BLOOD_GROUPS,
} from "@/validations/staff";
import { useStaffFormStore, useStep2Data } from "@/store/staffFormStore";

interface StepProps { onNext: () => void; onPrev: () => void; }

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

// ══════════════════════════════════════════════════════════════
// AddressSection — MUST be defined OUTSIDE Step2AddressID.
//
// If defined inside, React creates a NEW component type on every
// render of Step2AddressID. This causes React to unmount + remount
// AddressSection on every keystroke, losing input focus immediately.
//
// By defining it at module level, the component identity is stable
// across renders and focus is preserved correctly.
// ══════════════════════════════════════════════════════════════
interface AddressSectionProps {
  prefix:   "currentAddress" | "permanentAddress";
  division: string;
  district: string;
  title:    string;
  control:  Control<AddressIDData>;
}

const AddressSection = memo(function AddressSection({
  prefix, division, district, title, control,
}: AddressSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Division */}
        <FormField control={control} name={`${prefix}.division` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>বিভাগ <span className="text-cyan-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                  <SelectValue placeholder="বিভাগ" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DIVISIONS.map((d) => (
                  <SelectItem key={d} value={d}>{DIVISION_LABELS[d]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* District */}
        <FormField control={control} name={`${prefix}.district` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>জেলা <span className="text-cyan-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""} disabled={!division}>
              <FormControl>
                <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                  <SelectValue placeholder={division ? "জেলা" : "আগে বিভাগ"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {division && DISTRICTS_BY_DIVISION[division]?.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Thana */}
        <FormField control={control} name={`${prefix}.thana` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>থানা/উপজেলা <span className="text-cyan-500">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""} disabled={!district}>
              <FormControl>
                <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                  <SelectValue placeholder={district ? "থানা" : "আগে জেলা"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {district && UPAZILAS_BY_DISTRICT[district]?.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Post Office — plain Input, NOT VoiceInputBn, to avoid focus issues */}
        <FormField control={control} name={`${prefix}.postOffice` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>পোস্ট অফিস <span className="text-cyan-500">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder="পোস্ট অফিসের নাম"
                className="bg-white/50 dark:bg-zinc-900/50"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Post Code */}
        <FormField control={control} name={`${prefix}.postCode` as any} render={({ field }) => (
          <FormItem>
            <FormLabel>পোস্ট কোড</FormLabel>
            <FormControl>
              <Input placeholder="১২৩০" className="bg-white/50 dark:bg-zinc-900/50" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Village — plain Input for focus stability */}
        <FormField control={control} name={`${prefix}.village` as any} render={({ field }) => (
          <FormItem className="sm:col-span-2 lg:col-span-3">
            <FormLabel>গ্রাম / ইউনিয়ন / এলাকা <span className="text-cyan-500">*</span></FormLabel>
            <FormControl>
              <Input
                placeholder="বিস্তারিত ঠিকানা লিখুন"
                className="bg-white/50 dark:bg-zinc-900/50"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

      </div>
    </div>
  );
});

// ─── NID Upload Card — also defined outside for same reason ───
interface NidCardProps {
  side:       "front" | "back";
  preview:    string | null;
  inputRef:   React.RefObject<HTMLInputElement>;
  onUpload:   (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove:   () => void;
}

const NidUploadCard = memo(function NidUploadCard({
  side, preview, inputRef, onUpload, onRemove,
}: NidCardProps) {
  const label = side === "front" ? "এনআইডি সামনের অংশ" : "এনআইডি পিছনের অংশ";
  return (
    <div className="space-y-3">
      <FormLabel className="flex items-center gap-2">
        {label} <span className="text-cyan-500">*</span>
        <HelpTooltip content={`জাতীয় পরিচয়পত্রের ${side === "front" ? "সামনের" : "পিছনের"} পাতার ছবি আপলোড করুন।`} />
      </FormLabel>
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative group h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden cursor-pointer",
          preview
            ? "border-cyan-500"
            : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400 bg-white/30 dark:bg-zinc-950/20 hover:bg-cyan-50/10"
        )}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image src={preview} alt={label} fill className="object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 z-10 shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform">
            <div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
              <FileUp className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-cyan-600">ছবি আপলোড করুন</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    </div>
  );
});

// ══════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════
export default function Step2AddressID({ onNext, onPrev }: StepProps) {
  const savedData      = useStep2Data();
  const { setStep2Data, markIncomplete } = useStaffFormStore();

  // NID previews from persisted base64
  const [nidFrontPreview, setNidFrontPreview] = useState<string | null>(
    (savedData as any).nidFrontBase64 ?? null
  );
  const [nidBackPreview, setNidBackPreview] = useState<string | null>(
    (savedData as any).nidBackBase64 ?? null
  );

  const nidFrontRef = useRef<HTMLInputElement>(null);
  const nidBackRef  = useRef<HTMLInputElement>(null);

  // ── Form ───────────────────────────────────────────────────
  const form = useForm<AddressIDData>({
    resolver: zodResolver(addressIDSchema) as any,
    defaultValues: {
      currentAddress: {
        division:   savedData.currentAddress?.division   ?? "",
        district:   savedData.currentAddress?.district   ?? "",
        thana:      savedData.currentAddress?.thana      ?? "",
        postOffice: savedData.currentAddress?.postOffice ?? "",
        village:    savedData.currentAddress?.village    ?? "",
        postCode:   savedData.currentAddress?.postCode   ?? "",
      },
      permanentSameAsCurrent: savedData.permanentSameAsCurrent ?? false,
      permanentAddress: savedData.permanentSameAsCurrent
        ? { ...savedData.currentAddress }
        : {
            division:   savedData.permanentAddress?.division   ?? "",
            district:   savedData.permanentAddress?.district   ?? "",
            thana:      savedData.permanentAddress?.thana      ?? "",
            postOffice: savedData.permanentAddress?.postOffice ?? "",
            village:    savedData.permanentAddress?.village    ?? "",
            postCode:   savedData.permanentAddress?.postCode   ?? "",
          },
      nidNumber:   savedData.nidNumber   ?? "",
      dateOfBirth: savedData.dateOfBirth ?? "",
      bloodGroup:  savedData.bloodGroup  ?? "unknown",
    },
  });

  // Restore on mount
  useEffect(() => {
    if (!savedData || !Object.keys(savedData).length) return;
    const front = (savedData as any).nidFrontBase64 ?? null;
    const back  = (savedData as any).nidBackBase64  ?? null;
    if (front) setNidFrontPreview(front);
    if (back)  setNidBackPreview(back);
  }, []);

  // Address cascade resets
  useEffect(() => {
    const sub = form.watch((_, { name, type }) => {
      if (type !== "change") return;
      if (name === "currentAddress.division") {
        form.setValue("currentAddress.district", "");
        form.setValue("currentAddress.thana", "");
      }
      if (name === "currentAddress.district") {
        form.setValue("currentAddress.thana", "");
      }
      if (name === "permanentAddress.division") {
        form.setValue("permanentAddress.district", "");
        form.setValue("permanentAddress.thana", "");
      }
      if (name === "permanentAddress.district") {
        form.setValue("permanentAddress.thana", "");
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Auto-save (debounced 800ms)
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const saveToStore = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStep2Data({
        ...form.getValues(),
        nidFrontBase64:   nidFrontPreview,
        nidBackBase64:    nidBackPreview,
        nidFrontCopyUrl:  nidFrontPreview,
        nidBackCopyUrl:   nidBackPreview,
      } as any);
    }, 800);
  }, [form, nidFrontPreview, nidBackPreview, setStep2Data]);

  useEffect(() => {
    const sub = form.watch(() => saveToStore());
    return () => { sub.unsubscribe(); clearTimeout(timerRef.current); };
  }, [form, saveToStore]);

  // ── NID upload handler ─────────────────────────────────────
  const handleNidChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const compressed = await compressImage(file, 0.7);
        const base64     = await fileToBase64(compressed);

        if (side === "front") {
          setNidFrontPreview(base64);
          setStep2Data({
            ...(useStaffFormStore.getState().step2Data as any),
            nidFrontBase64:  base64,
            nidFrontCopyUrl: base64,
          } as any);
        } else {
          setNidBackPreview(base64);
          setStep2Data({
            ...(useStaffFormStore.getState().step2Data as any),
            nidBackBase64:  base64,
            nidBackCopyUrl: base64,
          } as any);
        }
        toast.success(`✅ NID ${side === "front" ? "সামনের" : "পিছনের"} অংশ আপলোড হয়েছে`);
      } catch {
        toast.error("❌ ফাইল প্রসেসিং এ সমস্যা হয়েছে");
      }
    },
    [setStep2Data]
  );

  const removeNid = useCallback((side: "front" | "back") => {
    if (side === "front") {
      setNidFrontPreview(null);
      if (nidFrontRef.current) nidFrontRef.current.value = "";
      setStep2Data({ ...(useStaffFormStore.getState().step2Data as any), nidFrontBase64: null, nidFrontCopyUrl: null } as any);
    } else {
      setNidBackPreview(null);
      if (nidBackRef.current) nidBackRef.current.value = "";
      setStep2Data({ ...(useStaffFormStore.getState().step2Data as any), nidBackBase64: null, nidBackCopyUrl: null } as any);
    }
  }, [setStep2Data]);

  // Watched values for address section
  const sameAsCurrent     = form.watch("permanentSameAsCurrent");
  const currentDivision   = form.watch("currentAddress.division");
  const currentDistrict   = form.watch("currentAddress.district");
  const permanentDivision = form.watch("permanentAddress.division");
  const permanentDistrict = form.watch("permanentAddress.district");

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit: SubmitHandler<AddressIDData> = async (data) => {
    if (!nidFrontPreview) {
      markIncomplete(2);
      toast.error("⚠️ NID সামনের অংশের ছবি আপলোড করুন");
      return;
    }
    if (!nidBackPreview) {
      markIncomplete(2);
      toast.error("⚠️ NID পিছনের অংশের ছবি আপলোড করুন");
      return;
    }
    if (!data.nidNumber?.trim()) {
      markIncomplete(2);
      toast.error("⚠️ NID নম্বর লিখুন");
      return;
    }

    setStep2Data({
      ...data,
      nidFrontBase64:  nidFrontPreview,
      nidBackBase64:   nidBackPreview,
      nidFrontCopyUrl: nidFrontPreview,
      nidBackCopyUrl:  nidBackPreview,
    } as any);
    onNext();
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="kalpurush-font">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-10">

          {/* Address section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <MapPin className="h-5 w-5" /><span>ঠিকানা</span>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-50/30 dark:bg-cyan-900/10 border border-cyan-100/50 shadow-inner">
              <AddressSection
                prefix="currentAddress"
                division={currentDivision}
                district={currentDistrict}
                title="বর্তমান ঠিকানা"
                control={form.control}
              />
            </div>

            {/* Same as current */}
            <FormField control={form.control} name="permanentSameAsCurrent" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-800 bg-cyan-50/10">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => {
                      field.onChange(val);
                      if (val) form.setValue("permanentAddress", form.getValues("currentAddress") as any);
                      else form.setValue("permanentAddress", { division:"",district:"",thana:"",postOffice:"",village:"",postCode:"" });
                    }}
                    className="border-cyan-500 data-[state=checked]:bg-cyan-500"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer font-medium">স্থায়ী ঠিকানা এবং বর্তমান ঠিকানা একই</FormLabel>
              </FormItem>
            )} />

            {!sameAsCurrent && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-200 dark:border-zinc-800">
                <AddressSection
                  prefix="permanentAddress"
                  division={permanentDivision}
                  district={permanentDistrict}
                  title="স্থায়ী ঠিকানা"
                  control={form.control}
                />
              </motion.div>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Identity section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <IdCard className="h-5 w-5" /><span>পরিচয়পত্র ও অন্যান্য</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="nidNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>NID নম্বর <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="১০ বা ১৭ ডিজিট" className="bg-white/50 dark:bg-zinc-900/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem>
                  <FormLabel>জন্ম তারিখ <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value ? new Date(field.value) : undefined}
                      setDate={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                      startYear={1950}
                      endYear={new Date().getFullYear() - 10}
                      placeholder="জন্ম তারিখ নির্বাচন করুন"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* NID images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NidUploadCard
                side="front"
                preview={nidFrontPreview}
                inputRef={nidFrontRef}
                onUpload={(e) => handleNidChange(e, "front")}
                onRemove={() => removeNid("front")}
              />
              <NidUploadCard
                side="back"
                preview={nidBackPreview}
                inputRef={nidBackRef}
                onUpload={(e) => handleNidChange(e, "back")}
                onRemove={() => removeNid("back")}
              />
            </div>

            <div className="max-w-xs">
              <FormField control={form.control} name="bloodGroup" render={({ field }) => (
                <FormItem>
                  <FormLabel>রক্তের গ্রুপ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-white/50 dark:bg-zinc-900/50">
                        <SelectValue placeholder="নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg === "unknown" ? "জানা নেই" : bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={onPrev} className="text-zinc-500 hover:text-cyan-600 rounded-xl px-6 h-12 font-bold">
              ← ফিরে যান
            </Button>
            <Button type="submit" size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[150px] shadow-lg rounded-xl font-bold h-12">
              পরবর্তী ধাপ →
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}