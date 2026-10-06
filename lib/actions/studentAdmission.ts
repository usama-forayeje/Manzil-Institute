'use server';

import { revalidatePath } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import {
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { createAdminClient } from '@/lib/appwrite/admin';
import { getSession } from '@/lib/auth/actions';
import {
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS,
} from '@/config/appwrite';

import {
  r2Client,
  validateR2Config,
  buildR2Key,
  buildR2Url,
  R2_BUCKET,
} from '@/config/r2';
import { getCachedReference, setCachedReference } from '@/lib/utils/academic-cache';
import type {
  PersonalInfoData,
  ContactAddressData,
  EnrollmentInfoData,
  FeeCollectionData,
  FeeItemData,
  EnrollmentEntry,
} from '@/validations/admission';

// ═══════════════════════════════════════════════════════════════
// STUDENT ADMISSION SERVER ACTIONS
// মানযিল ইনস্টিটিউট — ছাত্র ভর্তি সার্ভার অ্যাকশন
// ═══════════════════════════════════════════════════════════════

// ─── Types ──────────────────────────────────────────────────

import type { AdmissionFormValues } from '@/features/admission/schemas/form';

export interface AdmissionResult {
  success: boolean;
  studentId: string;
  studentDocId: string;
  admissionNo: string;
  enrollmentIds: string[];
  receiptNo: string;
  error?: string;
}

interface DepartmentDoc {
  $id: string;
  code: string;
  name: string;
  nameBn: string;
  isActive: boolean;
}

interface ClassDoc {
  $id: string;
  name: string;
  nameBn: string;
  level: number;
  departmentId: string;
  section: string;
  isActive: boolean;
}

interface FeeTypeDoc {
  $id: string;
  feeCode: string;
  feeName: string;
  feeNameBn: string;
  feeCategory: string;
  defaultAmount: number;
  isRequired: boolean;
  isActive: boolean;
  applicableDepartments: string[];
  applicableBoardingTypes: string[];
}

// ─── ID Generation ──────────────────────────────────────────

async function generateSequentialId(
  databases: any,
  collectionId: string,
  fieldName: string,
  prefix: string,
  padLength: number = 4
): Promise<string> {
  const year = new Date().getFullYear();
  const searchPrefix = `${prefix}-`;
  const fullPrefix = `${prefix}-${year}-`;

  try {
    const existing = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      [
        Query.startsWith(fieldName, searchPrefix),
        Query.orderDesc('$createdAt'),
        Query.limit(1),
      ]
    );

    let next = 1;
    if (existing.total > 0) {
      const lastId = existing.documents[0][fieldName] as string;
      const parts = lastId.split('-');
      const lastNum = parseInt(parts[parts.length - 1] ?? '0', 10);
      if (!isNaN(lastNum)) {
        next = lastNum + 1;
      }
    }

    return `${fullPrefix}${String(next).padStart(padLength, '0')}`;
  } catch {
    // Fallback: timestamp-based
    const ts = Date.now().toString().slice(-6);
    return `${fullPrefix}${ts}`;
  }
}

// ─── Photo Upload ───────────────────────────────────────────

async function uploadStudentFile(
  base64: string,
  folderName: string,
  fileName: string
): Promise<string> {
  const r2Validation = validateR2Config();
  if (!r2Validation.valid) {
    console.warn('R2 config invalid, skipping file upload');
    return '';
  }

  if (!base64 || !base64.startsWith('data:')) {
    return '';
  }

  const [meta, base64Data] = base64.split(',');
  if (!base64Data) return '';

  const contentType = meta.match(/data:([^;]+)/)?.[1] ?? 'image/webp';
  const ext = contentType.split('/')[1] ?? 'webp';
  
  // naming cleaning
  const safeFolderName = folderName.replace(/[^a-z0-9]/g, '_').toLowerCase();
  const safeFileName = fileName.replace(/[^a-z0-9]/g, '_').toLowerCase();
  
  const fileKey = `${safeFolderName}/${safeFileName}-${Date.now()}.${ext}`;
  const r2Key = buildR2Key(BUCKETS.STUDENT_PHOTOS, fileKey);

  const binary = atob(base64Data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: r2Key,
        Body: bytes,
        ContentType: contentType,
        ContentDisposition: `inline; filename="${safeFileName}.${ext}"`,
      })
    );
    return buildR2Url(BUCKETS.STUDENT_PHOTOS, fileKey);
  } catch (err) {
    console.error(`Upload failed for ${fileName}:`, err);
    return '';
  }
}

// ─── Address Formatter ──────────────────────────────────────

function formatAddress(addr: {
  village?: string;
  postOffice?: string;
  union?: string;
  thana?: string;
  district?: string;
  division?: string;
  postCode?: string;
}): string {
  return [addr.village, addr.postOffice, addr.union, addr.thana, addr.district, addr.division]
    .filter(Boolean)
    .join(', ');
}

// ═══════════════════════════════════════════════════════════════
// MAIN: createAdmission()
// ═══════════════════════════════════════════════════════════════

