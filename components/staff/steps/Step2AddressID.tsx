"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { toast } from "sonner";
import { MapPin, IdCard, X, FileUp } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn, compressImage } from "@/lib/utils";
import { DatePicker } from "@/components/ui/DatePicker";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VoiceInputBn } from "@/components/ui/voice-input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

import { addressIDSchema, type AddressIDData, DIVISIONS, DIVISION_LABELS, DISTRICTS_BY_DIVISION, UPAZILAS_BY_DISTRICT, BLOOD_GROUPS } from "@/validations/staff";
import { useStaffFormStore, useStep2Data } from "@/store/staffFormStore";

interface StepProps { onNext: () => void; onPrev: () => void; }

export default function Step2AddressID({ onNext, onPrev }: StepProps) {
  const savedData = useStep2Data();
  const { setStep2Data, markIncomplete } = useStaffFormStore();

  const [nidFrontUrl, setNidFrontUrl] = useState<string | null>((savedData as any).nidFrontBase64 ?? savedData.nidFrontCopyUrl ?? null);
  const [nidBackUrl, setNidBackUrl] = useState<string | null>((savedData as any).nidBackBase64 ?? savedData.nidBackCopyUrl ?? null);
  const [nidFrontFile, setNidFrontFile] = useState<File | null>(null);
  const [nidBackFile, setNidBackFile] = useState<File | null>(null);

  const nidFrontRef = useRef<HTMLInputElement>(null);
  const nidBackRef = useRef<HTMLInputElement>(null);

  // Get initial values - if same as current is checked, use currentAddress for permanentAddress
  const getInitialPermanentAddress = () => {
    if (savedData.permanentSameAsCurrent) {
      return {
        division: savedData.currentAddress?.division ?? "",
        district: savedData.currentAddress?.district ?? "",
        upazila: savedData.currentAddress?.upazila ?? "",
        thana: savedData.currentAddress?.thana ?? "",
        postOffice: savedData.currentAddress?.postOffice ?? "",
        village: savedData.currentAddress?.village ?? "",
        postCode: savedData.currentAddress?.postCode ?? ""
      };
    }
    return {
      division: savedData.permanentAddress?.division ?? "",
      district: savedData.permanentAddress?.district ?? "",
      upazila: savedData.permanentAddress?.upazila ?? "",
      thana: savedData.permanentAddress?.thana ?? "",
      postOffice: savedData.permanentAddress?.postOffice ?? "",
      village: savedData.permanentAddress?.village ?? "",
      postCode: savedData.permanentAddress?.postCode ?? ""
    };
  };

  const form = useForm<AddressIDData>({
    resolver: zodResolver(addressIDSchema) as any,
    defaultValues: {
      currentAddress: { division: savedData.currentAddress?.division ?? "", district: savedData.currentAddress?.district ?? "", upazila: savedData.currentAddress?.upazila ?? "", thana: savedData.currentAddress?.thana ?? "", postOffice: savedData.currentAddress?.postOffice ?? "", village: savedData.currentAddress?.village ?? "", postCode: savedData.currentAddress?.postCode ?? "" },
      permanentSameAsCurrent: savedData.permanentSameAsCurrent ?? false,
      permanentAddress: getInitialPermanentAddress(),
      nidNumber: savedData.nidNumber ?? "", dateOfBirth: savedData.dateOfBirth ?? "", bloodGroup: savedData.bloodGroup ?? "unknown",
    },
  });

  // Restore data on mount
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      // Build permanent address based on sameAsCurrent flag
      const permanentAddr = savedData.permanentSameAsCurrent
        ? {
            division: savedData.currentAddress?.division ?? "",
            district: savedData.currentAddress?.district ?? "",
            upazila: savedData.currentAddress?.upazila ?? "",
            thana: savedData.currentAddress?.thana ?? "",
            postOffice: savedData.currentAddress?.postOffice ?? "",
            village: savedData.currentAddress?.village ?? "",
            postCode: savedData.currentAddress?.postCode ?? ""
          }
        : {
            division: savedData.permanentAddress?.division ?? "",
            district: savedData.permanentAddress?.district ?? "",
            upazila: savedData.permanentAddress?.upazila ?? "",
            thana: savedData.permanentAddress?.thana ?? "",
            postOffice: savedData.permanentAddress?.postOffice ?? "",
            village: savedData.permanentAddress?.village ?? "",
            postCode: savedData.permanentAddress?.postCode ?? ""
          };
      
      form.reset({
        currentAddress: { division: savedData.currentAddress?.division ?? "", district: savedData.currentAddress?.district ?? "", upazila: savedData.currentAddress?.upazila ?? "", thana: savedData.currentAddress?.thana ?? "", postOffice: savedData.currentAddress?.postOffice ?? "", village: savedData.currentAddress?.village ?? "", postCode: savedData.currentAddress?.postCode ?? "" },
        permanentSameAsCurrent: savedData.permanentSameAsCurrent ?? false,
        permanentAddress: permanentAddr,
        nidNumber: savedData.nidNumber ?? "", dateOfBirth: savedData.dateOfBirth ?? "", bloodGroup: savedData.bloodGroup ?? "unknown",
      });
      if ((savedData as any).nidFrontBase64) setNidFrontUrl((savedData as any).nidFrontBase64);
      else if (savedData.nidFrontCopyUrl) setNidFrontUrl(savedData.nidFrontCopyUrl);
      if ((savedData as any).nidBackBase64) setNidBackUrl((savedData as any).nidBackBase64);
      else if (savedData.nidBackCopyUrl) setNidBackUrl(savedData.nidBackCopyUrl);
    }
  }, []);

  const sameAsCurrent = form.watch("permanentSameAsCurrent");
  const currentDivision = form.watch("currentAddress.division");
  const districtCurrent = form.watch("currentAddress.district");
  const permanentDivision = form.watch("permanentAddress.division");
  const districtPermanent = form.watch("permanentAddress.district");

  // Auto-save form data
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      setStep2Data(value as Partial<AddressIDData>);
      if (type === 'change') {
        if (name === 'currentAddress.division') { form.setValue('currentAddress.district', ''); form.setValue('currentAddress.upazila', ''); form.setValue('currentAddress.thana', ''); }
        if (name === 'currentAddress.district') { form.setValue('currentAddress.upazila', ''); form.setValue('currentAddress.thana', ''); }
        if (name === 'permanentAddress.division') { form.setValue('permanentAddress.district', ''); form.setValue('permanentAddress.upazila', ''); form.setValue('permanentAddress.thana', ''); }
        if (name === 'permanentAddress.district') { form.setValue('permanentAddress.upazila', ''); form.setValue('permanentAddress.thana', ''); }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setStep2Data]);

  // Cleanup ObjectURLs on unmount
  useEffect(() => {
    return () => {
      if (nidFrontUrl?.startsWith('blob:')) URL.revokeObjectURL(nidFrontUrl);
      if (nidBackUrl?.startsWith('blob:')) URL.revokeObjectURL(nidBackUrl);
    };
  }, [nidFrontUrl, nidBackUrl]);

  const fileToBase64 = useCallback((file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result as string); reader.onerror = reject; }), []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Cleanup old blob URL
      if (side === 'front' && nidFrontUrl?.startsWith('blob:')) URL.revokeObjectURL(nidFrontUrl);
      if (side === 'back' && nidBackUrl?.startsWith('blob:')) URL.revokeObjectURL(nidBackUrl);

      const compressed = await compressImage(file, 0.6); // More aggressive compression to reduce payload
      const blobUrl = URL.createObjectURL(compressed);
      
      // Immediately convert to base64 for preview only
      const base64 = await fileToBase64(compressed);

      if (side === 'front') {
        setNidFrontFile(compressed);
        setNidFrontUrl(base64); // Store base64 only for preview
      } else {
        setNidBackFile(compressed);
        setNidBackUrl(base64); // Store base64 only for preview
      }

      // Auto-save form data without base64 (to reduce payload)
      setStep2Data(form.getValues() as any);
    } catch (err) { console.error(err); toast.error("ফাইল প্রসেসিং এ সমস্যা হয়েছে"); }
  }, [nidFrontUrl, nidBackUrl, form, setStep2Data]);

  const onSubmit: SubmitHandler<AddressIDData> = async (data) => {
    console.log('Step2 onSubmit called with data:', data);

    // For now, just proceed directly to test if the button works
    console.log('Bypassing validation for testing - proceeding to next step');

    // Save data with file references (not base64 to reduce payload)
    setStep2Data({
      ...data,
      nidFrontCopyFile: nidFrontFile,
      nidBackCopyFile: nidBackFile,
      // Note: base64 data is stored only locally for preview
    } as any);

    console.log('Step2 data saved, calling onNext()');
    onNext();
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="kalpurush-font">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} id="addressIDForm" className="space-y-10">
          {/* Address Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold"><MapPin className="h-5 w-5" /><span>ঠিকানা (Address)</span></div>
            <div className="p-5 rounded-2xl bg-cyan-50/30 dark:bg-cyan-900/10 border border-cyan-100/50 dark:border-cyan-800/20 space-y-5 shadow-inner">
              <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-300">বর্তমান ঠিকানা</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.division" render={({ field }) => (<FormItem><FormLabel>বিভাগ <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value || undefined}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder="বিভাগ" /></SelectTrigger></FormControl><SelectContent>{DIVISIONS.map(d => <SelectItem key={d} value={d}>{DIVISION_LABELS[d]}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.district" render={({ field }) => (<FormItem><FormLabel>জেলা <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value || undefined} disabled={!currentDivision}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder={currentDivision ? "জেলা নির্বাচন করুন" : "আগে বিভাগ সিলেক্ট করুন"} /></SelectTrigger></FormControl><SelectContent>{currentDivision && DISTRICTS_BY_DIVISION[currentDivision]?.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.upazila" render={({ field }) => (<FormItem><FormLabel>উপজেলা <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value || undefined} disabled={!districtCurrent}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder={districtCurrent ? "উপজেলা" : "আগে জেলা নির্বাচন করুন"} /></SelectTrigger></FormControl><SelectContent>{districtCurrent && UPAZILAS_BY_DISTRICT[districtCurrent]?.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.thana" render={({ field }) => (<FormItem><FormLabel>থানা <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value || undefined} disabled={!districtCurrent}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder={districtCurrent ? "থানা" : "আগে জেলা নির্বাচন করুন"} /></SelectTrigger></FormControl><SelectContent>{districtCurrent && UPAZILAS_BY_DISTRICT[districtCurrent]?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.postOffice" render={({ field }) => (<FormItem><FormLabel>পোস্ট অফিস <span className="text-cyan-500">*</span></FormLabel><FormControl><VoiceInputBn placeholder="পোস্ট অফিসের নাম" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.postCode" render={({ field }) => (<FormItem><FormLabel>পোস্ট কোড</FormLabel><FormControl><Input placeholder="যেমন: ১২৩০" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField<AddressIDData> control={form.control as any} name="currentAddress.village" render={({ field }) => (<FormItem className="sm:col-span-2 lg:col-span-3"><FormLabel>গ্রাম / ইউনিয়ন / এলাকা <span className="text-cyan-500">*</span></FormLabel><FormControl><VoiceInputBn placeholder="বিস্তারিত ঠিকানা" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </div>
            <FormField<AddressIDData> control={form.control as any} name="permanentSameAsCurrent" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-800 bg-cyan-50/10 transition-colors hover:bg-cyan-50/20"><FormControl><Checkbox checked={field.value} onCheckedChange={(val) => { field.onChange(val); if (val) form.setValue("permanentAddress", form.getValues("currentAddress")); else form.setValue("permanentAddress", { division: "", district: "", upazila: "", thana: "", postOffice: "", village: "", postCode: "" }); }} className="border-cyan-500 data-[state=checked]:bg-cyan-500" /></FormControl><div className="space-y-1 leading-none"><FormLabel className="cursor-pointer">স্থায়ী ঠিকানা এবং বর্তমান ঠিকানা একই</FormLabel></div></FormItem>)} />
            {!sameAsCurrent && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-200 dark:border-zinc-800 space-y-5"><h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">স্থায়ী ঠিকানা</h4><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField control={form.control} name="permanentAddress.division" render={({ field }) => (<FormItem><FormLabel>বিভাগ <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={field.value || undefined}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder="বিভাগ" /></SelectTrigger></FormControl><SelectContent>{DIVISIONS.map(d => <SelectItem key={d} value={d}>{DIVISION_LABELS[d]}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="permanentAddress.district" render={({ field }) => (<FormItem><FormLabel>জেলা <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={(field.value as string) || undefined} disabled={!permanentDivision}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder={permanentDivision ? "জেলা নির্বাচন করুন" : "আগে বিভাগ সিলেক্ট করুন"} /></SelectTrigger></FormControl><SelectContent>{permanentDivision && DISTRICTS_BY_DIVISION[permanentDivision]?.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="permanentAddress.upazila" render={({ field }) => (<FormItem><FormLabel>উপজেলা <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={(field.value as string) || undefined} disabled={!districtPermanent}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder={districtPermanent ? "উপজেলা" : "আগে জেলা নির্বাচন করুন"} /></SelectTrigger></FormControl><SelectContent>{districtPermanent && UPAZILAS_BY_DISTRICT[districtPermanent]?.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="permanentAddress.thana" render={({ field }) => (<FormItem><FormLabel>থানা <span className="text-cyan-500">*</span></FormLabel><Select onValueChange={field.onChange} value={(field.value as string) || undefined} disabled={!districtPermanent}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder={districtPermanent ? "থানা" : "আগে জেলা নির্বাচন করুন"} /></SelectTrigger></FormControl><SelectContent>{districtPermanent && UPAZILAS_BY_DISTRICT[districtPermanent]?.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="permanentAddress.postOffice" render={({ field }) => (<FormItem><FormLabel>পোস্ট অফিস <span className="text-cyan-500">*</span></FormLabel><FormControl><VoiceInputBn placeholder="নাম" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="permanentAddress.postCode" render={({ field }) => (<FormItem><FormLabel>পোস্ট কোড</FormLabel><FormControl><Input placeholder="যেমন: ১২৩০" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="permanentAddress.village" render={({ field }) => (<FormItem className="sm:col-span-2 lg:col-span-3"><FormLabel>গ্রাম / ইউনিয়ন / এলাকা <span className="text-cyan-500">*</span></FormLabel><FormControl><VoiceInputBn placeholder="বিস্তারিত ঠিকানা" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div></motion.div>)}
          </div>

          <Separator className="opacity-50" />

          {/* Identity Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold"><IdCard className="h-5 w-5" /><span>পরিচয়পত্র ও অন্যান্য (Identity & Others)</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="nidNumber" render={({ field }) => (<FormItem><FormLabel>জাতীয় পরিচয়পত্র নম্বর (NID) <span className="text-cyan-500">*</span></FormLabel><FormControl><Input placeholder="আপনার ১০ বা ১৭ ডিজিটের NID লিখুন" className="bg-white/50 dark:bg-zinc-900/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (<FormItem><FormLabel>জন্ম তারিখ <span className="text-cyan-500">*</span></FormLabel><FormControl><DatePicker date={field.value ? new Date(field.value) : undefined} setDate={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")} startYear={1950} endYear={new Date().getFullYear() - 10} placeholder="জন্ম তারিখ নির্বাচন করুন" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-3">
                <FormLabel className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">এনআইডি সামনের অংশ (Front Copy) <span className="text-cyan-500">*</span><HelpTooltip content="আপনার জাতীয় পরিচয়পত্রের সামনের পাতার পরিষ্কার ছবি বা স্ক্যান কপি আপলোড করুন।" /></FormLabel>
                <div onClick={() => nidFrontRef.current?.click()} className={cn("relative group h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-white/30 dark:bg-zinc-950/20 cursor-pointer hover:bg-cyan-50/10", nidFrontUrl ? "border-cyan-500" : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400")}>
                  {nidFrontUrl ? (<div className="relative w-full h-full"><Image src={nidFrontUrl} alt="NID Front" fill className="object-cover" /><button type="button" onClick={(e) => { e.stopPropagation(); if (nidFrontUrl.startsWith('blob:')) URL.revokeObjectURL(nidFrontUrl); setNidFrontUrl(null); setNidFrontFile(null); if (nidFrontRef.current) nidFrontRef.current.value = ""; }} className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all z-10"><X className="h-4 w-4" /></button></div>) : (<div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform"><div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center"><FileUp className="h-6 w-6 text-cyan-600 dark:text-cyan-400" /></div><span className="text-xs font-bold text-cyan-600">ছবি আপলোড করুন</span></div>)}
                  <input ref={nidFrontRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'front')} />
                </div>
              </div>
              <div className="space-y-3">
                <FormLabel className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">এনআইডি পিছনের অংশ (Back Copy) <span className="text-cyan-500">*</span><HelpTooltip content="আপনার জাতীয় পরিচয়পত্রের পিছনের পাতার পরিষ্কার ছবি বা স্ক্যান কপি আপলোড করুন।" /></FormLabel>
                <div onClick={() => nidBackRef.current?.click()} className={cn("relative group h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-white/30 dark:bg-zinc-950/20 cursor-pointer hover:bg-cyan-50/10", nidBackUrl ? "border-cyan-500" : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400")}>
                  {nidBackUrl ? (<div className="relative w-full h-full"><Image src={nidBackUrl} alt="NID Back" fill className="object-cover" /><button type="button" onClick={(e) => { e.stopPropagation(); if (nidBackUrl.startsWith('blob:')) URL.revokeObjectURL(nidBackUrl); setNidBackUrl(null); setNidBackFile(null); if (nidBackRef.current) nidBackRef.current.value = ""; }} className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all z-10"><X className="h-4 w-4" /></button></div>) : (<div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform"><div className="h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center"><FileUp className="h-6 w-6 text-cyan-600 dark:text-cyan-400" /></div><span className="text-xs font-bold text-cyan-600">ছবি আপলোড করুন</span></div>)}
                  <input ref={nidBackRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'back')} />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <FormField control={form.control} name="bloodGroup" render={({ field }) => (<FormItem><FormLabel>রক্তের গ্রুপ</FormLabel><Select onValueChange={field.onChange} value={field.value || undefined}><FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-900/50"><SelectValue placeholder="সিলেক্ট" /></SelectTrigger></FormControl><SelectContent>{BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg === "unknown" ? "জানা নেই" : bg}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
          </div>

          <div className="flex justify-between pt-6 relative z-50">
            <Button type="button" variant="ghost" onClick={onPrev} className="text-zinc-500 hover:text-cyan-600 hover:bg-cyan-50 transition-all rounded-xl px-6">← ফিরে যান</Button>
            <button
              type="submit"
              form="addressIDForm"
              className="bg-cyan-500 hover:bg-cyan-600 text-white min-w-[150px] shadow-lg shadow-cyan-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold px-8 py-3 text-lg relative z-50"
              onClick={(e) => {
                console.log('Step2 Next button clicked');
                console.log('Form values:', form.getValues());
                console.log('Form errors:', form.formState.errors);
              }}
            >
              পরবর্তী ধাপ →
            </button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
