import { z } from 'zod';

// ─── Utility: Bengali → English digit converter ──────────────
export const convertToEnglishDigits = (str: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = str;
  bengaliDigits.forEach((bd, i) => {
    result = result.replace(new RegExp(bd, 'g'), englishDigits[i]);
  });
  return result;
};

// Phone number converter — accepts Bengali or English digits
export const convertPhoneToEnglish = (val: string): string => {
  return convertToEnglishDigits(val.trim());
};

// ─── Labels ──────────────────────────────────────────────

export const GENDER_LABELS: Record<string, string> = {
  male: 'পুরুষ (Male)',
  female: 'মহিলা (Female)',
};

export const RELIGION_LABELS: Record<string, string> = {
  islam: 'ইসলাম (Islam)',
  hinduism: 'হিন্দু (Hinduism)',
  christianity: 'খ্রিষ্টান (Christianity)',
  buddhism: 'বৌদ্ধ (Buddhism)',
  other: 'অন্যান্য (Other)',
};

export const BLOOD_GROUP_LABELS: Record<string, string> = {
  'A+': 'এ পজিティブ (A+)',
  'A-': 'এ নেগেটিভ (A-)',
  'B+': 'বি পজিটিভ (B+)',
  'B-': 'বি নেগেটিভ (B-)',
  'AB+': 'এবি পজিটিভ (AB+)',
  'AB-': 'এবি নেগেটিভ (AB-)',
  'O+': 'ও পজিটিভ (O+)',
  'O-': 'ও নেগেটিভ (O-)',
  unknown: 'অজানা (Unknown)',
};

export const BOARDING_TYPE_LABELS: Record<string, string> = {
  day: 'ডে / এক্সটার্নাল (Day)',
  residential: 'আবাসিক (Residential)',
  boarding: 'ফুল বোর্ডিং (Full Boarding)',
};

const currentYear = new Date().getFullYear();
export const SESSION_OPTIONS = [
  `${currentYear - 1}-${currentYear}`,
  `${currentYear}-${currentYear + 1}`,
  `${currentYear + 1}-${currentYear + 2}`,
];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'নগদ (Cash)',
  bank: 'ব্যাংক (Bank)',
  bkash: 'বিকাশ (bKash)',
  nagad: 'নগদ মোবাইল (Nagad)',
  rocket: 'রকেট (Rocket)',
};

// ─── Export Sub-Schemas and types ──────────────────────────

export * from './personal';
export * from './address';
export * from './enrollment';
export * from './payment';

import { personalInfoSchema } from './personal';
import { contactAddressSchema } from './address';
import { enrollmentInfoSchema } from './enrollment';
import { feeCollectionSchema } from './payment';

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type ContactAddressData = z.infer<typeof contactAddressSchema>;
export type EnrollmentInfoData = z.infer<typeof enrollmentInfoSchema>;
export type FeeCollectionData = z.infer<typeof feeCollectionSchema>;

/**
 * Full Admission Payload Type — uses the master form schema types
 */
export type { AdmissionFormValues as AdmissionPayload } from './form';
