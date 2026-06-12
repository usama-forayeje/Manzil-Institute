import { Student } from '@/types/database';

export interface StudentListItem extends Student {
  // Add any extra fields if needed from joins
  departmentName?: string;
  className?: string;
  session?: string;
  activeEnrollments?: {
    departmentId: string;
    classId: string;
    departmentName: string;
    className: string;
    session: string;
    boardingType?: string;
    boardingTypeId?: string;
    section?: string;
    monthlyFee?: number;
    enrolledAt?: string;
  }[];
  nameBn?: string;
  nameEn?: string;
  phonePrimary?: string;
  whatsappNo?: string;
  presentVillage?: string;
  presentUnion?: string;
  presentThana?: string;
  presentDistrict?: string;
  bloodGroup?: string;
}

export interface StudentTableResponse {
  documents: StudentListItem[];
  total: number;
  nextCursor: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