export async function createAdmission(
  payload: AdmissionFormValues
): Promise<AdmissionResult> {
  const { personal: step1, contact: step2, enrollment: step3, payment: step4, documents } = payload;
  const photoBase64 = documents?.studentPhoto;
  const { databases } = await createAdminClient();
  const uploadedR2Keys: string[] = [];
  const createdDocIds: { collectionId: string; documentId: string }[] = [];

  try {
    // ── 1. Generate IDs ─────────────────────────────────────
    const studentId = await generateSequentialId(
      databases,
      COLLECTIONS.STUDENTS,
      'studentId',
      'MI',
      4
    );

    const admissionNo = await generateSequentialId(
      databases,
      COLLECTIONS.STUDENTS,
      'admissionNo',
      'ADM',
      4
    );

    // ── 0. Configuration Check ────────────────────────────
    const requiredCollections = [
      { id: COLLECTIONS.STUDENTS, name: 'STUDENTS' },
      { id: COLLECTIONS.STUDENT_ENROLLMENTS, name: 'STUDENT_ENROLLMENTS' },
      { id: COLLECTIONS.FEE_INVOICES, name: 'FEE_INVOICES' },
      { id: COLLECTIONS.FEE_TRANSACTIONS, name: 'FEE_TRANSACTIONS' },
      { id: COLLECTIONS.FEE_PAYMENTS, name: 'FEE_PAYMENTS' },
    ];

    for (const col of requiredCollections) {
      if (!col.id || col.id === '') {
        return { success: false, studentId: '', studentDocId: '', admissionNo: '', enrollmentIds: [], receiptNo: '', error: `Configuration error: Collection ID for ${col.name} is missing in .env` };
      }
    }

    if (!DATABASE_ID) {
      return { success: false, studentId: '', studentDocId: '', admissionNo: '', enrollmentIds: [], receiptNo: '', error: 'Configuration error: DATABASE_ID is missing in .env' };
    }

    // ── 2. Create Student Folder Name ───────────────────────
    const folderBaseName = step1.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const folderId = step1.identificationNo || studentId.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const folderName = `${folderBaseName}-${folderId}`;

    // ── 3. Upload Photo & Documents ──────────────────────────
    const uploadFile = async (base64: string | undefined, fileName: string) => {
      if (!base64) return '';
      const url = await uploadStudentFile(base64, folderName, fileName);
      if (url) {
        const key = url.split('/').slice(-2).join('/');
        uploadedR2Keys.push(key);
      }
      return url;
    };

    const photoUrl = await uploadFile(documents?.studentPhoto || step1.photoBase64, 'profile-photo');
    const studentDocFrontUrl = await uploadFile(documents?.studentDocFront, 'birth-certificate-front');
    const studentDocBackUrl = await uploadFile(documents?.studentDocBack, 'birth-certificate-back');
    const fatherNidFrontUrl = await uploadFile(documents?.fatherNidFront, 'father-nid-front');
    const fatherNidBackUrl = await uploadFile(documents?.fatherNidBack, 'father-nid-back');
    const motherNidFrontUrl = await uploadFile(documents?.motherNidFront, 'mother-nid-front');
    const motherNidBackUrl = await uploadFile(documents?.motherNidBack, 'mother-nid-back');
    const transferCertificateUrl = await uploadFile(documents?.transferCertificate, 'transfer-certificate');

    // Handle Additional Documents
    const additionalDocs: string[] = [];
    if (documents?.additionalDocuments && Array.isArray(documents.additionalDocuments)) {
      for (let i = 0; i < documents.additionalDocuments.length; i++) {
        const url = await uploadFile(documents.additionalDocuments[i], `additional-doc-${i}`);
        if (url) additionalDocs.push(url);
      }
    }
    // ── 4. Get Current User for Audit & Meta ───────────────
    const session = await getSession();
    const currentUserName = session?.userDoc?.name || session?.user?.name || 'admin';

    // ── 5. Create Student Document ──────────────────────────
    const studentDocId = ID.unique();

    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      studentDocId,
      {
        studentId,
        admissionNo,
        status: 'active',
        createdBy: currentUserName,

        // Personal
        nameEn: step1.nameEn,
        nameBn: step1.nameBn,
        nameAr: step1.nameAr || '',
        fatherNameBn: step1.fatherNameBn,
        fatherNameEn: step1.fatherNameEn || '',
        fatherNameAr: (step1 as any).fatherNameAr || '',
        motherNameBn: step1.motherNameBn,
        motherNameEn: step1.motherNameEn || '',
        motherNameAr: (step1 as any).motherNameAr || '',
        fatherOccupation: step1.fatherOccupation || '',
        fatherWorkplace: step1.fatherWorkplace || '',
        motherOccupation: step1.motherOccupation || '',
        motherWorkplace: step1.motherWorkplace || '',

        // Applicant Info
        applicantRelation: step1.applicantRelation || 'father',
        applicantName: (step1.applicantRelation === 'father' || step1.applicantRelation === 'mother') ? '' : (step1.applicantName || ''),
        applicantPhone: (step1.applicantRelation === 'father' || step1.applicantRelation === 'mother') ? '' : (step1.applicantPhone || ''),
        dateOfBirth: step1.dateOfBirth
          ? new Date(step1.dateOfBirth).toISOString()
          : new Date().toISOString(),
        gender: step1.gender,
        bloodGroup: step1.bloodGroup || 'unknown',
        nationality: step1.nationality || 'বাংলাদেশী',
        religion: step1.religion,
        identificationNo: step1.identificationNo || '',
        identificationType: step1.identificationType || 'bc',
        isHafiz: step1.isHafiz || false,

        // Photos & Docs
        photo: photoUrl || '',
        studentDocFrontUrl,
        studentDocBackUrl: studentDocBackUrl || '',
        fatherNidFrontUrl,
        fatherNidBackUrl,
        motherNidFrontUrl,
        motherNidBackUrl,
        transferCertificateUrl: transferCertificateUrl || '',
        additionalDocuments: additionalDocs,

        // Contact
        guardianPhone: step2.guardianPhone,
        phonePrimary: step2.phonePrimary || '',
        whatsappNo: step2.whatsappNo || '',
        email: step2.email || '',

        // Atomic Address Fields
        presentVillage: step2.presentAddress?.village || '',
        presentPostOffice: step2.presentAddress?.postOffice || '',
        presentUnion: step2.presentAddress?.union || '',
        presentThana: step2.presentAddress?.thana || '',
        presentDistrict: step2.presentAddress?.district || '',
        presentDivision: step2.presentAddress?.division || '',
        presentPostCode: Number(step2.presentAddress?.postCode || 0),
        
        permanentVillage: (step2.permanentSameAsCurrent ? step2.presentAddress?.village : step2.permanentAddress?.village) || '',
        permanentPostOffice: (step2.permanentSameAsCurrent ? step2.presentAddress?.postOffice : step2.permanentAddress?.postOffice) || '',
        permanentUnion: (step2.permanentSameAsCurrent ? step2.presentAddress?.union : step2.permanentAddress?.union) || '',
        permanentThana: (step2.permanentSameAsCurrent ? step2.presentAddress?.thana : step2.permanentAddress?.thana) || '',
        permanentDistrict: (step2.permanentSameAsCurrent ? step2.presentAddress?.district : step2.permanentAddress?.district) || '',
        permanentDivision: (step2.permanentSameAsCurrent ? step2.presentAddress?.division : step2.permanentAddress?.division) || '',
        permanentPostCode: Number((step2.permanentSameAsCurrent ? step2.presentAddress?.postCode : step2.permanentAddress?.postCode) || 0),

        // previous school
        previousSchoolName: step3.previousSchoolName || '',
        previousSchoolAddress: step3.previousSchoolAddress || '',
        previousClassName: step3.previousClassName || '',
        previousResult: step3.previousResult || '',

        // admission test 
        admissionTestMarks: step3.admissionTestMarks || '',
        admissionTestResult: step3.admissionTestResult || 'passed',
        admissionTestRemarks: step3.admissionTestRemarks || '',
        examinerName: step3.examinerName || '',

        // Meta
        admissionDate: step3.admissionDate ? new Date(step3.admissionDate).toISOString() : new Date().toISOString(),
        notes: step3.notes || '',
      }
    );

    createdDocIds.push({ collectionId: COLLECTIONS.STUDENTS, documentId: studentDocId });

    // ── 5. Create Enrollment Records (per department) ───────
    const enrollmentIds: string[] = [];

    for (const enrollment of step3.enrollments) {
      const enrollmentId = await generateSequentialId(
        databases,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        'enrollmentId',
        'ENR',
        4
      );

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        ID.unique(),
        {
          enrollmentId,
          studentId: studentDocId,
          departmentId: enrollment.departmentId,
          classId: enrollment.classId,
          section: enrollment.section || '',
          session: enrollment.session,
          shift: enrollment.shift || 'day',
          monthlyFee: Number(enrollment.monthlyFee || 0),
          rollNo: enrollment.rollNo || '',
          boardingType: step3.boardingType,
          hallId: step3.hallId || '',
          hallName: step3.hallName || '',
          status: 'active',
          enrollmentDate: new Date().toISOString(),
        }
      ).then(doc => createdDocIds.push({ collectionId: COLLECTIONS.STUDENT_ENROLLMENTS, documentId: doc.$id }));
      enrollmentIds.push(enrollmentId);
    }

    // ── 6. Create Fee Invoice (Only if billing data was provided) ─
    let receiptNo = 'N/A';
    if (step4?.feeItems && step4.feeItems.length > 0 && (Number(step4.totalAmount || 0) > 0 || Number(step4.paidAmount || 0) > 0)) {
      receiptNo = await generateSequentialId(
        databases,
        COLLECTIONS.FEE_INVOICES,
        'receiptNo',
        'RCT',
        5
      );

      const invoiceId = await generateSequentialId(
        databases,
        COLLECTIONS.FEE_INVOICES,
        'invoiceId', // Sequential business ID
        'INV',
        5
      );

      const invoiceDocId = ID.unique();
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FEE_INVOICES,
        invoiceDocId,
        {
          invoiceId,
          studentId: studentDocId,
          enrollmentId: enrollmentIds[0],
          departmentCode: step3.enrollments[0]?.departmentCode || step3.enrollments[0]?.departmentId,
          invoiceType: 'admission',
          session: new Date().getFullYear().toString(),
          month: new Date().toLocaleString('default', { month: 'long' }),
          totalAmount: Number(step4.totalAmount || 0),
          discount: Number(step4.firstMonthDiscount || 0),
          netAmount: Number(step4.netAmount || 0),
          paidAmount: Number(step4.paidAmount || 0),
          dueAmount: Math.max(0, Number(step4.netAmount || 0) - Number(step4.paidAmount || 0)),
          status: Number(step4.paidAmount) >= Number(step4.netAmount) ? 'paid' : (Number(step4.paidAmount) > 0 ? 'partial' : 'unpaid'),
          feeItems: JSON.stringify(step4.feeItems.filter(item => item.isIncluded || item.isRequired)),
          createdBy: currentUserName,
        }
      );

      createdDocIds.push({ collectionId: COLLECTIONS.FEE_INVOICES, documentId: invoiceDocId });

      for (const item of step4.feeItems) {
        if (!item.isIncluded && !item.isRequired) continue;
        
        const transactionDocId = ID.unique();
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.FEE_TRANSACTIONS,
          transactionDocId,
          {
            invoiceId: invoiceDocId,
            studentId: studentDocId,
            createdBy: currentUserName,
            enrollmentId: enrollmentIds[0],

            departmentCode: step3.enrollments[0]?.departmentCode || step3.enrollments[0]?.departmentId,
            feeTypeCode: item.feeTypeCode,
            feeTypeName: item.feeTypeName,
            transactionType: 'admission',
            amount: Number(item.amount),
            discount: Number(item.discount || 0),
            netAmount: Number(item.amount - (item.discount || 0)),
            date: new Date().toISOString(),
          }
        ).then(doc => createdDocIds.push({ collectionId: COLLECTIONS.FEE_TRANSACTIONS, documentId: doc.$id }));
      }

      // ── 7. Record Payment (if paid) ─────────────────────────
      if (step4.paidAmount > 0) {
        const paymentId = await generateSequentialId(
          databases,
          COLLECTIONS.FEE_PAYMENTS,
          'paymentId',
          'PAY',
          5
        );

        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.FEE_PAYMENTS,
          ID.unique(),
          {
            paymentId,
            invoiceId: invoiceDocId,
            enrollmentId: enrollmentIds[0],
            departmentCode: step3.enrollments[0]?.departmentCode || step3.enrollments[0]?.departmentId,
            receiptNo,
            studentId: studentDocId,
            amountPaid: Number(step4.paidAmount || 0),
            paymentMethod: step4.paymentMethod,
            transactionRef: step4.transactionRef || '',
            notes: step4.notes || '',
            paymentDate: new Date().toISOString(),
            collectedBy: currentUserName,
          }
        ).then(doc => createdDocIds.push({ collectionId: COLLECTIONS.FEE_PAYMENTS, documentId: doc.$id }));
      }
    }

    // ── 8. Audit Log ────────────────────────────────────────
    try {
      if (COLLECTIONS.AUDIT_LOGS) {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.AUDIT_LOGS,
          ID.unique(),
          {
            userId: session?.user?.$id || 'admin',
            userEmail: session?.user?.email || 'admin',
            userRole: session?.role || 'admin',
            action: 'STUDENT_ADMISSION',

            targetType: 'student',
            targetId: studentId,
            targetName: step1.nameBn || step1.nameEn,
            oldValue: null,
            newValue: JSON.stringify({
              studentId,
              admissionNo,
              enrollmentIds,
              receiptNo,
            }),
            ipAddress: '',
            userAgent: '',
          }
        );
      }
    } catch {
      // Audit log failure should not block admission
    }

    try {
      revalidatePath('/dashboard/admin/students');
      revalidatePath('/dashboard/admin/students/admission');
    } catch (e) {
      // Non-fatal if cache revalidation fails in certain contexts
    }

    return {
      success: true,
      studentId,
      studentDocId,
      admissionNo,
      enrollmentIds,
      receiptNo,
    };
  } catch (err: any) {
    // ── Rollback: Clean up created documents on error ───────
    console.error('❌ Admission creation failed, rolling back...', err);
    
    for (const doc of createdDocIds) {
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          doc.collectionId,
          doc.documentId
        );
      } catch (delErr) {
        console.error(`Rollback failed for ${doc.collectionId}:${doc.documentId}`, delErr);
      }
    }

    // ── Rollback: Clean up uploaded files ───────────────────
    for (const key of uploadedR2Keys) {
      try {
        await r2Client.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key })
        );
      } catch {}
    }

    return {
      success: false,
      studentId: '',
      studentDocId: '',
      admissionNo: '',
      enrollmentIds: [],
      receiptNo: '',
      error: err.message || 'ভর্তি প্রক্রিয়ায় সমস্যা হয়েছে',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// DATA FETCHING ACTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Fetch all active departments
 */
export async function getDepartments(): Promise<{
  success: boolean;
  departments: DepartmentDoc[];
  error?: string;
}> {
  try {
    const cached = getCachedReference<DepartmentDoc[]>('departments');
    if (cached) {
      return { success: true, departments: cached };
    }
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DEPARTMENTS
    );
    const data = JSON.parse(JSON.stringify(response.documents)) as unknown as DepartmentDoc[];
    setCachedReference('departments', data);
    return {
      success: true,
      departments: data,
    };
  } catch (err: any) {
    console.error('[Appwrite Error] Fetching departments:', err);
    return { success: false, departments: [], error: err.message };
  }
}

