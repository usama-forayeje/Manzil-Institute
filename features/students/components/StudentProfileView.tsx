'use client';

import React from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Building2, 
  History, GraduationCap, FileText, ShieldCheck, 
  Smartphone, Briefcase, Users, Map as MapIcon, 
  Home, CheckCircle2, Clock, ChevronLeft, School, 
  Bookmark, UserCheck, IdCard, Files, ExternalLink, Circle,
  MessageSquareCheck, Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RELATION_LABELS: Record<string, string> = {
  father: 'পিতা',
  mother: 'মাতা',
  brother: 'ভাই',
  sister: 'বোন',
  grandfather: 'দাদা/নানা',
  grandmother: 'দাদী/নানী',
  uncle: 'চাচা/মামু',
  guardian: 'আইনি অভিভাবক',
  other: 'অন্যান্য',
};

interface StudentProfileViewProps {
  student: any;
}

export default function StudentProfileView({ student }: StudentProfileViewProps) {
  const router = useRouter();
  if (!student) return null;

  const latestEnrollment = student.enrollments?.[0] || null;

  const toBn = (num: any) => {
    if (num === null || num === undefined) return '---';
    return num.toString().replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);
  };

  const formatDateBn = (dateStr: string) => {
    if (!dateStr) return '---';
    try {
      return format(new Date(dateStr), 'dd MMMM, yyyy', { locale: bn });
    } catch {
      return dateStr;
    }
  };

  const getFlatAddress = (prefix: 'present' | 'permanent') => {
    const v = student[`${prefix}Village`];
    const u = student[`${prefix}Union`];
    const p = student[`${prefix}PostOffice`];
    const t = student[`${prefix}Thana`];
    const d = student[`${prefix}District`];
    const c = student[`${prefix}PostCode`];

    if (!v && !t && !d) return 'ঠিকানা পাওয়া যায়নি';

    const parts = [
      v,
      u,
      p ? `ডাকঘর: ${p}` : null,
      t,
      d,
      c ? `পিন: ${c}` : null
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4 sm:px-0">
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <Avatar className="h-36 w-36 rounded-2xl border-4 border-[#00AEEF]/10 cursor-pointer hover:opacity-90 transition-all shadow-lg">
          <AvatarImage 
            src={student.photo || student.photoUrl} 
            alt={student.nameEn} 
            className="object-cover" 
          />
          <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-[#00AEEF]">
            <User className="h-14 w-14" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-start gap-3 justify-center md:justify-start">
             <div className="space-y-1">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white kalpurush-font leading-tight">{student.nameBn}</h1>
                <p className="text-xl font-bold text-[#00AEEF] ar-font leading-none">{student.nameAr || ''}</p>
             </div>
             <div className="flex items-center gap-2 mt-1">
                <Badge className={cn(
                  "h-fit px-3 py-1 text-[10px] font-black uppercase tracking-widest cursor-pointer",
                  student.status === 'active' ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
                )}>
                  {student.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </Badge>
                {student.isHafiz && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1 rounded-lg px-2 cursor-pointer transition-colors hover:bg-amber-100">
                    <Bookmark className="h-3 w-3 fill-amber-600" /> হাফেজ
                  </Badge>
                )}
             </div>
          </div>
          
          <p className="text-zinc-500 font-bold english-text tracking-wide text-lg">{student.nameEn}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
             <div className="flex items-center gap-1.5 px-4 py-2 bg-[#00AEEF]/5 dark:bg-[#00AEEF]/10 rounded-xl text-xs font-bold text-[#00AEEF] border border-[#00AEEF]/20">
                <IdCard className="h-4 w-4" /> আইডি: {student.studentId || '---'}
             </div>
             <div className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                ভর্তি নং: {student.admissionNo || '---'}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <Link href={`/dashboard/admin/students/${student.$id || student.id}/edit`}>
              <Button 
                variant="outline" 
                className="rounded-2xl font-bold kalpurush-font h-12 px-6 gap-2 border-zinc-200 hover:bg-zinc-50 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] dark:hover:bg-zinc-900"
              >
                <Edit className="h-4 w-4" /> এডিট প্রোফাইল
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           {/* Row 1: Academic & Admission */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoCard title="একাডেমিক বিবরণ" icon={GraduationCap}>
                 <DetailRow label="শ্রেণী / জামাত" value={latestEnrollment?.className || '---'} />
                 <DetailRow label="বিভাগ / শাখা" value={latestEnrollment?.departmentName || '---'} />
                 <DetailRow label="রোল নম্বর" value={toBn(latestEnrollment?.rollNo)} />
                 <DetailRow label="শিফট / সময়" value={latestEnrollment?.shift === 'morning' ? 'সকাল' : 'দিন'} />
                 <DetailRow label="সেশন" value={latestEnrollment?.session || student.session || '---'} />
                 <DetailRow label="মাসিক ফি" value={`${toBn(latestEnrollment?.monthlyFee || 0)}/-`} />
              </InfoCard>

              <InfoCard title="ভর্তি ও বোর্ডিং" icon={Home}>
                 <DetailRow label="ভর্তির তারিখ" value={formatDateBn(student.admissionDate || latestEnrollment?.enrollmentDate)} />
                 <DetailRow label="বোর্ডিং ধরন" value={latestEnrollment?.boardingTypeName || '---'} />
                 <DetailRow label="হল / হোস্টেল" value={latestEnrollment?.hallName || '---'} />
                 <DetailRow label="পূর্ববর্তী স্কুল" value={student.previousSchoolName || '---'} />
                 <DetailRow label="পূর্ববর্তী শ্রেণী" value={student.previousClassName || '---'} />
                 <DetailRow label="পূর্ববর্তী রেজাল্ট" value={student.previousResult || '---'} />
              </InfoCard>
           </div>

           {/* Row 2: Personal & Identity */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="ব্যক্তিগত ও পরিচয়পত্র" icon={User}>
                 <div className="grid grid-cols-1 gap-y-1">
                    <DetailRow label="লিঙ্গ" value={student.gender === 'male' ? 'পুরুষ' : 'মহিলা'} />
                    <DetailRow label="জন্ম তারিখ" value={formatDateBn(student.dateOfBirth)} />
                    <DetailRow label="রক্তের গ্রুপ" value={student.bloodGroup || 'N/A'} />
                    <DetailRow label="জাতীয়তা" value={student.nationality || 'বাংলাদেশী'} />
                    <DetailRow label="ধর্ম" value={student.religion || 'ইসলাম'} />
                    <DetailRow label="পরিচয়পত্রের ধরন" value={student.identificationType?.toUpperCase() || 'N/A'} />
                    <DetailRow label="পরিচয়পত্র নং" value={student.identificationNo || '---'} />
                 </div>
              </InfoCard>

              <InfoCard title="আবেদনকারীর তথ্য" icon={UserCheck}>
                 <div className="grid grid-cols-1 gap-y-1">
                    <DetailRow label="সম্পর্ক" value={RELATION_LABELS[student.applicantRelation] || 'পিতা'} />
                    <DetailRow 
                       label="আবেদনকারীর নাম" 
                       value={
                          student.applicantRelation === 'father' ? (student.fatherNameBn || '---') :
                          student.applicantRelation === 'mother' ? (student.motherNameBn || '---') :
                          (student.applicantName || '---')
                       } 
                    />
                    <DetailRow 
                       label="মোবাইল নম্বর" 
                       value={
                          student.applicantRelation === 'father' ? (student.phonePrimary || student.guardianPhone || '---') :
                          student.applicantRelation === 'mother' ? (student.guardianPhone || '---') :
                          (student.applicantPhone || '---')
                       } 
                    />
                 </div>
                 { (student.applicantRelation === 'father' || student.applicantRelation === 'mother') && (
                    <p className="text-[10px] text-zinc-400 font-medium italic mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-900 leading-relaxed">
                       * আবেদনকারী পিতা/মাতা হওয়ায় তাদের মূল তথ্য থেকে রেকর্ড দেখানো হয়েছে।
                    </p>
                 )}
              </InfoCard>
           </div>

           {/* Row 3: Family Info */}
           <InfoCard title="পারিবারিক তথ্য" icon={Users}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1">
                 <DetailRow label="পিতার নাম (বাং)" value={student.fatherNameBn || '---'} />
                 <DetailRow label="পিতার নাম (ইং)" value={student.fatherNameEn || '---'} />
                 <DetailRow label="পিতার পেশা" value={student.fatherOccupation || '---'} />
                 <DetailRow label="পিতার কর্মস্থল" value={student.fatherWorkplace || '---'} />
                 
                 <DetailRow label="মাতার নাম (বাং)" value={student.motherNameBn || '---'} />
                 <DetailRow label="মাতার নাম (ইং)" value={student.motherNameEn || '---'} />
                 <DetailRow label="মাতার পেশা" value={student.motherOccupation || '---'} />
                 <DetailRow label="মাতার কর্মস্থল" value={student.motherWorkplace || '---'} />
              </div>
           </InfoCard>

           {/* Row 4: Address */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="বর্তমান ঠিকানা" icon={MapPin}>
                 <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group transition-all hover:border-[#00AEEF]/20">
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 kalpurush-font leading-loose">
                       {getFlatAddress('present')}
                    </p>
                 </div>
              </InfoCard>

              <InfoCard title="স্থায়ী ঠিকানা" icon={MapPin}>
                 <div className="p-5 rounded-2xl bg-[#00AEEF]/5 dark:bg-[#00AEEF]/10 border border-[#00AEEF]/20 group transition-all hover:bg-[#00AEEF]/10">
                    <p className="text-sm font-bold text-[#00AEEF] kalpurush-font leading-loose">
                       {getFlatAddress('permanent')}
                    </p>
                 </div>
              </InfoCard>
           </div>
           
           {/* Section 5: Admission Test Content */}
           {(student.admissionTestMarks || student.admissionTestResult) && (
              <InfoCard title="ভর্তি পরীক্ষা ও মন্তব্য" icon={ShieldCheck}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1">
                    <DetailRow label="প্রাপ্ত নম্বর" value={student.admissionTestMarks ? toBn(student.admissionTestMarks) : '---'} />
                    <DetailRow label="ফলাফল" value={student.admissionTestResult === 'passed' ? 'উত্তীর্ণ' : 'অপেক্ষমাণ'} />
                    <DetailRow label="পরীক্ষক" value={student.examinerName || '---'} />
                    <div className="sm:col-span-2 pt-3">
                       <p className="text-[10px] font-black text-zinc-400 uppercase mb-2 tracking-widest">বিশেষ মন্তব্য</p>
                       <div className="text-sm text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 leading-relaxed">
                          {student.admissionTestRemarks || student.notes || 'কোনো মন্তব্য পাওয়া যায়নি।'}
                       </div>
                    </div>
                 </div>
              </InfoCard>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <InfoCard title="যোগাযোগ" icon={Smartphone}>
              <div className="space-y-4">
                <ContactItem label="প্রাথমিক মোবাইল" value={student.phonePrimary || '---'} icon={Smartphone} />
                <ContactItem label="অভিভাবকের মোবাইল" value={student.guardianPhone || '---'} icon={Phone} />
                <ContactItem label="হোয়াটসঅ্যাপ" value={student.whatsappNo || '---'} icon={MessageSquareCheck} />
                <ContactItem label="ইমেইল ঠিকানা" value={student.email || 'N/A'} icon={Mail} />
              </div>
           </InfoCard>

           <InfoCard title="প্রয়োজনীয় নথিপত্র" icon={Files}>
              <div className="space-y-3">
                 <SimpleDocItem label="ছাত্রের ছবি" url={student.photo} />
                 <SimpleDocItem label="পরিচয়পত্র (সামনে)" url={student.studentDocFrontUrl} />
                 <SimpleDocItem label="পরিচয়পত্র (পিছনে)" url={student.studentDocBackUrl} />
                 <SimpleDocItem label="পিতার এনআইডি (সামনে)" url={student.fatherNidFrontUrl} />
                 <SimpleDocItem label="পিতার এনআইডি (পিছনে)" url={student.fatherNidBackUrl} />
                 <SimpleDocItem label="মাতার এনআইডি (সামনে)" url={student.motherNidFrontUrl} />
                 <SimpleDocItem label="মাতার এনআইডি (পিছনে)" url={student.motherNidBackUrl} />
                 <SimpleDocItem label="ছাড়পত্র (TC)" url={student.transferCertificateUrl} />
                 {student.additionalDocuments?.map((url: string, index: number) => (
                    <SimpleDocItem key={index} label={`অন্যান্য নথি ${index + 1}`} url={url} />
                 ))}
              </div>
           </InfoCard>

           {/* Metadata Card */}
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-none shadow-xl rounded-[2rem] p-8 text-zinc-900 dark:text-white space-y-6 relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 h-40 w-40 bg-[#00AEEF]/5 dark:bg-[#00AEEF]/20 rounded-full blur-3xl transition-all group-hover:bg-[#00AEEF]/10 dark:group-hover:bg-[#00AEEF]/30" />
              
              <div className="flex items-center gap-4 relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-[#00AEEF]/5 dark:bg-white/10 flex items-center justify-center text-[#00AEEF] border border-[#00AEEF]/10 dark:border-white/10">
                    <Clock className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-none mb-2">রেজিস্ট্রেশন তারিখ</p>
                    <p className="text-base font-bold kalpurush-font">{formatDateBn(student.$createdAt)}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-[#00AEEF]/5 dark:bg-white/10 flex items-center justify-center text-[#00AEEF] border border-[#00AEEF]/10 dark:border-white/10">
                    <UserCheck className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-none mb-2">এন্ট্রি দাতা</p>
                    <p className="text-base font-bold kalpurush-font">{student.createdBy || 'Unknown Admin'}</p>
                 </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-white/10 flex flex-col relative z-10">
                 <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-2">SYSTEM ID</p>
                 <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-white/5 px-2 py-1.5 rounded-lg border border-zinc-100 dark:border-none w-fit">
                    {student.$id}
                 </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="p-7 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all shadow-sm hover:shadow-md">
      <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
        <div className="h-6 w-6 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 cursor-pointer" />
        </div>
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-zinc-50 dark:border-zinc-900 last:border-0 group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 rounded-lg px-1">
      <span className="text-[12px] font-bold text-zinc-400 kalpurush-font uppercase tracking-tight">{label}</span>
      <span className="text-sm font-black text-zinc-800 dark:text-zinc-200 kalpurush-font">{value}</span>
    </div>
  );
}

function ContactItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-center gap-5 py-2 border-b border-zinc-50 dark:border-zinc-900 last:border-0 group">
       <div className="h-11 w-11 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-[#00AEEF] cursor-pointer hover:bg-[#00AEEF] hover:text-white transition-all group-hover:scale-110 shadow-sm">
          <Icon className="h-5 w-5" />
       </div>
       <div className="flex-1">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-2">{label}</p>
          <p className="text-sm font-bold text-zinc-800 dark:text-white font-mono tracking-tight">{value}</p>
       </div>
    </div>
  );
}

function SimpleDocItem({ label, url }: { label: string, url: string }) {
  const exists = !!url && url !== '' && url !== null;
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
        exists 
          ? "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-[#00AEEF]/5 hover:border-[#00AEEF]/20 hover:shadow-sm" 
          : "bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-50 dark:border-zinc-900 opacity-60 grayscale"
      )}
      onClick={() => exists && window.open(url, '_blank')}
    >
       <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className={cn(
             "h-8 w-8 rounded-xl flex items-center justify-center",
             exists ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-100/50 text-zinc-300"
          )}>
            {exists ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          </div>
          <span className={cn("text-[12px] font-bold kalpurush-font truncate", exists ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-400 dark:text-zinc-600")}>{label}</span>
       </div>
       {exists && (
         <div className="h-8 w-8 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-[#00AEEF] shadow-sm border border-zinc-100 dark:border-zinc-700 transition-transform hover:rotate-12">
            <ExternalLink className="h-4 w-4" />
         </div>
       )}
    </div>
  );
}
