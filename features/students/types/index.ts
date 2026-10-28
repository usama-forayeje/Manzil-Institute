import { Student } from '@/types/database';

export interface StudentDischargeInfo {
  reason: 'graduated' | 'transferred' | 'personal' | 'financial' | 'health' | 'expelled' | 'other';
  reasonBn: string;
  date: string;
  tcNo?: string;
  remarks?: string;
  clearance?: 'cleared' | 'due_pending' | 'waived';
  dischargedAt?: string;
  dischargedBy?: string;
}

export interface StudentListItem extends Omit<Student, 'status' | 'boardingType' | 'fatherNameBn' | 'motherName'> {
  status?: string;
  boardingType?: any;
  fatherNameBn?: string;
  fatherNameEn?: string;
  motherNameBn?: string;
  motherNameEn?: string;
  motherName?: string;
  photoUrl?: string;
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
    hallId?: string;
    hallName?: string;
    enrolledAt?: string;
  }[];
  hallId?: string;
  hallName?: string;
  nameBn?: string;
  nameEn?: string;
  phonePrimary?: string;
  whatsappNo?: string;
  presentVillage?: string;
  presentUnion?: string;
  presentThana?: string;
  presentDistrict?: string;
  permanentVillage?: string;
  permanentThana?: string;
  permanentDistrict?: string;
  bloodGroup?: string;
  dischargeInfo?: StudentDischargeInfo;
}

export interface StudentStatsResponse {
  total: number;
  active: number;
  departed: number;
  residential: number;
  nonResidential: number;
}

export interface DischargeStudentPayload {
  studentDocId: string;
  studentId: string;
  reason: 'graduated' | 'transferred' | 'personal' | 'financial' | 'health' | 'expelled' | 'other';
  reasonBn: string;
  date: string;
  tcNo?: string;
  remarks?: string;
  operatorName?: string;
  waiveDues?: boolean;
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