/**
 * Fetch classes filtered by department
 */
export async function getClassesByDepartment(
  departmentId: string
): Promise<{
  success: boolean;
  classes: ClassDoc[];
  error?: string;
}> {
  try {
    const { databases } = await createAdminClient();
    console.log('[Appwrite] Fetching classes for dept:', departmentId);
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CLASSES,
      [
        Query.equal('departmentId', departmentId),
        Query.orderAsc('level'),
      ]
    );
    console.log('[Appwrite] Found classes:', response.total);
    return {
      success: true,
      classes: JSON.parse(JSON.stringify(response.documents)) as unknown as ClassDoc[],
    };
  } catch (err: any) {
    console.error('[Appwrite Error] Fetching classes:', err);
    return { success: false, classes: [], error: err.message };
  }
}

/**
 * Fetch all active fee types
 */
export async function getFeeTypes(): Promise<{
  success: boolean;
  feeTypes: FeeTypeDoc[];
  error?: string;
}> {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      [Query.equal('isActive', true), Query.orderAsc('feeCode')]
    );
    return {
      success: true,
      feeTypes: JSON.parse(JSON.stringify(response.documents)) as unknown as FeeTypeDoc[],
    };
  } catch (err: any) {
    console.error('Error fetching fee types:', err);
    return { success: false, feeTypes: [], error: err.message };
  }
}

