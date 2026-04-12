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
import type { FullStaffData } from "@/validations/staff";

// ─── Server-side file validation ─────────────────────────────
function validateFileServerSide(file: File, type: "photo" | "document"): { valid: boolean; error?: string } {
  const maxSize = type === "photo" ? FILE_LIMITS.PHOTO : FILE_LIMITS.DOCUMENT;
  const acceptedTypes = type === "photo" ? ACCEPTED_IMAGE_TYPES : ACCEPTED_DOC_TYPES;

  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `ফাইল "${file.name}" এর সাইজ ${maxMB}MB এর বেশি হতে পারবে না।`,
    };
  }

  if (!acceptedTypes.includes(file.type as any)) {
    const typeLabel = type === "photo" ? "JPEG, PNG, WebP" : "JPEG, PNG, WebP, PDF";
    return {
      valid: false,
      error: `ফাইল "${file.name}" এর টাইপ গ্রহণযোগ্য নয়। গ্রহণযোগ্য ফরম্যাট: ${typeLabel}`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: `ফাইল "${file.name}" খালি বা ক্ষতিগ্রস্ত।`,
    };
  }

  return { valid: true };
}

function validateAllFilesServerSide(files: {
  photoFile?: File;
  nidFrontCopyFile?: File;
  nidBackCopyFile?: File;
  certificateFiles?: File[];
  experienceLetterFile?: File;
  cvFile?: File;
  tazkiyahFile?: File;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (files.photoFile) {
    const result = validateFileServerSide(files.photoFile, "photo");
    if (!result.valid && result.error) errors.push(result.error);
  }

  for (const file of [files.nidFrontCopyFile, files.nidBackCopyFile]) {
    if (file) {
      const result = validateFileServerSide(file, "document");
      if (!result.valid && result.error) errors.push(result.error);
    }
  }

  if (files.certificateFiles) {
    for (const file of files.certificateFiles) {
      if (file) {
        const result = validateFileServerSide(file, "document");
        if (!result.valid && result.error) errors.push(result.error);
      }
    }
  }

  for (const file of [files.experienceLetterFile, files.cvFile, files.tazkiyahFile]) {
    if (file) {
      const result = validateFileServerSide(file, "document");
      if (!result.valid && result.error) errors.push(result.error);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Duplicate check ─────────────────────────────────────────
export async function checkDuplicateApplication(
  email?: string,
  phonePrimary?: string
): Promise<{ isDuplicate: boolean; existingApplicationId?: string }> {
  if (!email && !phonePrimary) {
    return { isDuplicate: false };
  }

  const { databases } = await createAdminClient();
  const queries: any[] = [];

  if (email) {
    queries.push(Query.equal("email", email));
  }
  if (phonePrimary) {
    queries.push(Query.equal("phonePrimary", phonePrimary));
  }

  try {
    const existing = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STAFF_APPLICATIONS,
      queries
    );

    if (existing.total > 0) {
      const pendingApp = existing.documents.find((doc: any) => doc.status === "pending");
      if (pendingApp) {
        return {
          isDuplicate: true,
          existingApplicationId: pendingApp.applicationId,
        };
      }
    }

    return { isDuplicate: false };
  } catch {
    return { isDuplicate: false };
  }
}

// ─── Application ID generator ───────────────────────────────
async function generateApplicationId(databases: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `APP-${year}-`;

  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    [
      Query.startsWith("applicationId", prefix),
      Query.orderDesc("applicationId"),
      Query.limit(1),
    ]
  );

  let nextNumber = 1;
  if (existing.total > 0) {
    const lastId = existing.documents[0].applicationId as string;
    const lastNum = parseInt(lastId.split("-")[2] ?? "0", 10);
    nextNumber = lastNum + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

// ─── File upload helper ────────────────────────────────────
async function uploadFile(
  storage: any,
  bucketId: string,
  file: File | string // Accept File or base64 string
): Promise<string> {
  // If bucket ID is empty, skip upload and return empty string
  if (!bucketId) {
    console.warn("Bucket ID is empty, skipping upload");
    return "";
  }

  let fileToUpload: File;
  
  if (typeof file === "string") {
    // It's a base64 data URL - convert directly without fetch
    const base64Data = file.split(',')[1]; // Get the base64 part
    if (!base64Data) {
      throw new Error("Invalid base64 data URL");
    }
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const mimeType = file.match(/data:([^;]+)/)?.[1] || "image/jpeg";
    const blob = new Blob([bytes], { type: mimeType });
    const fileName = `upload_${Date.now()}.jpg`;
    fileToUpload = new File([blob], fileName, { type: mimeType });
  } else {
    fileToUpload = file;
  }

  try {
    const result = await storage.createFile(
      bucketId,
      ID.unique(),
      fileToUpload
    );

    const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    // Ensure URL is within Appwrite's 500 char limit
    if (url.length > 500) {
      console.warn("Generated URL too long, using shorter version:", url.length);
      return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view`;
    }

    return url;
  } catch (error: any) {
    // If bucket doesn't exist, return null instead of empty string
    if (error.code === 404 || error.message?.includes("bucket")) {
      console.warn("Storage bucket not found, skipping upload:", bucketId);
      return null;
    }
    throw error;
  }
}

// ─── Main Server Action: Create Application ────────────────
export async function createApplication(
  formData: FullStaffData & {
    photoFile?: File;
    nidFrontCopyFile?: File;
    nidBackCopyFile?: File;
    certificateFiles?: File[];
    experienceLetterFile?: File;
    cvFile?: File;
    tazkiyahFile?: File;
    photoUrl?: string;
    nidFrontCopyUrl?: string;
    nidBackCopyUrl?: string;
    certificateUrls?: string[];
    experienceLetterUrl?: string;
    cvUrl?: string;
    tazkiyahUrl?: string;
  }
): Promise<{ applicationId: string; success: true }> {
  const { databases, storage } = await createAdminClient();

  const hasFiles = formData.photoFile || formData.nidFrontCopyFile || formData.nidBackCopyFile;

  if (hasFiles) {
    const fileValidation = validateAllFilesServerSide({
      photoFile: formData.photoFile,
      nidFrontCopyFile: formData.nidFrontCopyFile,
      nidBackCopyFile: formData.nidBackCopyFile,
      certificateFiles: formData.certificateFiles,
      experienceLetterFile: formData.experienceLetterFile,
      cvFile: formData.cvFile,
      tazkiyahFile: formData.tazkiyahFile,
    });

    if (!fileValidation.valid) {
      throw new Error(fileValidation.errors.join(" "));
    }
  }

  let photoUrl = formData.photoUrl || null;
  let nidFrontCopyUrl = formData.nidFrontCopyUrl || null;
  let nidBackCopyUrl = formData.nidBackCopyUrl || null;
  let certificateUrls = formData.certificateUrls || [];
  let experienceLetterUrl = formData.experienceLetterUrl || null;
  let cvUrl = formData.cvUrl || null;
  let tazkiyahUrl = formData.tazkiyahUrl || null;

  if (formData.photoFile instanceof File) {
    photoUrl = await uploadFile(storage, BUCKETS.STAFF_PHOTOS, formData.photoFile);
  }
  // Upload NID images - either from File object or base64 URL
  if (formData.nidFrontCopyFile instanceof File) {
    nidFrontCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidFrontCopyFile);
  } else if (formData.nidFrontCopyUrl && formData.nidFrontCopyUrl.startsWith("data:")) {
    // It's a base64 URL, upload it
    nidFrontCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidFrontCopyUrl);
  }
  if (formData.nidBackCopyFile instanceof File) {
    nidBackCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidBackCopyFile);
  } else if (formData.nidBackCopyUrl && formData.nidBackCopyUrl.startsWith("data:")) {
    // It's a base64 URL, upload it
    nidBackCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidBackCopyUrl);
  }

  if (Array.isArray(formData.certificateFiles)) {
    for (const file of formData.certificateFiles) {
      if (file instanceof File) {
        const url = await uploadFile(storage, BUCKETS.DOCUMENTS, file);
        certificateUrls.push(url);
      }
    }
  }

  if (formData.experienceLetterFile instanceof File) {
    experienceLetterUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.experienceLetterFile);
  }
  if (formData.cvFile instanceof File) {
    cvUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.cvFile);
  }
  if (formData.tazkiyahFile instanceof File) {
    tazkiyahUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.tazkiyahFile);
  }

  // ── 3. Application ID generate ───────────────────────────
  const applicationId = await generateApplicationId(databases);

  // ── 4. Full address string build ─────────────────────────
  const currentAddr = formData.currentAddress;
  const permanentAddr = formData.permanentSameAsCurrent
    ? currentAddr
    : (formData.permanentAddress ?? currentAddr);

  const currentAddressStr = [
    currentAddr.village,
    currentAddr.postOffice,
    currentAddr.thana,
    currentAddr.upazila,
    currentAddr.district,
    currentAddr.division,
  ].filter(Boolean).join(", ");

  const permanentAddressStr = [
    permanentAddr.village,
    permanentAddr.postOffice,
    permanentAddr.thana,
    permanentAddr.upazila,
    permanentAddr.district,
    permanentAddr.division,
  ].filter(Boolean).join(", ");

  // ── 5. Save to STAFF_APPLICATIONS ────────────────────────
  await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    ID.unique(),
    {
      applicationId,
      status: "pending",
      // Personal
      nameBn: formData.nameBn || formData.nameEn,
      nameEn: formData.nameEn,
      fatherNameBn: formData.fatherNameBn,
      fatherNameEn: formData.fatherNameEn,
      motherNameBn: formData.motherNameBn,
      motherNameEn: formData.motherNameEn,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      religion: formData.religion,
      nationality: formData.nationality ?? "বাংলাদেশী",
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      bloodGroup: formData.bloodGroup ?? "unknown",
      // Contact
      phonePrimary: formData.phonePrimary,
      phoneSecondary: formData.phoneSecondary || null,
      email: formData.email && formData.email.includes("@") ? formData.email : null,
      // Address
      currentAddress: currentAddressStr,
      permanentAddress: permanentAddressStr,
      // NID
      nidNumber: formData.nidNumber,
      // Professional
      designation: formData.designationCustom || formData.designation,
      department: formData.department || "",
      employmentType: formData.employmentType,
      // Education & Skills - Appwrite expects array of strings
      education: Array.isArray(formData.education) && formData.education.length > 0 
        ? formData.education.map((e: any) => `${e.degree} - ${e.institution} (${e.year})`)
        : [],
      // socialLinks: JSON.stringify(formData.socialLinks ?? {}), // Remove this if not in Appwrite schema
      totalExperienceYears: formData.totalExperienceYears ?? 0,
      isHafiz: formData.isHafiz ?? false,
      specialSkills: formData.specialSkills ?? "",
      // Expected Terms
      expectedSalary: formData.expectedSalary,
      expectedJoiningDate: formData.expectedJoiningDate,
      noticePeriod: formData.noticePeriod,
      // Payment
      paymentMethod: formData.paymentMethod,
      bankName: formData.bankName || "",
      bankBranch: formData.bankBranch || null,
      accountName: formData.accountName || null,
      accountNumber: formData.accountNumber || null,
      mobileBankingProvider: formData.mobileBankingProvider || null,
      mobileBankingNumber: formData.mobileBankingNumber || null,
      // Reference
      referenceName: formData.referenceName,
      referencePhone: formData.referencePhone,
      referenceOccupation: formData.referenceOccupation || null,
      // Emergency
      emergencyContactNo: formData.emergencyContactNo,
      emergencyRelationship: formData.emergencyRelationship,
      // Declaration
      declaration: formData.declaration,
      // Documents
      photoUrl: photoUrl || "",
      nidFrontCopyUrl: nidFrontCopyUrl || "",
      nidBackCopyUrl: nidBackCopyUrl || "",
      certificateUrls: certificateUrls, // Appwrite expects array
      experienceLetterUrl: experienceLetterUrl || "",
      cvUrl: cvUrl || "",
      tazkiyahUrl: tazkiyahUrl || "",
      // Meta - Only include required fields
      appliedAt: new Date().toISOString(),
    }
  );

  // ── 6. Audit log ─────────────────────────────────────────
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId: "public_form",
        userEmail: formData.email ?? "public",
        userRole: "public",
        action: "APPLICATION_SUBMITTED",
        targetType: "staff_application",
        targetId: applicationId,
        targetName: formData.nameBn || formData.nameEn,
        oldValue: null,
        newValue: JSON.stringify({ applicationId, designation: formData.designation }),
        ipAddress: "",
        userAgent: "",
        createdAt: new Date().toISOString(),
      }
    );
  } catch {
    // Non-critical
  }

  return { applicationId, success: true };
}

// ─── Approve Application ───────────────────────────────────
export async function approveApplication(
  applicationDocId: string,
  adminUserId: string,
  adminNotes?: string
): Promise<{ staffId: string; success: true }> {
  const { databases } = await createAdminClient();

  // 1. Get application
  const application = await databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId
  );

  if (application.status !== "pending") {
    throw new Error("আবেদনটি ইতিমধ্যে প্রক্রিয়াধীন বা নিষ্পত্তি হয়েছে");
  }

  // 2. Generate staff ID
  const staffId = await generateStaffId(databases);

  // 3. Create STAFF record
  await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    ID.unique(),
    {
      staffId,
      userId: "",
      name: application.nameBn || application.nameEn,
      nameEn: application.nameEn,
      nameBn: application.nameBn,
      fatherNameBn: application.fatherNameBn,
      fatherNameEn: application.fatherNameEn,
      motherNameBn: application.motherNameBn,
      motherNameEn: application.motherNameEn,
      designation: application.designation,
      department: "",
      joiningDate: application.expectedJoiningDate ? new Date(application.expectedJoiningDate).toISOString() : new Date().toISOString(),
      expectedJoiningDate: application.expectedJoiningDate,
      expectedSalary: application.expectedSalary,
      salary: application.expectedSalary,
      bonus: 0,
      employmentType: application.employmentType,
      phone: application.phonePrimary,
      phoneSecondary: application.phoneSecondary ?? "",
      email: application.email ?? "",
      address: application.currentAddress,
      permanentAddress: application.permanentAddress ?? "",
      nidNumber: application.nidNumber,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender,
      maritalStatus: application.maritalStatus,
      religion: application.religion,
      nationality: application.nationality ?? "বাংলাদেশী",
      bloodGroup: application.bloodGroup ?? "unknown",
      emergencyContactNo: application.emergencyContactNo,
      emergencyRelationship: application.emergencyRelationship,
      photo: application.photoUrl ?? "",
      nfcCardId: "",
      isActive: true,
      education: application.education,
      socialLinks: application.socialLinks,
      previousWorkplace: "",
      previousWorkDuration: "",
      totalExperienceYears: application.totalExperienceYears ?? 0,
      isHafiz: application.isHafiz ?? false,
      specialSkills: application.specialSkills ?? "",
      nidFrontCopyUrl: application.nidFrontCopyUrl ?? "",
      nidBackCopyUrl: application.nidBackCopyUrl ?? "",
      certificateUrls: application.certificateUrls,
      experienceLetterUrl: application.experienceLetterUrl ?? "",
      cvUrl: application.cvUrl ?? "",
      tazkiyahUrl: application.tazkiyahUrl ?? "",
      paymentMethod: application.paymentMethod,
      bankName: application.bankName ?? "",
      bankBranch: application.bankBranch ?? "",
      accountName: application.accountName ?? "",
      accountNumber: application.accountNumber ?? "",
      mobileBankingProvider: application.mobileBankingProvider ?? "",
      mobileBankingNumber: application.mobileBankingNumber ?? "",
      referenceName: application.referenceName,
      referencePhone: application.referencePhone,
      referenceOccupation: application.referenceOccupation ?? "",
      noticePeriod: application.noticePeriod,
      declaration: application.declaration,
      createdAt: new Date().toISOString(),
    }
  );

  // 4. Update application status
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId,
    {
      status: "approved",
      assignedStaffId: staffId,
      reviewedBy: adminUserId,
      reviewedAt: new Date().toISOString(),
      reviewNotes: adminNotes ?? "",
    }
  );

  // 5. Audit log
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId: adminUserId,
        userEmail: "",
        userRole: "admin",
        action: "APPLICATION_APPROVED",
        targetType: "staff_application",
        targetId: applicationDocId,
        targetName: application.nameBn || application.nameEn,
        oldValue: JSON.stringify({ status: "pending" }),
        newValue: JSON.stringify({ status: "approved", staffId }),
        ipAddress: "",
        userAgent: "",
        createdAt: new Date().toISOString(),
      }
    );
  } catch {
    // Non-critical
  }

  return { staffId, success: true };
}

// ─── Reject Application ────────────────────────────────────
export async function rejectApplication(
  applicationDocId: string,
  adminUserId: string,
  reason: string
): Promise<{ success: true }> {
  const { databases } = await createAdminClient();

  // 1. Update application status
  await databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId,
    {
      status: "rejected",
      reviewedBy: adminUserId,
      reviewedAt: new Date().toISOString(),
      reviewNotes: reason,
    }
  );

  // 2. Audit log
  try {
    const application = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.STAFF_APPLICATIONS,
      applicationDocId
    );

    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId: adminUserId,
        userEmail: "",
        userRole: "admin",
        action: "APPLICATION_REJECTED",
        targetType: "staff_application",
        targetId: applicationDocId,
        targetName: application.nameBn || application.nameEn,
        oldValue: JSON.stringify({ status: "pending" }),
        newValue: JSON.stringify({ status: "rejected", reason }),
        ipAddress: "",
        userAgent: "",
        createdAt: new Date().toISOString(),
      }
    );
  } catch {
    // Non-critical
  }

  return { success: true };
}

// ─── Get pending applications ──────────────────────────────
export async function getPendingApplications({
  limit = 25,
  offset = 0,
}: { limit?: number; offset?: number } = {}) {
  const { databases } = await createAdminClient();

  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    [
      Query.equal("status", "pending"),
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("appliedAt"),
    ]
  );
}

// ─── Get single application ────────────────────────────────
export async function getApplicationById(applicationDocId: string) {
  const { databases } = await createAdminClient();

  return databases.getDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF_APPLICATIONS,
    applicationDocId
  );
}

// ─── Staff ID generator (for approve flow) ─────────────────
async function generateStaffId(databases: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `STF-${year}-`;

  const existing = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    [
      Query.startsWith("staffId", prefix),
      Query.orderDesc("staffId"),
      Query.limit(1),
    ]
  );

  let nextNumber = 1;
  if (existing.total > 0) {
    const lastId = existing.documents[0].staffId as string;
    const lastNum = parseInt(lastId.split("-")[2] ?? "0", 10);
    nextNumber = lastNum + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}
