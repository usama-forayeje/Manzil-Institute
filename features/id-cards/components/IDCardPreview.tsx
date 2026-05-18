'use client';

import React from 'react';
import { StudentListItem } from '@/features/students/types';
import { cn } from '@/lib/utils';
import { QrCode, Phone, Building, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface IDCardPreviewProps {
  student: StudentListItem;
}

export function IDCardPreview({ student }: IDCardPreviewProps) {
  // Use our Next.js backend proxy to completely bypass browser CORS limitations for PDF/PNG exports
  const proxyPhotoSrc = student.photo ? `/api/image-proxy?url=${encodeURIComponent(student.photo)}` : '';
  
  return (
    <div className="relative group perspective-1000">
      {/* Front of the ID Card */}
      <div 
        className="w-[204px] h-[325px] bg-[#FFFFFF] rounded-xl relative overflow-hidden flex flex-col font-sans transition-transform duration-500 transform-gpu group-hover:-translate-y-2 border border-[#E4E4E7]"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          {/* Subtle wave or curve at the top */}
          <div 
            className="absolute top-0 left-0 right-0 h-32 rounded-b-[100%]" 
            style={{ background: 'linear-gradient(to bottom, #00AEEF, rgba(255,255,255,0))' }}
          />
        </div>

        {/* Top Header Section */}
        <div 
          className="relative z-10 w-full bg-[#00AEEF] pt-4 pb-8 rounded-b-[1.5rem] flex flex-col items-center justify-center text-[#FFFFFF]"
          style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        >
          {/* Since we don't have the logo asset path guaranteed, we use premium typography */}
          <h1 className="text-sm font-black tracking-tight leading-none text-center">MANZIL</h1>
          <p className="text-[6px] tracking-[0.2em] uppercase font-bold opacity-90 mt-0.5">International Institute</p>
        </div>

        {/* Photo Container - Overlapping the header */}
        <div className="relative z-20 flex justify-center -mt-6 mb-3">
          <div 
            className="relative p-1 bg-[#FFFFFF] rounded-lg"
            style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          >
            <Avatar className="w-20 h-24 rounded-md border-2 border-[#00AEEF]/20 relative overflow-hidden">
              <AvatarImage 
                src={proxyPhotoSrc} 
                className="w-full h-full object-cover bg-white" 
                crossOrigin="anonymous" 
              />
              <AvatarFallback className="bg-[#F4F4F5] text-[#A1A1AA] rounded-md">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            {/* Holographic or subtle badge overlay */}
            <div 
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#10B981] border-2 border-[#FFFFFF]" 
              title="Active Student" 
              style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
            />
          </div>
        </div>

        {/* Student Details (Bangla + English) */}
        <div className="flex-1 flex flex-col items-center px-4 relative z-10">
          <h2 className="text-[16px] font-bold text-[#18181B] kalpurush-font leading-tight text-center w-full truncate">
            {student.nameBn}
          </h2>
          <h3 className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA] mt-0.5 w-full text-center truncate">
            {student.nameEn || 'STUDENT NAME'}
          </h3>

          <div className="w-8 h-[2px] bg-[#00AEEF] rounded-full my-2 opacity-50" />

          {/* Details Grid */}
          <div className="w-full space-y-1.5 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-[#A1A1AA] uppercase tracking-wider">ID NO</span>
              <span className="text-[10px] font-black text-[#00AEEF] uppercase font-mono bg-[#00AEEF]/10 px-1.5 py-0.5 rounded">
                {student.studentId}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-b border-[#F4F4F5] pb-1">
              <span className="text-[8px] font-bold text-[#A1A1AA] uppercase tracking-wider">BLOOD GRP</span>
              <span className="text-[10px] font-black text-[#F43F5E] uppercase">{student.bloodGroup !== 'unknown' ? student.bloodGroup : 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center bg-[#FAFAFA] rounded px-1.5 py-1">
              <span className="text-[8px] font-bold text-[#71717A] kalpurush-font">বিভাগ</span>
              <span className="text-[9px] font-bold text-[#27272A] kalpurush-font max-w-[80px] truncate text-right">
                {student.departmentName || '---'}
              </span>
            </div>
            
            <div className="flex justify-between items-center bg-[#FAFAFA] rounded px-1.5 py-1">
              <span className="text-[8px] font-bold text-[#71717A] kalpurush-font">শ্রেণী</span>
              <span className="text-[9px] font-bold text-[#27272A] kalpurush-font max-w-[80px] truncate text-right">
                {student.className || '---'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Area with QR & Signature */}
        <div className="h-14 w-full bg-[#FAFAFA] mt-auto border-t border-[#F4F4F5] flex items-center justify-between px-3 relative z-10">
          <div 
            className="bg-[#FFFFFF] p-0.5 rounded border border-[#E4E4E7]"
            style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
          >
             {/* Mocking QR code based on ID */}
            <QrCode className="w-8 h-8 text-[#27272A]" strokeWidth={1.5} />
          </div>
          
          <div className="flex flex-col items-center">
             {/* Signature Mock */}
            <div className="font-[signature] text-[#00AEEF] text-lg leading-none transform -rotate-6 italic font-serif">
              Principal
            </div>
            <div className="w-12 h-[1px] bg-[#27272A] my-0.5" />
            <span className="text-[6px] font-bold text-[#71717A] uppercase tracking-widest">Authority</span>
          </div>
        </div>
      </div>
      
      {/* Decorative tag to indicate it's a front preview 
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Front Side
      </div> */}
    </div>
  );
}
