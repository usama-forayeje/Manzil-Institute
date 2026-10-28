'use client';

import React, { useState, useCallback, Suspense, useEffect, useRef, useMemo } from 'react';
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
  Plus,
  Check,
  Trash2,
  Sparkles,
  Phone,
  Layers,
  RotateCcw,
  ScanBarcode,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  createAdHocInvoice,
  getFeeCollectMetadata,
  getNextReceiptNo,
} from '@/lib/actions/fees';
import { BarcodeScannerModal } from '@/components/dashboard/shared/BarcodeScannerModal';
import { getSession } from '@/lib/auth/actions';
import { MONTH_NAMES_BN } from '@/features/fees/types';
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

const PAYMENT_METHODS = [
  { value: 'cash', label: 'নগদ', labelEn: 'Cash', icon: Banknote, color: 'text-emerald-500 bg-emerald-500/10' },
  { value: 'bkash', label: 'বিকাশ', labelEn: 'bKash', icon: Smartphone, color: 'text-pink-500 bg-pink-500/10' },
  { value: 'nagad', label: 'নগদ', labelEn: 'Nagad', icon: Wallet, color: 'text-orange-500 bg-orange-500/10' },
  { value: 'bank', label: 'ব্যাংক', labelEn: 'Bank', icon: Building2, color: 'text-blue-500 bg-blue-500/10' },
];

const STANDARD_FEE_HEADS = [
  { code: 'tour', title: 'ট্যুর / শিক্ষা সফর ফি' },
  { code: 'monthly', title: 'মাসিক ফি' },
  { code: 'session', title: 'সেশন ফি' },
  { code: 'exam', title: 'পরীক্ষা ফি' },
  { code: 'semester', title: 'সেমিস্টার ফি' },
  { code: 'admission', title: 'ভর্তি ফি' },
  { code: 'dress', title: 'ড্রেস ও পোশাক ফি' },
  { code: 'id_card', title: 'আইডি কার্ড ফি' },
  { code: 'books', title: 'কিতাব ও বই ফি' },
  { code: 'boarding', title: 'খানা ও বোর্ডিং ফি' },
  { code: 'other', title: 'অন্যান্য / বিবিধ ফি' },
];

function FeeCollectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initStudentId = searchParams.get('studentId');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  // Invoices state
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // Dynamic Metadata state
  const [availableSessions, setAvailableSessions] = useState<string[]>([]);
  const [availableFeeTypes, setAvailableFeeTypes] = useState<any[]>([]);

  // Add Ad-Hoc Fee Dialog state
  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false);
  const [newFeeType, setNewFeeType] = useState('tour');
  const [newFeeTitle, setNewFeeTitle] = useState('ট্যুর / শিক্ষা সফর ফি');
  const [newFeeAmount, setNewFeeAmount] = useState<string>('');
  const [newFeeSession, setNewFeeSession] = useState<string>(new Date().getFullYear().toString());
  const [newFeeMonth, setNewFeeMonth] = useState<string>('');
  const [breakdownItems, setBreakdownItems] = useState<Array<{ name: string; amount: number }>>([
    { name: 'বাস / গাড়ি ভাড়া', amount: 500 },
    { name: 'খাবার খরচ', amount: 600 },
  ]);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [isCreatingFee, setIsCreatingFee] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [customPaidAmount, setCustomPaidAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success / Receipt state
  const [isSuccess, setIsSuccess] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getSession().then(session => {
      if (session) setCurrentUser(session);
    });

    getFeeCollectMetadata().then(res => {
      if (res.success) {
        if (res.sessions && res.sessions.length > 0) {
          const names = res.sessions.map((s: any) => s.name);
          setAvailableSessions(names);
          const curr = res.sessions.find((s: any) => s.isCurrent)?.name || names[0];
          setNewFeeSession(curr);
        } else {
          setAvailableSessions([new Date().getFullYear().toString()]);
        }

        if (res.feeTypes && res.feeTypes.length > 0) {
          setAvailableFeeTypes(res.feeTypes);
        }
      }
    });
  }, []);

  // Merge dynamic DB fee types with standard heads (DB fee structure takes precedence)
  const feeCategories = useMemo(() => {
    const list: Array<{ code: string; title: string; breakdown?: any; defaultAmount?: number }> = [];

    // 1. Dynamic DB fee types from /dashboard/admin/fees/structure (Primary)
    availableFeeTypes.forEach(ft => {
      if (!list.some(l => l.code === ft.code)) {
        list.push({
          code: ft.code || ft.id,
          title: ft.title,
          breakdown: ft.breakdown,
          defaultAmount: ft.defaultAmount,
        });
      }
    });

    // 2. Default Tour preset if not already configured in DB
    if (!list.some(l => l.code === 'tour' || l.code.toLowerCase().includes('tour'))) {
      list.push({
        code: 'tour',
        title: 'ট্যুর / শিক্ষা সফর ফি',
        breakdown: [
          { name: 'বাস / গাড়ি ভাড়া', amount: 500 },
          { name: 'খাবার খরচ', amount: 600 },
        ]
      });
    }

    // 3. Fallback standard heads
    STANDARD_FEE_HEADS.forEach(head => {
      if (!list.some(l => l.code === head.code)) {
        list.push(head);
      }
    });

    return list;
  }, [availableFeeTypes]);

  const handleCategoryChange = (val: string) => {
    setNewFeeType(val);
    const matched = feeCategories.find(c => c.code === val);
    if (matched) {
      setNewFeeTitle(matched.title);
      if (matched.breakdown && Array.isArray(matched.breakdown) && matched.breakdown.length > 0) {
        setBreakdownItems(matched.breakdown);
        setShowBreakdown(true);
        const total = matched.breakdown.reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);
        setNewFeeAmount(String(total));
      } else if (val === 'tour') {
        setBreakdownItems([
          { name: 'বাস / গাড়ি ভাড়া', amount: 500 },
          { name: 'খাবার খরচ', amount: 600 },
        ]);
        setShowBreakdown(true);
        setNewFeeAmount('1100');
      } else {
        setShowBreakdown(false);
        setBreakdownItems([]);
        if (matched.defaultAmount) {
          setNewFeeAmount(String(matched.defaultAmount));
        } else {
          setNewFeeAmount('');
        }
      }
    }
  };

  // Select student handler
  const handleSelectStudent = useCallback(async (student: any) => {
    setSelectedStudent(student);
    setIsLoadingInvoices(true);
    setInvoices([]);
    setSelectedInvoiceIds(new Set());
    setIsSuccess(false);
    setDiscountAmount(0);
    setCustomPaidAmount(0);

    const res = await fetchUnpaidInvoices({ studentDocId: student.$id });
    if (res.success) {
      const invs = res.invoices || [];
      setInvoices(invs);
      if (invs.length > 0) {
        const allIds = new Set<string>(invs.map((inv: any) => String(inv.$id)));
        setSelectedInvoiceIds(allIds);
        const total = invs.reduce((s: number, i: any) => s + (i.dueAmount || 0), 0);
        setCustomPaidAmount(total);
      }
    }
    setIsLoadingInvoices(false);
  }, []);

  // Search handler (autoSelectOnSingle: only auto-select when user pressed Enter or scanned Barcode)
  const handleSearch = useCallback(async (forcedTerm?: string, autoSelectOnSingle: boolean = false) => {
    const term = (forcedTerm !== undefined ? forcedTerm : searchTerm).trim();
    if (!term) {
      setStudents([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);

    const res = await searchStudentsForFee(term);
    if (res.success) {
      const list = res.students || [];
      setStudents(list);
      if (list.length === 1 && autoSelectOnSingle) {
        handleSelectStudent(list[0]);
      } else if (list.length === 0 && autoSelectOnSingle) {
        toast.info('কোনো শিক্ষার্থী পাওয়া যায়নি');
      }
    } else {
      if (autoSelectOnSingle) {
        toast.error('সার্চ করতে সমস্যা হয়েছে');
      }
    }
    setIsSearching(false);
  }, [searchTerm, handleSelectStudent]);

  // Real-time debounced search effect as user types
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setStudents([]);
      setIsSearching(false);
      return;
    }
    if (selectedStudent) return;

    const timer = setTimeout(() => {
      handleSearch(term, false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedStudent, handleSearch]);

  // Barcode Scan handler
  const handleBarcodeScan = useCallback((code: string) => {
    setSearchTerm(code);
    handleSearch(code, true);
  }, [handleSearch]);

  // Initial search from URL
  useEffect(() => {
    if (initStudentId && !selectedStudent) {
      setSearchTerm(initStudentId);
      handleSearch(initStudentId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initStudentId]);

  // Toggle single invoice
  const toggleInvoice = (id: string) => {
    setSelectedInvoiceIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      const selInvs = invoices.filter(inv => next.has(inv.$id));
      const newTotal = selInvs.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0);
      const net = Math.max(0, newTotal - discountAmount);
      setCustomPaidAmount(net);
      return next;
    });
  };

  // Toggle all invoices
  const selectAllInvoices = () => {
    if (selectedInvoiceIds.size === invoices.length) {
      setSelectedInvoiceIds(new Set());
      setCustomPaidAmount(0);
    } else {
      const allIds = new Set<string>(invoices.map(inv => String(inv.$id)));
      setSelectedInvoiceIds(allIds);
      const total = invoices.reduce((s, inv) => s + (inv.dueAmount || 0), 0);
      setCustomPaidAmount(Math.max(0, total - discountAmount));
    }
  };

  // Calculations
  const selectedInvoices = useMemo(
    () => invoices.filter(inv => selectedInvoiceIds.has(inv.$id)),
    [invoices, selectedInvoiceIds]
  );

  const totalSelectedAmount = useMemo(
    () => selectedInvoices.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0),
    [selectedInvoices]
  );

  const payableNetAmount = Math.max(0, totalSelectedAmount - discountAmount);
  const remainingDueAfterPaying = Math.max(0, payableNetAmount - customPaidAmount);

  // Create On-The-Spot / Ad-Hoc Fee
  const handleCreateAdHocFee = async () => {
    if (!selectedStudent) return;

    let validItems: Array<{ name: string; amount: number }> = [];
    let calculatedAmount = 0;

    if (showBreakdown && breakdownItems.length > 0) {
      validItems = breakdownItems.filter(i => i.name && i.name.trim() !== '' && Number(i.amount) > 0);
      calculatedAmount = validItems.reduce((s, i) => s + Number(i.amount), 0);
    } else {
      calculatedAmount = Number(newFeeAmount);
    }

    if (!calculatedAmount || calculatedAmount <= 0) {
      toast.error('অনুগ্রহ করে সঠিক টাকার পরিমাণ অথবা আইটেম লিখুন');
      return;
    }

    setIsCreatingFee(true);
    try {
      const res = await createAdHocInvoice({
        studentDocId: selectedStudent.$id,
        studentId: selectedStudent.studentId,
        feeType: newFeeType,
        feeTitle: newFeeTitle.trim() || 'ফি',
        amount: calculatedAmount,
        session: newFeeSession,
        month: newFeeMonth || undefined,
        recordedBy: currentUser?.userDoc?.name || currentUser?.user?.name || 'admin',
        items: validItems.length > 0 ? validItems : undefined
      });

      if (res.success && res.invoice) {
        toast.success('নতুন ফি সফলভাবে যুক্ত ও সিলেক্ট করা হয়েছে!');
        setInvoices(prev => [res.invoice, ...prev]);
        setSelectedInvoiceIds(prev => {
          const next = new Set(prev);
          next.add(res.invoice.$id);
          return next;
        });
        setCustomPaidAmount(prev => prev + calculatedAmount);
        setIsAddFeeOpen(false);
        setNewFeeAmount('');
      } else {
        toast.error(res.error || 'নতুন ফি তৈরি করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      toast.error(err.message || 'সমস্যা হয়েছে');
    } finally {
      setIsCreatingFee(false);
    }
  };

  // Collect Payment & Print
  const handleProcessPayment = async () => {
    if (selectedInvoices.length === 0 || customPaidAmount <= 0) {
      toast.error('কমপক্ষে একটি ফি এবং পরিশোধের পরিমাণ নিশ্চিত করুন');
      return;
    }

    setIsProcessing(true);
    let lastResult: any = null;
    let successCount = 0;
    const createdPaymentIds: string[] = [];

    let remainingDiscount = discountAmount;
    let remainingPaid = customPaidAmount;

    // Generate one shared sequential receipt number for this transaction batch
    let batchReceiptNo: string | undefined = undefined;
    try {
      const nextRes = await getNextReceiptNo();
      if (nextRes.success && nextRes.receiptNo) {
        batchReceiptNo = nextRes.receiptNo;
      }
    } catch { /* will generate individually if failed */ }

    for (let i = 0; i < selectedInvoices.length; i++) {
      const inv = selectedInvoices[i];
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

      const invNetDue = Math.max(0, inv.dueAmount - currentInvDiscount);
      const amountToPay = Math.min(remainingPaid, invNetDue);
      remainingPaid = Math.max(0, remainingPaid - amountToPay);

      const res = await collectFeePayment({
        invoiceId: inv.$id,
        studentId: inv.studentId,
        studentDocId: inv.studentDocId,
        amount: amountToPay,
        discount: currentInvDiscount,
        paymentMethod,
        transactionRef,
        notes,
        recordedBy: currentUser?.userDoc?.name || currentUser?.user?.name || 'admin',
        receiptNo: batchReceiptNo,
      });

      if (res.success) {
        successCount++;
        lastResult = res;
        const idToPush = res.paymentDocId || res.paymentId;
        if (idToPush) {
          createdPaymentIds.push(idToPush);
        }
      } else {
        toast.error(`পেমেন্ট ব্যর্থ: ${res.error}`);
      }
    }

    if (successCount > 0) {
      setLastPaymentResult(lastResult);
      if (createdPaymentIds.length > 0) {
        try {
          const receiptRes = await generateReceiptData(createdPaymentIds);
          if (receiptRes.success && receiptRes.receipt) {
            setReceiptData(receiptRes.receipt);
            // Auto trigger print in background
            setTimeout(() => {
              if (receiptRef.current) {
                printElement(receiptRef.current, `রসিদ - ${receiptRes.receipt.receiptNo}`);
              }
            }, 300);
          }
        } catch { /* silent */ }
      }
      toast.success(`${toBn(successCount)} টি ফি সফলভাবে আদায় হয়েছে!`);
      setIsSuccess(true);
      router.replace('/dashboard/admin/fees/collect', { scroll: false });
    }
    setIsProcessing(false);
  };

  // Reset for next student
  const handleResetForNext = () => {
    setSelectedStudent(null);
    setSearchTerm('');
    setStudents([]);
    setInvoices([]);
    setSelectedInvoiceIds(new Set());
    setDiscountAmount(0);
    setCustomPaidAmount(0);
    setTransactionRef('');
    setNotes('');
    setIsSuccess(false);
    setReceiptData(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans solaiman-lipi">

      {/* ═══ Header ═══ */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00AEEF] via-cyan-400 to-[#00AEEF] rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-all duration-700 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#005f82] p-[1px] shadow-lg shadow-[#00AEEF]/20 flex-shrink-0">
              <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center">
                <CreditCard className="h-7 w-7 text-[#00AEEF]" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-1.5 kalpurush-font">
                দ্রুত ফি আদায় (Quick Collect)
              </h1>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                শিক্ষার্থী নির্বাচন করুন → ফি ও আইটেম দেখুন → ১-ক্লিকে আদায় ও রসিদ প্রিন্ট
              </p>
            </div>
          </div>

          {selectedStudent && !isSuccess && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetForNext}
              className="rounded-xl h-10 border-zinc-200 dark:border-zinc-700 font-bold text-xs gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> শিক্ষার্থী পরিবর্তন
            </Button>
          )}
        </div>
      </div>

      {/* ═══ Top Search Bar (When no student selected or changing) ═══ */}
      {!selectedStudent && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8 relative overflow-hidden">
          <div className="max-w-xl mx-auto text-center mb-6">
            <div className="h-14 w-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mx-auto mb-3 border border-cyan-100 dark:border-cyan-500/20">
              <Search className="h-7 w-7 text-[#00AEEF]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 kalpurush-font mb-1">শিক্ষার্থী খুঁজুন</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              আইডি বা শেষ নম্বর (যেমন: 10, 12, 20, 103), নাম, মোবাইল অথবা বারকোড স্ক্যান করুন
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
              <Input
                placeholder="আইডি বা শেষ নম্বর (10, 12, 20, 103), নাম বা মোবাইল..."
                value={searchTerm}
                autoFocus
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(searchTerm, true)}
                className="pl-12 pr-24 h-14 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-2 border-transparent focus:border-[#00AEEF]/40 font-bold text-base shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setStudents([]);
                    }}
                    className="h-7 w-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isSearching && (
                  <Loader2 className="h-4 w-4 text-[#00AEEF] animate-spin" />
                )}
                <div className="hidden sm:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                  <span className="text-[10px] font-bold text-zinc-400 px-1">ENTER ↵</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBarcodeModalOpen(true)}
              className="h-14 px-4 rounded-xl border-2 border-dashed border-[#00AEEF]/40 hover:border-[#00AEEF] hover:bg-[#00AEEF]/10 text-[#00AEEF] font-bold gap-2 text-sm transition-all cursor-pointer shadow-sm"
              title="স্মার্ট আইডি কার্ডের বারকোড স্ক্যান করুন"
            >
              <ScanBarcode className="h-5 w-5" />
              <span className="hidden sm:inline">বারকোড</span>
            </Button>

            <Button
              onClick={() => handleSearch(searchTerm, true)}
              disabled={isSearching || !searchTerm.trim()}
              className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl px-7 h-14 font-black transition-all hover:scale-[1.02] active:scale-95 border-0 shadow-lg shadow-[#00AEEF]/20 kalpurush-font text-base cursor-pointer"
            >
              {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'অনুসন্ধান'}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
            <span className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
              💡 শর্টকাট: <strong className="text-zinc-700 dark:text-zinc-300">10, 12, 20, 103</strong> টাইপ করলেই নিচে লাইভ তালিকা চলে আসবে
            </span>
            <span className="bg-zinc-100 dark:bg-zinc-800/60 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
              📷 বারকোড স্ক্যানার দিয়ে নিমেষেই সিলেক্ট করুন
            </span>
          </div>

          {/* Results List */}
          <div className="mt-6 max-w-xl mx-auto space-y-2.5">
            {isSearching && students.length === 0 && (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            )}

            {!isSearching && searchTerm.trim() && students.length === 0 && (
              <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 kalpurush-font">
                  &ldquo;{searchTerm}&rdquo; দিয়ে কোনো শিক্ষার্থী খুঁজে পাওয়া যায়নি
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  আইডির শেষ সংখ্যা (যেমন 10, 12, 20), পুরো আইডি বা সঠিক নাম/মোবাইল লিখে খুঁজুন
                </p>
              </div>
            )}

            {students.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2 text-xs font-bold text-zinc-500">
                  <span>অনুসন্ধানের ফলাফল ({students.length} জন)</span>
                  <span className="text-[11px] text-[#00AEEF]">ক্লিক করে সিলেক্ট করুন</span>
                </div>
                {students.map(student => (
                  <div
                    key={student.$id}
                    onClick={() => handleSelectStudent(student)}
                    className="group cursor-pointer bg-white dark:bg-zinc-900 hover:bg-cyan-50/70 dark:hover:bg-cyan-950/30 border border-zinc-200/80 dark:border-zinc-800 hover:border-[#00AEEF]/60 rounded-2xl p-3.5 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Student Photo */}
                      <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-zinc-200 dark:border-zinc-700 relative shadow-sm group-hover:border-[#00AEEF]/50 transition-colors">
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.name || ''}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.display = 'none';
                              const sibling = target.nextElementSibling;
                              if (sibling) (sibling as HTMLElement).classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <User className={cn("h-6 w-6 text-zinc-400 group-hover:text-[#00AEEF] transition-colors", student.photo ? "hidden" : "")} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base font-black text-zinc-900 dark:text-zinc-100 kalpurush-font group-hover:text-[#00AEEF] transition-colors truncate">
                          {student.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-mono font-black text-[#00AEEF] bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-200/60 dark:border-cyan-800/60">
                            {student.studentId}
                          </span>
                          <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-zinc-400" />
                            {student.class} {student.section ? `(${student.section})` : ''}
                          </span>
                          {student.phone && (
                            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {student.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                      <span className="hidden sm:inline-block text-xs font-black text-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity kalpurush-font">
                        সিলেক্ট করুন
                      </span>
                      <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-[#00AEEF] flex items-center justify-center text-zinc-400 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Phase 2: Instant Receipt & Success (After Collection) ═══ */}
      {selectedStudent && isSuccess && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 border-4 border-emerald-100 dark:border-emerald-500/20 shadow-lg">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={2.5} />
          </div>

          <h2 className="text-2xl font-black text-zinc-900 dark:text-white kalpurush-font mb-2">
            ফি সফলভাবে আদায় করা হয়েছে!
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-6">
            রসিদ নম্বর: <span className="font-mono font-black text-[#00AEEF] bg-cyan-50 dark:bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-200 dark:border-cyan-800">
              {lastPaymentResult?.receiptNo || lastPaymentResult?.paymentId || '---'}
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            {receiptData && (
              <Button
                onClick={() => {
                  if (receiptRef.current) {
                    printElement(receiptRef.current, `রসিদ - ${receiptData.receiptNo}`);
                  }
                }}
                className="bg-[#00AEEF] hover:bg-[#0081B1] text-white rounded-xl px-8 h-12 font-black text-sm gap-2 shadow-lg shadow-[#00AEEF]/20 cursor-pointer"
              >
                <Printer className="h-4 w-4" /> রসিদ আবার প্রিন্ট করুন
              </Button>
            )}
            <Button
              onClick={handleResetForNext}
              variant="outline"
              className="rounded-xl px-8 h-12 font-black text-sm border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> পরবর্তী শিক্ষার্থী (Next)
            </Button>
          </div>

          {/* Hidden Print Container */}
          {receiptData && (
            <div ref={receiptRef} className="fixed top-[-9999px] left-[-9999px] pointer-events-none select-none bg-white">
              <ReceiptTemplate receipt={receiptData} />
            </div>
          )}
        </div>
      )}

      {/* ═══ Phase 1: ONE-SCREEN QUICK COLLECT DASHBOARD ═══ */}
      {selectedStudent && !isSuccess && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">

          {/* ── Left Column: Student Card & Invoices (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-5">

            {/* Student Profile Ribbon */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-[#00AEEF]/40 relative shadow-md">
                  {selectedStudent.photo ? (
                    <img
                      src={selectedStudent.photo}
                      alt={selectedStudent.name || ''}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.display = 'none';
                        const sibling = target.nextElementSibling;
                        if (sibling) (sibling as HTMLElement).classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <User className={cn("h-7 w-7 text-[#00AEEF]", selectedStudent.photo ? "hidden" : "")} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 kalpurush-font leading-tight truncate">
                      {selectedStudent.name}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono font-bold text-[#00AEEF] border-cyan-200">
                      {selectedStudent.studentId}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium mt-1 flex flex-wrap items-center gap-2">
                    <span>শ্রেণী: <strong>{selectedStudent.class}</strong> {selectedStudent.section ? `(${selectedStudent.section})` : ''}</span>
                    {selectedStudent.phone && <span>| ফোন: {selectedStudent.phone}</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Fees & Invoices Checklist */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[#00AEEF]" />
                  <span className="text-sm font-black kalpurush-font text-zinc-800 dark:text-zinc-100">
                    বকেয়া ফি ও খাতসমূহ ({invoices.length} টি)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      setNewFeeType('tour');
                      setNewFeeTitle('ট্যুর / শিক্ষা সফর ফি');
                      setShowBreakdown(true);
                      setIsAddFeeOpen(true);
                    }}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8 text-xs font-black gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> + নতুন ফি / ট্যুর ফি যোগ করুন
                  </Button>
                  {invoices.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAllInvoices}
                      className="h-8 text-[11px] font-bold text-zinc-500 hover:text-[#00AEEF] cursor-pointer"
                    >
                      {selectedInvoiceIds.size === invoices.length ? 'সব বাদ দিন' : 'সব সিলেক্ট'}
                    </Button>
                  )}
                </div>
              </div>

              {isLoadingInvoices ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : invoices.length === 0 ? (
                <div className="p-8 text-center">
                  <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-black text-emerald-600 kalpurush-font">কোনো নিয়মিত বকেয়া নেই</p>
                  <p className="text-xs text-zinc-400 mt-1 mb-4">ট্যুর ফি বা অন্য কোনো ফি যুক্ত করতে উপরের বাটনে চাপ দিন</p>
                  <Button
                    onClick={() => setIsAddFeeOpen(true)}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 text-xs font-black gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> ফি যোগ করুন (ট্যুর, সেশন ইত্যাদি)
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {invoices.map(inv => {
                    const isSelected = selectedInvoiceIds.has(inv.$id);

                    // Parse breakdown items if present
                    let parsedItems: any[] = [];
                    try {
                      if (inv.feeItems) parsedItems = JSON.parse(inv.feeItems);
                    } catch {}

                    return (
                      <div
                        key={inv.$id}
                        onClick={() => toggleInvoice(inv.$id)}
                        className={cn(
                          "p-4 cursor-pointer transition-all flex items-center justify-between gap-3 group relative",
                          isSelected
                            ? "bg-[#00AEEF]/[0.05] dark:bg-[#00AEEF]/10"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00AEEF] rounded-r" />
                        )}

                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className={cn(
                            "h-5 w-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                            isSelected
                              ? "bg-[#00AEEF] border-[#00AEEF] text-white"
                              : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                          )}>
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 kalpurush-font truncate">
                                {parsedItems.length > 0 && parsedItems[0].feeTypeName
                                  ? parsedItems.map(p => p.feeTypeName).join(' + ')
                                  : (inv.invoiceType || 'ফি')}
                              </span>
                              {inv.month && (
                                <Badge variant="secondary" className="text-[10px] font-bold px-1.5 py-0 rounded">
                                  {MONTH_NAMES_BN[inv.month] || inv.month}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px] font-mono font-bold px-1.5 py-0 border-zinc-200">
                                {inv.session}
                              </Badge>
                            </div>

                            {/* Sub-items preview pills if available */}
                            {parsedItems.length > 1 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {parsedItems.map((item: any, i: number) => (
                                  <span key={i} className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                    {item.feeTypeName}: ৳{toBn(item.amount)}
                                  </span>
                                ))}
                              </div>
                            )}

                            <span className="text-[10px] font-mono text-zinc-400">#{inv.invoiceId}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-black text-rose-600 dark:text-rose-500 font-mono">
                            ৳{toBn(inv.dueAmount)}
                          </p>
                          {inv.paidAmount > 0 && (
                            <p className="text-[10px] text-emerald-600 font-bold">
                              আগে জমা: ৳{toBn(inv.paidAmount)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Instant Checkout Card (5 Cols) ── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl sticky top-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black kalpurush-font text-zinc-900 dark:text-zinc-100">
                    আদায় কাউন্টার (Checkout)
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    {selectedInvoiceIds.size} টি ফি নির্বাচিত
                  </p>
                </div>
              </div>

              {/* Amount Breakdown Box */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-zinc-600 dark:text-zinc-400 font-bold">
                  <span>মোট নির্বাচিত ফি:</span>
                  <span className="font-mono text-sm font-black text-zinc-900 dark:text-zinc-100">
                    ৳{toBn(totalSelectedAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-600 dark:text-zinc-400">ছাড় / ডিসকাউন্ট (যদি থাকে):</span>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">৳</span>
                    <Input
                      type="number"
                      min="0"
                      max={totalSelectedAmount}
                      value={discountAmount || ''}
                      placeholder="0"
                      onChange={e => {
                        const disc = Math.min(totalSelectedAmount, Number(e.target.value) || 0);
                        setDiscountAmount(disc);
                        setCustomPaidAmount(Math.max(0, totalSelectedAmount - disc));
                      }}
                      className="h-8 pl-6 text-right pr-2 text-xs font-black rounded-lg border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">নিট পরিশোধ্য (Net):</span>
                  <span className="font-mono text-base font-black text-zinc-900 dark:text-zinc-100">
                    ৳{toBn(payableNetAmount)}
                  </span>
                </div>

                {/* Paying Amount */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-emerald-600 dark:text-emerald-400 kalpurush-font">
                      আজকের আদায় / জমা (৳):
                    </label>
                    <span className="text-[10px] text-zinc-400 font-bold">আংশিক বা পুরো লিখুন</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-base text-emerald-600">৳</span>
                    <Input
                      type="number"
                      min="1"
                      max={payableNetAmount}
                      value={customPaidAmount || ''}
                      onChange={e => setCustomPaidAmount(Number(e.target.value) || 0)}
                      className="h-12 pl-8 text-right pr-3 font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 rounded-xl border-2 border-emerald-500/30 focus:border-emerald-500 bg-white dark:bg-zinc-900 shadow-sm"
                    />
                  </div>
                </div>

                {/* Remaining Due Indicator */}
                {remainingDueAfterPaying > 0 ? (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-700 dark:text-amber-400">বকেয়া থাকবে (পরবর্তী):</span>
                    <span className="font-mono font-black text-amber-700 dark:text-amber-400">
                      ৳{toBn(remainingDueAfterPaying)}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-center text-xs font-bold text-emerald-600">
                    ✓ কোনো অবশিষ্ট বকেয়া থাকবে না
                  </div>
                )}
              </div>

              {/* Payment Methods (Chips) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 kalpurush-font">
                  পরিশোধ মাধ্যম:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all font-bold text-xs cursor-pointer",
                        paymentMethod === method.value
                          ? "border-[#00AEEF] bg-[#00AEEF]/10 text-[#00AEEF] shadow-sm"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:border-zinc-300"
                      )}
                    >
                      <method.icon className="h-4 w-4" />
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod !== 'cash' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">ট্রানজেকশন আইডি / রেফারেন্স</label>
                  <Input
                    placeholder="TrxID..."
                    value={transactionRef}
                    onChange={e => setTransactionRef(e.target.value)}
                    className="h-10 text-xs font-mono font-bold rounded-xl"
                  />
                </div>
              )}

              {/* Collect & Print Button */}
              <Button
                onClick={handleProcessPayment}
                disabled={isProcessing || customPaidAmount <= 0}
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-600/20 active:scale-95 transition-all kalpurush-font cursor-pointer flex items-center justify-center gap-2 border-0"
              >
                {isProcessing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> আদায় প্রসেস হচ্ছে...</>
                ) : (
                  <>
                    <Printer className="h-5 w-5" />
                    আদায় ও রসিদ প্রিন্ট করুন (৳{toBn(customPaidAmount)})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add On-The-Spot / Tour Fee Dialog ═══ */}
      <Dialog open={isAddFeeOpen} onOpenChange={setIsAddFeeOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl font-sans solaiman-lipi">
          <DialogHeader className="mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <DialogTitle className="text-lg font-black kalpurush-font text-zinc-900 dark:text-zinc-100">
                  নতুন ফি যোগ করুন (ট্যুর / অন্যান্য)
                </DialogTitle>
                <p className="text-xs text-zinc-500 font-medium">
                  ফি এর বিবরণ ও আইটেমসমূহ লিখুন — রসিদে প্রতিটি আইটেম আলাদাভাবে প্রিন্ট হবে
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Category Select */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">ফি ক্যাটাগরি (কাঠামো থেকে লোডকৃত)</label>
                <a
                  href="/dashboard/admin/fees/structure"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-[#00AEEF] hover:underline"
                >
                  ফি কাঠামো পরিবর্তন / নতুন ফি +
                </a>
              </div>
              <Select
                value={newFeeType}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs font-bold bg-zinc-50 dark:bg-zinc-950">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-bold text-xs max-h-60">
                  {feeCategories.map(cat => (
                    <SelectItem key={cat.code} value={cat.code}>
                      <div className="flex items-center gap-2">
                        <span>{cat.title}</span>
                        {cat.defaultAmount ? (
                          <span className="text-[10px] text-emerald-600 font-mono font-bold">(৳{toBn(cat.defaultAmount)})</span>
                        ) : null}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">ফি এর নাম / বিবরণ</label>
              <Input
                placeholder="যেমন: শিক্ষা সফর / ট্যুর ফি ২০২৬"
                value={newFeeTitle}
                onChange={e => setNewFeeTitle(e.target.value)}
                className="h-10 text-xs font-bold rounded-xl bg-zinc-50 dark:bg-zinc-950"
              />
            </div>

            {/* Breakdown Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-black text-[#00AEEF] flex items-center gap-1.5 cursor-pointer">
                <Layers className="h-3.5 w-3.5" />
                আইটেম ব্রেকডাউন (যেমন: গাড়ি ভাড়া, খাবার, টিকিট ইত্যাদি)
              </label>
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="text-[11px] font-bold text-zinc-500 hover:text-zinc-800 underline cursor-pointer"
              >
                {showBreakdown ? 'একক টাকায় রূপান্তর' : 'ব্রেকডাউন যোগ করুন'}
              </button>
            </div>

            {/* Breakdown List */}
            {showBreakdown ? (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                <div className="space-y-2">
                  {breakdownItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder="আইটেম নাম (যেমন: বাস ভাড়া)"
                        value={item.name}
                        onChange={e => {
                          const val = e.target.value;
                          setBreakdownItems(prev => {
                            const updated = [...prev];
                            updated[idx] = { ...updated[idx], name: val };
                            return updated;
                          });
                        }}
                        className="h-9 text-xs font-bold rounded-lg bg-white dark:bg-zinc-900 flex-1"
                      />
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">৳</span>
                        <Input
                          type="number"
                          placeholder="টাকা"
                          value={item.amount || ''}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setBreakdownItems(prev => {
                              const updated = [...prev];
                              updated[idx] = { ...updated[idx], amount: val };
                              return updated;
                            });
                          }}
                          className="h-9 pl-6 text-right pr-2 text-xs font-mono font-black rounded-lg bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setBreakdownItems(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBreakdownItems(prev => [...prev, { name: '', amount: 0 }])}
                    className="h-7 text-xs font-bold gap-1 rounded-lg cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> + আইটেম যোগ করুন
                  </Button>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    মোট: ৳{toBn(breakdownItems.reduce((s, i) => s + (Number(i.amount) || 0), 0))}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">মোট টাকার পরিমাণ (৳)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm text-zinc-400">৳</span>
                  <Input
                    type="number"
                    min="1"
                    placeholder="উদাঃ ১১০০"
                    value={newFeeAmount}
                    onChange={e => setNewFeeAmount(e.target.value)}
                    className="h-11 pl-7 text-right pr-3 font-mono font-black text-lg rounded-xl bg-zinc-50 dark:bg-zinc-950 text-emerald-600"
                  />
                </div>
              </div>
            )}

            {/* Session & Month */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-500">শিক্ষাবর্ষ / সেশন</label>
                <Select value={newFeeSession} onValueChange={setNewFeeSession}>
                  <SelectTrigger className="h-9 text-xs font-bold rounded-xl bg-zinc-50 dark:bg-zinc-950">
                    <SelectValue placeholder="সেশন নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs font-bold">
                    {availableSessions.length > 0 ? (
                      availableSessions.map(sess => (
                        <SelectItem key={sess} value={sess}>{sess}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value={new Date().getFullYear().toString()}>
                        {new Date().getFullYear()}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-500">মাস (ঐচ্ছিক)</label>
                <Select value={newFeeMonth || 'none'} onValueChange={v => setNewFeeMonth(v === 'none' ? '' : v)}>
                  <SelectTrigger className="h-9 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-950">
                    <SelectValue placeholder="প্রযোজ্য নয়" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs font-bold">
                    <SelectItem value="none">প্রযোজ্য নয়</SelectItem>
                    {Object.entries(MONTH_NAMES_BN).map(([en, bn]) => (
                      <SelectItem key={en} value={en}>{bn}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setIsAddFeeOpen(false)}
              disabled={isCreatingFee}
              className="rounded-xl h-10 px-4 text-xs font-bold cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              onClick={handleCreateAdHocFee}
              disabled={isCreatingFee}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-black text-xs gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              {isCreatingFee ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              ফি যুক্ত ও সিলেক্ট করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ Barcode & QR Camera Scanner Modal ═══ */}
      <BarcodeScannerModal
        isOpen={isBarcodeModalOpen}
        onClose={() => setIsBarcodeModalOpen(false)}
        onScan={handleBarcodeScan}
      />
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
