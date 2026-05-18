import { z } from 'zod';
import {
  DIVISIONS_LIST_BN,
  DISTRICTS_BY_DIVISION_BN,
  THANAS_BY_DISTRICT_BN,
  DISTRICTS,
  DHAKA_METRO_DISTRICTS_BN,
} from '@/lib/bangladesh-address';

// Add Dhaka North & South to Dhaka division districts manually
const DHAKA_NORTH = 'ঢাকা উত্তর';
const DHAKA_SOUTH = 'ঢাকা দক্ষিণ';

// Extend DISTRICTS_BY_DIVISION_BN with Dhaka Metro districts
const extendedDistrictsByDivision: Record<string, string[]> = {
  ...DISTRICTS_BY_DIVISION_BN,
  ঢাকা: [...(DISTRICTS_BY_DIVISION_BN['ঢাকা'] || []), DHAKA_NORTH, DHAKA_SOUTH],
};

// ─── Constants ─────────────────────────────────────────────
export const DESIGNATION_LABELS: Record<string, string> = {
  principal: 'অধ্যক্ষ / প্রিন্সিপাল (Principal)',
  secondary_principal: 'সহকারী অধ্যক্ষ (Secondary Principal)',
  headmaster: 'প্রধান শিক্ষক (Headmaster)',
  assistant_teacher: 'সহকারী শিক্ষক (Assistant Teacher)',
  general_teacher: 'জেনারেল শিক্ষক (General Teacher)',

  residential_teacher: 'আবাসিক শিক্ষক (Residential Teacher)',
  unResidential_teacher: 'অনাবাসিক শিক্ষক (Unresidential Teacher)',
  hifz_teacher: 'হিফজ শিক্ষক (Hifz Teacher)',
  nazera_teacher: 'নাজেরা শিক্ষক (Nazera Teacher)',
  unpaid_teacher: 'অবৈতনিক শিক্ষক (Unpaid Teacher)',
  accountant: 'হিসাবরক্ষক (Accountant)',
  staff: 'স্টাফ (Staff)',
  guard: 'নিরাপত্তা রক্ষী (Security Guard / Guard)',
  caretaker: 'তত্ত্বাবধায়ক (Caretaker)',
  adviser: 'উপদেষ্টা (Adviser)',
  web_developer: 'ওয়েব ডেভেলপার (Web Developer)',
  digital_marketer: 'ডিজিটাল মার্কেটার (Digital Marketer)',
  graphics_designer: 'গ্রাফিক্স ডিজাইনার (Graphics Designer)',
  content_writer: 'কন্টেন্ট রাইটার (Content Writer)',
  it_teacher: 'আইটি শিক্ষক (IT Teacher)',
  librarian: 'লাইব্রেরিয়ান (Librarian)',
  lab_assistant: 'ল্যাব সহকারী (Lab Assistant)',
  office_assistant: 'অফিস সহকারী (Office Assistant)',
  driver: 'ড্রাইভার (Driver)',
  cleaner: 'পরিচ্ছন্নতা কর্মী (Cleaner)',
  other: 'অন্যান্য (Other)',
};

export const TEACHER_DESIGNATIONS = [
  'assistant_teacher',
  'general_teacher',
  'unpaid_teacher',
  'residential_teacher',
  'hifz_teacher',
  'nazera_teacher',
  'headmaster',
  'principal',
  'secondary_principal',
];

// Non-teacher/Staff designations for special handling
export const NON_TEACHER_DESIGNATIONS = [
  'staff',
  'guard',
  'caretaker',
  'cleaner',
  'driver',
  'cook',
  'office_assistant',
  'accountant',
];

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  '0+',
  '0-',
  'unknown',
];

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  unmarried: 'অবিবাহিত (Unmarried)',
  married: 'বিবাহিত (Married)',
  widowed: 'বিধবা/বিপত্নীক (Widowed)',
  divorced: 'তালাকপ্রাপ্ত (Divorced)',
};

