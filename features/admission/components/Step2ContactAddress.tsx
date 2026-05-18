'use client';

/**
 * Step2ContactAddress.tsx — Premium Minimal Redesign
 *
 * Design Philosophy:
 * - shadcn/ui-inspired: clean, purposeful, refined
 * - Numbered sections with clear visual hierarchy
 * - Floating sync toggle as a pill switch (not a floating button)
 * - Subtle micro-animations — entrance stagger + hover states
 * - No heavy glassmorphism; clean white cards with precise borders
 * - Clear typographic scale with Bengali support
 * - Responsive: single column → two column
 */

import { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Phone, Mail, MapPin, Home,
  ArrowRight, ArrowLeft,
  Copy, CheckCircle2, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AdmissionFormValues } from '../schemas/form';
import { VoiceInputBn, VoiceInputEn } from '@/components/ui/voice-input';

import {
  DIVISIONS_LIST_BN,
  getDistrictsOfDivisionBN,
  getThanasOfDistrictBN,
  UNIONS_BY_UPAZILA_BN,
  isDhakaMetroDistrict,
  getWardsForDhakaMetro,
} from '@/lib/bangladesh-address';

// ─── Animation Variants ────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Section Card ──────────────────────────────────────────────────────────

function SectionCard({
  number,
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  faded,
}: {
  number: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  faded?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-500 overflow-hidden',
        faded && 'opacity-60 grayscale-[0.2]',
        className
      )}
    >
      {/* Card Header */}
      <div className="flex items-start gap-4 p-5 sm:p-6 md:px-8 md:pt-8 md:pb-6 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#00AEEF]">
              ধাপ {number}
            </span>
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 md:p-8">{children}</div>
    </div>
  );
}

// ─── Field Label ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <FormLabel className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide">
      {children}
      {required && <span className="text-[#00AEEF] ml-0.5">*</span>}
    </FormLabel>
  );
}

// ─── Input Wrapper (consistent height + style) ─────────────────────────────

const inputClass =
  'h-10 rounded-lg border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-[#00AEEF] focus-visible:border-[#00AEEF] transition-all';

// ─── Address Select ────────────────────────────────────────────────────────

function AddressSelect({
  control,
  name,
  label,
  options,
  disabled,
  placeholder = 'নির্বাচন করুন',
  required,
}: {
  control: any;
  name: string;
  label: string;
  options: string[];
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FieldLabel required={required}>{label}</FieldLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            disabled={disabled || options.length === 0}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  'h-10 rounded-lg border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-medium transition-all',
                  'focus:ring-1 focus:ring-[#00AEEF] focus:border-[#00AEEF]',
                  (disabled || options.length === 0) &&
                    'opacity-40 cursor-not-allowed'
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="kalpurush-font rounded-lg border-zinc-200 dark:border-zinc-800 shadow-xl max-h-72">
              {options.length > 0 ? (
                options.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="rounded-lg text-sm font-medium cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-zinc-400 font-medium">
                  আগের ধাপ নির্বাচন করুন
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// ─── Sync Toggle ───────────────────────────────────────────────────────────

function SyncToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!checked)}
      className={cn(
        'group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200',
        checked
          ? 'bg-[#00AEEF] border-[#00AEEF] text-white shadow-md shadow-[#00AEEF]/20'
          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200'
      )}
    >
      <span
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded-md transition-all',
          checked
            ? 'bg-white/20'
            : 'border border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400'
        )}
      >
        {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      </span>
      স্থায়ী ঠিকানা বর্তমানের মতো
    </button>
  );
}

// ─── Step Progress Dots ────────────────────────────────────────────────────

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
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

// ─── Main Component ────────────────────────────────────────────────────────

