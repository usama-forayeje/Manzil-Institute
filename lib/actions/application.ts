"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/admin";
import {
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS,
  FILE_LIMITS,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_DOC_TYPES,
} from "@/config/appwrite";
import { convertBengaliToEnglish } from "@/lib/utils";
import type { FullStaffData } from "@/validations/staff";

// ─── Types ────────────────────────────────────────────────
interface UploadResult {
  url:    string;
  fileId: string;
}

// ─── Server-side file validation ─────────────────────────
function validateFile(
  file: File,
  type: "photo" | "document"
): { valid: boolean; error?: string } {
  const maxSize      = type === "photo" ? FILE_LIMITS.PHOTO : FILE_LIMITS.DOCUMENT;
  const acceptedTypes = type === "photo" ? ACCEPTED_IMAGE_TYPES : ACCEPTED_DOC_TYPES;
  const maxMB        = Math.round(maxSize / (1024 * 1024));

  if (file.size === 0)
    return { valid: false, error: `"${file.name}" ফাইলটি খালি বা ক্ষতিগ্রস্ত।` };
  if (file.size > maxSize)
    return { valid: false, error: `"${file.name}" এর সাইজ ${maxMB}MB এর বেশি হতে পারবে না।` };
  if (!acceptedTypes.includes(file.type as any))
    return { valid: false, error: `"${file.name}" এর ফরম্যাট গ্রহণযোগ্য নয়।` };

  return { valid: true };
}

// ─── File ID generator ─────────────────────────────────────
// Format: {username}_{appId}_{type}  (max 36 chars — Appwrite limit)
//
// Examples:
//   abdurrahim_mi2026001_profile
//   abdurrahim_mi2026001_nid_front
//   abdurrahim_mi2026001_nid_back
//   abdurrahim_mi2026001_cv
//   abdurrahim_mi2026001_certificate_0
//   abdurrahim_mi2026001_exp_letter
function buildFileId(
  rawName:       string,    // nameEn or nameBn
  applicationId: string,    // "MI-2026-001"
  type:          string,    // "profile" | "nid_front" | "nid_back" | "cv" | "certificate" | "exp_letter" | "tazkiyah"
  index?:        number     // for multi-file types (certificates)
): string {
  // Sanitize name: only lowercase a-z and 0-9, max 12 chars
  const name = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 12);

  // Compact app ID: "MI-2026-001" → "mi2026001"
  const appId = applicationId
    .toLowerCase()
    .replace(/-/g, "");

  const suffix = index !== undefined ? `_${index}` : "";
  const id     = `${name}_${appId}_${type}${suffix}`;

  console.log(`📝 Generated file ID: ${id} (name: ${name}, appId: ${appId}, type: ${type}, suffix: ${suffix})`);

  // Hard cap at 36 chars (Appwrite fileId limit)
  if (id.length <= 36) return id;

  // Truncate name to fit
  const overhead   = appId.length + type.length + suffix.length + 3; // 3 underscores
  const allowedName = Math.max(3, 36 - overhead);
  return `${name.substring(0, allowedName)}_${appId}_${type}${suffix}`;
}