export const RELIGION_LABELS: Record<string, string> = {
  islam: 'ইসলাম (Islam)',
  hinduism: 'হিন্দু (Hinduism)',
  other: 'অন্যান্য (Other)',
};
export const RELATIONSHIP_LABELS: Record<string, string> = {
  father: 'পিতা (Father)',
  mother: 'মাতা (Mother)',
  spouse: 'স্বামী/স্ত্রী (Spouse)',
  brother: 'ভাই (Brother)',
  sister: 'বোন (Sister)',
  uncle: 'চাচা/মামা (Uncle)',
  aunt: 'ফুফু/খালা (Aunt)',
  teacher: 'শিক্ষক (Teacher)',
  friend: 'বন্ধু (Friend)',
  other: 'অন্যান্য (Other)',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  bank: 'ব্যাংক (Bank)',
  mobile_banking: 'মোবাইল ব্যাংকিং (bKash/Nagad/Rocket/Upay)',
  cash: 'নগদ (Cash)',
};

export const MOBILE_BANKING_PROVIDERS: Record<string, string> = {
  bkash: 'বিকাশ (bKash)',
  nagad: 'নগদ (Nagad)',
  rocket: 'রকেট (Rocket)',
  upay: 'উপায় (Upay)',
};

export const DIVISIONS = DIVISIONS_LIST_BN;

export const DIVISION_LABELS: Record<string, string> = Object.fromEntries(
  DIVISIONS_LIST_BN.map(d => [d, d])
);

const divisionsMap: Record<string, string> = {
  Dhaka: 'ঢাকা',
  Chattogram: 'চট্টগ্রাম',
  Rajshahi: 'রাজশাহী',
  Khulna: 'খুলনা',
  Barishal: 'বরিশাল',
  Sylhet: 'সিলেট',
  Rangpur: 'রংপুর',
  Mymensingh: 'ময়মনসিংহ',
};

// Use extended districts for Dhaka division
export const DISTRICTS_BY_DIVISION = extendedDistrictsByDivision;

// Extend thanas with Dhaka Metro thanas
const extendedThanasByDistrict: Record<string, string[]> = {
  ...THANAS_BY_DISTRICT_BN,
  [DHAKA_NORTH]: DHAKA_METRO_DISTRICTS_BN[DHAKA_NORTH].thanas,
  [DHAKA_SOUTH]: DHAKA_METRO_DISTRICTS_BN[DHAKA_SOUTH].thanas,
};

export const UPAZILAS_BY_DISTRICT = extendedThanasByDistrict;

export const DHAKA_THANA_PHONES: Record<
  string,
  { oc: string; ops: string; duty: string; landline: string }
