"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Wallet, 
  Calendar, 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Building2, 
  Smartphone,
  Banknote,
  Clock,
  Calendar as CalendarIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/DatePicker";

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
import { Separator } from "@/components/ui/separator";

import {
  paymentReferenceSchema,
  type PaymentReferenceData,
  PAYMENT_METHOD_LABELS,
  MOBILE_BANKING_PROVIDERS,
} from "@/validations/staff";
import { useStaffFormStore, useStep4Data } from "@/store/staffFormStore";
import { getTermsByDesignation, DESIGNATIONS_REQUIRING_TERMS } from "@/config/terms";
import { HelpTooltip } from "@/components/ui/HelpTooltip";
import { Download, FileText, ChevronDown, ChevronUp, Printer } from "lucide-react";
import { useState } from "react";

// Simple print function - without useCallback hook at top level
const generateTermsPrint = (terms: any, designation: string) => {
  if (!terms) return;
  
  let content = `${terms.title}\n\n`;
  terms.sections.forEach((section: any) => {
    content += `${section.title}\n\n`;
    section.content.forEach((item: string) => {
      content += `• ${item}\n`;
    });
    content += `\n`;
  });
  
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>নিয়ম ও শর্তাবলী - ${designation}</title>
          <link href="https://fonts.googleapis.com/css2?family=Kalpurush&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Kalpurush', 'Nikosh', 'SolimanL', sans-serif; 
              padding: 40px; 
              line-height: 2; 
              font-size: 16px;
            }
            h1 { 
              text-align: center; 
              color: #0891b2; 
              font-size: 32px;
              margin-bottom: 30px;
              font-weight: bold;
            }
            h2 { 
              color: #0e7490; 
              margin-top: 30px; 
              margin-bottom: 15px;
              font-size: 20px;
              border-bottom: none;
              padding-bottom: 0;
            }
            h3 {
              color: #155e75;
              font-size: 16px;
              margin-top: 15px;
              margin-bottom: 8px;
            }
            ul { 
              padding-left: 25px; 
              margin: 0;
            }
            li { 
              margin-bottom: 8px; 
              text-align: justify;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              border-top: 1px solid #ccc;
              padding-top: 20px;
              color: #666;
              font-size: 12px;
            }
            .signature {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              padding: 0 50px;
            }
            .sig-box {
              text-align: center;
              border-top: 1px solid #333;
              padding-top: 5px;
              width: 200px;
            }
            @media print { 
              * { 
                print-color-adjust: exact !important; 
                -webkit-print-color-adjust: exact !important;
              }
              input[type="color"] { display: none !important; }
              ::-webkit-color-swatch { display: none !important; }
              ::-webkit-color-swatch-wrapper { display: none !important; }
              input[type="color"]::-webkit-color-swatch { display: none !important; }
              input[type="color"]::-webkit-color-swatch-wrapper { display: none !important; }
            }
          </style>
        </head>
        <body>
          <h1>মানযিল ইনস্টিটিউট</h1>
          <h2>${terms.title}</h2>
          <pre style="white-space: pre-wrap; font-family: 'Kalpurush', sans-serif; font-size: 14px; line-height: 2; border: none; padding: 0; margin: 0;">${content}</pre>
          
          <div class="signature">
            <div class="sig-box">
              <br/><br/><br/>
              <p>আবেদনকারীর স্বাক্ষর</p>
              <p>তারিখ: _____________</p>
            </div>
            <div class="sig-box">
              <br/><br/><br/>
              <p>কর্তৃপক্ষের স্বাক্ষর</p>
              <p>তারিখ: _____________</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString("bn-BD")} | মানযিল ইনস্টিটিউট</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

interface StepProps {
  onPrev:   () => void;
  onSubmit: (data: PaymentReferenceData) => void;
  isLoading?: boolean;
}

