/**
 * features/admission/schemas/form.ts
 *
 * Master schema for the entire multi-step admission form.
 * Used by AdmissionForm.tsx with a single useForm() + FormProvider.
 * Each section (personal / contact / enrollment / payment) maps to one step.
 */
import { z } from 'zod';

import { personalInfoSchema } from './personal';
import { contactAddressSchema } from './address';
import { feeItemSchema } from './payment';

// ── Enrollment (flexible – boardingType can be Appwrite $id or key) ──
const enrollmentEntrySchema = z.object({
  departmentId:   z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  departmentCode: z.string().optional().default(''),
  departmentName: z.string().optional().default(''),
  classId:        z.string().min(1, 'শ্রেণী নির্বাচন করুন'),
  className:      z.string().optional(),
  section:        z.string().optional(),
  session:        z.string().min(1, 'সেশন নির্বাচন করুন'),
  shift:          z.string().optional(),
  monthlyFee:     z.number().min(0).default(0),
  rollNo:         z.string().optional(),
  enrollmentDocId: z.string().optional(),
});

const enrollmentSectionSchema = z.object({
  admissionDate: z.string().min(1, 'ভর্তির তারিখ দিতে হবে'),
  boardingType: z.string().min(1, 'বোর্ডিং ধরন নির্বাচন করুন'),
  hallId: z.string().optional(),
  hallName: z.string().optional(),
  enrollments: z
    .array(enrollmentEntrySchema)
    .min(1, 'কমপক্ষে একটি বিভাগ নির্বাচন করুন'),
  previousSchoolName: z.string().optional(),
  previousSchoolAddress: z.string().optional(),
  previousClassName:  z.string().optional(),
  previousResult:     z.string().optional(),
  admissionTestMarks: z.string().optional(),
  admissionTestResult: z.string().optional().default('passed'),
  admissionTestRemarks: z.string().optional(),
  examinerName: z.string().optional(),
  
  // Custom Identification  // Manual sequence override
  useManualIDs: z.boolean().optional().default(false),
  customStudentId: z.string().optional(),
  notes: z.string().optional(),
});

// ── Payment (feeItems are async-loaded; validated on final submit) ──
const paymentSectionSchema = z.object({
  feeItems:           z.array(feeItemSchema).default([]),
  totalAmount:        z.number().min(0).default(0),
  netAmount:          z.number().min(0).default(0),
  paidAmount:         z.number().min(0).default(0),
  includeFirstMonth:  z.boolean().default(false),
  monthlyFeeOverride: z.number().default(0),
  isMonthlyFeeEdited: z.boolean().default(false),
  firstMonthDiscount: z.number().min(0).default(0),
  paymentMethod:      z.enum(['cash', 'bank', 'bkash', 'nagad', 'rocket']).default('cash'),
  // Transaction reference for non-cash payments (bKash TxID, bank ref, etc.)
  transactionRef:     z.string().optional().or(z.literal('')),
  notes:              z.string().max(500).optional().or(z.literal('')),
});

const documentsSectionSchema = z.object({
  studentPhoto:    z.string().optional(),
  studentDocFront: z.string().optional(),
  studentDocBack:  z.string().optional(),
  fatherNidFront:  z.string().optional(),
  fatherNidBack:   z.string().optional(),
  motherNidFront:  z.string().optional(),
  motherNidBack:   z.string().optional(),
  transferCertificate: z.string().optional(),
  additionalDocuments: z.array(z.string()).optional().default([]),
});

// ── Master Schema ────────────────────────────────────────────
export const admissionFormSchema = z.object({
  personal:   personalInfoSchema,
  contact:    contactAddressSchema,
  documents:  documentsSectionSchema,
  enrollment: enrollmentSectionSchema,
  payment:    paymentSectionSchema,
});

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>;
export type EnrollmentEntry     = z.infer<typeof enrollmentEntrySchema>;
export type PaymentValues       = z.infer<typeof paymentSectionSchema>;

// ── Per-step field lists (for form.trigger()) ────────────────
// RHF accepts dotted paths; passing the section key validates ALL sub-fields.
export const STEP_FIELDS: Record<1 | 2 | 3 | 4 | 5, (keyof AdmissionFormValues)[]> = {
  1: ['personal'],
  2: ['contact'],
  3: ['documents'],
  4: ['enrollment'],
  5: ['payment'],
};

// ── Default values (keeps all inputs controlled from the start) ──
export const ADMISSION_DEFAULT_VALUES: AdmissionFormValues = {
  personal: {
    nameEn:       '',
    nameBn:       '',
    nameAr:       '',
    fatherNameBn: '',
    fatherNameEn: '',
    motherNameBn: '',
    motherNameEn: '',
    fatherOccupation: '',
    motherOccupation: '',
    fatherWorkplace: '',
    motherWorkplace: '',
    dateOfBirth:  '',
    gender:       undefined as any,
    bloodGroup:   'unknown',
    nationality:  'বাংলাদেশী',
    religion:     undefined as any,
    identificationNo: '',
    isHafiz:      false,
    photoBase64:  undefined,
    photoUrl:     undefined,
    identificationType: 'bc',
    applicantRelation: '' as any,
    applicantName: '',
    applicantPhone: '',
    status: 'active' as any,
  },
  contact: {
    guardianPhone:          '',
    phonePrimary:           '',
    whatsappNo:             '',
    email:                  '',
    permanentSameAsCurrent: false,
    presentAddress: {
      division: '', district: '', thana: '', union: '',
      postOffice: '', village: '', postCode: '',
    },
    permanentAddress: {
      division: '', district: '', thana: '', union: '',
      postOffice: '', village: '', postCode: '',
    },
  },
  documents: {
    studentPhoto: undefined,
    studentDocFront: undefined,
    studentDocBack: undefined,
    fatherNidFront: undefined,
    fatherNidBack: undefined,
    motherNidFront: undefined,
    motherNidBack: undefined,
    transferCertificate: undefined,
    additionalDocuments: [],
  },
  enrollment: {
    admissionDate:      new Date().toISOString(),
    boardingType:       'day',
    hallId:             '',
    hallName:           '',
    useManualIDs:       false,
    customStudentId:    '',
    enrollments:        [{
      departmentId: '', departmentCode: '', departmentName: '',
      classId: '', className: '', section: '',
      session: '', shift: '', monthlyFee: 0, rollNo: '',
    }],
    previousSchoolName: '',
    previousSchoolAddress: '',
    previousClassName:  '',
    previousResult:     '',
    admissionTestMarks: '',
    admissionTestResult: 'passed',
    admissionTestRemarks: '',
    examinerName: '',
    notes: '',
  },
  payment: {
    feeItems:           [],
    totalAmount:        0,
    netAmount:          0,
    paidAmount:         0,
    includeFirstMonth:  false,
    monthlyFeeOverride: 0,
    isMonthlyFeeEdited: false,
    firstMonthDiscount: 0,
    paymentMethod:      'cash',
    transactionRef:     '',
    notes:              '',
  },
};