export default function Step2ContactAddress({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const form = useFormContext<AdmissionFormValues>();
  const { control, watch, setValue } = form;

  const presentDivision = watch('contact.presentAddress.division');
  const presentDistrict = watch('contact.presentAddress.district');
  const presentThana    = watch('contact.presentAddress.thana');

  const permanentDivision = watch('contact.permanentAddress.division');
  const permanentDistrict = watch('contact.permanentAddress.district');
  const permanentThana    = watch('contact.permanentAddress.thana');

  const isPermanentSame = watch('contact.permanentSameAsCurrent');

  const getUnionOptions = (district: string, thana: string) => {
    if (isDhakaMetroDistrict(district)) {
      return getWardsForDhakaMetro(district).map((w) => `ওয়ার্ড ${w}`);
    }
    return UNIONS_BY_UPAZILA_BN[thana] || [];
  };

  const presentDistricts = useMemo(
    () => getDistrictsOfDivisionBN(presentDivision || ''),
    [presentDivision]
  );
  const presentThanas = useMemo(
    () => getThanasOfDistrictBN(presentDistrict || ''),
    [presentDistrict]
  );
  const presentUnions = useMemo(
    () => getUnionOptions(presentDistrict || '', presentThana || ''),
    [presentDistrict, presentThana]
  );

  const permanentDistricts = useMemo(
    () => getDistrictsOfDivisionBN(permanentDivision || ''),
    [permanentDivision]
  );
  const permanentThanas = useMemo(
    () => getThanasOfDistrictBN(permanentDistrict || ''),
    [permanentDistrict]
  );
  const permanentUnions = useMemo(
    () => getUnionOptions(permanentDistrict || '', permanentThana || ''),
    [permanentDistrict, permanentThana]
  );

  const syncAddress = (checked: boolean) => {
    setValue('contact.permanentSameAsCurrent', checked);
    if (checked) {
      const present = form.getValues('contact.presentAddress');
      setValue('contact.permanentAddress', { ...present });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="kalpurush-font max-w-3xl mx-auto px-4 pb-24 pt-8"
    >
      <div className="space-y-8">

        {/* ── Page Header ──────────────────────────────────── */}
        <motion.div variants={fadeUp} className="space-y-1">
          <div className="flex items-center gap-2 mb-3">
            <StepDots current={2} total={5} />
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 tracking-wide ml-1">
              ধাপ ২ / ৫
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            যোগাযোগ ও ঠিকানা
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium max-w-lg leading-relaxed">
            সঠিক যোগাযোগের তথ্য এবং বর্তমান ও স্থায়ী ঠিকানা প্রদান করুন।
          </p>
        </motion.div>

        {/* ── Section 1: Contact Numbers ───────────────────── */}
        <motion.div variants={fadeUp}>
          <SectionCard number="২.১" title="যোগাযোগের তথ্য" subtitle="ফোন, হোয়াটসঅ্যাপ ও ইমেইল" icon={Phone}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">

              <FormField control={control} name="contact.guardianPhone" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FieldLabel required>অভিভাবকের ফোন নম্বর</FieldLabel>
                  <FormControl>
                    <VoiceInputEn
                      {...field}
                      component={Input}
                      placeholder="01XXX-XXXXXX"
                      className={cn(inputClass, 'english-text')}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="contact.phonePrimary" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FieldLabel>ছাত্রের ফোন নম্বর</FieldLabel>
                  <FormControl>
                    <VoiceInputEn
                      {...field}
                      component={Input}
                      placeholder="01XXX-XXXXXX (ঐচ্ছিক)"
                      className={cn(inputClass, 'english-text')}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={control} name="contact.whatsappNo" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FieldLabel>হোয়াটসঅ্যাপ নম্বর</FieldLabel>
                  <FormControl>
                    <VoiceInputEn
                      {...field}
                      component={Input}
                      placeholder="WhatsApp Number"
                      className={cn(
                        inputClass,
                        'english-text border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/20',
                        'focus-visible:ring-emerald-500 focus-visible:border-emerald-500 text-emerald-700 dark:text-emerald-400'
                      )}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={control} name="contact.email" render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FieldLabel>ইমেইল ঠিকানা</FieldLabel>
                  <FormControl>
                    <VoiceInputEn
                      {...field}
                      component={Input}
                      placeholder="example@email.com (ঐচ্ছিক)"
                      className={cn(inputClass, 'english-text')}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            </div>
          </SectionCard>
        </motion.div>

        {/* ── Section 2: Present Address ───────────────────── */}
        <motion.div variants={fadeUp}>
          <SectionCard number="২.২" title="বর্তমান ঠিকানা" subtitle="এখন যেখানে থাকছেন" icon={MapPin}>
            <div className="space-y-5">

              {/* Division + District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AddressSelect
                  control={control}
                  name="contact.presentAddress.division"
                  label="বিভাগ"
                  options={DIVISIONS_LIST_BN}
                  required
                />
                <AddressSelect
                  control={control}
                  name="contact.presentAddress.district"
                  label="জেলা"
                  options={presentDistricts}
                  disabled={!presentDivision}
                  required
                />
              </div>

              {/* Thana + Union */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AddressSelect
                  control={control}
                  name="contact.presentAddress.thana"
                  label="থানা / উপজেলা"
                  options={presentThanas}
                  disabled={!presentDistrict}
                  required
                />
                <AddressSelect
                  control={control}
                  name="contact.presentAddress.union"
                  label={isDhakaMetroDistrict(presentDistrict || '') ? 'ওয়ার্ড নম্বর' : 'ইউনিয়ন / ওয়ার্ড'}
                  options={presentUnions}
                  disabled={!presentThana && !isDhakaMetroDistrict(presentDistrict || '')}
                  placeholder={isDhakaMetroDistrict(presentDistrict || '') ? 'ওয়ার্ড সিলেক্ট করুন' : 'নির্বাচন করুন'}
                  required
                />
              </div>

              {/* Village + Post Office */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField control={control} name="contact.presentAddress.village" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FieldLabel required>গ্রাম / মহল্লা / বাড়ি নং</FieldLabel>
                    <FormControl>
                      <VoiceInputBn
                        {...field}
                        component={Input}
                        placeholder="বাংলায় লিখুন"
                        className={inputClass}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={control} name="contact.presentAddress.postOffice" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FieldLabel required>ডাকঘর</FieldLabel>
                    <FormControl>
                      <VoiceInputBn
                        {...field}
                        component={Input}
                        placeholder="পোস্ট অফিসের নাম"
                        className={inputClass}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Post Code — half width */}
              <div className="w-full sm:w-1/2">
                <FormField control={control} name="contact.presentAddress.postCode" render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FieldLabel>পোস্ট কোড</FieldLabel>
                    <FormControl>
                      <VoiceInputEn
                        {...field}
                        component={Input}
                        placeholder="XXXX"
                        className={cn(inputClass, 'english-text')}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </div>

            </div>
          </SectionCard>
        </motion.div>

        {/* ── Section 3: Permanent Address ─────────────────── */}
        <motion.div variants={fadeUp}>
          <SectionCard
            number="২.৩"
            title="স্থায়ী ঠিকানা"
            subtitle="স্থায়ী বাসস্থান / গ্রামের বাড়ি"
            icon={Home}
            faded={isPermanentSame}
          >

            {/* Sync Toggle — inside card, top row */}
            <div className="mb-5">
              <SyncToggle checked={!!isPermanentSame} onToggle={syncAddress} />
            </div>

            <AnimatePresence>
              {!isPermanentSame && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <AddressSelect
                      control={control}
                      name="contact.permanentAddress.division"
                      label="বিভাগ"
                      options={DIVISIONS_LIST_BN}
                    />
                    <AddressSelect
                      control={control}
                      name="contact.permanentAddress.district"
                      label="জেলা"
                      options={permanentDistricts}
                      disabled={!permanentDivision}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <AddressSelect
                      control={control}
                      name="contact.permanentAddress.thana"
                      label="থানা / উপজেলা"
                      options={permanentThanas}
                      disabled={!permanentDistrict}
                    />
                    <AddressSelect
                      control={control}
                      name="contact.permanentAddress.union"
                      label={isDhakaMetroDistrict(permanentDistrict || '') ? 'ওয়ার্ড নম্বর' : 'ইউনিয়ন / ওয়ার্ড'}
                      options={permanentUnions}
                      disabled={!permanentThana && !isDhakaMetroDistrict(permanentDistrict || '')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField control={control} name="contact.permanentAddress.village" render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FieldLabel>গ্রাম / মহল্লা / বাড়ি নং</FieldLabel>
                        <FormControl>
                          <VoiceInputBn
                            {...field}
                            component={Input}
                            placeholder="বাংলায় লিখুন"
                            className={inputClass}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )} />

                    <FormField control={control} name="contact.permanentAddress.postOffice" render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FieldLabel>ডাকঘর</FieldLabel>
                        <FormControl>
                          <VoiceInputBn
                            {...field}
                            component={Input}
                            placeholder="পোস্ট অফিসের নাম"
                            className={inputClass}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <FormField control={control} name="contact.permanentAddress.postCode" render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FieldLabel>পোস্ট কোড</FieldLabel>
                        <FormControl>
                          <VoiceInputEn
                            {...field}
                            component={Input}
                            placeholder="XXXX"
                            className={cn(inputClass, 'english-text')}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Synced state — visual confirmation */}
            <AnimatePresence>
              {isPermanentSame && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#00AEEF] shrink-0" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    স্থায়ী ঠিকানা বর্তমান ঠিকানার সাথে একই হিসেবে সংরক্ষিত হবে।
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </SectionCard>
        </motion.div>

        {/* ── Navigation Bar ───────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-4">
            
            <Button
              type="button"
              variant="ghost"
              onClick={onPrev}
              className="h-10 px-5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 rounded-lg hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
              পূর্ববর্তী
            </Button>

            {/* Center: step hint */}
            <div className="hidden sm:flex flex-col items-center gap-1">
              <StepDots current={2} total={5} />
              <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                পরবর্তী: প্রয়োজনীয় নথি
              </span>
            </div>

            <Button
              type="button"
              onClick={onNext}
              className="h-10 px-6 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all group shadow-sm"
            >
              পরবর্তী
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>

          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}