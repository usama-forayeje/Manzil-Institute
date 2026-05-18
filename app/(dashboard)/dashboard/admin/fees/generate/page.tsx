'use client';

import React from 'react';
import InvoiceGenerator from '@/components/dashboard/fees/InvoiceGenerator';
import { Banknote, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GenerateInvoicesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10 solaiman-lipi">

      {/* ═══ Premium Header ═══ */}
      <div className="relative group">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#00AEEF] via-cyan-400 to-[#00AEEF] rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-all duration-700 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00aeef08_1px,transparent_1px),linear-gradient(to_bottom,#00aeef08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-50" />

          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#00AEEF] to-[#005f82] p-[1px] shadow-lg shadow-[#00AEEF]/20">
              <div className="h-full w-full rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center">
                <Banknote className="h-8 w-8 text-[#00AEEF]" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-2 kalpurush-font">
                বাল্ক ইনভয়েস জেনারেটর
              </h1>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                ফি টাইপ বেছে নিন → শিক্ষার্থী দেখুন → ইনভয়েস তৈরি করুন
              </p>
            </div>
          </div>

          <Link href="/dashboard/admin/fees">
            <Button variant="outline" className="h-12 px-6 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold kalpurush-font gap-2 relative">
              <ArrowLeft className="h-4 w-4" /> ফিরে যান
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══ Wizard ═══ */}
      <div className="max-w-4xl mx-auto">
        <InvoiceGenerator />
      </div>
    </div>
  );
}