export default function Step4PaymentReference({ onPrev, onSubmit, isLoading, designation }: StepProps & { designation?: string }) {
  const savedData = useStep4Data();
  const { setStep4Data } = useStaffFormStore();

  // Get terms for current designation
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);
  const currentDesignation = designation || "";
  const currentTerms = designation ? getTermsByDesignation(designation) : null;
  const showTermsSection = currentTerms && DESIGNATIONS_REQUIRING_TERMS.includes(currentDesignation);
  
  const hideTerms = currentDesignation === "adviser" || currentDesignation === "unpaid_teacher";

  const form = useForm<PaymentReferenceData>({
    resolver: zodResolver(paymentReferenceSchema) as any,
    defaultValues: {
      expectedSalary:       savedData.expectedSalary       ?? undefined,
      expectedJoiningDate:  savedData.expectedJoiningDate  ?? new Date().toISOString().split("T")[0],
      noticePeriod:         savedData.noticePeriod         ?? "",
      paymentMethod:         savedData.paymentMethod         ?? undefined,
      bankName:              savedData.bankName              ?? "",
      bankBranch:            savedData.bankBranch            ?? "",
      accountName:           savedData.accountName           ?? "",
      accountNumber:         savedData.accountNumber         ?? "",
      mobileBankingProvider: savedData.mobileBankingProvider ?? undefined,
      mobileBankingNumber:   savedData.mobileBankingNumber   ?? "",
      referenceName:         savedData.referenceName         ?? "",
      referencePhone:        savedData.referencePhone        ?? "",
      referenceOccupation:   savedData.referenceOccupation   ?? "",
      phonePrimary:          savedData.phonePrimary          ?? "",
      phoneSecondary:        savedData.phoneSecondary        ?? "",
      whatsappNo:            savedData.whatsappNo            ?? "",
      email:                 savedData.email                 ?? "",
      emergencyContactNo:    savedData.emergencyContactNo    ?? "",
      emergencyRelationship: savedData.emergencyRelationship ?? "",
      declaration:           savedData.declaration           ?? false,
    },
  });

  // Restore form data on mount (when navigating back to this step)
  useEffect(() => {
    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        expectedSalary:       savedData.expectedSalary       ?? undefined,
        expectedJoiningDate:  savedData.expectedJoiningDate  ?? new Date().toISOString().split("T")[0],
        noticePeriod:         savedData.noticePeriod         ?? "",
        paymentMethod:         savedData.paymentMethod         ?? undefined,
        bankName:              savedData.bankName              ?? "",
        bankBranch:            savedData.bankBranch            ?? "",
        accountName:           savedData.accountName           ?? "",
        accountNumber:         savedData.accountNumber         ?? "",
        mobileBankingProvider: savedData.mobileBankingProvider ?? undefined,
        mobileBankingNumber:   savedData.mobileBankingNumber   ?? "",
        referenceName:         savedData.referenceName         ?? "",
        referencePhone:        savedData.referencePhone        ?? "",
        referenceOccupation:   savedData.referenceOccupation   ?? "",
        phonePrimary:          savedData.phonePrimary          ?? "",
        phoneSecondary:        savedData.phoneSecondary        ?? "",
        email:                 savedData.email                 ?? "",
        declaration:           savedData.declaration           ?? false,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save form data on every change (real-time draft)
  useEffect(() => {
    const subscription = form.watch((value) => {
      setStep4Data(value as Partial<PaymentReferenceData>);
    });
    return () => subscription.unsubscribe();
  }, [form, setStep4Data]);

  const paymentMethod = form.watch("paymentMethod");

  const handleFinalSubmit = (data: PaymentReferenceData) => {
    const result = paymentReferenceSchema.safeParse(data);
    if (!result.success) {
      const missingFields = result.error.issues.map((issue) => issue.message);
      toast.error("অনুগ্রহ করে নিচের তথ্যগুলো পূরণ করুন:\n" + missingFields.join(", "));
      return;
    }
    setStep4Data(data);
    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="kalpurush-font"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinalSubmit as any)} className="space-y-10">
          
          {/* Section: Expected Terms */}
          {!hideTerms && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <Banknote className="h-5 w-5" />
              <span>বেতন ও যোগদানের তথ্য (Terms)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-cyan-50/20 dark:bg-cyan-950/10 border border-cyan-100/50">
              <FormField control={form.control} name="expectedSalary" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-cyan-800 dark:text-cyan-300 font-bold">প্রত্যাশিত মাসিক বেতন (৳) <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-lg text-zinc-400 font-bold">৳</span>
                      <Input 
                        type="number" 
                        placeholder="১০০০০" 
                        className="pl-10 h-12 text-lg font-bold bg-white/70 dark:bg-zinc-950/50 border-cyan-200 dark:border-cyan-800 text-cyan-600 focus:ring-cyan-500" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="expectedJoiningDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>প্রত্যাশিত / যোগদানের তারিখ <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl>
                    <DatePicker 
                      date={field.value ? new Date(field.value) : undefined} 
                      setDate={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                      startYear={new Date().getFullYear() - 1}
                      endYear={new Date().getFullYear() + 2}
                      placeholder="যোগদানের তারিখ নির্বাচন করুন"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="noticePeriod" render={({ field }) => (
                <FormItem>
                  <FormLabel>নোটিশ পিরিয়ড / যোগদানের সম্ভাব্য সময় <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl><VoiceInputBn placeholder="যেমন: ১ সপ্তাহ পর বা অলরেডি জয়েন করেছি" className="h-12 bg-white/70 dark:bg-zinc-950/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
          )}

          <Separator className="opacity-30" />

          {/* Section: Contact Details (Primary) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <Phone className="h-5 w-5" />
              <span>যোগাযোগের জন্য তথ্য (Contact)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="phonePrimary" render={({ field }) => (
                <FormItem>
                  <FormLabel>মোবাইল নম্বর <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl><Input placeholder="01XXXXXXXXX" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="whatsappNo" render={({ field }) => (
                <FormItem>
                  <FormLabel>হোয়াটসঅ্যাপ নম্বর</FormLabel>
                  <FormControl><Input placeholder="01XXXXXXXXX (ঐচ্ছিক)" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>ইমেইল এড্রেস</FormLabel>
                  <FormControl><Input placeholder="example@email.com (ঐচ্ছিক)" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Section: Emergency Contact */}
          <Separator className="opacity-30" />
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              <span>জরুরি যোগাযোগ (Emergency Contact)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="emergencyContactNo" render={({ field }) => (
                <FormItem>
                  <FormLabel>জরুরি যোগাযোগের নম্বর <span className="text-cyan-500">*</span></FormLabel>
                  <FormControl><Input placeholder="01XXXXXXXXX" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="emergencyRelationship" render={({ field }) => (
                <FormItem>
                  <FormLabel>সম্পর্ক <span className="text-cyan-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-11 bg-white/50 dark:bg-zinc-950/50">
                        <SelectValue placeholder="সিলেক্ট করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="father">বাবা</SelectItem>
                      <SelectItem value="mother">মা</SelectItem>
                      <SelectItem value="spouse">স্বামী/স্ত্রী</SelectItem>
                      <SelectItem value="brother">ভাই</SelectItem>
                      <SelectItem value="sister">বোন</SelectItem>
                      <SelectItem value="son">ছেলে</SelectItem>
                      <SelectItem value="daughter">মেয়ে</SelectItem>
                      <SelectItem value="uncle">চাচা/মামা</SelectItem>
                      <SelectItem value="aunt">চাচী/মামী</SelectItem>
                      <SelectItem value="grandfather">দাদা/নানা</SelectItem>
                      <SelectItem value="grandmother">দাদী/নানী</SelectItem>
                      <SelectItem value="friend">বন্ধু</SelectItem>
                      <SelectItem value="teacher">শিক্ষক</SelectItem>
                      <SelectItem value="other">অন্যান্য</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Payment Method */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <Wallet className="h-5 w-5" />
              <span>পেমেন্ট তথ্য (Payment Details)</span>
            </div>
            
              <FormField control={form.control} name="paymentMethod" render={({ field }) => (
              <FormItem>
                <FormLabel>পেমেন্ট মেথড নির্বাচন করুন <span className="text-cyan-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl><SelectTrigger className="h-12 bg-white/50 dark:bg-zinc-950/50"><SelectValue placeholder="সিলেক্ট মেথড" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <AnimatePresence mode="wait">
              {paymentMethod === "bank" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-800">
                  <FormField control={form.control} name="bankName" render={({ field }) => (
                    <FormItem className="sm:col-span-2"><FormLabel>ব্যাংকের নাম</FormLabel><FormControl><VoiceInputBn placeholder="ইসলামী ব্যাংক" className="bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="accountName" render={({ field }) => (
                    <FormItem><FormLabel>অ্যাকাউন্ট নাম</FormLabel><FormControl><VoiceInputBn placeholder="হোল্ডারের নাম" className="bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="accountNumber" render={({ field }) => (
                    <FormItem><FormLabel>অ্যাকাউন্ট নম্বর</FormLabel><FormControl><Input placeholder="নম্বর লিখুন" className="bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl></FormItem>
                  )} />
                </motion.div>
              )}

              {paymentMethod === "mobile_banking" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-dashed border-cyan-200 dark:border-cyan-800">
                  <FormField control={form.control} name="mobileBankingProvider" render={({ field }) => (
                    <FormItem>
                      <FormLabel>প্রোভাইডার</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl><SelectTrigger className="bg-white/50 dark:bg-zinc-950/50"><SelectValue placeholder="সিলেক্ট" /></SelectTrigger></FormControl>
                        <SelectContent>{Object.entries(MOBILE_BANKING_PROVIDERS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="mobileBankingNumber" render={({ field }) => (
                    <FormItem><FormLabel>মোবাইল ব্যাংকিং নম্বর</FormLabel><FormControl><Input placeholder="01XXXXXXXXX" className="bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl></FormItem>
                  )} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Reference */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
              <UserPlus className="h-5 w-5" />
              <span>সুপারিশকারী / রেফারেন্স (Reference)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField control={form.control} name="referenceName" render={({ field }) => (
                <FormItem><FormLabel>সুপারিশকারীর নাম <span className="text-cyan-500">*</span></FormLabel><FormControl><VoiceInputBn placeholder="নাম লিখুন" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="referencePhone" render={({ field }) => (
                <FormItem><FormLabel>মোবাইল নম্বর <span className="text-cyan-500">*</span></FormLabel><FormControl><Input placeholder="01XXXXXXXXX" className="h-11 bg-white/50 dark:bg-zinc-950/50" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>

          {/* Dynamic Terms & Conditions Section */}
          {showTermsSection && currentTerms && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Separator className="opacity-30" />
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold">
                  <FileText className="h-5 w-5" />
                  <span>নিয়ম ও শর্তাবলী (Terms & Conditions)</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => generateTermsPrint(currentTerms, currentDesignation)}
                    className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    প্রিন্ট
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                    className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                  >
                    {isTermsExpanded ? (
                      <>লুকান <ChevronUp className="ml-1 h-4 w-4" /></>
                    ) : (
                      <>দেখুন <ChevronDown className="ml-1 h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isTermsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl border border-cyan-200 dark:border-cyan-800 bg-white/50 dark:bg-zinc-900/50 overflow-hidden"
                  >
                    <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                      <h3 className="text-lg font-bold text-cyan-700 dark:text-cyan-400 text-center border-b border-cyan-100 dark:border-cyan-800 pb-3">
                        {currentTerms.title}
                      </h3>
                      
                      {currentTerms.sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                          <h4 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">{section.title}</h4>
                          <ul className="space-y-1">
                            {section.content.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex gap-2">
                                <span className="text-cyan-500 mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <Checkbox 
                  id="termsAccepted" 
                  checked={form.watch("declaration") || false}
                  onCheckedChange={(checked) => form.setValue("declaration", checked as boolean)}
                  className="h-5 w-5 border-amber-500" 
                />
                <label htmlFor="termsAccepted" className="text-sm font-medium text-amber-800 dark:text-amber-300 cursor-pointer">
                  আমি উপরের সকল <span className="font-bold underline">নিয়ম ও শর্তাবলী</span> পড়ে বুঝেছি এবং সম্মত হচ্ছি।
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
            </motion.div>
          )}

          {/* Declaration */}
          <FormField
            control={form.control}
            name="declaration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border-2 border-cyan-100 dark:border-cyan-900/50 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-xl shadow-cyan-500/5 transition-all hover:bg-white dark:hover:bg-zinc-900">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5 border-cyan-500" /></FormControl>
                <div className="space-y-2 leading-none">
                  <FormLabel className="text-lg font-bold text-cyan-800 dark:text-cyan-300">ঘোষণাপত্র (Declaration)</FormLabel>
                  <FormDescription className="text-sm font-medium leading-relaxed">
                    আমি এই মর্মে ঘোষণা করছি যে, এই ফরমে প্রদানকৃত সকল তথ্য আমার জ্ঞানত সত্য ও সঠিক। কোনো তথ্য মিথ্যা প্রমাণিত হলে কর্তৃপক্ষ আমার বিরুদ্ধে আইনানুগ ব্যবস্থা গ্রহণ করতে পারবে।
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-6">
            <Button type="button" variant="destructive" onClick={() => {
              if (confirm("আপনি কি নিশ্চিত যে আপনি সম্পূর্ণ ফর্ম রিসেট করতে চান? সকল তথ্য মুছে যাবে।")) {
                useStaffFormStore.getState().reset();
                window.location.reload();
              }
            }} className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-6 h-12 font-bold transition-all hover:scale-105 active:scale-95">
              🗑️ রিসেট করুন
            </Button>
            <Button type="button" variant="ghost" onClick={onPrev} disabled={isLoading} className="text-zinc-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl px-6">
              ← ফিরে যান
            </Button>
            <Button type="submit" size="lg" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[180px] shadow-lg shadow-cyan-600/30 rounded-xl transition-all hover:scale-105 active:scale-95 font-bold h-12 text-lg">
              {isLoading ? (
                <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> জমান হচ্ছে...</span>
              ) : (
                "চূড়ান্ত সাবমিশন ✓"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