// ─── Single file upload helper ─────────────────────────────
async function uploadFile(
  storage:   any,
  bucketId:  string,
  source:    File | string,    // File object OR base64 data URL
  fileId:    string
): Promise<UploadResult | null> {
  console.log(`🔍 uploadFile called:`, {
    bucketId,
    fileId,
    sourceType: typeof source,
    isBase64: typeof source === 'string' && source.startsWith('data:'),
    sourceLength: typeof source === 'string' ? source.length : source?.size
  });

  if (!bucketId) {
    console.warn(`⚠️ Bucket not configured, skipping upload (type: ${fileId})`);
    return null;
  }

  let fileToUpload: File | null = null;
  let conversionError: string | null = null;

  try {
    if (typeof source === "string") {
      // base64 data URL → File
      if (!source.startsWith("data:")) {
        conversionError = "Invalid base64 URL: must start with 'data:'";
        throw new Error(conversionError);
      }

      const [meta, base64Data] = source.split(",");
      if (!base64Data) {
        conversionError = `Invalid base64 format for ${fileId}: no comma separator`;
        throw new Error(conversionError);
      }

      const mimeType = meta.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
      console.log(`📊 Converting base64 to File:`, { mimeType, fileSize: base64Data.length });

      const binary = atob(base64Data);
      const bytes  = new Uint8Array(binary.length);
      for (let i =0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      fileToUpload = new File([bytes], `${fileId}.jpg`, { type: mimeType });
      console.log(`✅ Base64 converted to File:`, {
        name: fileToUpload.name,
        size: fileToUpload.size,
        type: fileToUpload.type
      });
    } else if (source instanceof File) {
      fileToUpload = source;
      console.log(`📊 Using File object directly:`, { name: source.name, size: source.size });
    } else {
      conversionError = `Invalid source type for ${fileId}: expected File or base64 string, got ${typeof source}`;
      throw new Error(conversionError);
    }

    console.log(`📤 Uploading to Appwrite...`, { bucketId, fileId, fileName: fileToUpload.name });
    const result = await storage.createFile(bucketId, fileId, fileToUpload);
    const url    = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    console.log(`✅ Uploaded successfully: ${result.$id} (${(fileToUpload.size / 1024).toFixed(1)} KB)`);
    console.log(`📝 URL generated: ${url}`);
    return { url, fileId: result.$id };
  } catch (err: any) {
    console.error(`❌ Upload/Conversion failed (${fileId}):`, {
      message: err.message,
      code: err.code,
      type: err.type,
      response: err.response
    });

    // If file already exists (409), try to get the existing file URL
    if (err.code === 409 && err.type === 'storage_file_already_exists') {
      try {
        console.log(`🔄 File ${fileId} already exists, getting existing file...`);
        const existingFile = await storage.getFile(bucketId, fileId);
        const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${existingFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        console.log(`✅ Using existing file URL: ${url}`);
        return { url, fileId: existingFile.$id };
      } catch (getErr: any) {
        console.error(`❌ Failed to get existing file ${fileId}:`, getErr.message);
        return null;
      }
    }

    return null;
  }
}

// ─── Duplicate check ─────────────────────────────────────
export async function checkDuplicateApplication(
  email?:        string,
  phonePrimary?: string,
  nidNumber?:    string
): Promise<{ isDuplicate: boolean; existingApplicationId?: string }> {
  const { databases } = await createAdminClient();

  // Check NID first (most unique)
  if (nidNumber) {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [Query.equal("nidNumber", nidNumber), Query.equal("status", "pending"), Query.limit(1)]
      );
      if (res.total > 0)
        return { isDuplicate: true, existingApplicationId: res.documents[0].applicationId };
    } catch {}
  }

  // Check email
  if (email && email.includes("@")) {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [Query.equal("email", email), Query.equal("status", "pending"), Query.limit(1)]
      );
      if (res.total > 0)
        return { isDuplicate: true, existingApplicationId: res.documents[0].applicationId };
    } catch {}
  }

  return { isDuplicate: false };
}

// ─── Application ID generator ────────────────────────────
async function generateApplicationId(databases: any): Promise<string> {
  const year   = new Date().getFullYear();
  const prefix = `MI-${year}-`;

  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    [Query.startsWith("applicationId", prefix), Query.orderDesc("applicationId"), Query.limit(1)]
  );

  const next = existing.total > 0
    ? parseInt((existing.documents[0].applicationId as string).split("-")[2] ?? "0", 10) + 1
    : 1;

  return `${prefix}${String(next).padStart(3, "0")}`;
}

// ─── Staff ID generator ────────────────────────────────────
// BUG FIX: previous version had wrong return type Promise<{url,fileId}|null>
async function generateStaffId(databases: any): Promise<string> {
  const year   = new Date().getFullYear();
  const prefix = `STF-${year}-`;

  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    [Query.startsWith("staffId", prefix), Query.orderDesc("staffId"), Query.limit(1)]
  );

  const next = existing.total > 0
    ? parseInt((existing.documents[0].staffId as string).split("-")[2] ?? "0", 10) + 1
    : 1;

  return `${prefix}${String(next).padStart(3, "0")}`;
}

