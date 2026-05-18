'use client';

import React, { useState, useCallback, Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Banknote,
  Search,
  User,
  CreditCard,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Printer,
  Receipt,
  Smartphone,
  Building2,
  Wallet,
  ChevronRight,
  ShieldCheck,
  Zap,
  Eye,
  X,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  searchStudentsForFee,
  fetchUnpaidInvoices,
  collectFeePayment,
  generateReceiptData,
} from '@/lib/actions/fees';
import { getSession } from '@/lib/auth/actions';
import { PAYMENT_METHOD_LABELS, MONTH_NAMES_BN } from '@/features/fees/types';
import type { ReceiptData } from '@/features/fees/types';
import ReceiptTemplate from '@/components/dashboard/fees/ReceiptTemplate';

// ——— Bengali number helper ———
const toBn = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '০';
  const formatted = Number(num).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};



function printElement(el: HTMLElement, title: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('পপআপ ব্লক করা আছে। অনুগ্রহ করে এই সাইটের পপআপ অনুমতি দিন।');
    return;
  }
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((lnk) => lnk.outerHTML).join('\n');
  const styleTags = Array.from(document.querySelectorAll('style'))
    .map((s) => s.outerHTML).join('\n');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="${window.location.origin}">
        <title>${title}</title>
        ${styleLinks}
        ${styleTags}
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; background: white; }
          /* Hide extension-injected content like color pickers */
          body > *:not(#fee-print-content) {
             display: none !important;
          }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div id="fee-print-content">
          ${el.innerHTML}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.addEventListener('afterprint', () => printWindow.close());
  };
}

type Step = 'search' | 'invoices' | 'payment' | 'success';

