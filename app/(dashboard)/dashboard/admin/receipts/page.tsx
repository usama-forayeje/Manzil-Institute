'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {
  FileText,
  Search,
  Printer,
  Calendar,
  Clock,
  Loader2,
  Receipt,
  CheckCircle2,
  ListRestart,
  ArrowRight,
  User,
  Building2,
  AlertCircle,
  Undo2,
  Eye,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PAYMENT_METHOD_LABELS } from '@/features/fees/types';
import type { ReceiptData } from '@/features/fees/types';
import ReceiptTemplate from '@/components/dashboard/fees/ReceiptTemplate';
import { toast } from 'sonner';
import { fetchPaymentHistory, generateReceiptData } from '@/lib/actions/fees';

// ─── Bengali number helper ──────────────────────────────────
const toBn = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '---';
  const formatted = Number(num).toLocaleString('en-IN');
  return formatted.replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
};

// ─── printElement — same as AdmissionReceipt approach ───────
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

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return { date: '---', time: '---' };
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
  };
};

export default function ReceiptsPage() {
  const { ref, inView } = useInView();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrinting, setIsPrinting] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['feePayments', 'infinite', 'receipts', searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchPaymentHistory({
        searchTerm,
        page: pageParam as number,
        limit: 20,
      });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((acc, p) => acc + (p.payments?.length || 0), 0);
      if (lastPage.total && totalLoaded < (lastPage.total as number)) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const payments = useMemo(() => data?.pages.flatMap(page => page.payments || []) || [], [data]);

  const handlePrint = async (paymentId: string) => {
    // To avoid popup blocking, some browsers require window.open to be 
    // called directly as a result of a user action. 
    // However, we need to fetch data first.
    // Approach: Show a loading toast and use a small timeout or 
    // ensure the print loop is clean.
    setIsPrinting(paymentId);
    
    try {
      const result = await generateReceiptData(paymentId);
      if (result.success && result.receipt) {
        setReceiptData(result.receipt);
        // Wait for template to render
        setTimeout(() => {
          if (!receiptRef.current) return;
          
          // Use a more reliable printing method for production
          const printContent = receiptRef.current.innerHTML;
          const printWindow = window.open('', '_blank');
          
          if (!printWindow) {
            toast.error('পপআপ ব্লক করা আছে! অনুগ্রহ করে পপআপ অনুমতি দিন।');
            setIsPrinting(null);
            return;
          }

          const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .map((lnk) => lnk.outerHTML).join('\n');
          const styleTags = Array.from(document.querySelectorAll('style'))
            .map((s) => s.outerHTML).join('\n');

          printWindow.document.write(`
            <html>
              <head>
                <title>রসিদ - ${result.receipt?.receiptNo}</title>
                ${styleLinks}
                ${styleTags}
                <style>
                  @media print {
                    body { margin: 0; padding: 0; }
                    @page { margin: 0; size: auto; }
                  }
                  #print-wrapper { width: 100%; }
                </style>
              </head>
              <body>
                <div id="print-wrapper">${printContent}</div>
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.print();
                      window.close();
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
          setIsPrinting(null);
        }, 300);
      } else {
        toast.error('রসিদ ডাটা পাওয়া যায়নি');
        setIsPrinting(null);
      }
    } catch (err: any) {
      console.error('Print error:', err);
      toast.error('রসিদ জেনারেট করতে সমস্যা হয়েছে');
      setIsPrinting(null);
    }
  };

  const handlePreview = async (paymentId: string) => {
    try {
      const result = await generateReceiptData(paymentId);
      if (result.success && result.receipt) {
        setSelectedReceipt(result.receipt);
        setIsPreviewOpen(true);
      } else {
        toast.error('রসিদ ডাটা পাওয়া যায়নি');
      }
    } catch (err: any) {
      toast.error('প্রিভিউ দেখাতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 font-sans pb-10">
      
      {/* ═══ Header ═══ */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-400 via-[#00AEEF] to-emerald-500 rounded-3xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-700" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-6 md:p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00AEEF08_1px,transparent_1px),linear-gradient(to_bottom,#00AEEF08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50" />
          
          <div className="relative flex items-center gap-6">
            <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-[#00AEEF] to-[#005f82] p-[1px] shadow-2xl shadow-[#00AEEF]/30 transform group-hover:rotate-6 transition-transform duration-500">
              <div className="h-full w-full rounded-[2rem] bg-white dark:bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                <Printer className="h-10 w-10 text-[#00AEEF]" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-3 kalpurush-font">রসিদ রি-প্রিন্ট সেন্টার</h1>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 tracking-widest flex items-center gap-2 uppercase">
                <Badge variant="outline" className="bg-[#00AEEF]/10 text-[#00AEEF] border-[#00AEEF]/20 text-[10px] font-black tracking-widest uppercase">Reprint Receipts</Badge>
                <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                ম্যানেজ ও প্রিন্টিং পোর্টাল
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-[#00AEEF] transition-colors" />
             </div>
             <Input
               type="text"
               placeholder="রসিদ নম্বর, স্টুডেন্ট আইডি বা নাম লিখুন..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="h-16 pl-14 pr-6 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50 border-2 border-transparent focus:border-[#00AEEF]/30 focus:bg-white dark:focus:bg-zinc-900 shadow-inner kalpurush-font font-bold text-base transition-all duration-300"
             />
          </div>
        </div>
      </div>

      {/* ═══ Stats Cards ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg flex items-center gap-5 group hover:shadow-xl transition-all">
            <div className="h-14 w-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-100 dark:border-cyan-500/20 group-hover:scale-110 transition-transform">
               <Receipt className="h-6 w-6 text-[#00AEEF]" />
            </div>
            <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest kalpurush-font mb-0.5">সব রসিদ</p>
               <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">{toBn(data?.pages[0]?.total || 0)} <span className="text-sm font-medium text-zinc-400">টি</span></p>
            </div>
         </div>
         <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg flex items-center gap-5 group hover:shadow-xl transition-all">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform">
               <User className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest kalpurush-font mb-0.5">স্টুডেন্ট ডাটাবেস</p>
               <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">সক্রিয়</p>
            </div>
         </div>
         <div className="bg-emerald-500 text-white border border-emerald-500 rounded-2xl p-6 shadow-lg shadow-emerald-500/20 flex items-center gap-5 group hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
               <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
               <p className="text-[10px] font-black text-white/70 uppercase tracking-widest kalpurush-font mb-0.5">প্রিন্টার স্ট্যাটাস</p>
               <p className="text-3xl font-black tracking-tighter">অনলাইন</p>
            </div>
         </div>
      </div>

      {/* ═══ Receipts List ═══ */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {isLoading ? (
          <div className="p-10 space-y-6">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl opacity-50" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-40 text-center">
             <div className="h-32 w-32 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-8 animate-in zoom-in spin-in-6 duration-1000 shadow-inner">
                <Search className="h-12 w-12 text-zinc-200 dark:text-zinc-700" />
             </div>
             <h3 className="text-2xl font-black text-zinc-400 kalpurush-font mb-3">কোনো পেমেন্ট খুঁজে পাওয়া যায়নি</h3>
             <p className="text-sm text-zinc-400 font-medium max-w-sm px-6">সঠিক রসিদ নম্বর বা শিক্ষার্থীর তথ্য দিয়ে পুনরায় সার্চ করে দেখুন।</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-950/30 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-6 pl-10 pr-4 font-black kalpurush-font text-zinc-400 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">রসিদ নম্বর ও তারিখ</th>
                  <th className="py-6 px-4 font-black kalpurush-font text-zinc-400 text-[10px] uppercase tracking-[0.2em]">শিক্ষার্থীর তথ্য</th>
                  <th className="py-6 px-4 font-black kalpurush-font text-zinc-400 text-[10px] uppercase tracking-[0.2em]">পরিমাণ ও মাধ্যম</th>
                  <th className="py-6 pr-10 pl-4 font-black kalpurush-font text-zinc-400 text-[10px] uppercase tracking-[0.2em] text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const dt = formatDateTime(payment.paidAt || payment.$createdAt || '');
                  return (
                    <tr key={payment.$id} className="group hover:bg-[#00AEEF]/[0.02] dark:hover:bg-zinc-800/40 transition-all duration-300">
                      
                      <td className="py-8 pl-10 pr-4 align-middle">
                        <div className="flex items-center gap-5">
                           <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00AEEF] transition-all duration-500 shadow-sm">
                              <Receipt className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                           </div>
                           <div>
                              <span className="text-base font-mono font-black text-zinc-800 dark:text-zinc-100 block mb-1 group-hover:text-[#00AEEF] transition-colors">{payment.paymentId}</span>
                              <div className="flex items-center gap-3">
                                 <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1.5"><Calendar className="h-3 w-3 text-zinc-300" /> {dt.date}</span>
                                 <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5"><Clock className="h-3 w-3 text-zinc-300" /> {dt.time}</span>
                              </div>
                           </div>
                        </div>
                      </td>

                      <td className="py-8 px-4 align-middle">
                         <div className="flex flex-col gap-1.5">
                            <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 kalpurush-font leading-none group-hover:text-[#00AEEF] transition-colors">{payment.studentName}</p>
                            <div className="flex items-center gap-3">
                               <Badge variant="secondary" className="font-mono text-[10px] font-black h-5 px-1.5 rounded-md bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-transparent">{payment.studentId}</Badge>
                               <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest"><Building2 className="h-3 w-3" /> {payment.studentClass}</span>
                            </div>
                         </div>
                      </td>

                      <td className="py-8 px-4 align-middle">
                         <div className="flex flex-col gap-2">
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter drop-shadow-sm group-hover:scale-105 origin-left transition-transform">৳{toBn(payment.amount)}</span>
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className={cn(
                                 "rounded-md px-2 py-0.5 text-[9px] font-black border uppercase tracking-widest",
                                 payment.paymentMethod === 'bkash' ? 'border-pink-200 text-pink-600 bg-pink-50' :
                                 payment.paymentMethod === 'nagad' ? 'border-orange-200 text-orange-600 bg-orange-50' :
                                 'border-emerald-200 text-emerald-600 bg-emerald-50'
                               )}>
                                 {PAYMENT_METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod}
                               </Badge>
                               {payment.transactionRef && (
                                 <span className="text-[10px] font-mono font-bold text-zinc-400 tracking-tight">{payment.transactionRef}</span>
                               )}
                            </div>
                         </div>
                      </td>

                      <td className="py-8 pr-10 pl-4 align-middle text-right">
                         <div className="flex items-center justify-end gap-3">
                           <Button
                             onClick={() => handlePreview(payment.paymentId)}
                             variant="outline"
                             className="h-12 w-12 p-0 rounded-2xl border-2 border-zinc-100 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 text-zinc-400 hover:text-[#00AEEF] transition-all active:scale-95 shadow-sm"
                             title="প্রিভিউ দেখুন"
                           >
                             <Eye className="h-5 w-5" />
                           </Button>
                           <Button
                             onClick={() => handlePrint(payment.paymentId)}
                             disabled={isPrinting === payment.paymentId}
                             className={cn(
                               "h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.15em] gap-3 shadow-xl transition-all active:scale-95 group/btn overflow-hidden relative",
                               isPrinting === payment.paymentId ? 'bg-zinc-100 text-zinc-400' : 'bg-[#00AEEF] hover:bg-[#0081B1] text-white shadow-[#00AEEF]/20'
                             )}
                           >
                              {isPrinting === payment.paymentId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                 <>
                                   <Printer className="h-4 w-4 transform group-hover/btn:-translate-y-1 group-hover/btn:scale-110 transition-transform" />
                                   প্রিন্ট
                                 </>
                              )}
                           </Button>
                         </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination / Observer */}
            <div ref={ref} className="py-20 flex flex-col items-center justify-center gap-4">
               {isFetchingNextPage ? (
                 <div className="flex flex-col items-center gap-3">
                   <div className="h-12 w-12 rounded-full border-4 border-zinc-100 border-t-[#00AEEF] animate-spin" />
                   <p className="text-xs font-black text-zinc-400 uppercase tracking-widest kalpurush-font">আরও ডাটা লোড হচ্ছে...</p>
                 </div>
               ) : hasNextPage ? (
                 <Button 
                   variant="ghost" 
                   onClick={() => fetchNextPage()} 
                   className="text-[11px] font-black text-zinc-400 hover:text-[#00AEEF] uppercase tracking-[0.2em] kalpurush-font gap-2 h-12 px-8 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                 >
                   আরও লোড করুন <ArrowRight className="h-4 w-4" />
                 </Button>
               ) : (
                 <div className="flex flex-col items-center gap-4 opacity-50 py-10">
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-zinc-200 to-transparent rounded-full" />
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] kalpurush-font">সব ডাটা লোড সম্পন্ন</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Hidden Printing Area ═══ */}
      {receiptData && (
        <div ref={receiptRef} className="fixed top-[-9999px] left-[-9999px] pointer-events-none select-none bg-white">
          <ReceiptTemplate receipt={receiptData} />
        </div>
      )}

      {/* ═══ Receipt Preview Modal ═══ */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-zinc-50 border-none shadow-2xl">
           <DialogHeader className="p-6 bg-white border-b border-zinc-100 flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black kalpurush-font flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#00AEEF]/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#00AEEF]" />
                  </div>
                  ডিজিটাল রসিদ প্রিভিউ
                </DialogTitle>
                <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest pl-13">Digital Receipt Overview</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-full hover:bg-rose-50 hover:text-rose-500"
              >
                <X className="h-5 w-5" />
              </Button>
           </DialogHeader>

           <div className="p-8 flex justify-center bg-zinc-50 overflow-y-auto max-h-[70vh]">
              <div className="bg-white shadow-2xl rounded-sm p-4 transform scale-90 sm:scale-100 origin-top">
                {selectedReceipt && <ReceiptTemplate receipt={selectedReceipt} />}
              </div>
           </div>

           <div className="p-6 bg-white border-t border-zinc-100 flex items-center justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsPreviewOpen(false)}
                className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest border-2"
              >
                বন্ধ করুন
              </Button>
              <Button 
                onClick={() => {
                   if (selectedReceipt) {
                     handlePrint(selectedReceipt.paymentId);
                     setIsPreviewOpen(false);
                   }
                }}
                className="h-12 px-10 rounded-xl bg-[#00AEEF] hover:bg-[#0081B1] font-black text-sm kalpurush-font gap-2 shadow-xl shadow-[#00AEEF]/20"
              >
                <Printer className="h-4 w-4" />রসিদ প্রিন্ট করুন
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