> = {
  // Dhaka North (DNCC) Thanas
  খিলক্ষেত: {
    oc: '০১৭১৩৩৭৩১৭৪',
    ops: '০১১৯১০০৫৫৪৪',
    duty: '০১১৯৯৮৮৩৬১১',
    landline: '৮৯১৯৩৬৪',
  },
  কাফরুল: {
    oc: '০১৭১৩৩৭৩১৯১',
    ops: '০১১৯১০০৪৪৮৮',
    duty: '০১১৯৯৮৬৪০২২',
    landline: '৯৮৭১৭৭১',
  },
  ধানমন্ডি: {
    oc: '০১৭১৩-৩৭৩১২৬',
    ops: '০১১৯১-০০২২০০',
    duty: '০১১৯৯-৮৮৩৬২২',
    landline: '৮৬৩১৯৪১',
  },
  মোহাম্মদপুর: {
    oc: '০১৭১৩৩৭৩১৮২',
    ops: '০১১৯১০০৪৪২২',
    duty: '০১১৯৯৮৮৩৭৪২',
    landline: '৯১১৯৯৬০',
  },
  সূত্রাপুর: {
    oc: '০১৭১৩৩৭৩১৪৩',
    ops: '০১১৯১০০৩৩০০',
    duty: '০১১৯৯৮৮৩৭৩১',
    landline: '৭১১৬২৩৩',
  },
  যাত্রাবাড়ী: {
    oc: '০১৭১৩৩৭৩১৪৬',
    ops: '০১১৯১০০৩৩৩৩',
    duty: '০১১৯৯৮৮৩৭২৯',
    landline: '৭৫৪৬২৪৪',
  },
  বিমানবন্দর: {
    oc: '০১৭১৩৩৭৩১৬২',
    ops: '০১১৯১০০৫৫৬৬',
    duty: '০১১৯১০০১১৬৬',
    landline: '৮৯৫১২৮১',
  },
  গুলশান: {
    oc: '০১৭১৩৩৭৩১৭১',
    ops: '০১১৯১০০৫৫১১',
    duty: '০১১৯১০০১১৪৪',
    landline: '৯৮৯৫৮২৬',
  },
  'উত্তরা পশ্চিম': {
    oc: '০১৭১৩৩৭৩১৫৬',
    ops: '০১৭১৩৩৭৩১৫৭',
    duty: '০১৭১৩৩৯৮৫৮৫',
    landline: '',
  },
  মুগদা: { oc: '০১৭৬৯-০৫৮০৬১', ops: '', duty: '', landline: '৭৫৪৯৭২২' },
  রূপনগর: {
    oc: '০১৭১৩৩৭৩১৮৪',
    ops: '০১৭১৩৩৭৩১৮৫',
    duty: '০১৭১৩৩৯৮৫৬২',
    landline: '',
  },
  ভাষানটেক: {
    oc: '০১৭১৩৩৭৩১৮৪',
    ops: '০১৭১৩৩৭৩১৮৫',
    duty: '০১৭১৩৩৯৮৫৬২',
    landline: '',
  },
  ভাটারা: {
    oc: '০১৭১৩৩৭৩১৬৬',
    ops: '০১৭১৩৩৭৩১৬৭',
    duty: '০১৭১৩৩৭৩১৬৯',
    landline: '',
  },
  বনানী: {
    oc: '০১৭১৩৩৭৩১৬৬',
    ops: '০১৭১৩৩৭৩১৬৭',
    duty: '০১৭১৩৩৭৩১৬৯',
    landline: '',
  },
  ওয়ারী: {
    oc: '০১৭১৩৩৭৩১৩৮',
    ops: '০১৭১৩৩৭৩১৩৯',
    duty: '০১৭১৩৩৯৩৪০',
    landline: '',
  },
  শাহজাহানপুর: {
    oc: '০১৭১৩৩৭৩১৪৭',
    ops: '০১৭১৩৩৭৩১৪৮',
    duty: '০১৭১৩৩৭৩১৫০',
    landline: '',
  },
  'শেরেবাংলা নগর': {
    oc: '০১৭১৩৩৯৮৩৩৫',
    ops: '০১১৯১০০৪৪৫৫',
    duty: '০১১৯৯৮৬৭৮৮৮',
    landline: '৯১২৪১৫৪',
  },
  'মিরপুর মডেল': {
    oc: '০১৭১৩৩৭৩১৮৯',
    ops: '০১১৯১০০৪৪৬৬',
    duty: '০১১৯৯৮৮৩৭৩৪',
    landline: '৯০০১০০১',
  },
  'দারুস সালাম': {
    oc: '০১৭১৩৩৯৮৩৩৪',
    ops: '০১১৯১০০৪৪৯৯',
    duty: '০১১৯৯৮০২০২৫',
    landline: '৮০৩২৩৩৩',
  },
  দক্ষিণখান: {
    oc: '০১৭১৩৩৭৩১৬৫',
    ops: '০১১৯১০০৫৫৯৯',
    duty: '০১১৯১০০১১৮৮',
    landline: '৮৯৩১৭৭৭',
  },
  উত্তরখান: {
    oc: '০১৭১৩৩৭৩১৬৪',
    ops: '০১১৯১০০৫৫৮৮',
    duty: '০১১৯১০০১১৭৭',
    landline: '৮৯৩১৮৮৮',
  },
  তুরাগ: {
    oc: '০১৭১৩৩৭৩১৬৩',
    ops: '০১১৯১০০৫৫৭৭',
    duty: '০১১৯৯৮৮৩৬৪৫',
    landline: '৮৯১৪৬৬৪',
  },
  'উত্তরা মডেল': {
    oc: '০১৭১৩৩৭৩১৬১',
    ops: '০১১৯১০০৫৫৫৫',
    duty: '০১১৯৯৮৮৩৭৪০',
    landline: '৮৯১৪১২৬',
  },
  ক্যান্টনমেন্ট: {
    oc: '০১৭১৩৩৭৩১৭২',
    ops: '০১১৯১০০৫৫২২',
    duty: '০১১৯৯৮৮৩৭৩৯',
    landline: '৮৭১২৩৫০',
  },
  বাড্ডা: {
    oc: '০১৭১৩৩৭৩১৭৩',
    ops: '০১১৯১০০৫৫৩৩',
    duty: '০১১৯১০০১১৫৫',
    landline: '৯৮৮২৬৫২',
  },
  পল্লবী: {
    oc: '০১৭১৩৩৭৩১৯০',
    ops: '০১১৯১০০৪৪৭৭',
    duty: '০১১৯৯৮৮৩৭৩৫',
    landline: '৯০১৫৯২২',
  },
  শাহআলী: {
    oc: '০১৭১৩৩৭৩১৯২',
    ops: '০১১৯১০০৫৫০০',
    duty: '০১১৯৯৮৮৩৬২৫',
    landline: '৮০৬০৫৫৫',
  },
  'তেজগাও শিল্পাঞ্চল': {
    oc: '০১৭১৩৩৭৩১৮১',
    ops: '০১১৯১০০৪৪৩৩',
    duty: '০১১৯৯৮৬৭৪৭৪',
    landline: '৮৮৩৬৪৭২',
  },
  তেজগাও: {
    oc: '০১৭১৩৩৭৩১৮০',
    ops: '০১১৯১০০৪৪১১',
    duty: '০১১৯৯৮৮৩৭৪১',
    landline: '৯১১৯৪৬৭',
  },
  রামপুরা: {
    oc: '০১৭১৩৩৯৮৫২৬',
    ops: '০১১৯১০০৪৪০০',
    duty: '০১১৯৯৮৮৩৭৩৮',
    landline: '৭২৯০৯৯৯',
  },
  সবুজবাগ: {
    oc: '০১৭১৩৩৭৩১৫৩',
    ops: '০১১৯১০০৩৩৭৭',
    duty: '০১১৯৯৮৮৩৭৩৬',
    landline: '৭২১৯৯৮৮',
  },
  কদমতলী: {
    oc: '০১৭১৩৩৯৮৩৩৩',
    ops: '০১১৯১০০৩৩৪৪',
    duty: '০১১৯৯৮৮৩৭৩২',
    landline: '৭৫৪৭৭৫৫',
  },

  // Dhaka South (DSCC) Thanas
  চকবাজার: {
    oc: '০১৭১৩৩৯৮৩৩৭',
    ops: '০১১৯১০০২২৯৯',
    duty: '০১১৯৯৮৮৩৭২৪',
    landline: '৭৩১৩৯৬৬',
  },
  কামরাঙ্গীরচর: {
    oc: '০১৭১৩৩৭৩১৩৭',
    ops: '০১১৯১০০২২৭৭',
    duty: '০১১৯৯৮৮৩৭২৫',
    landline: '৭৩২০৩২৩',
  },
  কোতোয়ালী: {
    oc: '০১৭১৩৩৭৩১৩৫',
    ops: '০১১৯১০০২২৫৫',
    duty: '০১১৯৯৮৮৩৬৪৬',
    landline: '৭১১৬২৫৫',
  },
  লালবাগ: {
    oc: '০১৭১৩৩৭৩১৩৪',
    ops: '০১১৯১০০২২৬৬',
    duty: '০১১৯৯-৮৮৩৭২১',
    landline: '৯৬৬০১০৫',
  },
  কলাবাগান: {
    oc: '০১৭১৩-৩৯৮৩৩৯',
    ops: '০১১৯১-০০২২৪৪',
    duty: '০১১৯৯-৮৮৩৬২৮',
    landline: '৯৬৬৫২৫৪',
  },
  শাহবাগ: {
    oc: '০১৭১৩-৩৭৩১২৭',
    ops: '০১১৯১-০০২২২২',
    duty: '০১১৯৯-৮৮৩৬২৬',
    landline: '৯৬৭৬৬৯৯',
  },
  মতিঝিল: {
    oc: '০১১৯৯৮৮৩৭২৬',
    ops: '০১১৯১০০৩৩৬৬',
    duty: '০১৭১৩৩৭৩১৫২',
    landline: '৯৫৭১০০০',
  },
  খিলগাঁও: {
    oc: '০১৭১৩৩৭৩১৫৪',
    ops: '০১১৯১০০৩৩৮৮',
    duty: '০১১৯৯৮৮৩৭২৮',
    landline: '৭২১৯০৯০',
  },
  হাজারীবাগ: {
    oc: '০১৭১৩-৩৭৩১৩৬',
    ops: '০১১৯১-০০২২১১',
    duty: '০১১৯৯-৮৮৩৭২২',
    landline: '৯৬৬৯৯০০',
  },
  রমনা: {
    oc: '০১৭১৩-৩৭৩১২৫',
    ops: '০১১৯১-০০১১৯৯',
    duty: '০১১৯৯-৮৮৩৭২০',
    landline: '৯৩৫০৪৬৮',
  },
  ডেমরা: {
    oc: '০১৭১৩৩৭৩১৪৪',
    ops: '০১১৯১০০৩৩১১',
    duty: '০১১৯৯৮৮৩৭২৭',
    landline: '৭৫০১১৫৫',
  },
  পল্টন: {
    oc: '০১৭১৩৩৭৩১৫৫',
    ops: '০১১৯১০০৩৩৯৯',
    duty: '০১১৯৯৮৮৩৭৩৭',
    landline: '৯৩৬০৮০২',
  },
  বংশাল: {
    oc: '০১৭১৩৩৯৮৩৩৬',
    ops: '০১১৯১০০২২৮৮',
    duty: '০১১৯৯৮৮৩৭২৩',
    landline: '৯৫৬৫৭০০',
  },
  নিউমার্কেট: {
    oc: '০১৭১৩-৩৭৩১২৮',
    ops: '০১১৯১-০০২২৩৩',
    duty: '০১১৯৯-৮৮৩৬২৭',
    landline: '৮৬৩১৯৪২',
  },
  শ্যামপুর: {
    oc: '০১৭১৩৩৭৩১৪৫',
    ops: '০১১৯১০০৩৩২২',
    duty: '০১১৯৯৮৮৩৭৩০',
    landline: '৭৪৪০৬৯১',
  },
  গেন্ডারিয়া: {
    oc: '০১৭১৩৩৯৮৩৩১',
    ops: '০১১৯১০০৩৩৫৫',
    duty: '০১১৯৯৮৮৩৭৩৩',
    landline: '৭৪৫৩২৯৪',
  },
  আদাবর: {
    oc: '০১৭১৩৩৭৩১৮৩',
    ops: '০১১৯১০০৪৪৪৪',
    duty: '০১১৯৯৮৮৬৭৭৯৯',
    landline: '৯১৩৩২৬৫',
  },
};



