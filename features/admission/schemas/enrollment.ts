import { z } from 'zod';

export const enrollmentEntrySchema = z.object({
  departmentId: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  departmentCode: z.string(),
  departmentName: z.string().optional(),
  classId: z.string().min(1, 'শ্রেণী নির্বাচন করুন'),
  className: z.string().optional(),
  section: z.string().optional(),
  session: z.string().min(1, 'সেশন নির্বাচন করুন'),
  shift: z.string().optional(),
  monthlyFee: z.number().min(0, 'মাসিক বেতন অবশ্যই দিতে হবে').default(0),
  rollNo: z.string().optional(),
  enrollmentDocId: z.string().optional(),
});

export const enrollmentInfoSchema = z.object({
  admissionDate: z.string().optional(),
  // Global boarding type — accepts Appwrite $id from boarding_types collection
  boardingType: z.string().min(1, 'বোর্ডিং ধরন নির্বাচন করুন'),
  hallId: z.string().optional(),
  hallName: z.string().optional(),
  enrollments: z.array(enrollmentEntrySchema).min(1, 'কমপক্ষে একটি বিভাগ নির্বাচন করুন'),
  previousSchoolName: z.string().optional(),
  previousSchoolAddress: z.string().optional(),
  previousClassName: z.string().optional(),
  previousResult: z.string().optional(),

  // Admission Test Details
  admissionTestMarks: z.string().optional(),
  admissionTestResult: z.enum(['passed', 'waiting', 'failed'], {
    message: 'পরীক্ষার ফলাফল নির্বাচন করুন',
  }).default('passed').optional(),
  admissionTestRemarks: z.string().optional(),
  examinerName: z.string().optional(),

  // Manual sequence override
  useManualIDs: z.boolean().optional().default(false),
  customStudentId: z.string().optional(),
});

export type EnrollmentInfoData = z.infer<typeof enrollmentInfoSchema>;
export type EnrollmentEntry = z.infer<typeof enrollmentEntrySchema>;
