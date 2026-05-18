'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Wallet,
  UserPlus,
  ShieldCheck,
  Phone,
  Banknote,
  FileText,
  ChevronDown,
  ChevronUp,
  Printer,
  RotateCcw,
  FileSignature,
  Upload,
  X,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/DatePicker';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import {
  paymentReferenceSchema,
  type PaymentReferenceData,
  PAYMENT_METHOD_LABELS,
  MOBILE_BANKING_PROVIDERS,
} from '@/validations/staff';
import {
  useStaffFormStore,
  useStep6Data,
  useStep3Data,
} from '@/store/staffFormStore';
import { useTermsByDesignation } from '@/lib/hooks/use-terms';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { fileToBase64, validateFile } from '@/lib/utils/file';
import { compressImage } from '@/lib/utils';
import { Download } from 'lucide-react';
import { VoiceInputBn } from '@/components/ui/voice-input';

const generateTermsHTML = (terms: any, designation: string) => {
  if (!terms) return '';

  let content = `${terms.title}\n\n`;
  terms.sections.forEach((section: any) => {
    content += `${section.title}\n\n`;
    section.content.forEach((item: string) => {
      content += `• ${item}\n`;
    });
    content += `\n`;
  });

  return `
    <html>
      <head>
        <title>নিয়ম ও শর্তাবলী - ${designation}</title>
        <link href="https://fonts.googleapis.com/css2?family=Kalpurush&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { font-family: 'Kalpurush', 'Nikosh', sans-serif; padding: 40px; line-height: 2; font-size: 16px; }
          h1 { text-align: center; color: #0891b2; font-size: 32px; margin-bottom: 30px; font-weight: bold; }
          h2 { color: #0e7490; margin-top: 30px; margin-bottom: 15px; font-size: 20px; }
          ul { padding-left: 25px; margin: 0; }
          li { margin-bottom: 8px; text-align: justify; }
          .footer { margin-top: 40px; text-align: center; border-top: 1px solid #ccc; padding-top: 20px; color: #666; font-size: 12px; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; padding: 0 50px; }
          .sig-box { text-align: center; border-top: 1px solid #333; padding-top: 5px; width: 200px; }
          @media print { * { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; } }
        </style>
      </head>
      <body>
        <h1>মানযিল ইনস্টিটিউট</h1>
        <h2>${terms.title}</h2>
        <pre style="white-space: pre-wrap; font-family: 'Kalpurush', sans-serif; font-size: 14px; line-height: 2; border: none; padding: 0; margin: 0;">${content}</pre>
        <div class="signature">
          <div class="sig-box"><br/><br/><br/><p>আবেদনকারীর স্বাক্ষর</p><p>তারিখ: _____________</p></div>
          <div class="sig-box"><br/><br/><br/><p>কর্তৃপক্ষের স্বাক্ষর</p><p>তারিখ: _____________</p></div>
        </div>
        <div class="footer"><p>Generated on ${new Date().toLocaleDateString('bn-BD')} | মানযিল ইনস্টিটিউট</p></div>
      </body>
    </html>
  `;
};

const generateTermsPrint = (terms: any, designation: string) => {
  const html = generateTermsHTML(terms, designation);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
};

const generateTermsDownload = async (terms: any, designation: string) => {
  try {
    if (!terms) {
      toast.error('কোনো টার্মস পাওয়া যায়নি');
      return;
    }

    toast.info('Download শুরু হয়েছে');

    // Create HTML content with Bengali font
    const html = generateTermsHTML(terms, designation);

    // Create blob and download
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manzil-terms.html';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast.success('Download সম্পন্ন হয়েছে। PDF তে প্রিন্ট করুন।');
  } catch (err) {
    console.error('Download error:', err);
    toast.error('Download ব্যর্থ হয়েছে');
  }
};

interface StepProps {
  onPrev: () => void;
  onSubmit: (data: PaymentReferenceData) => void;
  isLoading?: boolean;
  designation?: string;
}

