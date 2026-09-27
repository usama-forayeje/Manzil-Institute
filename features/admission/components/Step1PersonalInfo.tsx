'use client';

/**
 * Step1PersonalInfo.tsx — Premium Redesign (Aligned with Schema)
 * Updated to include all schema fields: fatherNameEn, motherNameEn, workplaces, and nationality.
 */

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  User,
  Users,
  UserCheck,
  Heart,
  Sparkles,
  Check,
  ChevronRight,
  Globe,
  Briefcase
} from 'lucide-react';
import { differenceInYears, differenceInMonths } from 'date-fns';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/DatePicker';

import {
  GENDER_LABELS,
  RELIGION_LABELS,
  BLOOD_GROUP_LABELS,
} from '../schemas';

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

import type { AdmissionFormValues } from '../schemas/form';
import { VoiceInputBn, VoiceInputEn, VoiceInputAr } from '@/components/ui/voice-input';
import { cn } from '@/lib/utils';

// ── Animations ─────────────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// ── Sub-components ─────────────────────────────────────────────────────────

function SectionCard({
  number,
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
}: {
  number: string;
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md',
        className
      )}
    >
      <div className="p-5 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#00AEEF]/10 text-[10px] font-bold text-[#00AEEF] dark:bg-[#00AEEF]/20">
                {number}
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                {title}
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium line-clamp-1">
              {subtitle}
            </p>
          </div>
          <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 flex items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i + 1 === current
              ? 'w-6 bg-[#00AEEF]'
              : i + 1 < current
                ? 'w-1.5 bg-zinc-900 dark:bg-zinc-100'
                : 'w-1.5 bg-zinc-200 dark:bg-zinc-700'
          )}
        />
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Step1PersonalInfo({ onNext, isEditMode }: { onNext: () => void, isEditMode?: boolean }) {
  const form = useFormContext<AdmissionFormValues>();
  const { control, watch } = form;

  const dob = watch('personal.dateOfBirth');
  const applicantRelation = watch('personal.applicantRelation');

  const ageLabel = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const now = new Date();
    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;
    if (years === 0 && months === 0) return '১ মাসের কম';
    if (years === 0) return `${months} মাস`;
    return `${years} বছর ${months} মাস`;
  }, [dob]);

  return (
    <div
      className="kalpurush-font max-w-3xl mx-auto px-4 pb-24 pt-8"
    >
      <div className="space-y-8">

        {/* ── Page Header ──────────────────────────────────── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <StepDots current={1} total={5} />
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide ml-1">
              ধাপ ১ / ৫
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            ছাত্রের ব্যক্তিগত তথ্য
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium max-w-lg leading-relaxed">
            ছাত্রের প্রাথমিক পরিচয়, অভিভাবক এবং অন্যান্য ব্যক্তিগত বিবরণ নির্ভুলভাবে প্রদান করুন।
          </p>
        </div>

        {/* ── Section 1.1: Core Identity ───────────────────── */}
        <SectionCard
          number="১.১"
          title="প্রাথমিক পরিচয়"
          subtitle="ছাত্রের পূর্ণ নাম বিভিন্ন ভাষায় প্রদান করুন"
          icon={User}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={control}
              name="personal.nameBn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    পূর্ণ নাম (বাংলায়) *
                  </FormLabel>
                  <FormControl>
                    <VoiceInputBn
                      {...field}
                      component={Input}
                      placeholder="নাম বাংলায় লিখুন"
                      className="h-11 rounded-xl bg-zinc-50/50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 focus:ring-2 focus:ring-[#00AEEF]/20"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="personal.nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 english-text">
                    Full Name (English) *
                  </FormLabel>
                  <FormControl>
                    <VoiceInputEn
                      {...field}
                      component={Input}
                      placeholder="Full Name and Title"
                      className="h-11 rounded-xl bg-zinc-50/50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 focus:ring-2 focus:ring-[#00AEEF]/20 english-text"
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="personal.nameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  পূর্ণ নাম (আরবি)
                </FormLabel>
                <FormControl>
                  <VoiceInputAr
                    {...field}
                    component={Input}
                    placeholder="الاسم الكامل باللغة العربية"
                    className="h-11 rounded-xl bg-zinc-50/50 border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 focus:ring-2 focus:ring-[#00AEEF]/20 text-right"
                    value={field.value ?? ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </SectionCard>

        {/* ── Section 1.2: Parents ─────────────────────────── */}
        <SectionCard
          number="১.২"
          title="অভিভাবক তথ্য"
          subtitle="পিতা ও মাতার প্রয়োজনীয় তথ্য যুক্ত করুন"
          icon={Users}
        >
          {/* Father Info */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">পিতার তথ্য</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              <FormField control={control} name="personal.fatherNameBn" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">নাম (বাংলা)</FormLabel>
                  <FormControl><VoiceInputBn {...field} component={Input} placeholder="পিতার বাংলা নাম" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="personal.fatherNameEn" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500 english-text">Name (English)</FormLabel>
                  <FormControl><VoiceInputEn {...field} component={Input} placeholder="Father's English Name" className="h-11 rounded-xl english-text" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="personal.fatherNameAr" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">নাম (আরবি)</FormLabel>
                  <FormControl><VoiceInputAr {...field} component={Input} placeholder="اسم الأب بالعربية" className="h-11 rounded-xl text-right" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <FormField control={control} name="personal.fatherOccupation" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">পেশা</FormLabel>
                  <FormControl><VoiceInputBn {...field} component={Input} placeholder="পেশা" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="personal.fatherWorkplace" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">কর্মস্থল / ঠিকানা</FormLabel>
                  <FormControl><VoiceInputBn {...field} component={Input} placeholder="পেশার স্থান" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
            </div>
          </div>

          <div className="h-px bg-zinc-100 dark:bg-zinc-900 my-4" />

          {/* Mother Info */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">মাতার তথ্য</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-4">
              <FormField control={control} name="personal.motherNameBn" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">নাম (বাংলা)</FormLabel>
                  <FormControl><VoiceInputBn {...field} component={Input} placeholder="মাতার বাংলা নাম" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="personal.motherNameEn" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500 english-text">Name (English)</FormLabel>
                  <FormControl><VoiceInputEn {...field} component={Input} placeholder="Mother's English Name" className="h-11 rounded-xl english-text" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="personal.motherNameAr" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">নাম (আরবি)</FormLabel>
                  <FormControl><VoiceInputAr {...field} component={Input} placeholder="اسم الأم بالعربية" className="h-11 rounded-xl text-right" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <FormField control={control} name="personal.motherOccupation" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">পেশা</FormLabel>
                  <FormControl><VoiceInputBn {...field} component={Input} placeholder="পেশা" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
              <FormField control={control} name="personal.motherWorkplace" render={({ field }) => (
                <FormItem><FormLabel className="text-xs text-zinc-500">কর্মস্থল / ঠিকানা</FormLabel>
                  <FormControl><VoiceInputBn {...field} component={Input} placeholder="কর্মস্থল" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
                </FormItem>
              )} />
            </div>
          </div>
        </SectionCard>

        {/* ── Section 1.3: Additional Details ─────────────── */}
        <SectionCard
          number="১.৩"
          title="ব্যক্তিগত বিবরণ"
          subtitle="জন্ম তারিখ, লিঙ্গ ও জাতীয়তা"
          icon={Heart}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={control}
              name="personal.dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                    <span>জন্ম তারিখ *</span>
                    {ageLabel && (
                      <span className="text-[9px] bg-[#00AEEF]/10 text-[#00AEEF] px-2 py-0.5 rounded-full font-black tracking-tight">{ageLabel}</span>
                    )}
                  </FormLabel>
                  <DatePicker
                    date={field.value ? new Date(field.value + 'T00:00:00') : undefined}
                    setDate={(date) => {
                      if (date) {
                        const y = date.getFullYear();
                        const m = String(date.getMonth() + 1).padStart(2, '0');
                        const d = String(date.getDate()).padStart(2, '0');
                        field.onChange(`${y}-${m}-${d}`);
                      } else { field.onChange(''); }
                    }}
                    placeholder="জন্ম তারিখ নির্বাচন করুন"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={control} name="personal.gender" render={({ field }) => (
              <FormItem><FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">লিঙ্গ *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="নির্বাচন" /></SelectTrigger></FormControl>
                  <SelectContent className="kalpurush-font">
                    {Object.entries(GENDER_LABELS).map(([v, l]) => (<SelectItem key={v} value={v}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField control={control} name="personal.religion" render={({ field }) => (
              <FormItem><FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">ধর্ম *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="ধর্ম নিবার্চন" /></SelectTrigger></FormControl>
                  <SelectContent className="kalpurush-font">
                    {Object.entries(RELIGION_LABELS).map(([v, l]) => (<SelectItem key={v} value={v}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="personal.bloodGroup" render={({ field }) => (
              <FormItem><FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">রক্তের গ্রুপ</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'unknown'}>
                  <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="রক্তের গ্রুপ" /></SelectTrigger></FormControl>
                  <SelectContent className="kalpurush-font">
                    {Object.entries(BLOOD_GROUP_LABELS).map(([v, l]) => (<SelectItem key={v} value={v}>{l}</SelectItem>))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField control={control} name="personal.nationality" render={({ field }) => (
              <FormItem><FormLabel className="text-xs text-zinc-500">জাতীয়তা</FormLabel>
                <FormControl><VoiceInputBn {...field} component={Input} placeholder="উদাঃ বাংলাদেশী" className="h-11 rounded-xl" value={field.value ?? ''} /></FormControl>
              </FormItem>
            )} />
            <FormField
              control={control}
              name="personal.identificationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-zinc-500">আইডি ধরণ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'bc'}>
                    <FormControl><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="ধরণ" /></SelectTrigger></FormControl>
                    <SelectContent className="kalpurush-font">
                      <SelectItem value="bc">জন্ম নিবন্ধন</SelectItem>
                      <SelectItem value="nid">এনআইডি</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField control={control} name="personal.identificationNo" render={({ field }) => (
              <FormItem><FormLabel className="text-xs text-zinc-500">পরিচয়পত্র নম্বর</FormLabel>
                <FormControl>
                  <VoiceInputEn {...field} component={Input} placeholder="নম্বর লিখুন" className="h-11 rounded-xl" value={field.value ?? ''} />
                </FormControl></FormItem>
            )} />
          </div>

          {/* Special Toggle */}
          <div className="pt-2">

          </div>
        </SectionCard>

        {/* ── Section 1.4: Applicant Info ─────────────────── */}
        <SectionCard
          number="১.৪"
          title="আবেদনকারীর তথ্য ও সম্পর্ক"
          subtitle="যিনি ছাত্রকে ভর্তি করাতে এসেছেন তার তথ্য দিন"
          icon={UserCheck}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FormField
              control={control}
              name="personal.applicantRelation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    ছাত্রের সাথে সম্পর্ক *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-[#00AEEF]/20">
                        <SelectValue placeholder="সম্পর্ক নির্বাচন করুন" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(RELATION_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val} className="text-sm">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {(applicantRelation && applicantRelation !== 'father' && applicantRelation !== 'mother') && (
              <>
                <FormField
                  control={control}
                  name="personal.applicantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        আবেদনকারীর নাম *
                      </FormLabel>
                      <FormControl>
                        <VoiceInputBn
                          placeholder="পূর্ণ নাম প্রবেশ করুন"
                          {...field}
                          className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-[#00AEEF]/20"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="personal.applicantPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        মোবাইল নম্বর *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="০১XXXXXXXXX"
                          {...field}
                          className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-[#00AEEF]/20 font-mono"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {(applicantRelation === 'father' || applicantRelation === 'mother') && (
            <p className="text-[10px] text-zinc-400 font-medium italic">
              * পিতা বা মাতা হলে উপরের সেকশনে তাদের তথ্য থেকেই রেকর্ড আপডেট করা হবে।
            </p>
          )}
        </SectionCard>

        {/* ── System Status (Only visible on edit mode) ── */}
        {isEditMode && (
          <SectionCard number="১.৫" title="সিস্টেম স্ট্যাটাস" subtitle="শিক্ষার্থীর বর্তমান অবস্থা নির্ধারণ করুন" icon={Sparkles}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="personal.status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      স্ট্যাটাস *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || 'active'}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-[#00AEEF]/20">
                          <SelectValue placeholder="স্ট্যাটাস নির্বাচন করুন" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">সক্রিয় (Active)</SelectItem>
                        <SelectItem value="inactive">নিষ্ক্রিয় (Inactive)</SelectItem>
                        <SelectItem value="graduated">উত্তীর্ণ (Graduated)</SelectItem>
                        <SelectItem value="disqualified">বাতিল (Disqualified)</SelectItem>
                        <SelectItem value="suspended">বহিস্কৃত (Suspended)</SelectItem>
                        <SelectItem value="transferred">স্থানান্তরিত (Transferred)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>
        )}

        {/* ── Navigation ─────────────────────────────────── */}
        <div className="pt-4">
          <Button
            type="button"
            onClick={onNext}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
          >
            পরবর্তী তথ্য প্রদান করুন
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

      </div>
    </div>
  );
}