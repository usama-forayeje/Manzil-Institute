import { z } from 'zod';
import {
  DIVISIONS_LIST_BN,
  DISTRICTS_BY_DIVISION_BN,
  THANAS_BY_DISTRICT_BN,
} from '@/lib/bangladesh-address';

// ═══════════════════════════════════════════════════════════════
// STUDENT ADMISSION FORM — Zod Validation Schemas
// মানযিল ইনস্টিটিউট — ছাত্র ভর্তি ফর্ম ভ্যালিডেশন
// ═══════════════════════════════════════════════════════════════

// ─── Utility: Bengali → English digit converter ──────────────
const convertToEnglishDigits = (str: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = str;
  bengaliDigits.forEach((bd, i) => {
    result = result.replace(new RegExp(bd, 'g'), englishDigits[i]);
  });
  return result;
};

// Phone number converter — accepts Bengali or English digits
const convertPhoneToEnglish = (val: string): string => {
  return convertToEnglishDigits(val.trim());
};

// ─── Constants ──────────────────────────────────────────────

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
  'A+': 'এ পজিটিভ (A+)',
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

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'নগদ (Cash)',
  bank: 'ব্যাংক (Bank)',
  bkash: 'বিকাশ (bKash)',
  nagad: 'নগদ মোবাইল (Nagad)',
  rocket: 'রকেট (Rocket)',
};

export const DEPARTMENT_CODES = {
  MDR: 'মাদ্রাসা বিভাগ',
  SCH: 'স্কুল বিভাগ',
  TEC: 'টেকনিক্যাল বিভাগ',
} as const;

export const SESSION_OPTIONS = [
  '2025-2026',
  '2026-2027',
  '2027-2028',
] as const;

export const DIVISIONS = DIVISIONS_LIST_BN;
export const DISTRICTS_BY_DIVISION = DISTRICTS_BY_DIVISION_BN;
export const UPAZILAS_BY_DISTRICT = THANAS_BY_DISTRICT_BN;

// ─── Helper: Address Schema ─────────────────────────────────
const addressSchema = z.object({
  division: z
    .string()
    .min(1, 'বিভাগ নির্বাচন করুন'),
  district: z
    .string()
    .min(1, 'জেলা নির্বাচন করুন'),
  thana: z
    .string()
    .min(1, 'থানা/উপজেলা নির্বাচন করুন'),
  union: z.string().optional().or(z.literal('')),
  postOffice: z.string().optional().or(z.literal('')),
  village: z
    .string()
    .min(1, 'গ্রাম/এলাকা অবশ্যই দিতে হবে'),
  postCode: z
    .string()
    .max(10, { message: 'পোস্টকোড সর্বোচ্চ ১০টি অক্ষরের হতে পারে' })
    .optional()
    .or(z.literal('')),
});

const optionalAddressSchema = z.object({
  division: z.string().optional().or(z.literal('')),
  district: z.string().optional().or(z.literal('')),
  thana: z.string().optional().or(z.literal('')),
  union: z.string().optional().or(z.literal('')),
  postOffice: z.string().optional().or(z.literal('')),
  village: z.string().optional().or(z.literal('')),
  postCode: z.string().optional().or(z.literal('')),
});

// ═══════════════════════════════════════════════════════════════
// STEP 1: ব্যক্তিগত তথ্য (Personal Info)
// ═══════════════════════════════════════════════════════════════

