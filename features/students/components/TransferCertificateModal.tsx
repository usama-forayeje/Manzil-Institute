'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';
import { convertEnglishToBengali } from '@/lib/utils';
import type { StudentListItem } from '@/features/students/types';

interface TransferCertificateModalProps {
  student: StudentListItem | null;
  dischargeData?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TransferCertificateModal({
  student,
  dischargeData,
  isOpen,
  onClose,
}: TransferCertificateModalProps) {
  if (!student) return null;

  const info = dischargeData || student.dischargeInfo || {};
  const todayStr = info.date || new Date().toISOString().split('T')[0];
  const formattedDate = new Date(todayStr).toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tcNo = info.tcNo || `TC-${new Date().getFullYear()}-${student.studentId?.slice(-4) || '0001'}`;
  const reasonBn = info.reasonBn || (student.status === 'graduated' ? 'হিফজ সম্পন্ন' : 'স্থানান্তর / ছাড়পত্র');
  const studentName = student.nameBn || student.nameEn || 'শিক্ষার্থী';
  const fatherName = student.fatherNameBn || student.fatherNameEn || 'তথ্য নেই';
  const motherName = student.motherNameBn || student.motherNameEn || 'তথ্য নেই';
  const deptName = student.departmentName || 'হিফজুল কুরআন';
  const className = student.className || 'সাধারণ জামাত';

  const village = student.presentVillage || student.permanentVillage || '—';
  const thana = student.presentThana || student.permanentThana || '—';
  const district = student.presentDistrict || student.permanentDistrict || '—';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto kalpurush-font p-6 print:p-0 print:border-none print:shadow-none print:max-w-none">
        <DialogHeader className="print:hidden border-b pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#00AEEF]" />
            <DialogTitle className="text-lg font-black text-zinc-900 dark:text-zinc-50">
              ছাড়পত্র ও চারিত্রিক প্রশংসাপত্র (Transfer Certificate)
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-[#00AEEF] hover:bg-[#0081B1] text-white text-xs font-bold gap-1.5 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              প্রিন্ট করুন (A4)
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Transfer Certificate Canvas */}
        <div className="tc-printable-area bg-white text-zinc-900 border-2 border-[#00AEEF]/40 p-8 sm:p-10 rounded-xl relative shadow-sm my-2">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-8xl font-black">MANZIL</span>
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-zinc-800 pb-5 mb-6 relative">
            <p className="text-xs font-mono font-bold tracking-widest text-[#00AEEF] uppercase mb-1">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              মানযিল ইন্টারন্যাশনাল ইনস্টিটিউট
            </h1>
            <p className="text-sm font-bold text-zinc-600 mt-0.5">
              MANZIL INTERNATIONAL INSTITUTE
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              ইসলামী শিক্ষা, হিফজুল কুরআন ও জেনারেল শিক্ষার একটি সমন্বিত আদর্শ প্রতিষ্ঠান
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              ওয়েবসাইট: manzil.edu.bd • হেল্পলাইন: +880 1700-000000
            </p>

            <div className="mt-4 inline-block">
              <span className="px-5 py-1.5 bg-zinc-900 text-white rounded-full text-sm font-black tracking-wide border border-zinc-700">
                ছাড়পত্র ও প্রশংসাপত্র
              </span>
            </div>
          </div>

          {/* Reference and Date Bar */}
          <div className="flex items-center justify-between text-xs font-bold border-b border-zinc-200 pb-3 mb-6">
            <div>
              <span className="text-zinc-500">স্মারক নং / টিসি নং:</span>{' '}
              <span className="font-mono font-black text-zinc-900">{tcNo}</span>
            </div>
            <div>
              <span className="text-zinc-500">শিক্ষার্থী আইডি:</span>{' '}
              <span className="font-mono font-black text-zinc-900">{student.studentId}</span>
            </div>
            <div>
              <span className="text-zinc-500">তারিখ:</span>{' '}
              <span className="text-zinc-900">{formattedDate}</span>
            </div>
          </div>

          {/* Certificate Statement */}
          <div className="space-y-4 text-justify text-sm sm:text-[15px] leading-relaxed text-zinc-800 font-medium px-2">
            <p>
              এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <strong className="font-black text-zinc-950 text-base">{studentName}</strong>, 
              পিতা: <strong className="font-black text-zinc-950">{fatherName}</strong>, 
              মাতা: <strong className="font-black text-zinc-950">{motherName}</strong>, 
              গ্রাম: <strong>{village}</strong>, উপজেলা/থানা: <strong>{thana}</strong>, জেলা: <strong>{district}</strong>।
            </p>

            <p>
              তিনি অত্র প্রতিষ্ঠানে <strong className="text-zinc-950">{deptName}</strong> বিভাগের{' '}
              <strong className="text-zinc-950">{className}</strong> জামাতের একজন নিয়মিত শিক্ষার্থী ছিলেন। 
              তিনি অত্র প্রতিষ্ঠান হইতে বিগত <strong>{formattedDate}</strong> তারিখে{' '}
              <strong className="text-[#00AEEF] underline decoration-[#00AEEF]/40">{reasonBn}</strong> এর কারণে বিধিমোতাবেক ছাড়পত্র গ্রহণ করিয়াছেন।
            </p>

            <p>
              অত্র প্রতিষ্ঠানে অধ্যয়নকালীন সময়ে তাহার স্বভাব-চরিত্র উত্তম, ভদ্র ও প্রশংসনীয় ছিল। মাদ্রাসার নিয়ম-শৃঙ্খলা ও ধর্মীয় অনুশাসন পালনে সে সক্রিয় ছিল এবং সে কোনো প্রকার প্রতিষ্ঠান বা সমাজ বিরোধী কার্যকলাপে লিপ্ত ছিল না।
            </p>

            {info.remarks ? (
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs italic text-zinc-700">
                <strong>কর্তৃপক্ষের বিশেষ মন্তব্য:</strong> &ldquo;{info.remarks}&rdquo;
              </div>
            ) : null}

            <div className="flex items-center gap-2 pt-1 text-xs font-bold text-emerald-800 bg-emerald-50/80 p-2.5 rounded border border-emerald-200/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                অত্র প্রতিষ্ঠানের কেন্দ্রীয় হিসাব ও হোস্টেল শাখার যাবতীয় পাওনাদি ও ফি সম্পূর্ণভাবে পরিশোধিত ও নিষ্পন্ন।
              </span>
            </div>

            <p className="pt-2 text-center font-bold text-zinc-700">
              আমরা তাহার ভবিষ্যৎ জীবনের অব্যাহত সাফল্য, জ্ঞানার্জন ও সর্বাঙ্গীন কল্যাণ কামনা করি।
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-16 mt-6 text-center text-xs font-bold text-zinc-700">
            <div>
              <div className="border-t border-dashed border-zinc-400 pt-1.5 mx-4">
                হিসাব রক্ষক
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">মানযিল ইনস্টিটিউট</span>
            </div>
            <div>
              <div className="border-t border-dashed border-zinc-400 pt-1.5 mx-4">
                নাজেমে তা&apos;লীমাত
              </div>
              <span className="text-[10px] text-zinc-400 font-normal">শিক্ষা বিভাগ</span>
            </div>
            <div>
              <div className="border-t border-zinc-800 pt-1.5 mx-4 text-zinc-900 font-black">
                অধ্যক্ষ / মুহতামিম
              </div>
              <span className="text-[10px] text-zinc-500 font-normal">মানযিল ইন্টারন্যাশনাল ইনস্টিটিউট</span>
            </div>
          </div>

          {/* System Seal */}
          <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>System Generated Transfer Certificate • Manzil ERP</span>
            <span>Security Verification Code: {student.$id?.slice(-8).toUpperCase()}</span>
          </div>
        </div>

        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .tc-printable-area, .tc-printable-area * {
              visibility: visible;
            }
            .tc-printable-area {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 24px;
              border: 1px solid #000;
              box-shadow: none;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}