// ─── Helper Schemas ─────────────────────────────────────────
const addressSchema = z.object({
  division: z
    .string()
    .min(1, 'বিভাগ নির্বাচন করুন')
    .optional()
    .or(z.literal('')),
  district: z
    .string()
    .min(1, 'জেলা নির্বাচন করুন')
    .optional()
    .or(z.literal('')),
  thana: z
    .string()
    .min(1, 'থানা/উপজেলা নির্বাচন করুন')
    .optional()
    .or(z.literal('')),
  union: z.string().min(1, 'ইউনিয়ন নির্বাচন করুন'),
  postOffice: z.string().min(1, 'পোস্ট অফিস নির্বাচন করুন'),
  village: z
    .string()
    .min(1, 'গ্রাম/এলাকা অবশ্যই দিতে হবে')
    .optional()
    .or(z.literal('')),
  postCode: z
    .string()
    .max(10, { message: 'পোস্টকোড সর্বোচ্চ ১০টি অক্ষরের হতে পারে' })
    .optional()
    .or(z.literal('')),
});

// ─── Step 1: Personal & Family Information ─────────────────
export const personalFamilySchema = z.object({
  nameEn: z
    .string()
    .min(3, { message: 'ইংরেজি নাম কমপক্ষে ৩টি অক্ষরের হতে হবে' })
    .max(100, { message: 'ইংরেজি নাম সর্বোচ্চ ১০০টি অক্ষরের হতে পারে' }),
  nameBn: z
    .string()
    .min(2, { message: 'বাংলায় পূর্ণ নাম দিতে হবে' })
    .max(100, { message: 'বাংলা নাম সর্বোচ্চ ১০০ অক্ষর' }),
  fatherNameBn: z
    .string()
    .min(2, { message: 'পিতার নাম বাংলায় দিতে হবে' })
    .max(100, { message: 'পিতার নাম সর্বোচ্চ ১০০ অক্ষর' }),
  fatherNameEn: z
    .string()
    .min(3, { message: 'পিতার ইংরেজি নাম কমপক্ষে ৩টি অক্ষরের হবে' })
    .max(100, { message: 'পিতার নাম সর্বোচ্চ ১০০ অক্ষর' }),
  motherNameBn: z
    .string()
    .min(2, { message: 'মাতার নাম বাংলায় দিতে হবে' })
    .max(100, { message: 'মাতার নাম সর্বোচ্চ ১০০ অক্ষর' }),
  motherNameEn: z
    .string()
    .min(3, { message: 'মাতার ইংরেজি নাম কমপক্ষে ৩টি অক্ষরের হবে' })
    .max(100, { message: 'মাতার নাম সর্বোচ্চ ১০০ অক্ষর' }),
  gender: z.string().min(1, { message: 'লিঙ্গ নির্বাচন করুন' }),
  maritalStatus: z.enum(['unmarried', 'married', 'widowed', 'divorced'], {
    message: 'বৈবাহিক অবস্থা নির্বাচন করুন',
  }),
  religion: z.enum(['islam', 'hinduism', 'christianity', 'buddhism', 'other'], {
    message: 'ধর্ম নির্বাচন করুন',
  }),
  nationality: z
    .string()
    .min(2, { message: 'জাতীয়তা দিতে হবে' })
    .default('বাংলাদেশী'),
  photoUrl: z.string().optional(),
  photoFile: z.any().optional(),
});