// ─── Main Server Action: createApplication ─────────────────
export async function createApplication(
  formData: FullStaffData & {
    photoFile?:            File;
    photoBase64?:          string;
    nidFrontCopyFile?:     File;
    nidFrontBase64?:       string;
    nidBackCopyFile?:      File;
    nidBackBase64?:        string;
    certificateFiles?:     File[];
    certificateUrls?:      string[];
    experienceLetterFile?: File;
    experienceLetterUrl?:  string;
    cvFile?:               File;
    cvUrl?:                string;
  }
): Promise<{ applicationId: string; success: true }> {

  // ── 1. Duplicate check ──────────────────────────────────
  const dup = await checkDuplicateApplication(
    formData.email,
    formData.phonePrimary,
    formData.nidNumber
  );
  if (dup.isDuplicate) {
    throw Object.assign(
      new Error(`DUPLICATE_APPLICATION:এই তথ্য দিয়ে ইতিমধ্যে আবেদন জমা আছে। ID: ${dup.existingApplicationId}`),
      { name: "DuplicateApplicationError" }
    );
  }

  const { databases, storage } = await createAdminClient();

  // ── 2. Generate application ID (needed for file naming) ─
  const applicationId = await generateApplicationId(databases);

  // ── 3. Build file ID helper ─────────────────────────────
  const rawName = formData.nameEn || formData.nameBn || "user";
  const fid = (type: string, index?: number) =>
    buildFileId(rawName, applicationId, type, index);

  // ── 4. Upload all files ─────────────────────────────────
  const uploadedIds: string[] = [];

  async function up(
    source:   File | string | undefined | null,
    bucket:   string,
    fileId:   string,
    fileType: "photo" | "document"
  ): Promise<string> {
    console.log(`🔄 up() called for: ${fileId}`, {
      hasSource: !!source,
      sourceType: typeof source,
      bucket,
      fileType
    });

    if (!source) {
      console.warn(`⚠️ Skipping upload for ${fileId}: no source data`);
      return "";
    }

    // Validate File objects (base64 skipped — already compressed client-side)
    if (source instanceof File) {
      const v = validateFile(source, fileType);
      if (!v.valid) {
        console.error(`❌ File validation failed for ${fileId}:`, v.error);
        throw new Error(v.error);
      }
      console.log(`✅ File validated: ${fileId}`, { size: source.size, type: source.type });
    } else if (typeof source === "string") {
      if (!source.startsWith("data:")) {
        console.error(`❌ Invalid base64 URL for ${fileId}: must start with "data:"`);
        throw new Error(`Invalid data URL format for ${fileId}`);
      }
      if (source.length > 10 * 1024 * 1024) {
        console.error(`❌ Base64 too large for ${fileId}: ${(source.length / 1024 / 1024).toFixed(2)} MB`);
        throw new Error(`${fileId} base64 data too large (>10MB)`);
      }
      console.log(`✅ Base64 validated: ${fileId}`, { length: source.length });
    }

    const result = await uploadFile(storage, bucket, source, fileId);
    if (result) {
      uploadedIds.push(result.fileId);
      console.log(`✅ Upload success for ${fileId}:`, result.url.substring(0, 100) + '...');
    } else {
      console.error(`❌ Upload failed for ${fileId}: result is null`);
    }
    return result?.url ?? "";
  }

  // Photo: prefer File > base64
  console.log('📷 Photo upload check...', {
    hasPhotoFile: !!formData.photoFile,
    hasPhotoBase64: typeof formData.photoBase64 === 'string',
    isPhotoBase64Valid: typeof formData.photoBase64 === 'string' && formData.photoBase64.startsWith('data:'),
    photoBucket: BUCKETS.STAFF_PHOTOS,
    photoBase64Length: typeof formData.photoBase64 === 'string' ? formData.photoBase64.length : 0
  });

  let photoUrl = "";
  try {
    photoUrl = await up(
      formData.photoFile ?? formData.photoBase64,
      BUCKETS.STAFF_PHOTOS,
      fid("profile"),
      "photo"
    );
  } catch (err: any) {
    console.error('💥 Photo upload error:', err);
    throw new Error(`Photo upload failed: ${err.message}`);
  }

  console.log('📸 Photo upload result:', {
    urlEmpty: !photoUrl,
    urlLength: photoUrl.length,
    urlStartsWith: photoUrl?.substring(0, 50)
  });

  // Fail early if photo URL is empty after upload attempt
  if (!photoUrl) {
    console.error('💥 CRITICAL: Photo upload resulted in empty URL. Application will fail to save properly.');
    // We don't throw here to allow other files to upload, but log the issue
  }

  // NID front: prefer File > base64

  // NID front: prefer File > base64
  console.log('🆔 NID Front upload check...', {
    hasNidFrontFile: !!formData.nidFrontCopyFile,
    hasNidFrontBase64: typeof formData.nidFrontBase64 === 'string',
    docBucket: BUCKETS.DOCUMENTS
  });

  const nidFrontUrl = await up(
    formData.nidFrontCopyFile ?? formData.nidFrontBase64,
    BUCKETS.DOCUMENTS,
    fid("nid_front"),
    "document"
  );

  console.log('🆕 NID Back upload check...', {
    hasNidBackFile: !!formData.nidBackCopyFile,
    hasNidBackBase64: typeof formData.nidBackBase64 === 'string',
    docBucket: BUCKETS.DOCUMENTS
  });

  const nidBackUrl = await up(
    formData.nidBackCopyFile ?? formData.nidBackBase64,
    BUCKETS.DOCUMENTS,
    fid("nid_back"),
    "document"
  );

  // Certificates (File array OR base64 array)
  const certSources: Array<File | string> = [];
  if (Array.isArray(formData.certificateFiles)) certSources.push(...formData.certificateFiles.filter(Boolean));
  if (Array.isArray(formData.certificateUrls))  certSources.push(...formData.certificateUrls.filter((u) => u?.startsWith("data:")));

  const certificateUrls: string[] = [];
  for (let i = 0; i < certSources.length; i++) {
    const url = await up(certSources[i], BUCKETS.DOCUMENTS, fid("certificate", i), "document");
    if (url) certificateUrls.push(url);
  }

  // Experience letter
  const expLetterUrl = await up(
    formData.experienceLetterFile ?? (formData.experienceLetterUrl?.startsWith("data:") ? formData.experienceLetterUrl : null),
    BUCKETS.DOCUMENTS,
    fid("exp_letter"),
    "document"
  );

  // CV
  const cvUrl = await up(
    formData.cvFile ?? (formData.cvUrl?.startsWith("data:") ? formData.cvUrl : null),
    BUCKETS.DOCUMENTS,
    fid("cv"),
    "document"
  );



  // ── 5. Build address strings ────────────────────────────
  const addrStr = (a: typeof formData.currentAddress) =>
    [a?.village, a?.postOffice, a?.thana, a?.upazila, a?.district, a?.division]
      .filter(Boolean)
      .join(", ");

  const currentAddressStr  = addrStr(formData.currentAddress);
  const permanentAddressStr = formData.permanentSameAsCurrent
    ? currentAddressStr
    : addrStr(formData.permanentAddress ?? formData.currentAddress);

  // ── 6. Save to STAFF_APPLICATIONS ──────────────────────
  console.log('💾 About to save to database with URLs:', {
    photoUrl: photoUrl ? photoUrl.substring(0, 80) + '...' : 'EMPTY',
    photoUrlLength: photoUrl.length,
    nidFrontUrl: !!nidFrontUrl,
    nidBackUrl: !!nidBackUrl,
    certCount: certificateUrls.length,
    cvUrl: !!cvUrl,
    expLetterUrl: !!expLetterUrl
  });

  try {
    console.log('Creating staff application with designation:', formData.designation, 'type:', typeof formData.designation);
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.STAFF_APPLICATIONS,
      ID.unique(),
      {
        applicationId,
        status: "pending",

        // Personal
        nameBn:        formData.nameBn || formData.nameEn,
        nameEn:        formData.nameEn,
        fatherNameBn:  formData.fatherNameBn,
        fatherNameEn:  formData.fatherNameEn,
        motherNameBn:  formData.motherNameBn,
        motherNameEn:  formData.motherNameEn,
        gender:        formData.gender,
        maritalStatus: formData.maritalStatus,
        religion:      formData.religion,
        nationality:   formData.nationality ?? "বাংলাদেশী",
        dateOfBirth:   new Date(formData.dateOfBirth).toISOString(),
        bloodGroup:    formData.bloodGroup ?? "unknown",
        isHafiz:       formData.isHafiz ?? false,

        // Contact
        nidNumber:            formData.nidNumber,
        phonePrimary:         convertBengaliToEnglish(formData.phonePrimary),
        phoneSecondary:       formData.phoneSecondary ? convertBengaliToEnglish(formData.phoneSecondary) : null,
        whatsappNo:           formData.whatsappNo    ? convertBengaliToEnglish(formData.whatsappNo)    : null,
        email:                formData.email?.includes("@") ? formData.email : null,

        // Address
        currentAddress:   currentAddressStr,
        permanentAddress: permanentAddressStr,

        // Professional
        designation_id:       formData.designation,
        employmentType:       formData.employmentType,
        education:            Array.isArray(formData.education)
          ? formData.education.map((e: any) => `${e.degree} - ${e.institution} (${e.year})`)
          : [],
        totalExperienceYears: typeof formData.totalExperienceYears === "string"
          ? parseInt(formData.totalExperienceYears, 10) || 0
          : (formData.totalExperienceYears ?? 0),
        specialSkills:        formData.specialSkills ?? "",

        // Social links (individual fields)
        fb_links:       formData.socialLinks?.facebook  || null,
        x_link:         formData.socialLinks?.twitter   || null,
        linedin_ink:    formData.socialLinks?.linkedin  || null,
        instagram_link: formData.socialLinks?.instagram || null,
        website_link:   formData.socialLinks?.website   || null,

        // Expected terms
        expectedSalary:      formData.expectedSalary,
        expectedJoiningDate: formData.expectedJoiningDate,

        // Payment
        paymentMethod:         formData.paymentMethod,
        bankName:              formData.bankName              || "",
        bankBranch:            formData.bankBranch            || null,
        accountName:           formData.accountName           || null,
        accountNumber:         formData.accountNumber         || null,
        mobileBankingProvider: formData.mobileBankingProvider || null,
        mobileBankingNumber:   formData.mobileBankingNumber
          ? convertBengaliToEnglish(formData.mobileBankingNumber) : null,

        // Reference
        referenceName:       formData.referenceName,
        referencePhone:      convertBengaliToEnglish(formData.referencePhone),
        referenceOccupation: formData.referenceOccupation || null,

        // Emergency
        emergencyContactNo:   convertBengaliToEnglish(formData.emergencyContactNo),
        emergencyRelationship: formData.emergencyRelationship,

        // Declaration
        declaration: formData.declaration,

        // Document URLs (only store if not base64)
        photoUrl:             cleanUrl(photoUrl),
        nidFrontCopyUrl:      cleanUrl(nidFrontUrl),
        nidBackCopyUrl:       cleanUrl(nidBackUrl),
        certificateUrls:      certificateUrls.filter(isStorableUrl),
        experienceLetterUrl:  cleanUrl(expLetterUrl),
        cvUrl:                cleanUrl(cvUrl),

        appliedAt: new Date().toISOString(),
      }
    );
  } catch (docError) {
    // Rollback: delete uploaded files
    for (const fid of uploadedIds) {
      try { await storage.deleteFile(BUCKETS.STAFF_PHOTOS, fid); } catch {}
      try { await storage.deleteFile(BUCKETS.DOCUMENTS,    fid); } catch {}
    }
    throw docError;
  }

  // ── 7. Audit log (non-critical) ─────────────────────────
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId:     "public_form",
        userEmail:  formData.email ?? "public",
        userRole:   "public",
        action:     "APPLICATION_SUBMITTED",
        targetType: "staff_application",
        targetId:   applicationId,
        targetName: formData.nameBn || formData.nameEn,
        oldValue:   null,
        newValue:   JSON.stringify({ applicationId, designation: formData.designation }),
        ipAddress:  "",
        userAgent:  "",
        createdAt:  new Date().toISOString(),
      }
    );
  } catch {}

  return { applicationId, success: true };
}

