'use client';

/**
 * Step6Success.tsx
 *
 * Final Success Screen Polish:
 * - High-fidelity "Success Card" design.
 * - Simplified information grid.
 * - Ultra-responsive action buttons.
 * - Professional print/download integration.
 * - Fixed Type Linting Errors.
 *
 * Bug Fix: Replaced html2canvas with native window.print() popup.
 * html2canvas does NOT support modern CSS color functions like lab(), oklch(),
 * etc. (used by shadcn/Radix UI) and throws a parse error at runtime.
 * The new printElement() helper opens a lightweight print popup, copies all
 * active stylesheets into it, and triggers the browser's native print dialog —
 * which has full CSS support and produces higher-quality output.
 */

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, Printer, Download, User, Home, 
  ArrowRight, RefreshCw, Smartphone, CreditCard, Calendar, Building2, Loader2 
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useStep5Data, useAdmissionUIStore } from '@/store/admissionFormStore';
import { AdmissionReceipt } from './AdmissionReceipt';
import { AdmissionApplicationForm } from './AdmissionApplicationForm';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { getAdmissionFullDetails } from '@/lib/actions/studentAdmission';
import { useFormContext } from 'react-hook-form';

/**
 * printElement
 * Opens a new browser window, copies styles + the element's HTML,
 * and calls print(). Works with any CSS including lab(), oklch(), etc.
 * @param el        The DOM element to print
 * @param filename  (unused — native print dialog handles saving as PDF)
 */
function printElement(el: HTMLElement) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('পপআপ ব্লক করা আছে। অনুগ্রহ করে এই সাইটের পপআপ অনুমতি দিন।');
    return;
  }

  // Collect all stylesheets from the current document
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((lnk) => lnk.outerHTML)
    .join('\n');

  const styleTags = Array.from(document.querySelectorAll('style'))
    .map((s) => s.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="${window.location.origin}">
        <title>Print</title>
        ${styleLinks}
        ${styleTags}
        <style>
          /* Force white background and remove screen-only chrome */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; background: white; }
          @media print { body { margin: 0; } }
          
          /* Aggressive hiding of injected browser extensions (ColorPickers, Grammarly, etc.) */
          body > *:not(#my-print-content) {
             display: none !important;
          }
        </style>
      </head>
      <body>
        <div id="my-print-content">
          ${el.innerHTML}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();

  // Wait for resources (fonts, images) to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Close after the print dialog is dismissed
    printWindow.addEventListener('afterprint', () => printWindow.close());
  };
}