export type PersonalFamilyData = z.infer<typeof personalFamilySchema>;

// ─── Step 2: Address & Identity ────────────────────────────
// Empty permanent address schema for when same as current
const emptyPermanentAddress = z.object({
  division: z.string(),
  district: z.string(),
  thana: z.string(),
  union: z.string(),
  postOffice: z.string(),
  village: z.string(),
  postCode: z.string().optional().or(z.literal('')),
});

export const addressIDSchema = z
  .object({
    currentAddress: addressSchema,
    permanentSameAsCurrent: z.boolean().default(false),
    permanentAddress: emptyPermanentAddress.optional(),
    // NID - Bengali digit support
    nidNumber: z
      .string()
      .transform(val => convertToEnglishDigits(val))
      .pipe(
        z
          .string()
          .regex(/^(\d{10}|\d{17})$/, {
            message: 'সঠিক NID নম্বর দিন (১০ বা ১৭ ডিজিট)',
          })
          .optional()
      ),
    dateOfBirth: z
      .string()
      .min(1, 'জন্ম তারিখ দিতে হবে')
      .optional()
      .or(z.literal('')),
    bloodGroup: z
      .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-', 'unknown'])
      .optional()
      .default('unknown'),
    nidFrontCopyFile: z.any().optional(),
    nidBackCopyFile: z.any().optional(),
    nidFrontCopyUrl: z.string().optional(),
    nidBackCopyUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate permanent address if NOT same as current
    if (!data.permanentSameAsCurrent) {
      const pa = data.permanentAddress;
      // Only check if permanentAddress has actual values (not empty)
      if (pa && pa.division) {
        if (!pa?.district)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার জেলা দিন',
            path: ['permanentAddress', 'district'],
          });
        if (!pa?.thana)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার থানা দিন',
            path: ['permanentAddress', 'thana'],
          });
        if (!pa?.union)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার ইউনিয়ন দিন',
            path: ['permanentAddress', 'union'],
          });
        if (!pa?.postOffice)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার পোস্ট অফিস দিন',
            path: ['permanentAddress', 'postOffice'],
          });
        if (!pa?.village)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'স্থায়ী ঠিকানার গ্রাম/এলাকা দিন',
            path: ['permanentAddress', 'village'],
          });
      } else {
        // If same as current is NOT checked, permanent address is required
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'স্থায়ী ঠিকানার বিভাগ দিন',
          path: ['permanentAddress', 'division'],
        });
      }
    }
    // NID validation is handled manually in the component
  });

