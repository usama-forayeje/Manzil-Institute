'use server';

import { ID, Query } from 'node-appwrite';
import {
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { createAdminClient } from '@/lib/appwrite/admin';
import {
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS,
  FILE_LIMITS,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_DOC_TYPES,
} from '@/config/appwrite';
import {
  r2Client,
  validateR2Config,
  buildR2Key,
  buildR2Url,
  R2_BUCKET,
} from '@/config/r2';
import { convertBengaliToEnglish, normalizeGender } from '@/lib/utils';
import type { FullStaffData } from '@/validations/staff';

interface UploadResult {
  url: string;
  fileId: string;
}

function validateFile(
  file: File,
  type: 'photo' | 'document'
): { valid: boolean; error?: string } {
  const maxSize = type === 'photo' ? FILE_LIMITS.PHOTO : FILE_LIMITS.DOCUMENT;
  const acceptedTypes =
    type === 'photo' ? ACCEPTED_IMAGE_TYPES : ACCEPTED_DOC_TYPES;
  const maxMB = Math.round(maxSize / (1024 * 1024));

  if (file.size === 0)
    return {
      valid: false,
      error: `"${file.name}" ফাইলটি খালি বা ক্ষতিগ্রস্ত।`,
    };
  if (file.size > maxSize)
    return {
      valid: false,
      error: `"${file.name}" এর সাইজ ${maxMB}MB এর বেশি হতে পারবে না।`,
    };
  if (!acceptedTypes.includes(file.type as any))
    return { valid: false, error: `"${file.name}" এর ফরম্যাট গ্রহণযোগ্য নয়।` };

  return { valid: true };
}

const FILE_TYPE_EXTENSIONS: Record<string, string> = {
  profile: 'jpg',
  nid_front: 'jpg',
  nid_back: 'jpg',
  cv: 'pdf',
  exp_letter: 'pdf',
  tazkiyah: 'pdf',
  certificate: 'jpg',
};

function buildFileId(
  rawName: string,
  applicationId: string,
  type: string,
  index?: number
): string {
  const name = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 12);

  const appId = applicationId.toLowerCase().replace(/-/g, '');

  const folder = `${name}_${appId}`;
  const suffix = index !== undefined ? `_${index}` : '';
  const ext = FILE_TYPE_EXTENSIONS[type] ?? 'jpg';

  return `${folder}/${type}${suffix}.${ext}`;
}

export async function uploadFile(
  folder: string,
  source: File | string,
  fileId: string
): Promise<UploadResult | null> {
  const r2Validation = validateR2Config();
  if (!r2Validation.valid) {
    return null;
  }

  const r2Key = buildR2Key(folder, fileId);
  const bucketName = R2_BUCKET;

  let fileToUpload: Uint8Array | File | null = null;
  let contentType: string = 'application/octet-stream';
  let originalName: string = fileId;
  let fileSize: number = 0;

  try {
    if (typeof source === 'string') {
      if (!source.startsWith('data:')) {
        throw new Error("Invalid base64 URL: must start with 'data:'");
      }

      const [meta, base64Data] = source.split(',');
      if (!base64Data) {
        throw new Error(
          `Invalid base64 format for ${fileId}: no comma separator`
        );
      }

      contentType = meta.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
      const extFromMime = contentType.split('/')[1] ?? 'jpg';
      originalName = fileId.includes('.') ? fileId : `${fileId}.${extFromMime}`;

      const binary = atob(base64Data);
      fileToUpload = new Uint8Array(binary.length);
      fileSize = binary.length;
      for (let i = 0; i < binary.length; i++)
        fileToUpload[i] = binary.charCodeAt(i);
    } else if (source instanceof File) {
      // Convert File to Uint8Array to avoid streaming issues
      const arrayBuffer = await source.arrayBuffer();
      fileToUpload = new Uint8Array(arrayBuffer);
      contentType = source.type;
      originalName = source.name;
      fileSize = source.size;
    } else {
      throw new Error(
        `Invalid source type for ${fileId}: expected File or base64 string, got ${typeof source}`
      );
    }

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
      });
      await r2Client.send(headCommand);
      const url = buildR2Url(folder, fileId);
      return { url, fileId: r2Key };
    } catch (headErr: any) {
      if (headErr.name !== 'NotFound' && headErr.name !== 'NoSuchKey') {
        return null;
      }
    }

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
      Body: fileToUpload,
      ContentType: contentType,
      ContentDisposition: `inline; filename="${originalName}"`,
      Metadata: {
        uploadedAt: new Date().toISOString(),
        originalName: originalName,
        fileSize: fileSize.toString(),
      },
    });

    await r2Client.send(uploadCommand);
    const url = buildR2Url(folder, fileId);
    return { url, fileId: r2Key };
  } catch (err: any) {
    throw err;
  }
}