/**
 * Fetch fee types applicable to a specific department and boarding type
 */
export async function getAdmissionFees(
  departmentIdOrCode: string,
  boardingTypeIdOrName: string,
  classId?: string
): Promise<{
  success: boolean;
  fees: FeeItemData[];
  error?: string;
}> {
  try {
    const { databases } = await createAdminClient();
    
    // 1. Resolve Department ID to Code if necessary
    let deptCode = departmentIdOrCode;
    try {
      if (departmentIdOrCode && departmentIdOrCode.length > 10) { // Likely an Appwrite ID
        const dept = await databases.getDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, departmentIdOrCode);
        if (dept && dept.code) deptCode = dept.code;
      }
    } catch (e) {
      // Keep original value if not found
    }

    // 2. Resolve Boarding Type ID to Name/Code if necessary
    let boardValue = boardingTypeIdOrName;
    try {
      if (boardingTypeIdOrName && boardingTypeIdOrName.length > 10) { // Likely an Appwrite ID
        const board = await databases.getDocument(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, boardingTypeIdOrName);
        if (board) boardValue = board.name || board.$id;
      }
    } catch (e) {
      // Keep original value
    }

    // 3. Fetch all active fee types
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      [
        Query.equal('isActive', true),
        Query.limit(100),
      ]
    );

    const allFeeTypes = JSON.parse(JSON.stringify(response.documents)) as unknown as any[];

    const fees: FeeItemData[] = allFeeTypes
      .filter((ft) => {
        // Basic visibility check
        if (!ft.isActive) return false;
        
        // Match only admission or monthly or flagged for admission form
        const isCorrectCategory = 
          ft.category === 'admission' || 
          ft.feeCategory === 'admission' || 
          ft.showInAdmissionForm === true || 
          ft.category === 'monthly' || 
          ft.feeCategory === 'monthly';
          
        if (!isCorrectCategory) return false;

        // 4. Department Filter (Matches against ID or Code)
        const deptList = ft.departmentIds || [];
        if (deptList.length > 0) {
          const matchesDept = deptList.some((d: string) => 
            d === departmentIdOrCode || 
            d.toLowerCase() === departmentIdOrCode.toLowerCase() ||
            d === deptCode || 
            d.toLowerCase() === deptCode.toLowerCase()
          );
          if (!matchesDept) return false;
        }

        // 5. Boarding Type Filter (Matches against ID or Name)
        const boardList = ft.boardingTypes || [];
        if (boardList.length > 0) {
          const matchesBoard = boardList.some((b: string) => 
            b === boardingTypeIdOrName || 
            b.toLowerCase() === boardingTypeIdOrName.toLowerCase() ||
            b === boardValue ||
            b.toLowerCase() === boardValue.toLowerCase()
          );
          if (!matchesBoard) return false;
        }

        return true;
      })
      .map((ft) => ({
        feeTypeCode: ft.code || ft.$id,
        feeTypeName: ft.nameBn || ft.name,
        amount: ft.defaultAmount || 0,
        originalAmount: ft.defaultAmount || 0,
        isRequired: ft.isRequired ?? true,
        isIncluded: ft.isRequired ?? true,
        isEdited: false,
        departmentCode: deptCode,
        discount: 0,
        billingCycle: ft.billingCycle || 'one-time',
      }));

    return { success: true, fees };
  } catch (err: any) {
    console.error('Error fetching admission fees:', err);
    return { success: false, fees: [], error: err.message };
  }
}