export default function Step6PaymentAgreement({
  onPrev,
  onSubmit,
  isLoading,
  designation: propDesignation,
}: StepProps) {
  const step3Data = useStep3Data();
  const savedData = useStep6Data();
  const { setStep6Data, markIncomplete } = useStaffFormStore();

  // Use prop designation or fall back to step3Data
  const designation = propDesignation || step3Data?.designation || '';
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);
  const currentDesignation = designation || '';

  const { data: currentTerms, isLoading: termsLoading } = useTermsByDesignation(
    designation || ''
  );

  const showTermsSection = !!currentDesignation;
  const hideTerms = false;

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    savedData?.signatureUrl ?? null
  );
  const [isCompressing, setIsCompressing] = useState(false);
  const signatureRef = useRef<HTMLInputElement>(null);

  const form = useForm<PaymentReferenceData>({
    resolver: zodResolver(paymentReferenceSchema),
    defaultValues: {
      expectedSalary: savedData?.expectedSalary ?? undefined,
      expectedJoiningDate:
        savedData?.expectedJoiningDate ??
        new Date().toISOString().split('T')[0],
      paymentMethod: savedData?.paymentMethod ?? undefined,
      bankName: savedData?.bankName ?? '',
      bankBranch: savedData?.bankBranch ?? '',
      accountName: savedData?.accountName ?? '',
      accountNumber: savedData?.accountNumber ?? '',
      mobileBankingProvider: savedData?.mobileBankingProvider ?? undefined,
      mobileBankingNumber: savedData?.mobileBankingNumber ?? '',
      declaration: savedData?.declaration ?? false,
      termsAccepted: savedData?.termsAccepted ?? false,
      signatureFile: undefined,
      signatureUrl: savedData?.signatureUrl ?? undefined,
      additionalNotes: savedData?.additionalNotes ?? '',
    },
  });

  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;

    if (savedData && Object.keys(savedData).length > 0) {
      form.reset({
        expectedSalary: savedData.expectedSalary ?? undefined,
        expectedJoiningDate:
          savedData.expectedJoiningDate ??
          new Date().toISOString().split('T')[0],
        paymentMethod: savedData.paymentMethod ?? undefined,
        bankName: savedData.bankName ?? '',
        bankBranch: savedData.bankBranch ?? '',
        accountName: savedData.accountName ?? '',
        accountNumber: savedData.accountNumber ?? '',
        mobileBankingProvider: savedData.mobileBankingProvider ?? undefined,
        mobileBankingNumber: savedData.mobileBankingNumber ?? '',
        declaration: savedData.declaration ?? false,
        termsAccepted: savedData.termsAccepted ?? false,
        signatureFile: undefined,
        signatureUrl: savedData.signatureUrl ?? undefined,
        additionalNotes: savedData.additionalNotes ?? '',
      });
      if (savedData.signatureUrl) {
        setSignaturePreview(savedData.signatureUrl);
        setSignatureFile(null);
      }
    }
    hasRestored.current = true;
  }, [form, savedData]);

  // FIXED: Proper auto-save with correct subscription cleanup
  useEffect(() => {
    const sub = form.watch(value => {
      setStep6Data(value);
    });
    return () => sub.unsubscribe();
  }, [form, setStep6Data]);

  const paymentMethod = form.watch('paymentMethod');

  const handleSignatureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, {
      maxSizeMB: 2,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });
    if (!validation.valid) {
      toast.error(validation.error || 'সিগনেচার ফাইল সাইজ বা টাইপ সঠিক নয়');
      return;
    }

    setIsCompressing(true);
    let blobUrl: string | null = null;
    try {
      const compressed = await compressImage(file, 0.9);
      blobUrl = URL.createObjectURL(compressed);
      const base64 = await fileToBase64(compressed);
      if (blobUrl) URL.revokeObjectURL(blobUrl);

      setSignatureFile(compressed);
      setSignaturePreview(base64);
      setStep6Data(prev => ({
        ...prev,
        signatureFile: compressed,
        signatureUrl: base64,
      }));
      toast.success('সিগনেচার আপলোড সম্পন্ন হয়েছে');
    } catch {
      toast.error('সিগনেচার প্রসেসিং এ সমস্যা হয়েছে');
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    } finally {
      setIsCompressing(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
    setStep6Data(prev => ({
      ...prev,
      signatureFile: undefined,
      signatureUrl: undefined,
    }));
  };

  const handleFinalSubmit = (data: PaymentReferenceData) => {
    // Validate signature uploaded
    if (!signaturePreview) {
      markIncomplete(6);
      toast.error('⚠️ আপনার স্বাক্ষর আপলোড করুন');
      return;
    }

    const submissionData = {
      ...data,
      signatureFile,
      signatureUrl: signaturePreview,
    };
    setStep6Data(submissionData);
    queueMicrotask(() => onSubmit(submissionData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="kalpurush-font"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFinalSubmit)}
          className="space-y-10"
        >
          {/* Section: Expected Terms */}
          {!hideTerms && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary dark:text-primary font-semibold">
                <Banknote className="h-5 w-5" />
                <span>বেতন ও যোগদানের তথ্য (Terms)</span>
              </div>

              {/* Terms Skeleton while loading */}
              {termsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-primary/5 dark:bg-primary/20 border border-primary/20 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-primary/20 rounded" />
                    <div className="h-12 w-full bg-primary/20 rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-32 bg-primary/20 rounded" />
                    <div className="h-12 w-full bg-primary/20 rounded-xl" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-primary/5 dark:bg-primary/20 border border-primary/20">
                  <FormField
                    control={form.control}
                    name="expectedJoiningDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary dark:text-primary/70 font-bold">
                          প্রত্যাশিত যোগদানের তারিখ{' '}
                          <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={d =>
                              field.onChange(d ? format(d, 'yyyy-MM-dd') : '')
                            }
                            startYear={new Date().getFullYear()}
                            endYear={new Date().getFullYear() + 5}
                            placeholder="যোগদানের তারিখ নির্বাচন করুন"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary dark:text-primary/70 font-bold">
                          প্রত্যাশিত মাসিক বেতন (৳){' '}
                          <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <VoiceInputBn
                            placeholder="যেমন: ২০০০০ বা 20000"
                            className="h-12 bg-background/80 backdrop-blur-sm border-primary/20 dark:border-primary"
                            value={field.value ? String(field.value) : ''}
                            onChange={e => {
                              const val = e.target.value;
                              const banglaToEng: Record<string, string> = {
                                '০': '0',
                                '১': '1',
                                '২': '2',
                                '৩': '3',
                                '৪': '4',
                                '৫': '5',
                                '৬': '6',
                                '৭': '7',
                                '৮': '8',
                                '৯': '9',
                              };
                              const engVal = val.replace(
                                /[০-৯]/g,
                                d => banglaToEng[d] || d
                              );
                              const num = parseInt(engVal) || 0;
                              field.onChange(num);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          <Separator className="opacity-30" />

          {/* Section: Payment Method */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary dark:text-primary font-semibold">
              <Wallet className="h-5 w-5" />
              <span>পেমেন্ট তথ্য (Payment Details)</span>
            </div>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    পেমেন্ট মেথড নির্বাচন করুন{' '}
                    <span className="text-primary">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-background/50 backdrop-blur-sm">
                        <SelectValue placeholder="সিলেক্ট মেথড" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(PAYMENT_METHOD_LABELS).map(
                        ([v, l], i) => (
                          <SelectItem key={`payment-${v}-${i}`} value={v}>
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
            <AnimatePresence mode="wait">
              {paymentMethod === 'bank' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-dashed border-primary/20 dark:border-primary"
                >
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>ব্যাংকের নাম</FormLabel>
                        <FormControl>
                          <VoiceInputBn
                            placeholder="ইসলামী ব্যাংক"
                            className="bg-background/50 backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankBranch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>শাখার নাম</FormLabel>
                        <FormControl>
                          <VoiceInputBn
                            placeholder="শাখার নাম"
                            className="bg-background/50 backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>অ্যাকাউন্ট নাম</FormLabel>
                        <FormControl>
                          <VoiceInputBn
                            placeholder="হোল্ডারের নাম"
                            className="bg-background/50 backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>অ্যাকাউন্ট নম্বর</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="নম্বর লিখুন"
                            className="bg-background/50 backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
              {paymentMethod === 'mobile_banking' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl border border-dashed border-primary/20 dark:border-primary"
                >
                  <FormField
                    control={form.control}
                    name="mobileBankingProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>প্রোভাইডার</FormLabel>{' '}
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                              <SelectValue placeholder="সিলেক্ট" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(MOBILE_BANKING_PROVIDERS).map(
                              ([v, l], i) => (
                                <SelectItem key={`mobile-${v}-${i}`} value={v}>
                                  {l}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobileBankingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>মোবাইল ব্যাংকিং নম্বর</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="01XXXXXXXXX"
                            className="bg-background/50 backdrop-blur-sm"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Separator className="opacity-30" />

          {/* Section: Additional Notes */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary dark:text-primary font-semibold">
              <FileText className="h-5 w-5" />
              <span>অতিরিক্ত তথ্য / নোট (Additional Info)</span>
            </div>
            <div className="p-6 rounded-2xl bg-white/40 dark:bg-zinc-900/40 border border-white/20 shadow-lg">
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      অতিরিক্ত নোট / বিশেষ তথ্য
                      <HelpTooltip content="আপনার কোনো বিশেষ প্রয়োজন, শর্ত, বা অন্য কিছু থাকলে এখানে লিখুন। যেমন: থাকার ব্যবস্থা, বেতন সম্পর্কে শর্ত, অন্য কোনো বিশেষ বিষয়..." />
                    </FormLabel>
                    <FormControl>
                      <VoiceInputBn
                        placeholder="যেমন: থাকার ব্যবস্থা, বেতন সম্পর্কে শর্ত, বা অন্য কোনো বিশেষ বিষয়..."
                        className="min-h-[100px] w-full p-3 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/20 dark:border-primary/20 text-sm resize-none"
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Dynamic Terms & Conditions Section */}
          {showTermsSection &&
            (termsLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Separator className="opacity-30" />
                <div className="p-6 rounded-xl bg-primary/5 dark:bg-primary/20 border border-primary/20 dark:border-primary text-center">
                  <p className="text-primary dark:text-primary/70 font-medium">
                    নিয়ম ও শর্তাবলী লোড হচ্ছে...
                  </p>
                </div>
              </motion.div>
            ) : currentTerms ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Separator className="opacity-30" />
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-primary dark:text-primary font-semibold">
                    <FileText className="h-5 w-5" />
                    <span>নিয়ম ও শর্তাবলী (Terms & Conditions)</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        generateTermsPrint(currentTerms, currentDesignation)
                      }
                      className="text-primary border-primary/20 hover:bg-primary/5"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      প্রিন্ট
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.success('Download শুরু হয়েছে');
                        generateTermsDownload(currentTerms, currentDesignation);
                      }}
                      className="text-primary border-primary/20 hover:bg-primary/5"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      ডাউনলোড
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsTermsExpanded(!isTermsExpanded)}
                      className="text-primary border-primary/20 hover:bg-primary/5"
                    >
                      {isTermsExpanded ? (
                        <>
                          লুকান <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          দেখুন <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <AnimatePresence>
                  {isTermsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-2xl border border-primary/20 dark:border-primary bg-white/50 dark:bg-zinc-900/50 overflow-hidden"
                    >
                      <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                        <h3 className="text-lg font-bold text-primary dark:text-primary text-center border-b border-primary/20 dark:border-primary pb-3">
                          {currentTerms.title}
                        </h3>
                        {currentTerms.sections.map((section, idx) => (
                          <div key={idx} className="space-y-2">
                            <h4 className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                              {section.title}
                            </h4>
                            <ul className="space-y-1">
                              {section.content.map((item, itemIdx) => (
                                <li
                                  key={itemIdx}
                                  className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex gap-2"
                                >
                                  <span className="text-primary mt-0.5">
                                    •
                                  </span>
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
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 dark:bg-primary/10/20 border border-primary/20 dark:border-primary">
                  <Checkbox
                    id="termsAccepted"
                    checked={form.watch('termsAccepted') || false}
                    onCheckedChange={checked =>
                      form.setValue('termsAccepted', checked as boolean)
                    }
                    className="h-5 w-5 border-primary"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm font-medium text-primary dark:text-primary/70 cursor-pointer"
                  >
                    আমি উপরের সকল{' '}
                    <span className="font-bold underline">
                      নিয়ম ও শর্তাবলী
                    </span>{' '}
                    পড়ে বুঝেছি এবং সম্মত হচ্ছি।
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                </div>
              </motion.div>
            ) : null)}

          {/* Signature Upload */}
          <div className="space-y-3">
            <FormLabel className="flex items-center gap-2 font-semibold text-primary dark:text-primary">
              <FileSignature className="h-5 w-5" />
              <span>স্বাক্ষর (Signature)</span>
              <span className="text-red-500">*</span>
              <HelpTooltip content="আপনার স্বাক্ষরকৃত হস্তাক্ষরের ছবি বা স্ক্যান করা ফাইল আপলোড করুন" />
            </FormLabel>

            <div
              onClick={() => signatureRef.current?.click()}
              className="relative group h-40 rounded-2xl border-2 border-dashed border-primary/20 dark:border-primary hover:border-primary transition-all overflow-hidden cursor-pointer flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm hover:bg-primary/5/30 dark:hover:bg-primary/10/20"
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-primary">
                    প্রসেসিং...
                  </span>
                </div>
              ) : signaturePreview ? (
                <div className="flex flex-col items-center gap-3 text-center px-4">
                  <img
                    src={signaturePreview}
                    alt="Signature preview"
                    className="max-h-32 rounded-lg shadow-md"
                  />
                  <span className="text-sm font-bold text-primary dark:text-primary">
                    স্বাক্ষর আপলোড সম্পন্ন
                  </span>
                  <span className="text-xs text-primary dark:text-primary/70">
                    (পুনরায় আপলোড করতে ক্লিক করুন)
                  </span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      removeSignature();
                    }}
                    className="mt-2 text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> মুছে ফেলুন
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform">
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary dark:text-primary" />
                  </div>
                  <span className="text-sm font-bold text-primary dark:text-primary">
                    ক্লিক করে সিগনেচার আপলোড করুন
                  </span>
                  <span className="text-xs text-primary dark:text-primary/70">
                    PNG / JPEG (সর্বোচ্চ ২MB)
                  </span>
                </div>
              )}
              <input
                ref={signatureRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleSignatureChange}
                capture="environment"
              />
            </div>
            <p className="text-xs text-primary dark:text-primary/70">
              আপনার স্বাক্ষরকৃত হস্তাক্ষরের ছবি ফাইল আপলোড করুন
            </p>
          </div>

          {/* Declaration */}
          <FormField
            control={form.control}
            name="declaration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border-2 border-primary/20 dark:border-primary/50 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-xl shadow-primary/5 transition-all hover:bg-white dark:hover:bg-zinc-900">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5 border-primary"
                  />
                </FormControl>
                <div className="space-y-2 leading-none">
                  <FormLabel className="text-lg font-bold text-primary dark:text-primary/70">
                    ঘোষণাপত্র (Declaration)
                  </FormLabel>
                  <FormDescription className="text-sm font-medium leading-relaxed">
                    আমি এই মর্মে ঘোষণা করছি যে, এই ফরমে প্রদানকৃত সকল তথ্য আমার
                    জ্ঞানত সত্য ও সঠিক।
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center pt-6">
            {/* Reset Button - Beautiful Red Gradient */}
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (
                  confirm(
                    'সম্পূর্ণ ফর্ম রিসেট করতে চান?\n\nসব তথ্য মোছানো হবে।'
                  )
                ) {
                  useStaffFormStore.getState().reset();
                  window.location.reload();
                }
              }}
              className="text-zinc-500 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/20 rounded-xl px-6 h-12 font-medium transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <RotateCcw className="h-5 w-5 mr-2" />
              <span>ফর্ম রিসেট</span>
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onPrev}
                disabled={isLoading}
                className="text-zinc-500 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/20 rounded-xl px-6 h-12 font-medium transition-all"
              >
                ← ফিরে যান
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={isLoading || !signaturePreview}
                onClick={() => {
                  if (!signaturePreview) {
                    toast.error('স্বাক্ষর আপলোড করা বাধ্যতামূলক');
                    return;
                  }
                  const data = form.getValues();
                  handleFinalSubmit(data);
                }}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 min-w-[180px] rounded-xl font-bold h-12 text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>জমা হচ্ছে...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    ফরম জমা দিন
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