export async function checkDuplicateApplication(
  email?: string,
  phonePrimary?: string,
  nidNumber?: string
): Promise<{ isDuplicate: boolean; existingApplicationId?: string }> {
  const { databases } = await createAdminClient();

  if (nidNumber) {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [
          Query.equal('nidNumber', nidNumber),
          Query.equal('status', 'pending'),
          Query.limit(1),
        ]
      );
      if (res.total > 0)
        return {
          isDuplicate: true,
          existingApplicationId: res.documents[0].applicationId,
        };
    } catch {}
  }

  if (email && email.includes('@')) {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [
          Query.equal('email', email),
          Query.equal('status', 'pending'),
          Query.limit(1),
        ]
      );
      if (res.total > 0)
        return {
          isDuplicate: true,
          existingApplicationId: res.documents[0].applicationId,
        };
    } catch {}
  }

  return { isDuplicate: false };
}

async function generateApplicationId(databases: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MI-${year}-`;

  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    [
      Query.startsWith('applicationId', prefix),
      Query.orderDesc('applicationId'),
      Query.limit(1),
    ]
  );

  const next =
    existing.total > 0
      ? parseInt(
          (existing.documents[0].applicationId as string).split('-')[2] ?? '0',
          10
        ) + 1
      : 1;

  return `${prefix}${String(next).padStart(3, '0')}`;
}

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

  const next =
    existing.total > 0
      ? parseInt(
          (existing.documents[0].staffId as string).split('-')[2] ?? '0',
          10
        ) + 1
      : 1;

  return `${prefix}${String(next).padStart(3, '0')}`;
}

export async function createApplication(
  formData: FullStaffData & {
    photoFile?: File;
    photoBase64?: string;
    nidFrontCopyFile?: File;
    nidFrontBase64?: string;
    nidBackCopyFile?: File;
    nidBackBase64?: string;
    certificateFiles?: File[];
    certificateUrls?: string[];
    experienceLetterFile?: File;
    experienceLetterUrl?: string;
    cvFile?: File;
    cvUrl?: string;
    signatureFile?: File;
    signatureUrl?: string;
  }
): Promise<{ applicationId: string; success: true }> {
  const dup = await checkDuplicateApplication(
    formData.email,
    formData.phonePrimary,
    formData.nidNumber
  );
  if (dup.isDuplicate) {
    throw Object.assign(
      new Error(
        `DUPLICATE_APPLICATION:এই তথ্য দিয়ে ইতিমধ্যে আবেদন জমা আছে। ID: ${dup.existingApplicationId}`
      ),
      { name: 'DuplicateApplicationError' }
    );
  }

  const { databases } = await createAdminClient();
  const applicationId = await generateApplicationId(databases);

  const rawName = formData.nameEn || formData.nameBn || 'user';
  const fid = (type: string, index?: number) =>
    buildFileId(rawName, applicationId, type, index);

  const uploadedIds: string[] = [];

  async function up(
    source: File | string | undefined | null,
    folder: string,
    fileId: string,
    fileType: 'photo' | 'document'
  ): Promise<string> {
    if (!source) {
      return '';
    }

    if (source instanceof File) {
      const v = validateFile(source, fileType);
      if (!v.valid) {
        throw new Error(v.error);
      }
    } else if (typeof source === 'string') {
      if (!source.startsWith('data:')) {
        throw new Error(`Invalid data URL format for ${fileId}`);
      }
      if (source.length > 10 * 1024 * 1024) {
        throw new Error(`${fileId} base64 data too large (>10MB)`);
      }
    }

    const result = await uploadFile(folder, source, fileId);
    if (result) {
      uploadedIds.push(result.fileId);
    }
    return result?.url ?? '';
  }

  let photoUrl = '';
  try {
    photoUrl = await up(
      formData.photoFile ?? formData.photoBase64,
      BUCKETS.STAFF_PHOTOS,
      fid('profile'),
      'photo'
    );
  } catch (err: any) {
    throw new Error(`Photo upload failed: ${err.message}`);
  }

  const nidFrontUrl = await up(
    formData.nidFrontCopyFile ?? formData.nidFrontBase64,
    BUCKETS.DOCUMENTS,
    fid('nid_front'),
    'document'
  );

  const nidBackUrl = await up(
    formData.nidBackCopyFile ?? formData.nidBackBase64,
    BUCKETS.DOCUMENTS,
    fid('nid_back'),
    'document'
  );

  const certSources: Array<File | string> = [];
  if (Array.isArray(formData.certificateFiles))
    certSources.push(...formData.certificateFiles.filter(Boolean));
  if (Array.isArray(formData.certificateUrls))
    certSources.push(
      ...formData.certificateUrls.filter(u => u?.startsWith('data:'))
    );

  const certificateUrls: string[] = [];
  for (let i = 0; i < certSources.length; i++) {
    const url = await up(
      certSources[i],
      BUCKETS.DOCUMENTS,
      fid('certificate', i),
      'document'
    );
    if (url) certificateUrls.push(url);
  }

  const expLetterUrl = await up(
    formData.experienceLetterFile ??
      (formData.experienceLetterUrl?.startsWith('data:')
        ? formData.experienceLetterUrl
        : null),
    BUCKETS.DOCUMENTS,
    fid('exp_letter'),
    'document'
  );

  const cvUrl = await up(
    formData.cvFile ??
      (formData.cvUrl?.startsWith('data:') ? formData.cvUrl : null),
    BUCKETS.DOCUMENTS,
    fid('cv'),
    'document'
  );

  const signatureUrl = await up(
    formData.signatureFile ??
      (formData.signatureUrl?.startsWith('data:')
        ? formData.signatureUrl
        : null),
    BUCKETS.DOCUMENTS,
    fid('signature'),
    'document'
  );

  const addrStr = (a: typeof formData.currentAddress) =>
    [a?.village, a?.postOffice, a?.thana, a?.upazila, a?.district, a?.division]
      .filter(Boolean)
      .join(', ');

  const currentAddressStr = addrStr(formData.currentAddress);
  const permanentAddressStr = formData.permanentSameAsCurrent
    ? currentAddressStr
    : addrStr(formData.permanentAddress ?? formData.currentAddress);

  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STAFF_APPLICATIONS,
      ID.unique(),
      {
        applicationId,
        status: 'pending',

        nameBn: formData.nameBn || formData.nameEn,
        nameEn: formData.nameEn,
        fatherNameBn: formData.fatherNameBn,
        fatherNameEn: formData.fatherNameEn,
        motherNameBn: formData.motherNameBn,
        motherNameEn: formData.motherNameEn,
        gender:
          normalizeGender(formData.gender) ??
          (() => {
            console.error('❌ GENDER NORMALIZATION FAILED:', {
              raw: formData.gender,
              type: typeof formData.gender,
            });
            throw new Error('Gender is required and must be male or female');
          })(),
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        nationality: formData.nationality ?? 'বাংলাদেশী',
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        bloodGroup: formData.bloodGroup ?? 'unknown',
        isHafiz: formData.isHafiz ?? false,

        nidNumber: formData.nidNumber,
        phonePrimary: convertBengaliToEnglish(formData.phonePrimary),
        phoneSecondary: formData.phoneSecondary
          ? convertBengaliToEnglish(formData.phoneSecondary)
          : null,
        whatsappNo: formData.whatsappNo
          ? convertBengaliToEnglish(formData.whatsappNo)
          : null,
        email: formData.email?.includes('@') ? formData.email : null,

        currentAddress: currentAddressStr,
        permanentAddress: permanentAddressStr,

        designation_id: formData.designation,
        employmentType: formData.employmentType,
        education: Array.isArray(formData.education)
          ? formData.education.map(
              (e: any) => `${e.degree} - ${e.institution} (${e.year})`
            )
          : [],
        totalExperienceYears:
          typeof formData.totalExperienceYears === 'string'
            ? parseInt(formData.totalExperienceYears, 10) || 0
            : (formData.totalExperienceYears ?? 0),
        specialSkills: formData.specialSkills ?? '',

        fb_links: formData.socialLinks?.facebook || null,
        x_link: formData.socialLinks?.twitter || null,
        linedin_ink: formData.socialLinks?.linkedin || null,
        instagram_link: formData.socialLinks?.instagram || null,
        website_link: formData.socialLinks?.website || null,

        expectedSalary: formData.expectedSalary,
        expectedJoiningDate: formData.expectedJoiningDate,

        paymentMethod: formData.paymentMethod,
        bankName: formData.bankName || '',
        bankBranch: formData.bankBranch || null,
        accountName: formData.accountName || null,
        accountNumber: formData.accountNumber || null,
        mobileBankingProvider: formData.mobileBankingProvider || null,
        mobileBankingNumber: formData.mobileBankingNumber
          ? convertBengaliToEnglish(formData.mobileBankingNumber)
          : null,

        referenceName: formData.referenceName,
        referencePhone: convertBengaliToEnglish(formData.referencePhone),
        referenceOccupation: formData.referenceOccupation || null,

        emergencyContactNo: convertBengaliToEnglish(
          formData.emergencyContactNo
        ),
        emergencyRelationship: formData.emergencyRelationship,

        declaration: formData.declaration,

        photoUrl: cleanUrl(photoUrl),
        nidFrontCopyUrl: cleanUrl(nidFrontUrl),
        nidBackCopyUrl: cleanUrl(nidBackUrl),
        certificateUrls: certificateUrls.filter(isStorableUrl),
        experienceLetterUrl: cleanUrl(expLetterUrl),
        cvUrl: cleanUrl(cvUrl),
        signatureUrl: cleanUrl(signatureUrl),

        appliedAt: new Date().toISOString(),
      }
    );
  } catch (docError) {
    for (const fid of uploadedIds) {
      try {
        await r2Client.send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: fid })
        );
      } catch {}
    }
    throw docError;
  }

  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId: 'public_form',
        userEmail: formData.email ?? 'public',
        userRole: 'public',
        action: 'APPLICATION_SUBMITTED',
        targetType: 'staff_application',
        targetId: applicationId,
        targetName: formData.nameBn || formData.nameEn,
        oldValue: null,
        newValue: JSON.stringify({
          applicationId,
          designation: formData.designation,
        }),
        ipAddress: '',
        userAgent: '',
        createdAt: new Date().toISOString(),
      }
    );
  } catch {}

  return { applicationId, success: true };
}

export async function approveApplication(
  applicationDocId: string,
  adminUserId: string,
  adminNotes?: string
): Promise<{ staffId: string; success: true }> {
  const { databases } = await createAdminClient();

  const app = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId
  );

  if (app.status !== 'pending')
    throw new Error('আবেদনটি ইতিমধ্যে প্রক্রিয়াধীন বা নিষ্পত্তি হয়েছে');

  const staffId = await generateStaffId(databases);

  await databases.createDocument(DATABASE_ID, COLLECTIONS.STAFF, ID.unique(), {
    staffId,
    userId: '',
    nameBn: app.nameBn,
    nameEn: app.nameEn,
    fatherNameBn: app.fatherNameBn,
    fatherNameEn: app.fatherNameEn,
    motherNameBn: app.motherNameBn,
    motherNameEn: app.motherNameEn,
    designation: app.designation_id,
    department: '',
    joiningDate: app.expectedJoiningDate
      ? new Date(app.expectedJoiningDate).toISOString()
      : new Date().toISOString(),
    expectedJoiningDate: app.expectedJoiningDate,
    expectedSalary: app.expectedSalary,
    basicSalary: app.expectedSalary,
    houseAllowance: 0,
    medicalAllowance: 0,
    transportAllowance: 0,
    grossSalary: app.expectedSalary,
    bonus: 0,
    employmentType: app.employmentType,
    phonePrimary: app.phonePrimary,
    phoneSecondary: app.phoneSecondary ?? '',
    email: app.email ?? '',
    currentAddress: app.currentAddress,
    permanentAddress: app.permanentAddress ?? '',
    nidNumber: app.nidNumber,
    dateOfBirth: app.dateOfBirth,
    gender: app.gender,
    maritalStatus: app.maritalStatus,
    religion: app.religion,
    nationality: app.nationality ?? 'বাংলাদেশী',
    bloodGroup: app.bloodGroup ?? 'unknown',
    isHafiz: app.isHafiz ?? false,
    emergencyContactNo: app.emergencyContactNo,
    emergencyRelationship: app.emergencyRelationship,
    photo: app.photoUrl ?? '',
    nfcCardId: '',
    isActive: true,
    education: app.education,
    totalExperienceYears: app.totalExperienceYears ?? 0,
    specialSkills: app.specialSkills ?? '',
    nidFrontCopyUrl: app.nidFrontCopyUrl ?? '',
    nidBackCopyUrl: app.nidBackCopyUrl ?? '',
    certificateUrls: app.certificateUrls,
    experienceLetterUrl: app.experienceLetterUrl ?? '',
    cvUrl: app.cvUrl ?? '',
    signatureUrl: app.signatureUrl ?? '',
    paymentMethod: app.paymentMethod,
    bankName: app.bankName ?? '',
    bankBranch: app.bankBranch ?? '',
    accountName: app.accountName ?? '',
    accountNumber: app.accountNumber ?? '',
    mobileBankingProvider: app.mobileBankingProvider ?? '',
    mobileBankingNumber: app.mobileBankingNumber ?? '',
    referenceName: app.referenceName,
    referencePhone: app.referencePhone,
    referenceOccupation: app.referenceOccupation ?? '',
    declaration: app.declaration,
    createdAt: new Date().toISOString(),
  });

  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId,
    {
      status: 'approved',
      assignedStaffId: staffId,
      reviewedBy: adminUserId,
      reviewedAt: new Date().toISOString(),
      reviewNotes: adminNotes ?? '',
    }
  );

  return { staffId, success: true };
}

export async function rejectApplication(
  applicationDocId: string,
  adminUserId: string,
  reason: string
): Promise<{ success: true }> {
  const { databases } = await createAdminClient();

  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId,
    {
      status: 'rejected',
      reviewedBy: adminUserId,
      reviewedAt: new Date().toISOString(),
      reviewNotes: reason,
    }
  );

  return { success: true };
}

export async function getPendingApplications({ limit = 25, offset = 0 } = {}) {
  const { databases } = await createAdminClient();
  return databases.listDocuments(DATABASE_ID, COLLECTIONS.STAFF_APPLICATIONS, [
    Query.equal('status', 'pending'),
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc('appliedAt'),
  ]);
}

export async function getApplicationById(docId: string) {
  const { databases } = await createAdminClient();
  return databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    docId
  );
}

function cleanUrl(url: string): string {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return '';
  return url;
}

function isStorableUrl(url: string): boolean {
  return !!url && !url.startsWith('data:') && !url.startsWith('blob:');
}
