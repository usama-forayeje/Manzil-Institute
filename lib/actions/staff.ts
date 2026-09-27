'use server';

import { ID, Query } from 'node-appwrite';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS, BUCKETS } from '@/config/appwrite';
import {
  r2Client,
  validateR2Config,
  buildR2Key,
  buildR2Url,
  R2_BUCKET,
} from '@/config/r2';
import { normalizeGender } from '@/lib/utils';
import type { FullStaffData } from '@/validations/staff';

async function generateStaffId(databases: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `STF-${year}-`;

  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    [
      Query.startsWith('staffId', prefix),
      Query.orderDesc('staffId'),
      Query.limit(1),
    ]
  );

  let nextNumber = 1;
  if (existing.total > 0) {
    const lastId = existing.documents[0].staffId as string;
    const lastNum = parseInt(lastId.split('-')[2] ?? '0', 10);
    nextNumber = lastNum + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, '0')}`;
}

function buildFileId(
  rawName: string,
  staffId: string,
  type: string,
  index?: number
): string {
  const name = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 12);

  const sId = staffId.toLowerCase().replace(/-/g, '');

  const suffix = index !== undefined ? `_${index}` : '';
  const ext =
    {
      profile: 'jpg',
      nid_front: 'jpg',
      nid_back: 'jpg',
      cv: 'pdf',
      exp_letter: 'pdf',
      tazkiyah: 'pdf',
      certificate: 'jpg',
    }[type] ?? 'jpg';

  return `${name}_${sId}/${type}${suffix}.${ext}`;
}

async function uploadFile(
  folder: string,
  source: File | string,
  fileId: string
): Promise<string> {
  const r2Validation = validateR2Config();
  if (!r2Validation.valid) {
    return '';
  }

  const r2Key = buildR2Key(folder, fileId);
  const bucketName = R2_BUCKET;

  let fileToUpload: Uint8Array | File;
  let contentType: string = 'application/octet-stream';
  let originalName: string = fileId;

  if (typeof source === 'string') {
    if (!source.startsWith('data:')) return '';

    const [meta, base64Data] = source.split(',');
    if (!base64Data) return '';

    contentType = meta.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
    try {
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      fileToUpload = bytes;
      originalName = `${fileId}.${contentType.split('/')[1] ?? 'jpg'}`;
    } catch {
      return '';
    }
  } else {
    fileToUpload = source;
    contentType = source.type;
    originalName = source.name;
  }

  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
      Body: fileToUpload,
      ContentType: contentType,
      ContentDisposition: `inline; filename="${originalName}"`,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        originalName: originalName,
      },
    });

    await r2Client.send(uploadCommand);
    return buildR2Url(folder, fileId);
  } catch {
    return '';
  }
}

export async function createStaff(
  formData: FullStaffData & {
    photoFile?: File;
    nidFrontCopyFile?: File;
    nidBackCopyFile?: File;
    certificateFiles?: File[];
    experienceLetterFile?: File;
    cvFile?: File;
    tazkiyahFile?: File;
    signatureFile?: File;
  }
): Promise<{ staffId: string; success: true }> {
  const { databases } = await createAdminClient();

  const staffId = await generateStaffId(databases);

  const rawName = formData.nameEn || formData.nameBn || 'user';
  const fid = (type: string, index?: number) =>
    buildFileId(rawName, staffId, type, index);

  let photoUrl = '';
  const photoSource = formData.photoFile ?? (formData as any).photoBase64;
  if (
    photoSource &&
    (photoSource instanceof File || typeof photoSource === 'string')
  ) {
    photoUrl = await uploadFile(
      BUCKETS.STAFF_PHOTOS,
      photoSource,
      fid('profile')
    );
  }

  let nidFrontCopyUrl = '';
  const nidFrontSource =
    formData.nidFrontCopyFile ?? (formData as any).nidFrontBase64;
  if (
    nidFrontSource &&
    (nidFrontSource instanceof File || typeof nidFrontSource === 'string')
  ) {
    nidFrontCopyUrl = await uploadFile(
      BUCKETS.DOCUMENTS,
      nidFrontSource,
      fid('nid_front')
    );
  }

  let nidBackCopyUrl = '';
  const nidBackSource =
    formData.nidBackCopyFile ?? (formData as any).nidBackBase64;
  if (
    nidBackSource &&
    (nidBackSource instanceof File || typeof nidBackSource === 'string')
  ) {
    nidBackCopyUrl = await uploadFile(
      BUCKETS.DOCUMENTS,
      nidBackSource,
      fid('nid_back')
    );
  }

  const certificateUrls: string[] = [];
  if (Array.isArray(formData.certificateFiles)) {
    for (let i = 0; i < formData.certificateFiles.length; i++) {
      const file = formData.certificateFiles[i];
      if (file && (file instanceof File || typeof file === 'string')) {
        const url = await uploadFile(
          BUCKETS.DOCUMENTS,
          file,
          fid('certificate', i)
        );
        if (url) certificateUrls.push(url);
      }
    }
  }

  let experienceLetterUrl = '';
  const expLetterSource =
    formData.experienceLetterFile ?? (formData as any).experienceLetterUrl;
  if (
    expLetterSource &&
    typeof expLetterSource === 'string' &&
    expLetterSource.startsWith('data:')
  ) {
    experienceLetterUrl = await uploadFile(
      BUCKETS.DOCUMENTS,
      expLetterSource,
      fid('exp_letter')
    );
  } else if (expLetterSource instanceof File) {
    experienceLetterUrl = await uploadFile(
      BUCKETS.DOCUMENTS,
      expLetterSource,
      fid('exp_letter')
    );
  }

  let cvUrl = '';
  const cvSource = formData.cvFile ?? (formData as any).cvUrl;
  if (
    cvSource &&
    typeof cvSource === 'string' &&
    cvSource.startsWith('data:')
  ) {
    cvUrl = await uploadFile(BUCKETS.DOCUMENTS, cvSource, fid('cv'));
  } else if (cvSource instanceof File) {
    cvUrl = await uploadFile(BUCKETS.DOCUMENTS, cvSource, fid('cv'));
  }

  let signatureUrl = '';
  const signatureSource = formData.signatureFile;
  if (
    signatureSource &&
    typeof signatureSource === 'string' &&
    signatureSource.startsWith('data:')
  ) {
    signatureUrl = await uploadFile(
      BUCKETS.DOCUMENTS,
      signatureSource,
      fid('signature')
    );
  } else if (signatureSource instanceof File) {
    signatureUrl = await uploadFile(
      BUCKETS.DOCUMENTS,
      signatureSource,
      fid('signature')
    );
  }

  const currentAddr = formData.currentAddress;
  const permanentAddr = formData.permanentSameAsCurrent
    ? currentAddr
    : (formData.permanentAddress ?? currentAddr);

  const currentAddressStr = [
    currentAddr.village,
    currentAddr.postOffice,
    currentAddr.thana,
    currentAddr.district,
    currentAddr.division,
  ]
    .filter(Boolean)
    .join(', ');

  const permanentAddressStr = [
    permanentAddr.village,
    permanentAddr.postOffice,
    permanentAddr.thana,
    permanentAddr.district,
    permanentAddr.division,
  ]
    .filter(Boolean)
    .join(', ');

  await databases.createDocument(DATABASE_ID, COLLECTIONS.STAFF, ID.unique(), {
    staffId,
    userId: '',
    name: formData.nameBn || formData.nameEn,
    nameEn: formData.nameEn,
    nameBn: formData.nameBn,
    fatherNameBn: formData.fatherNameBn,
    fatherNameEn: formData.fatherNameEn,
    motherNameBn: formData.motherNameBn,
    motherNameEn: formData.motherNameEn,
    designation: formData.designationCustom || formData.designation,
    department: (formData as any).department ?? '',
    joiningDate: formData.expectedJoiningDate
      ? new Date(formData.expectedJoiningDate).toISOString()
      : new Date().toISOString(),
    expectedJoiningDate: formData.expectedJoiningDate,
    expectedSalary: formData.expectedSalary,
    salary: formData.expectedSalary,
    employmentType: formData.employmentType,
    phone: formData.phonePrimary,
    phoneSecondary: formData.phoneSecondary ?? '',
    email: formData.email ?? '',
    address: currentAddressStr,
    permanentAddress: permanentAddressStr,
    nidNumber: formData.nidNumber,
    dateOfBirth: new Date(formData.dateOfBirth ?? '').toISOString(),
    gender:
      normalizeGender(formData.gender) ??
      (() => {
        console.error('❌ GENDER NORMALIZATION FAILED in createStaff:', {
          raw: formData.gender,
          type: typeof formData.gender,
        });
        throw new Error('Gender is required and must be male or female');
      })(),
    maritalStatus: formData.maritalStatus,
    religion: formData.religion,
    nationality: formData.nationality ?? 'বাংলাদেশী',
    bloodGroup: formData.bloodGroup ?? 'unknown',
    emergencyContactNo: formData.emergencyContactNo,
    emergencyRelationship: formData.emergencyRelationship,
    photo: photoUrl,
    nfcCardId: '',
    isActive: true,
    education: JSON.stringify(formData.education ?? []),
    socialLinks: JSON.stringify(formData.socialLinks ?? {}),
    previousWorkplace: formData.previousWorkplace ?? '',
    previousWorkDuration: formData.previousWorkDuration ?? '',
    totalExperienceYears: formData.totalExperienceYears ?? 0,
    isHafiz: formData.isHafiz ?? false,
    specialSkills: formData.specialSkills ?? '',
    nidFrontCopyUrl,
    nidBackCopyUrl,
    certificateUrls: JSON.stringify(certificateUrls),
    experienceLetterUrl,
    cvUrl,
    signatureUrl,
    paymentMethod: formData.paymentMethod,
    bankName: formData.bankName || '',
    bankBranch: formData.bankBranch || '',
    accountName: formData.accountName || '',
    accountNumber: formData.accountNumber || '',
    mobileBankingProvider: formData.mobileBankingProvider || '',
    mobileBankingNumber: formData.mobileBankingNumber || '',
    referenceName: formData.referenceName,
    referencePhone: formData.referencePhone,
    referenceOccupation: formData.referenceOccupation,
    declaration: formData.declaration,
    createdAt: new Date().toISOString(),
  });

  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId: 'public_form',
        userEmail: formData.email ?? 'public',
        userRole: 'public',
        action: 'STAFF_REGISTERED',
        targetType: 'staff',
        targetId: staffId,
        targetName: formData.nameBn || formData.nameEn,
        oldValue: null,
        newValue: JSON.stringify({
          staffId,
          designation: formData.designation,
        }),
        ipAddress: '',
        userAgent: '',
        createdAt: new Date().toISOString(),
      }
    );
  } catch {}

  return { staffId, success: true };
}

export async function getStaffList({
  search,
  limit = 25,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const { databases } = await createAdminClient();

  const queries = [
    Query.equal('isActive', true),
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc('createdAt'),
  ];

  if (search) {
    queries.push(Query.search('name', search));
  }

  return databases.listDocuments(DATABASE_ID, COLLECTIONS.STAFF, queries);
}

export async function getStaffById(staffId: string) {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STAFF, [
    Query.equal('staffId', staffId),
    Query.limit(1),
  ]);

  return result.documents[0] ?? null;
}

export async function toggleStaffActive(documentId: string, isActive: boolean) {
  const { databases } = await createAdminClient();

  return databases.updateDocument(DATABASE_ID, COLLECTIONS.STAFF, documentId, {
    isActive,
  });
}