/**
 * Get a single student by document ID
 */
export async function getStudentById(docId: string) {
  try {
    const { databases } = await createAdminClient();
    const student = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      docId
    );
    return { success: true, student: JSON.parse(JSON.stringify(student)) };
  } catch (err: any) {
    console.error('Error fetching student:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get student enrollments
 */
export async function getStudentEnrollments(studentId: string) {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      [
        Query.equal('studentId', studentId),
        Query.equal('status', 'active'),
        Query.orderDesc('enrolledAt'),
      ]
    );
    return { success: true, enrollments: JSON.parse(JSON.stringify(response.documents)) };
  } catch (err: any) {
    console.error('Error fetching enrollments:', err);
    return { success: false, enrollments: [], error: err.message };
  }
}

/**
 * Fetch all active sessions
 */
export async function getSessions(): Promise<{
  success: boolean;
  sessions: any[];
  error?: string;
}> {
  try {
    const cached = getCachedReference<any[]>('sessions');
    if (cached) {
      return { success: true, sessions: cached };
    }
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SESSIONS
    );
    const data = JSON.parse(JSON.stringify(response.documents));
    setCachedReference('sessions', data);
    return {
      success: true,
      sessions: data,
    };
  } catch (err: any) {
    console.error('[Appwrite Error] Fetching sessions:', err);
    return { success: false, sessions: [], error: err.message };
  }
}

/**
 * Fetch all active sections
 */
export async function getSections(): Promise<{
  success: boolean;
  sections: any[];
  error?: string;
}> {
  try {
    const cached = getCachedReference<any[]>('sections');
    if (cached) {
      return { success: true, sections: cached };
    }
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SECTIONS
    );
    const data = JSON.parse(JSON.stringify(response.documents));
    setCachedReference('sections', data);
    return {
      success: true,
      sections: data,
    };
  } catch (err: any) {
    console.error('[Appwrite Error] Fetching sections:', err);
    return { success: false, sections: [], error: err.message };
  }
}
/**
 * Fetch all active boarding types
 */
export async function getBoardingTypes(): Promise<{
  success: boolean;
  boardingTypes: any[];
  error?: string;
}> {
  try {
    const cached = getCachedReference<any[]>('boardingTypes');
    if (cached) {
      return { success: true, boardingTypes: cached };
    }
    const { databases } = await createAdminClient();
    if (!COLLECTIONS.BOARDING_TYPES) return { success: true, boardingTypes: [] };
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOARDING_TYPES,
      [Query.equal('isActive', true)]
    );
    const data = JSON.parse(JSON.stringify(response.documents));
    setCachedReference('boardingTypes', data);
    return {
      success: true,
      boardingTypes: data,
    };
  } catch (err: any) {
    console.error('[Appwrite Error] Fetching boarding types:', err);
    return { success: false, boardingTypes: [], error: err.message };
  }
}

/**
 * Fetch all boarding types (including inactive)
 */
export async function getAllBoardingTypes() {
  try {
    const { databases } = await createAdminClient();
    if (!COLLECTIONS.BOARDING_TYPES) return { success: true, boardingTypes: [] };
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOARDING_TYPES,
      [Query.orderAsc('order')]
    );
    return {
      success: true,
      boardingTypes: JSON.parse(JSON.stringify(response.documents)),
    };
  } catch (err: any) {
    return { success: false, boardingTypes: [], error: err.message };
  }
}

/**
 * Create or update a boarding type
 */
