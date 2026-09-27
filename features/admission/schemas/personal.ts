import { z } from 'zod';
import { convertToEnglishDigits } from './index';

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
  nameAr: z
    .string()
    .max(150, { message: 'নাম সর্বোচ্চ ১৫০ অক্ষর' })
    .optional()
    .or(z.literal('')),

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
  fatherNameAr: z
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
  motherNameAr: z
    .string()
    .max(150)
    .optional()
    .or(z.literal('')),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
  fatherWorkplace: z.string().optional(),
  motherWorkplace: z.string().optional(),

  // Personal details
  dateOfBirth: z
    .string()
    .min(1, 'জন্ম তারিখ দিতে হবে'),
  gender: z.enum(['male', 'female'], {
    message: 'লিঙ্গ নির্বাচন করুন',
  }),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'])
    .default('unknown'),
  nationality: z
    .string()
    .min(2, { message: 'জাতীয়তা দিতে হবে' })
    .default('বাংলাদেশী'),
  religion: z.enum(['islam', 'hinduism', 'christianity', 'buddhism', 'other'], 'ধর্ম নির্বাচন করুন'),
  identificationNo: z
    .string()
    .max(50, { message: 'নম্বর সর্বোচ্চ ৫০ অক্ষরের হতে পারে' })
    .optional()
    .transform(val => (val ? convertToEnglishDigits(val) : undefined)),
  identificationType: z.enum(['bc', 'nid']).default('bc'),
  isHafiz: z.boolean().optional().default(false),

  // Applicant Info (Who is bringing the student)
  applicantRelation: z.enum(['', 'father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother', 'uncle', 'guardian', 'other']).default(''),
  applicantName: z.string().optional(),
  applicantPhone: z
    .string()
    .optional()
    .transform(val => (val ? convertToEnglishDigits(val) : undefined))
    .refine(val => !val || /^\+?[0-9]{8,15}$/.test(val), {
      message: 'সঠিক ফোন নম্বর দিন',
    }),
  
  // Status (for Edit Mode)
  status: z.enum(['active', 'inactive', 'graduated', 'disqualified', 'suspended', 'transferred']).optional().default('active'),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