const PAYMENT_METHODS = [
  { value: 'cash', label: 'নগদ', labelEn: 'Cash', icon: Banknote, color: 'text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/20' },
  { value: 'bkash', label: 'বিকাশ', labelEn: 'bKash', icon: Smartphone, color: 'text-pink-500 bg-pink-500/10 group-hover:bg-pink-500/20' },
  { value: 'nagad', label: 'নগদ', labelEn: 'Nagad', icon: Wallet, color: 'text-orange-500 bg-orange-500/10 group-hover:bg-orange-500/20' },
  { value: 'bank', label: 'ব্যাংক', labelEn: 'Bank', icon: Building2, color: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20' },
];

function FeeCollectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initStudentId = searchParams.get('studentId');

  const [step, setStep] = useState<Step>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Invoice state
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success state
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch current user on mount
  useEffect(() => {
    getSession().then(session => {
      if (session) setCurrentUser(session);
    });
  }, []);

  // Initial auto-search if studentId exists in query
  useEffect(() => {
    if (initStudentId && step === 'search') {
      setSearchTerm(initStudentId);
      handleSearch(initStudentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStudentId]);

  // ——— Search ———
  const handleSearch = useCallback(async (forcedTerm?: string) => {
    const term = forcedTerm || searchTerm;
    if (!term.trim()) return;
    setIsSearching(true);
    setStudents([]);
    setSelectedStudent(null);

    const res = await searchStudentsForFee(term.trim());
    if (res.success) {
      setStudents(res.students || []);
      // Auto select if only 1 exact match
      if ((res.students || []).length === 1 && term === res.students![0].studentId) {
         handleSelectStudent(res.students![0]);
      } else if ((res.students || []).length === 0) {
        toast.info('কোনো সক্রিয় শিক্ষার্থী পাওয়া যায়নি');
      }
    } else {
      toast.error('সার্চ করতে সমস্যা হয়েছে');
    }
    setIsSearching(false);
  }, [searchTerm]);

  // ——— Select Student ———
  const handleSelectStudent = useCallback(async (student: any) => {
    setSelectedStudent(student);
    setIsLoadingInvoices(true);
    setInvoices([]);
    setSelectedInvoiceIds(new Set());
    setStep('invoices');

    const res = await fetchUnpaidInvoices({ studentDocId: student.$id });
    if (res.success) {
      const invs = res.invoices || [];
      setInvoices(invs);
      
      // Auto-select all if there are unpaid invoices
      if (invs.length > 0) {
        setSelectedInvoiceIds(new Set(invs.map(inv => inv.$id)));
      } else {
        toast.info('এই শিক্ষার্থীর কোনো বকেয়া ইনভয়েস নেই');
      }
    }
    setIsLoadingInvoices(false);
  }, []);

  // ——— Toggle invoice selection ———
  const toggleInvoice = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedInvoiceIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllInvoices = () => {
    if (selectedInvoiceIds.size === invoices.length) {
      setSelectedInvoiceIds(new Set());
    } else {
      setSelectedInvoiceIds(new Set(invoices.map(inv => inv.$id)));
    }
  };

  // ——— Computed values ———
  const selectedInvoices = invoices.filter(inv => selectedInvoiceIds.has(inv.$id));
  const totalSelectedAmount = selectedInvoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0);

  // ——— Process Payment ———
  const handleProcessPayment = async () => {
    if (selectedInvoices.length === 0) return;
    setIsProcessing(true);

    let lastResult: any = null;
    let successCount = 0;

    let remainingDiscount = discountAmount;

    for (let i = 0; i < selectedInvoices.length; i++) {
      const inv = selectedInvoices[i];
      // Distribute discount proportionally if multiple, or all if single
      let currentInvDiscount = 0;
      if (selectedInvoices.length === 1) {
        currentInvDiscount = remainingDiscount;
      } else {
        const ratio = inv.dueAmount / totalSelectedAmount;
        currentInvDiscount = i === selectedInvoices.length - 1 
          ? remainingDiscount 
          : Math.floor(discountAmount * ratio);
        remainingDiscount -= currentInvDiscount;
      }

      const amountToPayInCash = Math.max(0, inv.dueAmount - currentInvDiscount);

      const res = await collectFeePayment({
        invoiceId: inv.$id,
        studentId: inv.studentId,
        studentDocId: inv.studentDocId,
        amount: amountToPayInCash,
        discount: currentInvDiscount,
        paymentMethod,
        transactionRef,
        notes,
        recordedBy: currentUser?.userDoc?.name || currentUser?.user?.name || 'admin',
      });

      if (res.success) {
        successCount++;
        lastResult = res;
      } else {
        toast.error(`পেমেন্ট ব্যর্থ (${inv.receiptNo}): ${res.error}`);
      }
    }

    if (successCount > 0) {
      setLastPaymentResult(lastResult);
      // Try to get receipt data
      if (lastResult?.paymentId) {
        try {
          const receiptRes = await generateReceiptData(lastResult.paymentId);
          if (receiptRes.success && receiptRes.receipt) {
            setReceiptData(receiptRes.receipt);
          }
        } catch { /* silent */ }
      }
      toast.success(`${toBn(successCount)} টি পেমেন্ট সফল হয়েছে!`);
      setStep('success');
      // Clean query params
      router.replace('/dashboard/admin/fees/collect', { scroll: false });
    }
    setIsProcessing(false);
  };

  // ——— Reset ———
  const handleNewCollection = () => {
    setStep('search');
    setSearchTerm('');
    setStudents([]);
    setSelectedStudent(null);
    setInvoices([]);
    setSelectedInvoiceIds(new Set());
    setPaymentMethod('cash');
    setTransactionRef('');
    setNotes('');
    setDiscountAmount(0);
    setReceiptData(null);
    setLastPaymentResult(null);
  };

  return (
    <div className="max-w-[720px] mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700 pb-20 font-sans">
      
      {/* ——— Header ——— */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00AEEF] via-cyan-400 to-[#00AEEF] rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-700" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
          {/* subtle pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00AEEF08_1px,transparent_1px),linear-gradient(to_bottom,#00AEEF08_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none opacity-50" />
          
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#005f82] p-[1px] shadow-lg shadow-[#00AEEF]/20">
              <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden group-hover:bg-[#00AEEF]/[0.02] transition-colors">
                <CreditCard className="h-8 w-8 text-[#00AEEF] absolute transform transition-transform group-hover:scale-110 group-hover:rotate-6" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-2 kalpurush-font drop-shadow-sm">ফি কালেকশন</h1>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tracking-wide flex items-center gap-2">
                শিক্ষার্থীদের ফি গ্রহণ <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" /> রিয়েল-টাইম রসিদ
              </p>
            </div>
          </div>

          {/* Premium Step Indicator */}
          <div className="relative flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl shadow-inner border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden">
            {(['search', 'invoices', 'payment', 'success'] as Step[]).map((s, i) => {
              const stepLabels = ['সার্চ', 'ইনভয়েস', 'পেমেন্ট', 'সফল'];
              const isActive = s === step;
              const isPast = ['search', 'invoices', 'payment', 'success'].indexOf(step) > i;
              return (
                <div key={s} className="relative z-10 flex items-center">
                  <div className={cn(
                    "h-9 px-3.5 rounded-lg flex items-center justify-center text-[11px] font-black uppercase tracking-wider transition-all duration-500",
                    isActive ? 'bg-white dark:bg-zinc-700 text-[#00AEEF] shadow-sm transform scale-100 ring-1 ring-black/5 dark:ring-white/5' :
                    isPast ? 'text-emerald-500' : 'text-zinc-400'
                  )}>
                    {isPast && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                    {stepLabels[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ——— Step: Search ——— */}
      {step === 'search' && (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 relative overflow-hidden transition-all duration-500">
           {/* Decorative blurred bg */}
           <div className="absolute top-0 right-0 h-40 w-40 bg-[#00AEEF]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
           
           <div className="flex flex-col items-center text-center max-w-sm mx-auto mb-10 mt-4 relative z-10">
             <div className="h-16 w-16 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-5 border border-cyan-100 dark:border-cyan-500/20 shadow-sm">
               <Search className="h-8 w-8 text-[#00AEEF]" strokeWidth={1.5} />
             </div>
             <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 kalpurush-font mb-2">শিক্ষার্থী খুঁজুন</h3>
             <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">যেকোনো একটি শিক্ষার্থীর আইডি, নাম অথবা ফোন নম্বর দিয়ে অনুসন্ধান করুন</p>
           </div>

           <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto relative z-10">
             <div className="relative flex-1 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
               <Input
                 placeholder="উদাঃ MDS-2025-1234..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSearch()}
                 className="pl-12 h-14 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/30 focus:bg-white dark:focus:bg-zinc-900 transition-all font-bold text-base shadow-sm"
               />
               {/* Quick search badge */}
               <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                 <span className="text-[10px] font-bold text-zinc-400 px-1">ENTER ↵</span>
               </div>
             </div>
             <Button
               onClick={() => handleSearch()}
               disabled={isSearching || !searchTerm.trim()}
               className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl px-10 h-14 font-black transition-all hover:scale-[1.02] active:scale-95 border-0 shadow-xl shadow-[#00AEEF]/20 kalpurush-font text-base w-full sm:w-auto"
             >
               {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'অনুসন্ধান'}
             </Button>
           </div>

           {/* Search Results Area */}
           <div className="mt-8 max-w-xl mx-auto relative z-10 space-y-3">
             {isSearching && (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl opacity-50" />)
             )}

             {!isSearching && students.length > 0 && students.map(student => (
                <div
                  key={student.$id}
                  onClick={() => handleSelectStudent(student)}
                  className="group cursor-pointer relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex items-center justify-between"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00AEEF]/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="h-14 w-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00AEEF] transition-all duration-300 border border-zinc-200 dark:border-zinc-700 group-hover:border-[#0081B1] group-hover:shadow-lg">
                      <User className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 kalpurush-font group-hover:text-[#00AEEF] transition-colors">{student.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#00AEEF] bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-sm border border-cyan-100 dark:border-cyan-500/20">{student.studentId}</span>
                        <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5"><Building2 className="h-3 w-3" />{student.class} — {student.section}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300 dark:text-zinc-600 group-hover:text-[#00AEEF] transition-all duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </div>
             ))}
           </div>
        </div>
      )}

      {/* ——— Step: Invoices ——— */}
      {step === 'invoices' && selectedStudent && (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
           
           {/* Mini Student Card */}
           <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00AEEF] to-[#005f82] p-[1px] shadow-sm">
                  <div className="h-full w-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#00AEEF]" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 kalpurush-font leading-tight">{selectedStudent.name}</p>
                  <p className="text-[11px] font-mono font-bold text-zinc-500 mt-0.5 flex items-center gap-2">
                    <span className="text-[#00AEEF]">{selectedStudent.studentId}</span>
                    <span className="h-1 w-1 bg-zinc-300 rounded-full" />
                    <span>{selectedStudent.class} ({selectedStudent.section})</span>
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setStep('search'); setSelectedStudent(null); }} 
                className="rounded-xl h-10 border-zinc-200 dark:border-zinc-700 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> শিক্ষার্থী পরিবর্তন
              </Button>
           </div>

           {/* Invoice Selection Area */}
           <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shadow-inner">
                    <Receipt className="h-5 w-5 text-orange-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-800 dark:text-zinc-100 kalpurush-font">বকেয়া ইনভয়েস</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{invoices.length} Pending</p>
                  </div>
                </div>
                {invoices.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={selectAllInvoices} 
                    className={cn(
                      "rounded-lg h-9 font-bold text-[11px] uppercase tracking-wider transition-colors",
                      selectedInvoiceIds.size === invoices.length 
                        ? 'text-zinc-500 hover:text-zinc-700 bg-zinc-100 dark:bg-zinc-800' 
                        : 'text-[#00AEEF] hover:bg-[#00AEEF]/10'
                    )}
                  >
                    {selectedInvoiceIds.size === invoices.length ? 'আনসিলেক্ট অল' : 'সিলেক্ট অল'}
                  </Button>
                )}
              </div>

              {isLoadingInvoices ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl opacity-50" />)}
                </div>
              ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-100 dark:border-emerald-500/20">
                    <ShieldCheck className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
                  </div>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-500 kalpurush-font">কোনো বকেয়া নেই!</p>
                  <p className="text-xs font-medium text-zinc-500 mt-1">সব ইনভয়েস পরিশোধিত হয়েছে।</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 bg-white dark:bg-zinc-900">
                  {invoices.map(inv => {
                    const isSelected = selectedInvoiceIds.has(inv.$id);
                    return (
                      <div
                        key={inv.$id}
                        onClick={(e) => toggleInvoice(inv.$id, e)}
                        className={cn(
                          "w-full flex items-center justify-between p-5 cursor-pointer transition-all duration-300 group hover:bg-[#00AEEF]/[0.02] dark:hover:bg-zinc-800/40 relative",
                          isSelected && 'bg-[#00AEEF]/[0.04] dark:bg-[#00AEEF]/10 z-10'
                        )}
                      >
                         {/* Selection subtle left border */}
                         {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00AEEF] rounded-r-full" />}
                         
                         <div className="flex items-center gap-5 flex-1">
                            <div className={cn(
                              "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-sm",
                              isSelected
                                ? 'bg-[#00AEEF] border-[#00AEEF] scale-110'
                                : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 group-hover:border-[#00AEEF]/50'
                            )}>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={3} />}
                            </div>

                            <div>
                               <div className="flex items-center gap-2 mb-1.5">
                                 <span className="text-base font-black text-zinc-800 dark:text-zinc-100 kalpurush-font leading-none">
                                   {MONTH_NAMES_BN[inv.month] || inv.month} ({inv.session})
                                 </span>
                                 <Badge variant="outline" className={cn(
                                   "text-[9px] font-black rounded text-uppercase tracking-widest px-2 py-0 border",
                                   inv.status === 'partial'
                                     ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                                     : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30'
                                 )}>
                                   {inv.status === 'partial' ? 'আংশিক পেমেন্ট' : 'বকেয়া'}
                                 </Badge>
                                 <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[9px] font-bold px-2 py-0 rounded">
                                   {inv.invoiceType || 'Monthly'}
                                 </Badge>
                               </div>
                               <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-100 dark:border-zinc-800/50">#{inv.receiptNo}</span>
                            </div>
                         </div>

                         <div className="text-right flex-shrink-0 ml-4 group-hover:scale-105 transition-transform duration-300 origin-right">
                           <p className="text-2xl font-black text-rose-600 dark:text-rose-500 tracking-tighter leading-none">৳{toBn(inv.dueAmount)}</p>
                           {inv.paidAmount > 0 && (
                             <p className="text-[10px] text-emerald-600 font-bold mt-1.5 kalpurush-font flex justify-end items-center gap-1">
                               <CheckCircle2 className="h-3 w-3" /> পরিশোধিত: ৳{toBn(inv.paidAmount)}
                             </p>
                           )}
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}
           </div>

           {/* Sticky action bar */}
           {selectedInvoiceIds.size > 0 && (
             <div className="sticky bottom-6 animate-in slide-in-from-bottom-10 fade-in duration-500 z-50">
               <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 border border-zinc-800 dark:border-zinc-200">
                 <div className="pl-2">
                   <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 kalpurush-font">
                     {toBn(selectedInvoiceIds.size)} ইনভয়েস সিলেক্টেড
                   </p>
                   <p className="text-2xl font-black text-white dark:text-zinc-900 tracking-tighter leading-none">৳{toBn(totalSelectedAmount)}</p>
                 </div>
                 <Button
                   onClick={() => setStep('payment')}
                   className="bg-[#00AEEF] hover:bg-[#0081B1] dark:bg-[#00AEEF] dark:hover:bg-[#0081B1] text-white rounded-xl px-10 h-14 font-black transition-all hover:scale-[1.02] active:scale-95 border-0 shadow-xl shadow-[#00AEEF]/20 kalpurush-font text-base"
                 >
                   পেমেন্ট করুন <ArrowLeft className="h-5 w-5 ml-2 rotate-180" strokeWidth={2.5} />
                 </Button>
               </div>
             </div>
           )}
        </div>
      )}

      {/* ——— Step: Payment ——— */}
      {step === 'payment' && selectedStudent && (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
           <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden p-8 relative">
              <div className="absolute top-0 right-0 h-32 w-32 bg-[#00AEEF]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                  <Zap className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 kalpurush-font">পেমেন্ট নিশ্চিতকরণ</h3>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Payment Finalization</p>
                </div>
              </div>

              {/* Payment Info Card */}
              <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-6 mb-8 border border-zinc-100 dark:border-zinc-800/50 shadow-inner">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font">শিক্ষার্থীর নাম</span>
                     <span className="text-[15px] font-black text-zinc-800 dark:text-zinc-100 kalpurush-font">{selectedStudent.name}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font">ইনভয়েস সংখ্যা</span>
                     <span className="text-[15px] font-black text-zinc-800 dark:text-zinc-100">{toBn(selectedInvoiceIds.size)} টি</span>
                   </div>
                   
                   <div className="pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                     <span className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 kalpurush-font">উপ-মোট বকেয়া</span>
                     <span className="text-[15px] font-black text-zinc-800 dark:text-zinc-100 italic tracking-tighter">৳{toBn(totalSelectedAmount)}</span>
                   </div>

                   <div className="flex items-center justify-between gap-4 py-2">
                      <span className="text-[13px] font-bold text-rose-500 dark:text-rose-400 kalpurush-font">ডিসকাউন্ট দিন</span>
                      <div className="relative w-32 group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-400">৳</span>
                        <Input
                          type="number"
                          min="0"
                          max={totalSelectedAmount}
                          value={discountAmount || ''}
                          onChange={(e) => setDiscountAmount(Math.min(totalSelectedAmount, Number(e.target.value)))}
                          className="h-10 pl-7 text-right pr-3 rounded-lg border-2 border-rose-100 focus:border-rose-300 dark:border-rose-500/20 dark:focus:border-rose-500/40 bg-white dark:bg-zinc-950 font-black text-rose-600 dark:text-rose-400"
                        />
                      </div>
                   </div>

                   <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                     <span className="text-base font-black text-zinc-800 dark:text-zinc-100 kalpurush-font">নিট প্রদেয় (Cash)</span>
                     <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter drop-shadow-sm">
                       ৳{toBn(Math.max(0, totalSelectedAmount - discountAmount))}
                     </span>
                   </div>
                 </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 mb-8">
                 <div className="flex items-center justify-between pl-1">
                   <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest kalpurush-font">মাধ্যম নির্বাচন করুন</h4>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                   {PAYMENT_METHODS.map(method => (
                     <div
                       key={method.value}
                       onClick={() => setPaymentMethod(method.value)}
                       className={cn(
                         "group cursor-pointer flex justify-center items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden",
                         paymentMethod === method.value
                           ? 'border-[#00AEEF] bg-[#00AEEF]/5 shadow-md shadow-[#00AEEF]/10 scale-100 ring-2 ring-[#00AEEF]/20 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900'
                           : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 hover:scale-[1.02]'
                       )}
                     >
                       <div className={cn("h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors duration-300", method.color)}>
                         <method.icon className={cn("h-5 w-5", paymentMethod === method.value ? 'text-[#00AEEF]' : '')} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className={cn("text-sm font-black kalpurush-font truncate", paymentMethod === method.value ? 'text-[#00AEEF]' : 'text-zinc-700 dark:text-zinc-300')}>{method.label}</p>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase">{method.labelEn}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Extras Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                 {paymentMethod !== 'cash' && (
                   <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                     <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 pl-1 kalpurush-font">ট্রানজেকশন রেফারেন্স</p>
                     <div className="relative group">
                       <Input
                         placeholder="TrxID / Reference Number"
                         value={transactionRef}
                         onChange={e => setTransactionRef(e.target.value)}
                         className="h-14 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/30 focus:bg-white dark:focus:bg-zinc-900 font-mono font-bold text-sm pl-4 shadow-sm"
                       />
                     </div>
                   </div>
                 )}
                 <div className="space-y-2">
                   <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 pl-1 kalpurush-font">নোট (ঐচ্ছিক)</p>
                   <Input
                     placeholder="কোনো মন্তব্য থাকলে লিখুন..."
                     value={notes}
                     onChange={e => setNotes(e.target.value)}
                     className="h-14 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/30 focus:bg-white dark:focus:bg-zinc-900 font-bold kalpurush-font text-sm pl-4 shadow-sm"
                   />
                 </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setStep('invoices')}
                  className="sm:w-1/3 h-14 rounded-xl font-black uppercase text-[11px] tracking-widest text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                  disabled={isProcessing}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> ফিরে যান
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="sm:w-2/3 h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black kalpurush-font text-base shadow-xl shadow-emerald-500/20 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
                >
                  {isProcessing ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" /> পেমেন্ট প্রসেস হচ্ছে...</>
                  ) : (
                    <>৳{toBn(Math.max(0, totalSelectedAmount - discountAmount))} পেমেন্ট সম্পন্ন করুন</>
                  )}
                </Button>
              </div>
           </div>
        </div>
      )}

      {/* ——— Step: Success ——— */}
      {step === 'success' && (
        <div className="space-y-6 animate-in zoom-in-95 duration-700">
           <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
             
             {/* Beautiful success background bursts */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-gradient-to-tr from-emerald-500/5 to-[#00AEEF]/5 blur-3xl rounded-full pointer-events-none" />
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

             <div className="relative z-10">
               <div className="h-28 w-28 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border-4 border-white dark:border-zinc-900 shadow-xl shadow-emerald-500/10 animate-in zoom-in spin-in-12 duration-1000">
                 <CheckCircle2 className="h-14 w-14 text-emerald-500 drop-shadow-sm" strokeWidth={2.5} />
               </div>
               
               <h2 className="text-3xl font-black text-zinc-900 dark:text-white kalpurush-font mb-3 tracking-tight">পেমেন্ট সফলভাবে গৃহীত!</h2>
               <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium kalpurush-font mb-8">
                 <span className="block mb-1">রসিদ নম্বর:</span>
                 <span className="font-mono text-lg font-black text-[#00AEEF] bg-[#00AEEF]/5 px-3 py-1 rounded-md border border-[#00AEEF]/20">
                   {lastPaymentResult?.paymentId || lastPaymentResult?.receiptNo || '---'}
                 </span>
               </p>

               <div className="flex items-center justify-center gap-4 pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                 {receiptData && (
                   <Button
                     onClick={() => {
                       if (!receiptRef.current) return;
                       printElement(receiptRef.current, `রসিদ - ${receiptData.receiptNo}`);
                     }}
                     variant="outline"
                     className="rounded-xl px-8 h-12 font-black text-xs uppercase tracking-widest gap-2 border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all text-zinc-600 dark:text-zinc-300"
                   >
                     <Printer className="h-4 w-4 text-zinc-400" /> রসিদ প্রিন্ট করুন
                   </Button>
                 )}
                 <Button
                   onClick={handleNewCollection}
                   className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white rounded-xl px-8 h-12 font-black text-xs uppercase tracking-widest shadow-xl transition-all border-0 hover:scale-[1.02]"
                 >
                   নতুন সংগ্রহ শুরু করুন
                 </Button>
               </div>
             </div>
           </div>

           {/* Hidden Receipt Area */}
           {receiptData && (
             <div ref={receiptRef} className="fixed top-[-9999px] left-[-9999px] pointer-events-none select-none bg-white">
               <ReceiptTemplate receipt={receiptData} />
             </div>
           )}
        </div>
      )}
    </div>
  );
}

export default function FeeCollectPage() {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center bg-transparent">
        <div className="h-10 w-10 text-[#00AEEF] animate-spin border-4 border-zinc-200 border-t-[#00AEEF] rounded-full" />
      </div>
    }>
      <FeeCollectContent />
    </Suspense>
  );
}

