/**
 * features/admission/types.ts
 *
 * Shared types for the admission module.
 * Production-grade types eliminating \ny\ proliferation.
 */

import type { AppwriteDocument } from '@/types/database';

// ─── Appwrite document with typed data ─────────────────────
export type AppwriteDoc<T> = T & AppwriteDocument;

// ─── API Response wrapper ──────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
  [key: string]: unknown;
}

// ─── Admission-specific document types ─────────────────────
export interface DepartmentDoc extends AppwriteDocument {
  code: string;
  name: string;
  nameBn: string;
  isActive: boolean;
  sortOrder?: number;
}

export interface ClassDoc extends AppwriteDocument {
  name: string;
  nameBn: string;
  level: number;
  departmentId: string;
  section: string;
  isActive: boolean;
  monthlyFee?: number;
}

export interface SessionDoc extends AppwriteDocument {
  sessionName: string;
  isActive?: boolean;
}

export interface SectionDoc extends AppwriteDocument {
  sectionName: string;
  sectionNameBn?: string;
  isActive?: boolean;
}

export interface FeeTypeDoc extends AppwriteDocument {
  code: string;
  name: string;
  nameBn: string;
  category: string;
  billingCycle: string;
  defaultAmount: number;
  isRequired: boolean;
  isActive: boolean;
  showInAdmissionForm?: boolean;
  departmentIds: string[];
  classIds?: string[];
  boardingTypes: string[];
  applicableBoardingTypes?: string[];
  applicableTo?: string;
}

export interface BoardingTypeDoc extends AppwriteDocument {
  name: string;
  nameBn: string;
  isActive: boolean;
  isResidential?: boolean;
  monthlyFee?: number;
  admissionFee?: number;
  order?: number;
}

export interface HallRoomDoc extends AppwriteDocument {
  roomNo: string;
  roomName: string;
  roomNameBn?: string;
  floor: string;
  capacity: number;
  occupiedSeats: number;
  isActive: boolean;
}

// ─── Generic collection query response types ──────────────
export interface DepartmentsResponse {
  success: boolean;
  departments: AppwriteDoc<DepartmentDoc>[];
  error?: string;
}

export interface ClassesResponse {
  success: boolean;
  classes: AppwriteDoc<ClassDoc>[];
  error?: string;
}

export interface SessionsResponse {
  success: boolean;
  sessions: AppwriteDoc<SessionDoc>[];
  error?: string;
}

export interface SectionsResponse {
  success: boolean;
  sections: AppwriteDoc<SectionDoc>[];
  error?: string;
}

export interface BoardingTypesResponse {
  success: boolean;
  boardingTypes: AppwriteDoc<BoardingTypeDoc>[];
  error?: string;
}

export interface BoardingRoomsResponse {
  success: boolean;
  rooms: AppwriteDoc<HallRoomDoc>[];
  error?: string;
}

// ─── Option types for dropdowns ────────────────────────────
export interface SelectOption<T = string> {
  value: T;
  label: string;
  labelBn?: string;
  disabled?: boolean;
}

export interface HallOption {
  value: string;
  hallName: string;
  floorLabel: string;
  roomNoBn: string;
  label: string;
}