export type AddressIDData = z.infer<typeof addressIDSchema>;

// ─── Step 3: Professional & Educational (Dynamic) ──────────

// Bengali to English digit converter for year field
const convertToEnglishDigits = (str: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = str;
  bengaliDigits.forEach((bd, i) => {
    result = result.replace(new RegExp(bd, 'g'), englishDigits[i]);
  });
  return result;
};

export const professionalEducationSchema = z.object({
  designation: z.string().min(1, 'পদবী নির্বাচন করুন'),
  designationCustom: z.string().optional(),
  employmentType: z.enum(['permanent', 'contract'], {
    message: 'চাকরির ধরন নির্বাচন করুন',
  }),
  // Education - accepts both Bengali and English year
  education: z
    .array(
      z.object({
        degree: z.string().min(1, 'শিক্ষাগত যোগ্যতা/ডিগ্রীর নাম দিন'),
        institution: z.string().min(1, 'শিক্ষাপ্রতিষ্ঠানের নাম দিন'),
        year: z
          .string()
          .transform(val => convertToEnglishDigits(val)) // Convert Bengali to English
          .refine(val => val.length === 4, { message: '৪ সংখ্যার সাল দিন' })
          .refine(val => /^\d{4}$/.test(val), { message: 'সঠিক সাল দিন' })
          .refine(
            val => {
              const year = parseInt(val, 10);
              const currentYear = new Date().getFullYear();
              return year >= 1950 && year <= currentYear + 5;
            },
            { message: 'বৈধ সাল দিন' }
          ),
      })
    )
    .min(1, 'অন্তত একটি শিক্ষাগত যোগ্যতা যোগ করুন'),
  // Social Media Links
  socialLinks: z
    .object({
      facebook: z
        .string()
        .url('সঠিক ফেসবুক লিংক দিন')
        .optional()
        .or(z.literal('')),
      instagram: z
        .string()
        .url('সঠিক ইনস্টাগ্রাম লিংক দিন')
        .optional()
        .or(z.literal('')),
      twitter: z
        .string()
        .url('সঠিক X (Twitter) লিংক দিন')
        .optional()
        .or(z.literal('')),
      linkedin: z
        .string()
        .url('সঠিক লিঙ্কডইন লিংক দিন')
        .optional()
        .or(z.literal('')),
      website: z
        .string()
        .url('সঠিক ওয়েবসাইট লিংক দিন')
        .optional()
        .or(z.literal('')),
    })
    .optional(),
  // Previous Experience - Bengali digit support
  previousWorkplace: z.string().optional().or(z.literal('')),
  previousWorkDuration: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(val => (val ? convertToEnglishDigits(val) : '')),
  totalExperienceYears: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return 0;
      const num = parseInt(convertToEnglishDigits(val), 10);
      return isNaN(num) ? 0 : num;
    }),
  // Role specific fields
  isHafiz: z.boolean().optional().default(false),
  specialSkills: z
    .string()
    .max(500, {
      message: 'বিশেষ দক্ষতার বর্ণনা সর্বোচ্চ ৫০০টি অক্ষরের হতে পারে',
    })
    .optional()
    .or(z.literal('')),
  certificateFiles: z.any().optional(),
  experienceLetterFile: z.any().optional(),
  cvFile: z.any().refine(files => files?.length > 0 || files instanceof File, {
    message: 'CV আবশ্যিক',
  }),
  tazkiyahFile: z.any().optional(),
  // URLs
  certificateUrls: z.array(z.string()).optional(),
  experienceLetterUrl: z.string().optional(),
  cvUrl: z.string().optional(),
});

