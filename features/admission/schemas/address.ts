import { z } from 'zod';
import { convertPhoneToEnglish } from './index';

// ─── Helper: Address Schema ─────────────────────────────────
export const addressSchema = z.object({
  division: z
    .string()
    .min(1, 'বিভাগ নির্বাচন করুন'),
  district: z
    .string()
    .min(1, 'জেলা নির্বাচন করুন'),
  thana: z
    .string()
    .min(1, 'থানা/উপজেলা নির্বাচন করুন'),
  union: z
    .string()
    .min(1, 'ইউনিয়ন/ওয়ার্ড নির্বাচন করুন'),
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

export const optionalAddressSchema = z.object({
  division: z.string().optional().or(z.literal('')),
  district: z.string().optional().or(z.literal('')),
  thana: z.string().optional().or(z.literal('')),
  union: z.string().optional().or(z.literal('')),
  postOffice: z.string().optional().or(z.literal('')),
  village: z.string().optional().or(z.literal('')),
  postCode: z.string().optional().or(z.literal('')),
});

export const contactAddressBaseSchema = z.object({
    // Contact
    guardianPhone: z
      .string()
      .min(1, 'অভিভাবকের ফোন নম্বর দিতে হবে')
      .transform(val => convertPhoneToEnglish(val))
      .refine(val => /^\+?[0-9]{8,15}$/.test(val), {
        message: 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)',
      }),
    phonePrimary: z
      .string()
      .optional()
      .transform(val => (val ? convertPhoneToEnglish(val) : undefined))
      .refine(val => !val || /^\+?[0-9]{8,15}$/.test(val), {
        message: 'সঠিক ফোন নম্বর দিন',
      }),
    whatsappNo: z
      .string()
      .optional()
      .transform(val => (val ? convertPhoneToEnglish(val) : undefined))
      .refine(val => !val || /^\+?[0-9]{8,15}$/.test(val), {
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