export const personalInfoSchema = z.object({
  // Photo
  photoUrl: z.string().optional(),
  photoFile: z.any().optional(),
  photoBase64: z.string().optional(),

  // Names
  nameEn: z
    .string()
    .min(3, { message: 'ইংরেজি নাম কমপক্ষে ৩টি অক্ষরের হতে হবে' })
    .max(150, { message: 'নাম সর্বোচ্চ ১৫০ অক্ষর' }),
  nameBn: z
    .string()
    .min(2, { message: 'বাংলায় পূর্ণ নাম দিতে হবে' })
    .max(150, { message: 'নাম সর্বোচ্চ ১৫০ অক্ষর' }),

  // Parents
  fatherNameBn: z
    .string()
    .min(2, { message: 'পিতার নাম বাংলায় দিতে হবে' })
    .max(150),
  fatherNameEn: z
    .string()
    .max(150)
    .optional()
    .or(z.literal('')),
  motherNameBn: z
    .string()
    .min(2, { message: 'মাতার নাম বাংলায় দিতে হবে' })
    .max(150),
  motherNameEn: z
    .string()
    .max(150)
    .optional()
    .or(z.literal('')),

  // Personal details
  dateOfBirth: z
    .string()
    .min(1, 'জন্ম তারিখ দিতে হবে'),
  gender: z.enum(['male', 'female'], {
    message: 'লিঙ্গ নির্বাচন করুন',
  }),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'])
    .optional()
    .default('unknown'),
  nationality: z
    .string()
    .min(2, { message: 'জাতীয়তা দিতে হবে' })
    .default('বাংলাদেশী'),
  religion: z.enum(['islam', 'hinduism', 'christianity', 'buddhism', 'other'], {
    message: 'ধর্ম নির্বাচন করুন',
  }),
  birthCertNo: z
    .string()
    .max(50, { message: 'জন্ম নিবন্ধন নম্বর সর্বোচ্চ ৫০ অক্ষরের হতে পারে' })
    .optional()
    .transform(val => (val ? convertToEnglishDigits(val) : undefined)),
  nidNumber: z
    .string()
    .optional()
    .transform(val => (val ? convertToEnglishDigits(val) : undefined))
    .refine(val => !val || /^(\d{10}|\d{17})$/.test(val), {
      message: 'সঠিক NID নম্বর দিন (১০ বা ১৭ ডিজিট)',
    }),
  isHafiz: z.boolean().optional().default(false),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

// ═══════════════════════════════════════════════════════════════
// STEP 2: যোগাযোগ ও ঠিকানা (Contact & Address)
// ═══════════════════════════════════════════════════════════════

export const contactAddressBaseSchema = z.object({
    // Contact
    guardianPhone: z
      .string()
      .min(1, 'অভিভাবকের ফোন নম্বর দিতে হবে')
      .transform(val => convertPhoneToEnglish(val))
      .refine(val => /^(\+880|880|0)1[3-9]\d{8}$/.test(val), {
        message: 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)',
      }),
    phonePrimary: z
      .string()
      .optional()
      .transform(val => (val ? convertPhoneToEnglish(val) : undefined))
      .refine(val => !val || /^((\+880|880|0)1[3-9]\d{8})$/.test(val), {
        message: 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন',
      }),
    whatsappNo: z
      .string()
      .optional()
      .transform(val => (val ? convertPhoneToEnglish(val) : undefined))
      .refine(val => !val || /^((\+880|880|0)1[3-9]\d{8})$/.test(val), {
        message: 'সঠিক WhatsApp নম্বর দিন',
      }),
    email: z
      .string()
      .email('সঠিক ইমেইল ঠিকানা দিন')
      .optional()
      .or(z.literal('')),

    // Current Address
    presentAddress: addressSchema,

    // Permanent Address
    permanentSameAsCurrent: z.boolean().default(false),
    permanentAddress: optionalAddressSchema.optional(),
});

export const contactAddressSchema = contactAddressBaseSchema
  .superRefine((data, ctx) => {
    // Only validate permanent address if NOT same as current
    if (!data.permanentSameAsCurrent && data.permanentAddress) {
      const pa = data.permanentAddress;
      if (pa.division && pa.division.length > 0) {
        if (!pa.district || pa.district.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার জেলা দিন',
            path: ['permanentAddress', 'district'],
          });
        }
        if (!pa.thana || pa.thana.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার থানা দিন',
            path: ['permanentAddress', 'thana'],
          });
        }
        if (!pa.village || pa.village.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার গ্রাম/এলাকা দিন',
            path: ['permanentAddress', 'village'],
          });
        }
      }
    }
  });

export type ContactAddressData = z.infer<typeof contactAddressSchema>;