export async function upsertBoardingType(data: {
  name: string;
  nameBn: string;
  order: number;
  monthlyFee: number;
  isActive: boolean;
  docId?: string;
}) {
  try {
    const { databases } = await createAdminClient();
    
    const payload = {
      name: data.name,
      nameBn: data.nameBn,
      order: Number(data.order),
      monthlyFee: Number(data.monthlyFee || 0),
      isActive: data.isActive,
    };

    if (data.docId) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BOARDING_TYPES,
        data.docId,
        payload
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BOARDING_TYPES,
        ID.unique(),
        payload
      );
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a boarding type
 */
export async function deleteBoardingType(docId: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.BOARDING_TYPES,
      docId
    );
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Create or update a Fee Type
 */
export async function upsertFeeType(data: {
  feeCode: string;
  feeName: string;
  feeNameBn: string;
  feeCategory: 'admission' | 'monthly' | 'exam' | 'other';
  defaultAmount: number;
  isRequired: boolean;
  isActive: boolean;
  showInAdmissionForm: boolean;
  applicableDepartments: string[];
  applicableBoardingTypes: string[];
  docId?: string;
}) {
  try {
    const { databases } = await createAdminClient();
    
    const payload = {
      code: data.feeCode,
      name: data.feeName,
      nameBn: data.feeNameBn,
      category: data.feeCategory,
      defaultAmount: Number(data.defaultAmount),
      isRequired: data.isRequired,
      isActive: data.isActive,
      showInAdmissionForm: data.showInAdmissionForm,
      departmentIds: data.applicableDepartments,
      boardingTypes: data.applicableBoardingTypes,
      billingCycle: 'once', 
      applicableTo: 'all',
    };

    if (data.docId) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.FEE_TYPES,
        data.docId,
        payload
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.FEE_TYPES,
        ID.unique(),
        payload
      );
    }
    return { success: true };
  } catch (err: any) {
    console.error('Error upserting fee type:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a Fee Type
 */
export async function deleteFeeType(docId: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      docId
    );
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all Fee Types (Admin view)
 */
export async function getAllFeeTypes() {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      [Query.orderAsc('code')]
    );
    return {
      success: true,
      feeTypes: JSON.parse(JSON.stringify(response.documents)),
    };
  } catch (err: any) {
    return { success: false, feeTypes: [], error: err.message };
  }
}
/**
 * Fetch EVERYTHING related to an admission for the success page
 */
