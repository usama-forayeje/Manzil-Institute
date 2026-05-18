import { z } from 'zod';

export const updateStudentSchema = z.object({
  // Section 1: Personal
  nameEn: z.string().min(1, 'নাম (ইংরেজি) আবশ্যক'),
  nameBn: z.string().min(1, 'নাম (বাংলা) আবশ্যক'),
  dateOfBirth: z.string().min(1, 'জন্ম তারিখ আবশ্যক'),
  gender: z.enum(['male', 'female']),
  bloodGroup: z.string().optional().default('unknown'),
  nationality: z.string().optional().default('বাংলাদেশী'),
  religion: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNo: z.string().optional(),
  isHafiz: z.boolean().optional().default(false),
  
  // Section 2: Family & Guardians
  fatherNameEn: z.string().optional(),
  fatherNameBn: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherWorkplace: z.string().optional(),
  motherNameEn: z.string().optional(),
  motherNameBn: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherWorkplace: z.string().optional(),
  guardianPhone: z.string().optional(),
  whatsappNo: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),

  // Section 3: Professional & Contact
  phonePrimary: z.string().min(11, 'সঠিক ফোন নম্বর দিন'),
  
  // Section 4: Address
  address: z.string().min(1, 'ঠিকানা আবশ্যক'),
  presentVillage: z.string().optional(),
  presentPostOffice: z.string().optional(),
  presentThana: z.string().optional(),
  presentDistrict: z.string().optional(),
  
  // Section 5: Academic & Status
  status: z.enum(['active', 'inactive', 'graduated']),
  boardingType: z.string().min(1, 'আবাসন ধরণ আবশ্যক'),
  hallName: z.string().optional(),
  admissionDate: z.string().optional(),
  
  // Section 6: Previous School
  previousSchoolName: z.string().optional(),
  previousClassName: z.string().optional(),
  previousResult: z.string().optional(),
});

export type UpdateStudentValues = z.infer<typeof updateStudentSchema>;
