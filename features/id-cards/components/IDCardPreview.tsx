'use client';

import { StudentListItem } from '@/features/students/types';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { cn } from '@/lib/utils';

interface IDCardPreviewProps {
  student: StudentListItem;
}

// 🔢 ইংরেজি সংখ্যাকে বাংলায় কনভার্ট করার হেল্পার ফাংশন
const toBengaliDigits = (numStr: string): string => {
  return numStr.replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
};

export function IDCardPreview({ student }: IDCardPreviewProps) {
  const proxyPhotoSrc = student.photo ? `/api/image-proxy?url=${encodeURIComponent(student.photo)}` : '';
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && student.studentId) {
      try {
        JsBarcode(barcodeRef.current, student.studentId, {
          format: 'CODE128',
          width: 1.2,
          height: 14, // ক্যানভাসের ১৪ পিক্সেল হাইটের সাথে পারফেক্টলি সিঙ্কড
          displayValue: false, // টেক্সট ওভারল্যাপিং বন্ধ করার জন্য ফলস রাখা হলো
          margin: 0,
          background: 'transparent',
          lineColor: '#18181B',
        });
      } catch (e) {
        console.warn('Barcode generation failed', e);
      }
    }
  }, [student.studentId]);

  const rawAge = student.dateOfBirth
    ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()
    : '---';

  // 🧠 বয়স সরাসরি বাংলা সংখ্যায় কনভার্ট করা হচ্ছে
  const currentAgeBn = rawAge !== '---' ? toBengaliDigits(String(rawAge)) : '---';

  return (
    <div className="relative group perspective-1000">
      {/* Front of the ID Card Container */}
      <div
        className="w-[204px] h-[325px] bg-[#FFFFFF] rounded-sm relative overflow-hidden flex flex-col font-sans transition-transform duration-500 transform-gpu  border border-[#E4E4E7]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Background Layer Asset */}
        <img
          src="/dashboard/manzil_student_ID_clean.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none select-none"
          draggable={false}
        />

        {/* 📸 ফটো কন্টেইনার (ক্যানভাসের cx: 102.35, cy: 98, radius: 33.5 অনুযায়ী একদম নিখুঁত) */}
        <div
          className="absolute z-20 overflow-hidden rounded-full flex items-center justify-center bg-white"
          style={{
            left: '68.5px',  // cx - radius
            top: '64.5px',   // cy - radius
            width: '67px',   // radius * 2
            height: '67px'   // radius * 2
          }}
        >
          <Avatar className="w-full h-full rounded-full border border-zinc-100 relative overflow-hidden">
            <AvatarImage
              src={proxyPhotoSrc}
              className="w-full h-full object-cover object-[center_18%] bg-white"
              crossOrigin="anonymous"
            />
            <AvatarFallback className="bg-[#F4F4F5] text-[#A1A1AA] rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </div>

        {/* 🛑 WHITE MASK REMOVED NATIVELY TO SHOW SVG BACKGROUND DOTS */}

        {/* Dynamic Name Header System */}
        <div className="absolute z-20 left-0 right-0 top-[153px] flex flex-col items-center px-4">
          <h2 className="text-[12px] font-black text-[#EC1C24] kalpurush-font leading-none text-center w-full truncate">
            {student.nameBn || student.name || 'STUDENT NAME'}
          </h2>
          {student.nameEn && (
            <h3 className="text-[7px] font-bold uppercase tracking-wider text-zinc-400 mt-[3px] w-full text-center truncate">
              {student.nameEn}
            </h3>
          )}
        </div>

        {/* 📊 ডাইনামিক হাই-ফিডেলিটি টেবিল গ্রিড (ক্যানভাসের ২৪, ৫২ এবং ৬০ পিক্সেল নিয়মে সাজানো) */}
        <div
          className="absolute z-20 flex flex-col"
          style={{
            left: '24px',
            right: '24px',
            top: '180px' // ক্যানভাসের currentY: 191px বেসলাইনের সাথে নিখুঁত এলাইনমেন্ট
          }}
        >
          {[
            { label: 'পিতা', value: student.fatherNameBn || '---' },
            { label: 'বয়স', value: currentAgeBn },
            { label: 'শ্রেণী', value: student.className || student.class || '---' },
            { label: 'আইডি', value: student.studentId || '---', isMono: true, noBorder: true }
          ].map((field, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center h-[15px] border-zinc-100", // rowGap: 15px সিঙ্ক করা হয়েছে
                !field.noBorder && "border-b"
              )}
            >
              {/* 🏷️ লেবেল উইডথ ২৮ পিক্সেল (২৪ থেকে ৫২ এর দূরত্ব) */}
              <span className="w-[28px] font-bold text-zinc-400 text-left select-none kalpurush-font text-[7.5px] leading-none">
                {field.label}
              </span>
              {/* 🔤 কোলন উইডথ ৮ পিক্সেল (৫২ থেকে ৬০ এর দূরত্ব) */}
              <span className="w-[8px] text-zinc-400 select-none text-left kalpurush-font text-[7.5px] leading-none">
                :
              </span>
              {/* 💎 ভ্যালু শুরু হচ্ছে ঠিক ৬০ পিক্সেল থেকে */}
              <span
                className={cn(
                  "text-zinc-800 font-bold truncate flex-1 text-left kalpurush-font text-[8.5px] leading-none",
                  field.isMono && "font-mono text-[8.5px] font-black text-zinc-900"
                )}
              >
                {field.value}
              </span>
            </div>
          ))}
        </div>

        {/* 🛠️ বারকোড লেয়ার (ক্যানভাসের top: 244px এবং height: 14px এর সাথে ১:১ ম্যাচড) */}
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{
            left: '0',
            right: '0',
            top: '244px',
            height: '14px',
          }}
        >
          <svg ref={barcodeRef} className="h-full max-w-[85%]" />
        </div>
      </div>
    </div>
  );
}