// ─── Approve Application ───────────────────────────────────
export async function approveApplication(
  applicationDocId: string,
  adminUserId:      string,
  adminNotes?:      string
): Promise<{ staffId: string; success: true }> {
  const { databases } = await createAdminClient();

  const app = await databases.getDocument(DATABASE_ID, COLLECTIONS.STAFF_APPLICATIONS, applicationDocId);

  if (app.status !== "pending")
    throw new Error("আবেদনটি ইতিমধ্যে প্রক্রিয়াধীন বা নিষ্পত্তি হয়েছে");

  const staffId = await generateStaffId(databases); // ← uses fixed version

  await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    ID.unique(),
    {
      staffId,
      userId:      "",
      nameBn:      app.nameBn,
      nameEn:      app.nameEn,
      fatherNameBn: app.fatherNameBn,
      fatherNameEn: app.fatherNameEn,
      motherNameBn: app.motherNameBn,
      motherNameEn: app.motherNameEn,
      designation:  app.designation_id,
      department:   "",
      joiningDate:  app.expectedJoiningDate
        ? new Date(app.expectedJoiningDate).toISOString()
        : new Date().toISOString(),
      expectedJoiningDate: app.expectedJoiningDate,
      expectedSalary:      app.expectedSalary,
      basicSalary:         app.expectedSalary,
      houseAllowance:      0,
      medicalAllowance:    0,
      transportAllowance:  0,
      grossSalary:         app.expectedSalary,
      bonus:               0,
      employmentType:      app.employmentType,
      phonePrimary:        app.phonePrimary,
      phoneSecondary:      app.phoneSecondary ?? "",
      email:               app.email ?? "",
      currentAddress:      app.currentAddress,
      permanentAddress:    app.permanentAddress ?? "",
      nidNumber:           app.nidNumber,
      dateOfBirth:         app.dateOfBirth,
      gender:              app.gender,
      maritalStatus:       app.maritalStatus,
      religion:            app.religion,
      nationality:         app.nationality ?? "বাংলাদেশী",
      bloodGroup:          app.bloodGroup ?? "unknown",
      isHafiz:             app.isHafiz ?? false,
      emergencyContactNo:  app.emergencyContactNo,
      emergencyRelationship: app.emergencyRelationship,
      photo:               app.photoUrl ?? "",
      nfcCardId:           "",
      isActive:            true,
      education:           app.education,
      totalExperienceYears: app.totalExperienceYears ?? 0,
      specialSkills:       app.specialSkills ?? "",
      nidFrontCopyUrl:     app.nidFrontCopyUrl ?? "",
      nidBackCopyUrl:      app.nidBackCopyUrl  ?? "",
      certificateUrls:     app.certificateUrls,
      experienceLetterUrl: app.experienceLetterUrl ?? "",
      cvUrl:               app.cvUrl ?? "",
      paymentMethod:       app.paymentMethod,
      bankName:            app.bankName ?? "",
      bankBranch:          app.bankBranch ?? "",
      accountName:         app.accountName ?? "",
      accountNumber:       app.accountNumber ?? "",
      mobileBankingProvider: app.mobileBankingProvider ?? "",
      mobileBankingNumber: app.mobileBankingNumber ?? "",
      referenceName:       app.referenceName,
      referencePhone:      app.referencePhone,
      referenceOccupation: app.referenceOccupation ?? "",
      declaration:         app.declaration,
      createdAt:           new Date().toISOString(),
    }
  );

  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId,
    {
      status:          "approved",
      assignedStaffId: staffId,
      reviewedBy:      adminUserId,
      reviewedAt:      new Date().toISOString(),
      reviewNotes:     adminNotes ?? "",
    }
  );

  return { staffId, success: true };
}

// ─── Reject Application ────────────────────────────────────
export async function rejectApplication(
  applicationDocId: string,
  adminUserId:      string,
  reason:           string
): Promise<{ success: true }> {
  const { databases } = await createAdminClient();

  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId,
    {
      status:      "rejected",
      reviewedBy:  adminUserId,
      reviewedAt:  new Date().toISOString(),
      reviewNotes: reason,
    }
  );

  return { success: true };
}

// ─── List / Get helpers ─────────────────────────────────────
export async function getPendingApplications({ limit = 25, offset = 0 } = {}) {
  const { databases } = await createAdminClient();
  return databases.listDocuments(DATABASE_ID, COLLECTIONS.STAFF_APPLICATIONS, [
    Query.equal("status", "pending"),
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc("appliedAt"),
  ]);
}

export async function getApplicationById(docId: string) {
  const { databases } = await createAdminClient();
  return databases.getDocument(DATABASE_ID, COLLECTIONS.STAFF_APPLICATIONS, docId);
}

// ─── URL helpers ────────────────────────────────────────────
function cleanUrl(url: string): string {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return "";
  return url;
}

function isStorableUrl(url: string): boolean {
  return !!url && !url.startsWith("data:") && !url.startsWith("blob:");
}