// ═══════════════════════════════════════════════════════════════
// STEP 3: ভর্তির তথ্য (Enrollment Info)
// ═══════════════════════════════════════════════════════════════

// Single department enrollment entry
export const enrollmentEntrySchema = z.object({
  departmentId: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  departmentCode: z.string().min(1),
  departmentName: z.string().optional(),
  classId: z.string().min(1, 'শ্রেণী নির্বাচন করুন'),
  className: z.string().optional(),
  section: z.string().optional().or(z.literal('')),
  session: z.string().min(1, 'সেশন নির্বাচন করুন'),
  shift: z.string().optional().or(z.literal('')),
  monthlyFee: z.number().min(0, 'মাসিক বেতন অবশ্যই দিতে হবে').default(0),
  rollNo: z.string().optional().or(z.literal('')),
});

export type EnrollmentEntry = z.infer<typeof enrollmentEntrySchema>;

export const enrollmentInfoSchema = z.object({
  // Global boarding type for the student
  boardingType: z.enum(['day', 'residential', 'boarding'], {
    message: 'বোর্ডিং ধরন নির্বাচন করুন',
  }),

  // Multiple enrollment entries (one per department)
  enrollments: z
    .array(enrollmentEntrySchema)
    .min(1, 'অন্তত একটি বিভাগে ভর্তি করতে হবে')
    .max(3, 'সর্বোচ্চ ৩টি বিভাগে ভর্তি করা যায়'),

  // Previous school info
  previousSchoolName: z.string().max(200).optional().or(z.literal('')),
  previousClassName: z.string().max(50).optional().or(z.literal('')),
  previousResult: z.string().max(50).optional().or(z.literal('')),
});

export type EnrollmentInfoData = z.infer<typeof enrollmentInfoSchema>;

// ═══════════════════════════════════════════════════════════════
// STEP 4: ফি সংগ্রহ (Fee Collection)
// ═══════════════════════════════════════════════════════════════

export const feeItemSchema = z.object({
  feeTypeCode: z.string(),
  feeTypeName: z.string(),
  amount: z.number().min(0),
  originalAmount: z.number().min(0),
  isRequired: z.boolean(),
  isIncluded: z.boolean(),
  isEdited: z.boolean().default(false),
  departmentCode: z.string().optional(),
  boardingType: z.string().optional(),
  feeCategory: z.string().optional(),
});

export type FeeItemData = z.infer<typeof feeItemSchema>;

export const feeCollectionSchema = z.object({
  // Fee items per department (JSON-serializable)
  feeItems: z
    .array(feeItemSchema)
    .min(1, 'অন্তত একটি ফি আইটেম থাকতে হবে'),

  // Totals
  totalAmount: z.number().min(0),
  
  // Discount
  discountType: z.enum(['flat', 'percent']).default('flat'),
  discountPercent: z.number().min(0).max(100).default(0),
  discount: z.number().min(0).default(0),
  discountNote: z.string().max(200).optional().or(z.literal('')),
  
  // Net
  netAmount: z.number().min(0),
  paidAmount: z.number().min(0),

  // Payment
  includeFirstMonth: z.boolean().default(false),
  paymentMethod: z.enum(['cash', 'bank', 'bkash', 'nagad', 'rocket'], {
    message: 'পেমেন্ট পদ্ধতি নির্বাচন করুন',
  }),
  transactionRef: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type FeeCollectionData = z.infer<typeof feeCollectionSchema>;

// ═══════════════════════════════════════════════════════════════
// FULL MERGED SCHEMA — For final submission validation
// ═══════════════════════════════════════════════════════════════

export const fullAdmissionSchema = z.object({
  // Step 1
  ...personalInfoSchema.shape,
  // Step 2 (flattened from refinement)
  ...contactAddressBaseSchema.shape,
  // Step 3
  ...enrollmentInfoSchema.shape,
  // Step 4
  ...feeCollectionSchema.shape,
});

export type FullAdmissionData = z.infer<typeof fullAdmissionSchema>;

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS — For store and components
// ═══════════════════════════════════════════════════════════════

export type { z };