export async function getAdmissionFullDetails(idOrBusId: string) {
  try {
    const { databases } = await createAdminClient();
    
    let student: any = null;

    // ── 1. Try internal Appwrite ID first ─────────────────────
    try {
      student = await databases.getDocument(DATABASE_ID, COLLECTIONS.STUDENTS, idOrBusId);
    } catch {
      // ── 2. Fallback to Business ID (MII-...) ───────────────
      const studentResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENTS,
        [Query.equal('studentId', idOrBusId), Query.limit(1)]
      );

      if (studentResponse.total > 0) {
        student = studentResponse.documents[0];
      }
    }

    if (!student) {
      return { success: false, error: 'ছাত্রের তথ্য পাওয়া যায়নি' };
    }

    const studentDocId = student.$id;

    // 2. Get Enrollments with metadata
    const enrollmentsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      [Query.equal('studentId', studentDocId)]
    );

    const enrollmentDocs = await Promise.all(
      enrollmentsResponse.documents.map(async (enr: any) => {
        try {
          const dept = await databases.getDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, enr.departmentId);
          const cls = await databases.getDocument(DATABASE_ID, COLLECTIONS.CLASSES, enr.classId);
          
          const BOARDING_TYPE_NAMES: Record<string, string> = {
            day: 'অনাবাসিক (ডে)',
            non_residential: 'অনাবাসিক',
            residential: 'আবাসিক',
            boarding: 'আবাসিক',
            semi_residential: 'অর্ধ-আবাসিক',
            day_care: 'ডে-কেয়ার',
          };

          let boardingTypeName = enr.boardingType || '---';
          if (enr.boardingType) {
            const staticName = BOARDING_TYPE_NAMES[enr.boardingType.toLowerCase()];
            if (staticName) {
              boardingTypeName = staticName;
            } else {
              try {
                if (enr.boardingType.length > 10) {
                  const bt = await databases.getDocument(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, enr.boardingType);
                  boardingTypeName = bt.nameBn || bt.name || enr.boardingType;
                } else {
                  const list = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, [
                    Query.equal('code', enr.boardingType),
                    Query.limit(1)
                  ]);
                  if (list.documents.length > 0) {
                    boardingTypeName = list.documents[0].nameBn || list.documents[0].name;
                  }
                }
              } catch {
                // Non-fatal fallback
              }
            }
          }

          return {
            ...enr,
            departmentName: dept.nameBn || dept.name,
            departmentCode: dept.code,
            className: cls.nameBn || cls.name,
            boardingTypeName: boardingTypeName,
          };
        } catch {
          return enr;
        }
      })
    );

    // 3. Get Invoice (Admission type)
    const invoiceResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_INVOICES,
      [Query.equal('studentId', studentDocId), Query.equal('invoiceType', 'admission'), Query.orderDesc('$createdAt'), Query.limit(1)]
    );

    // 4. Get Payment (for receipt number)
    const paymentResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_PAYMENTS,
      [Query.equal('studentId', studentDocId), Query.orderDesc('$createdAt'), Query.limit(1)]
    );

    const invoice = invoiceResponse.documents[0];
    const payment = paymentResponse.documents[0];

    return {
      success: true,
      data: {
        student: JSON.parse(JSON.stringify(student)),
        studentDocId: student.$id,
        enrollments: JSON.parse(JSON.stringify(enrollmentDocs)),
        invoice: invoice ? JSON.parse(JSON.stringify(invoice)) : null,
        payment: payment ? JSON.parse(JSON.stringify(payment)) : null,
      }
    };
  } catch (err: any) {
    console.error('Error fetching full admission details:', err);
    return { success: false, error: err.message };
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * UPDATE: updateStudentAdmission()
 * মানযিল ইনস্টিটিউট — শিক্ষার্থীর তথ্য আপডেট সার্ভার অ্যাকশন
 * ═══════════════════════════════════════════════════════════════
 */
export async function updateStudentAdmission(
  docId: string,
  payload: AdmissionFormValues
): Promise<{ success: boolean; student?: any; error?: string }> {
  try {
    const { personal: step1, contact: step2, enrollment: step3, documents } = payload;
    const { databases } = await createAdminClient();

    // 1. Resolve folder name for R2 uploads
    const folderBaseName = step1.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const folderId = step1.identificationNo || docId.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const folderName = `${folderBaseName}-${folderId}`;

    // 2. Helper: extract R2 key from a public URL
    const getR2KeyFromUrl = (url: string | undefined): string | null => {
      if (!url || !url.startsWith('http')) return null;
      try {
        const urlObj = new URL(url);
        // Strip leading slash
        return urlObj.pathname.replace(/^\//, '');
      } catch {
        return null;
      }
    };

    // Helper: delete a file from R2 by its public URL (non-fatal)
    const deleteR2FileByUrl = async (url: string | undefined) => {
      if (!url) return;
      const key = getR2KeyFromUrl(url);
      if (!key) return;
      try {
        await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      } catch (e) {
        console.warn('R2 delete failed (non-fatal):', key, e);
      }
    };

    // Helper to handle uploads: 
    //   - newVal is base64 → upload to R2, then delete old URL from R2
    //   - newVal is an existing URL or empty → keep it (use as-is or fallback to currentUrl)
    //   - newVal is explicitly undefined/null → keep currentUrl (no change intended)
    const handleFileUpload = async (
      currentUrl: string | undefined,
      newVal: string | undefined,
      fileName: string
    ): Promise<string> => {
      // No new value at all — keep existing
      if (newVal === undefined || newVal === null) return currentUrl || '';
      // New value is an existing URL (not base64) — user kept/changed URL directly
      if (newVal && !newVal.startsWith('data:')) return newVal;
      // New value is base64 — upload it
      if (newVal.startsWith('data:')) {
        const uploadedUrl = await uploadStudentFile(newVal, folderName, fileName);
        if (uploadedUrl) {
          // Delete the old file from R2 if it's different
          if (currentUrl && currentUrl !== uploadedUrl) {
            await deleteR2FileByUrl(currentUrl);
          }
          return uploadedUrl;
        }
        // Upload failed — keep existing
        return currentUrl || '';
      }
      // Empty string — user cleared the field
      return '';
    };

    // Fetch current student to get existing file URLs for fallback/cleanup
    let existingStudent: any = {};
    try {
      existingStudent = await databases.getDocument(DATABASE_ID, COLLECTIONS.STUDENTS, docId);
    } catch (e) {
      console.warn('Could not fetch existing student for file fallback:', e);
    }

    const existingPhotoUrl         = existingStudent.photo               || '';
    const existingDocFrontUrl      = existingStudent.studentDocFrontUrl  || '';
    const existingDocBackUrl       = existingStudent.studentDocBackUrl   || '';
    const existingFatherNidFront   = existingStudent.fatherNidFrontUrl   || '';
    const existingFatherNidBack    = existingStudent.fatherNidBackUrl    || '';
    const existingMotherNidFront   = existingStudent.motherNidFrontUrl   || '';
    const existingMotherNidBack    = existingStudent.motherNidBackUrl    || '';
    const existingTransferCert     = existingStudent.transferCertificateUrl || '';

    const photoUrl              = await handleFileUpload(existingPhotoUrl,       documents?.studentPhoto || step1.photoBase64,  'profile-photo');
    const studentDocFrontUrl    = await handleFileUpload(existingDocFrontUrl,    documents?.studentDocFront,                    'birth-certificate-front');
    const studentDocBackUrl     = await handleFileUpload(existingDocBackUrl,     documents?.studentDocBack,                     'birth-certificate-back');
    const fatherNidFrontUrl     = await handleFileUpload(existingFatherNidFront, documents?.fatherNidFront,                     'father-nid-front');
    const fatherNidBackUrl      = await handleFileUpload(existingFatherNidBack,  documents?.fatherNidBack,                      'father-nid-back');
    const motherNidFrontUrl     = await handleFileUpload(existingMotherNidFront, documents?.motherNidFront,                     'mother-nid-front');
    const motherNidBackUrl      = await handleFileUpload(existingMotherNidBack,  documents?.motherNidBack,                      'mother-nid-back');
    const transferCertificateUrl = await handleFileUpload(existingTransferCert,  documents?.transferCertificate,                'transfer-certificate');

    // Handle Additional Documents (Loop through array)
    const processedDocs: string[] = [];
    if (documents?.additionalDocuments && Array.isArray(documents.additionalDocuments)) {
      const existingAdditional: string[] = Array.isArray(existingStudent.additionalDocuments)
        ? existingStudent.additionalDocuments.map((d: any) => String(d))
        : [];
      for (let i = 0; i < documents.additionalDocuments.length; i++) {
        const item = documents.additionalDocuments[i];
        if (item) {
          const url = await handleFileUpload(existingAdditional[i], item, `additional-doc-${i}`);
          if (url) processedDocs.push(url);
        }
      }
    }

    // 3. Flatten and Map Data for Appwrite
    const updateData: any = {
      // Personal
      nameEn: step1.nameEn,
      nameBn: step1.nameBn,
      nameAr: step1.nameAr || '',
      fatherNameBn: step1.fatherNameBn,
      fatherNameEn: step1.fatherNameEn || '',
      motherNameBn: step1.motherNameBn,
      motherNameEn: step1.motherNameEn || '',
      fatherOccupation: step1.fatherOccupation || '',
      fatherWorkplace: step1.fatherWorkplace || '',
      motherOccupation: step1.motherOccupation || '',
      motherWorkplace: step1.motherWorkplace || '',
      dateOfBirth: step1.dateOfBirth ? new Date(step1.dateOfBirth).toISOString() : undefined,
      gender: step1.gender,
      bloodGroup: step1.bloodGroup || 'unknown',
      nationality: step1.nationality || 'বাংলাদেশী',
      religion: step1.religion,
      identificationNo: step1.identificationNo || '',
      identificationType: step1.identificationType || 'bc',
      isHafiz: step1.isHafiz || false,
      status: step1.status || 'active',
      photo: photoUrl,
      transferCertificateUrl: transferCertificateUrl,

      // Applicant Info
      applicantRelation: step1.applicantRelation || '',
      applicantName: (step1.applicantRelation === 'father' || step1.applicantRelation === 'mother') ? '' : (step1.applicantName || ''),
      applicantPhone: (step1.applicantRelation === 'father' || step1.applicantRelation === 'mother') ? '' : (step1.applicantPhone || ''),

      // Docs
      studentDocFrontUrl,
      studentDocBackUrl,
      fatherNidFrontUrl,
      fatherNidBackUrl,
      motherNidFrontUrl,
      motherNidBackUrl,
      additionalDocuments: processedDocs,

      // Contact
      guardianPhone: step2.guardianPhone,
      phonePrimary: step2.phonePrimary || '',
      whatsappNo: step2.whatsappNo || '',
      email: step2.email || '',

      // Address Fields
      presentVillage: step2.presentAddress?.village || '',
      presentPostOffice: step2.presentAddress?.postOffice || '',
      presentUnion: step2.presentAddress?.union || '',
      presentThana: step2.presentAddress?.thana || '',
      presentDistrict: step2.presentAddress?.district || '',
      presentDivision: step2.presentAddress?.division || '',
      presentPostCode: Number(step2.presentAddress?.postCode || 0),

      permanentVillage: (step2.permanentSameAsCurrent ? step2.presentAddress?.village : step2.permanentAddress?.village) || '',
      permanentPostOffice: (step2.permanentSameAsCurrent ? step2.presentAddress?.postOffice : step2.permanentAddress?.postOffice) || '',
      permanentUnion: (step2.permanentSameAsCurrent ? step2.presentAddress?.union : step2.permanentAddress?.union) || '',
      permanentThana: (step2.permanentSameAsCurrent ? step2.presentAddress?.thana : step2.permanentAddress?.thana) || '',
      permanentDistrict: (step2.permanentSameAsCurrent ? step2.presentAddress?.district : step2.permanentAddress?.district) || '',
      permanentDivision: (step2.permanentSameAsCurrent ? step2.presentAddress?.division : step2.permanentAddress?.division) || '',
      permanentPostCode: Number((step2.permanentSameAsCurrent ? step2.presentAddress?.postCode : step2.permanentAddress?.postCode) || 0),

      // Academic
      previousSchoolName: step3.previousSchoolName || '',
      previousSchoolAddress: step3.previousSchoolAddress || '',
      previousClassName: step3.previousClassName || '',
      previousResult: step3.previousResult || '',
      admissionTestMarks: step3.admissionTestMarks || '',
      admissionTestResult: step3.admissionTestResult || 'passed',
      admissionTestRemarks: step3.admissionTestRemarks || '',
      examinerName: step3.examinerName || '',
      admissionDate: step3.admissionDate ? new Date(step3.admissionDate).toISOString() : undefined,
      notes: step3.notes || '',
    };

    // 4. Perform Update in Appwrite (Student Profile)
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      docId,
      updateData
    );

    // 5. Update Enrollment Records
    if (step3.enrollments && Array.isArray(step3.enrollments)) {
      for (const enr of step3.enrollments) {
        if (enr.enrollmentDocId) {
          try {
            await databases.updateDocument(
              DATABASE_ID,
              COLLECTIONS.STUDENT_ENROLLMENTS,
              enr.enrollmentDocId,
              {
                departmentId: enr.departmentId,
                classId: enr.classId,
                section: enr.section || '',
                session: enr.session,
                shift: enr.shift || 'day',
                monthlyFee: Number(enr.monthlyFee || 0),
                rollNo: enr.rollNo || '',
                boardingType: step3.boardingType, // Shared/Global field
                hallId: step3.hallId || '',
                hallName: step3.hallName || '',
              }
            );
          } catch (e) {
            console.error('Error updating enrollment:', enr.enrollmentDocId, e);
          }
        } else if (enr.departmentId && enr.classId) {
           // New enrollment added during update
           try {
             const newEnrollmentId = await generateSequentialId(
               databases,
               COLLECTIONS.STUDENT_ENROLLMENTS,
               'enrollmentId',
               'ENR',
               4
             );
             await databases.createDocument(
               DATABASE_ID,
               COLLECTIONS.STUDENT_ENROLLMENTS,
               ID.unique(),
               {
                 enrollmentId: newEnrollmentId,
                 studentId: docId,
                 departmentId: enr.departmentId,
                 classId: enr.classId,
                 section: enr.section || '',
                 session: enr.session,
                 shift: enr.shift || 'day',
                 monthlyFee: Number(enr.monthlyFee || 0),
                 rollNo: enr.rollNo || '',
                 boardingType: step3.boardingType,
                 hallId: step3.hallId || '',
                 hallName: step3.hallName || '',
                 status: 'active',
                 enrollmentDate: new Date().toISOString(),
               }
             );
           } catch (e) {
             console.error('Error creating new enrollment during update:', e);
           }
        }
      }
    }

    try {
      revalidatePath('/dashboard/admin/students');
      revalidatePath('/dashboard/admin/students/admission');
    } catch (e) {
      // Non-fatal if cache revalidation fails
    }

    return {
      success: true,
      student: JSON.parse(JSON.stringify(response)),
    };
  } catch (err: any) {
    console.error('Update student admission failed:', err);
    return { success: false, error: err.message || 'আপডেট প্রক্রিয়ায় সমস্যা হয়েছে' };
  }
}
