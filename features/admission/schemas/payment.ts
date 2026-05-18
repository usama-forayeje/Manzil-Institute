import { z } from 'zod';

// ─── Fee Item Schema ────────────────────────────────────────
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
  feeCategory: z.string().optional(), // 'admission' | 'boarding' | 'monthly' | 'other'
  discount: z.number().default(0),
});

export type FeeItemData = z.infer<typeof feeItemSchema>;

// ─── Fee Collection Schema ──────────────────────────────────
export const feeCollectionSchema = z.object({
  // Fee items per department (JSON-serializable)
  feeItems: z
    .array(feeItemSchema)
    .min(1, 'অন্তত একটি ফি আইটেম থাকতে হবে'),

  // Totals
  totalAmount: z.number().min(0),

  // Net
  netAmount: z.number().min(0),
  paidAmount: z.number().min(0),

  // Payment
  includeFirstMonth: z.boolean().default(false),
  monthlyFeeOverride: z.number().default(0),
  isMonthlyFeeEdited: z.boolean().default(false),
  firstMonthDiscount: z.number().default(0),
  paymentMethod: z.enum(['cash', 'bank', 'bkash', 'nagad', 'rocket'], {
    message: 'পেমেন্ট পদ্ধতি নির্বাচন করুন',
  }),
  // Bug #3 Fix: transactionRef was used in Step5 UI but missing from schema
  transactionRef: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type FeeCollectionData = z.infer<typeof feeCollectionSchema>;