export type ProfessionalEducationData = z.infer<
  typeof professionalEducationSchema
>;

// ─── Step 5: Contact Reference ───────────────────────────────

// Phone number helper - converts Bengali digits to English
const convertPhoneToEnglish = (val: string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = val;
  bengaliDigits.forEach((bd, i) => {
    result = result.replace(new RegExp(bd, 'g'), englishDigits[i]);
  });
  return result;
};

export const contactReferenceSchema = z.object({
  // Phone numbers (Main contact info) - accepts Bengali or English digits
  phonePrimary: z
    .string()
    .transform(val => convertPhoneToEnglish(val))
    .pipe(
      z
        .string()
        .min(11, { message: 'ফোন নম্বর অবশ্যঃ ১১ ডিজিটের হতে হবে' })
        .max(14, { message: 'ফোন নম্বর সর্বোচ্চ ১৪ ডিজিটের হতে পারে' })
        .regex(/^(\+880|880|0)1[3-9]\d{8}$/, {
          message:
            'সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 1712345678 বা +8801712345678)',
        })
    ),
  phoneSecondary: z
    .string()
    .transform(val => (val ? convertPhoneToEnglish(val) : ''))
    .pipe(
      z
        .string()
        .regex(/^(\+880|880|0)1[3-9]\d{8}$/, {
          message: 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন',
        })
        .optional()
    ),
  email: z.string().email('সঠিক ইমেইল ঠিকানা দিন').optional().or(z.literal('')),
  // Emergency Contact - Bengali digit support (optional)
  emergencyContactNo: z
    .string()
    .transform(val => (val ? convertPhoneToEnglish(val) : ''))
    .pipe(
      z
        .string()
        .min(11, { message: 'ফোন নম্বর অবশ্যঃ ১১ ডিজিটের হতে হবে' })
        .max(14, { message: 'ফোন নম্বর সর্বোচ্চ ১৪ ডিজিটের হতে পারে' })
        .regex(/^(\+880|880|0)1[3-9]\d{8}$/, {
          message: 'সঠিক বাংলাদেশী মোবাইল নম্বর দিন',
        })
        .optional()
    ),
  emergencyRelationship: z.string().min(1, 'সম্পর্ক নির্বাচন করুন'),
  // WhatsApp - Bengali digit support
  whatsappNo: z
    .string()
    .transform(val => (val ? convertPhoneToEnglish(val) : ''))
    .pipe(
      z
        .string()
        .min(11, { message: 'WhatsApp নম্বর অবশ্যয়: ১১ ডিজিটের হবে' })
        .max(14, { message: 'WhatsApp নম্বর সর্বোচ্চ: ১৪ ডিজিট' })
        .regex(/^(\+880|880|0)1[3-9]\d{8}$/, {
          message: 'সঠিক WhatsApp নম্বর দিন',
        })
        .optional()
    ),
  // Reference - Bengali digit support
  referenceName: z.string().min(2, 'সুপারিশকারীর নাম দিতে হবে'),
  referencePhone: z
    .string()
    .transform(val => (val ? convertPhoneToEnglish(val) : ''))
    .pipe(
      z
        .string()
        .min(11, { message: 'রেফারেন্স ফোন নম্বর অবশ্যঃ ১১ ডিজিটের হবে' })
        .max(14, { message: 'রেফারেন্স ফোন নম্বর সর্বোচ্চ: ১৪ ডিজিট' })
        .regex(/^(\+880|880|0)1[3-9]\d{8}$/, {
          message: 'সঠিক রেফারেন্স ফোন নম্বর দিন',
        })
        .optional()
    ),
  referenceOccupation: z.string().optional().or(z.literal('')),
});