export default function Step6Success() {
  const step5Data = useStep5Data();
  const { reset, setStep5Data } = useAdmissionUIStore();
  const { reset: resetForm } = useFormContext();
  const searchParams = useSearchParams();
  const successId = searchParams.get('successId');

  const [isFetchingDB, setIsFetchingDB] = useState(false);
  const hasHydrated = useRef(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingForm, setIsExportingForm] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const applicationRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════
  // NEXT LEVEL HYDRATION: Fetch from DB if store is empty (e.g. reload)
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    // If successId is present, we must ensure RHF is hydrated
    if (successId && !hasHydrated.current && !isFetchingDB) {
      const fetchData = async () => {
        setIsFetchingDB(true);
        try {
          const result = await getAdmissionFullDetails(successId);
          if (result.success && result.data) {
            hasHydrated.current = true;
            const { student, enrollments, invoice, payment } = result.data;
            
            // 1. Map to Step5Data (Summary Store)
            setStep5Data({
              studentId: student.studentId,
              admissionNo: student.admissionNo,
              enrollmentIds: enrollments.map((e: any) => e.enrollmentId),
              receiptNo: payment?.receiptNo || invoice?.receiptNo || '---',
              studentNameEn: student.nameEn,
              studentNameBn: student.nameBn,
              paidAmount: payment?.amountPaid || invoice?.paidAmount || 0,
              totalAmount: invoice?.netAmount || 0,
              admissionDate: student.admissionDate,
              hallName: enrollments[0]?.hallName || student.hallName || 'হিসাব শাখা',
            });

            // 2. Map to Full RHF Schema (For Templates)
            // This is critical because templates use getValues()
            const feeItems = invoice?.feeItems ? (typeof invoice.feeItems === 'string' ? JSON.parse(invoice.feeItems) : invoice.feeItems) : [];

            resetForm({
              personal: {
                nameEn: student.nameEn,
                nameBn: student.nameBn,
                fatherNameBn: student.fatherNameBn,
                fatherNameEn: student.fatherNameEn || '',
                motherNameBn: student.motherNameBn,
                motherNameEn: student.motherNameEn || '',
                fatherOccupation: student.fatherOccupation || '',
                motherOccupation: student.motherOccupation || '',
                fatherWorkplace: student.fatherWorkplace || '',
                motherWorkplace: student.motherWorkplace || '',
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                bloodGroup: student.bloodGroup || 'unknown',
                nationality: student.nationality || 'বাংলাদেশী',
                religion: student.religion,
                identificationNo: student.identificationNo || '',
                identificationType: student.identificationType || 'bc',
                isHafiz: student.isHafiz || false,
                photoUrl: student.photo,
              },
              contact: {
                guardianPhone: student.guardianPhone,
                phonePrimary: student.phonePrimary || '',
                whatsappNo: student.whatsappNo || '',
                email: student.email || '',
                permanentSameAsCurrent: false, 
                presentAddress: {
                  division: student.presentDivision || '',
                  district: student.presentDistrict || '',
                  thana: student.presentThana || '',
                  union: student.presentUnion || '',
                  postOffice: student.presentPostOffice || '',
                  village: student.presentVillage || '',
                  postCode: student.presentPostCode?.toString() || '',
                },
                permanentAddress: {
                  division: student.permanentDivision || '',
                  district: student.permanentDistrict || '',
                  thana: student.permanentThana || '',
                  union: student.permanentUnion || '',
                  postOffice: student.permanentPostOffice || '',
                  village: student.permanentVillage || '',
                  postCode: student.permanentPostCode?.toString() || '',
                },
              },
              enrollment: {
                admissionDate: student.admissionDate,
                boardingType: enrollments[0]?.boardingType || 'day',
                hallName: enrollments[0]?.hallName || '',
                enrollments: enrollments.map((en: any) => ({
                  departmentId: en.departmentId,
                  departmentName: en.departmentName,
                  departmentCode: en.departmentCode,
                  classId: en.classId,
                  className: en.className,
                  section: en.section,
                  session: en.session,
                  shift: en.shift,
                  monthlyFee: en.monthlyFee,
                  rollNo: en.rollNo,
                })),
                previousSchoolName: student.previousSchoolName || '',
                previousSchoolAddress: student.previousSchoolAddress || '',
                previousClassName: student.previousClassName || '',
                previousResult: student.previousResult || '',
                admissionTestMarks: student.admissionTestMarks || '',
                admissionTestResult: student.admissionTestResult || 'passed',
                admissionTestRemarks: student.admissionTestRemarks || '',
                examinerName: student.examinerName || '',
              },
              payment: {
                feeItems: feeItems.map((f: any) => ({
                  ...f,
                  amount: Number(f.amount || 0),
                  discount: Number(f.discount || 0),
                  isIncluded: true // Force true so templates show them
                })),
                totalAmount: Number(invoice?.totalAmount || 0),
                netAmount: Number(invoice?.netAmount || 0),
                paidAmount: Number(payment?.amountPaid || invoice?.paidAmount || 0),
                paymentMethod: payment?.paymentMethod || 'cash',
                transactionRef: payment?.transactionRef || '',
                notes: payment?.notes || '',
              },
              documents: {
                studentPhoto: student.photo || '',
                studentDocFront: student.studentDocFrontUrl || '',
                studentDocBack: student.studentDocBackUrl || '',
                fatherNidFront: student.fatherNidFrontUrl || '',
                fatherNidBack: student.fatherNidBackUrl || '',
                motherNidFront: student.motherNidFrontUrl || '',
                motherNidBack: student.motherNidBackUrl || '',
                transferCertificate: student.transferCertificateUrl || '',
              }
            });

          }
        } catch (err) {
          console.error('Failed to hydrate admission data:', err);
        } finally {
          setIsFetchingDB(false);
        }
      };
      fetchData();
    }
  }, [successId, setStep5Data, resetForm]);

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, scale: 1,
      transition: { staggerChildren: 0.1, duration: 0.4, ease: "easeOut" }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  // Bug Fix: Uses native window.print() popup — no html2canvas, no lab() crash.
  const handleDownloadReceipt = () => {
    if (!receiptRef.current) return;
    setIsExporting(true);
    try {
      printElement(receiptRef.current);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadApplication = () => {
    if (!applicationRef.current) return;
    setIsExportingForm(true);
    try {
      printElement(applicationRef.current);
    } finally {
      setIsExportingForm(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] py-10 px-4 kalpurush-font max-w-2xl mx-auto overflow-hidden">
      
      {/* Celebration Backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#00AEEF]/5 to-transparent pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full space-y-10 text-center relative"
      >
        {isFetchingDB ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#00AEEF] opacity-50" />
            <p className="text-sm font-bold text-zinc-400 kalpurush-font">সার্ভার থেকে তথ্য লোড হচ্ছে...</p>
          </div>
        ) : (
          <>
            {/* Lottie-like Check Animation Wrapper */}
            <motion.div variants={itemVariants} className="relative inline-block">
           <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
           <div className="relative h-24 w-24 bg-gradient-to-tr from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 mx-auto border-4 border-white dark:border-zinc-800">
              <CheckCircle2 className="h-12 w-12 text-white" />
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">অভিনন্দন! ভর্তি সফল হয়েছে</h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 text-emerald-600 px-4 py-1 rounded-lg inline-block">Admission Confirmed Successfully</p>
        </motion.div>

        {/* Simplified Digital Success Card */}
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-zinc-800/30 rounded-xl p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left relative">
              <div className="space-y-6">
                 <InfoItem icon={User} label="ছাত্রের নাম" value={step5Data.studentNameBn || '---'} />
                 <InfoItem icon={Smartphone} label="অ্যাডমিশন আইডি" value={step5Data.studentId || '---'} highlight />
                 <InfoItem icon={Building2} label="হল / ফ্লোর" value={step5Data.hallName || 'হিসাব শাখা'} />
              </div>

              <div className="space-y-6">
                 <InfoItem icon={Calendar} label="ভর্তির তারিখ" value={step5Data.admissionDate ? new Date(step5Data.admissionDate).toLocaleDateString('bn-BD') : 'আজ'} />
                 <InfoItem icon={CreditCard} label="রিসিট নম্বর" value={step5Data.receiptNo || '---'} highlight />
                 <InfoItem icon={CreditCard} label="প্রদত্ত টাকা" value={`৳ ${(step5Data.paidAmount || 0).toLocaleString('bn-BD')}`} />
              </div>
           </div>
        </motion.div>

        {/* Compact & Awesome Action Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-black text-sm shadow-xl shadow-primary/20 group transition-all"
            onClick={handleDownloadApplication}
            disabled={isExportingForm}
          >
            {isExportingForm ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <Printer className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
            ভর্তি ফরম প্রিন্ট করুন
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 font-bold text-zinc-900 dark:text-zinc-100 group hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all"
            onClick={handleDownloadReceipt}
            disabled={isExporting}
          >
            {isExporting ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />}
            রিসিট ডাউনলোড
          </Button>
        </motion.div>

        {/* Footer Navigation */}
        <motion.div variants={itemVariants} className="pt-6 flex flex-wrap justify-center gap-6 border-t border-zinc-100 dark:border-zinc-800/50">
           <Link href="/dashboard" onClick={reset} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors group">
              <Home className="h-3.5 w-3.5" /> ড্যাশবোর্ডে যান <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
           </Link>
           {/* Bug #2 Fix: was /dashboard/admin/students (404) — correct path is /dashboard/admin/students/admission */}
           <Link href={`/dashboard/admin/id-cards?search=${step5Data.studentId}`} onClick={reset} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors group">
              <CreditCard className="h-3.5 w-3.5" /> আইডি কার্ড <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
           </Link>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Hidden Templates for PDF Engine */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none select-none overflow-hidden">
        <div ref={receiptRef} className="bg-white"><AdmissionReceipt /></div>
        <div ref={applicationRef} className="bg-white"><AdmissionApplicationForm /></div>
      </div>

    </div>
  );
}

function InfoItem({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 pl-0.5">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <div className={cn(
        "text-base font-bold tracking-tight py-1 border-b border-zinc-100 dark:border-zinc-800/50 min-h-[32px]",
        highlight ? "text-primary font-black font-mono" : "text-zinc-800 dark:text-zinc-200"
      )}>
        {value || '---'}
      </div>
    </div>
  );
}