export type ContactReferenceData = z.infer<typeof contactReferenceSchema>;

// ─── Step 4: Payment & Reference ───────────────────────────
export const paymentReferenceSchema = z.object({
  expectedSalary: z
    .number({ message: 'বেতন সংখ্যায় প্রদান করুন' })
    .min(500, 'সঠিক বেতন উল্লেখ করুন'),
  expectedJoiningDate: z.string().min(1, 'প্রত্যাশিত যোগদানের তারিখ দিন'),
  // Payment Info
  paymentMethod: z.enum(['bank', 'mobile_banking', 'cash'], {
    message: 'পেমেন্টের মাধ্যম নির্বাচন করুন',
  }),
  bankName: z.string().optional().or(z.literal('')),
  bankBranch: z.string().optional().or(z.literal('')),
  accountName: z.string().optional().or(z.literal('')),
  // Account number - Bengali digit support
  accountNumber: z
    .string()
    .transform(val => convertToEnglishDigits(val))
    .optional()
    .or(z.literal('')),
  mobileBankingProvider: z
    .enum(['bkash', 'nagad', 'rocket', 'upay'])
    .optional(),
  // Mobile banking number - Bengali digit support
  mobileBankingNumber: z
    .string()
    .transform(val => convertToEnglishDigits(val))
    .pipe(
      z
        .string()
        .min(11, { message: 'মোবাইল ব্যাংকিং নম্বর অবশ্যঃ ১১ ডিজিটের হবে' })
        .max(14, { message: 'মোবাইল ব্যাংকিং নম্বর সর্বোচ্চ: ১৪ ডিজিট' })
        .regex(/^(\+880|880|0)1[3-9]\d{8}$/, {
          message: 'সঠিক মোবাইল ব্যাংকিং নম্বর দিন',
        })
        .optional()
    ),
  // Declaration
  declaration: z.boolean().refine(val => val === true, {
    message: 'ঘোষণাপত্রটি গ্রহণ করা আবশ্যিক',
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'নিয়ম ও শর্তাবলী স্বীকার করুন',
  }),
  signatureFile: z.any().optional(),
  signatureUrl: z.string().optional(),
  additionalNotes: z
    .string()
    .max(1000, { message: 'অতিরিক্ত নোট সর্বোচ্চ ১০০০টি অক্ষরের হতে পারে' })
    .optional()
    .or(z.literal('')),
});

export type PaymentReferenceData = z.infer<typeof paymentReferenceSchema>;

// ─── Full Combine Schema ────────────────────────────────────
// Note: We combine these for the final submit result
export const fullStaffSchema = personalFamilySchema
  .merge(addressIDSchema)
  .merge(professionalEducationSchema)
  .merge(contactReferenceSchema)
  .merge(paymentReferenceSchema);

export type FullStaffData = z.infer<typeof fullStaffSchema>;
