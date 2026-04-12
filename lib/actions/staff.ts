"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/admin";
import {
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS,
} from "@/config/appwrite";
import type { FullStaffData } from "@/validations/staff";

// ─── Staff ID generator ────────────────────────────────────
async function generateStaffId(databases: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `STF-${year}-`;

  // সর্বশেষ staff ID বের করো
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
    const lastId   = existing.documents[0].staffId as string;
    const lastNum  = parseInt(lastId.split("-")[2] ?? "0", 10);
    nextNumber     = lastNum + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
}

// ─── File upload helper ────────────────────────────────────
async function uploadFile(
  storage:   any,
  bucketId:  string,
  file:      File
): Promise<string> {
  const result = await storage.createFile(
    bucketId,
    ID.unique(),
    file
  );

  // File URL বানাও
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
}

// ─── Main Server Action ────────────────────────────────────
export async function createStaff(
  formData: FullStaffData & {
    photoFile?:           File;
    nidFrontCopyFile?:    File;
    nidBackCopyFile?:     File;
    certificateFiles?:    File[];
    experienceLetterFile?: File;
    cvFile?:              File;
    tazkiyahFile?:        File;
  }
): Promise<{ staffId: string; success: true }> {
  const { account, databases, storage } = await createAdminClient();

  // ── 1. Photo upload ──────────────────────────────────────
  let photoUrl = "";
  if (formData.photoFile instanceof File) {
    photoUrl = await uploadFile(storage, BUCKETS.STAFF_PHOTOS, formData.photoFile);
  }

  // ── 2. Documents upload ──────────────────────────────────
  let nidFrontCopyUrl = "";
  if (formData.nidFrontCopyFile instanceof File) {
    nidFrontCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidFrontCopyFile);
  }
  let nidBackCopyUrl = "";
  if (formData.nidBackCopyFile instanceof File) {
    nidBackCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidBackCopyFile);
  }

  const certificateUrls: string[] = [];
  if (Array.isArray(formData.certificateFiles)) {
    for (const file of formData.certificateFiles) {
      if (file instanceof File) {
        const url = await uploadFile(storage, BUCKETS.DOCUMENTS, file);
        certificateUrls.push(url);
      }
    }
  }

  let experienceLetterUrl = "";
  if (formData.experienceLetterFile instanceof File) {
    experienceLetterUrl = await uploadFile(
      storage,
      BUCKETS.DOCUMENTS,
      formData.experienceLetterFile
    );
  }

  let cvUrl = "";
  if (formData.cvFile instanceof File) {
    cvUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.cvFile);
  }

  let tazkiyahUrl = "";
  if (formData.tazkiyahFile instanceof File) {
    tazkiyahUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.tazkiyahFile);
  }

  // ── 3. Staff ID generate ─────────────────────────────────
  const staffId = await generateStaffId(databases);

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
  ]
    .filter(Boolean)
    .join(", ");

  const permanentAddressStr = [
    permanentAddr.village,
    permanentAddr.postOffice,
    permanentAddr.thana,
    permanentAddr.upazila,
    permanentAddr.district,
    permanentAddr.division,
  ]
    .filter(Boolean)
    .join(", ");

  // ── 5. Staff collection এ insert ─────────────────────────
  await databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    ID.unique(),
    {
      staffId,
      userId:      "",      // Google OAuth এর পরে link হবে
      name:        formData.nameBn || formData.nameEn,
      nameEn:      formData.nameEn,
      nameBn:      formData.nameBn,
      fatherNameBn: formData.fatherNameBn,
      fatherNameEn: formData.fatherNameEn,
      motherNameBn: formData.motherNameBn,
      motherNameEn: formData.motherNameEn,
      designation: formData.designationCustom || formData.designation,
      department:  formData.department ?? "",
      joiningDate: formData.expectedJoiningDate ? new Date(formData.expectedJoiningDate).toISOString() : new Date().toISOString(),
      expectedJoiningDate: formData.expectedJoiningDate,
      expectedSalary: formData.expectedSalary,
      salary:      formData.expectedSalary,
      employmentType:    formData.employmentType,
      phone:       formData.phonePrimary,
      phoneSecondary:    formData.phoneSecondary ?? "",
      email:       formData.email ?? "",
      address:     currentAddressStr,
      permanentAddress:  permanentAddressStr,
      nidNumber:   formData.nidNumber,
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      gender:      formData.gender,
      maritalStatus:   formData.maritalStatus,
      religion:        formData.religion,
      nationality:     formData.nationality ?? "বাংলাদেশী",
      bloodGroup:  formData.bloodGroup ?? "unknown",
      emergencyContactNo: formData.emergencyContactNo,
      emergencyRelationship: formData.emergencyRelationship,
      photo:       photoUrl,
      nfcCardId:   "",
      isActive:    true,
      // Education & Online Presence
      education:             JSON.stringify(formData.education ?? []),
      socialLinks:           JSON.stringify(formData.socialLinks ?? {}),
      // Experience
      previousWorkplace:    formData.previousWorkplace ?? "",
      previousWorkDuration: formData.previousWorkDuration ?? "",
      totalExperienceYears: formData.totalExperienceYears ?? 0,
      // Madrasha specific
      isHafiz:       formData.isHafiz ?? false,
      specialSkills: formData.specialSkills ?? "",
      // Documents
      nidFrontCopyUrl,
      nidBackCopyUrl,
      certificateUrls:       JSON.stringify(certificateUrls),
      experienceLetterUrl,
      cvUrl,
      tazkiyahUrl,
      // Payment Info
      paymentMethod:      formData.paymentMethod,
      bankName:           formData.bankName || "",
      bankBranch:         formData.bankBranch || "",
      accountName:        formData.accountName || "",
      accountNumber:      formData.accountNumber || "",
      mobileBankingProvider: formData.mobileBankingProvider || "",
      mobileBankingNumber:   formData.mobileBankingNumber || "",
      // Reference Info
      referenceName:      formData.referenceName,
      referencePhone:     formData.referencePhone,
      referenceOccupation: formData.referenceOccupation,
      noticePeriod:       formData.noticePeriod,
      declaration:        formData.declaration,
      createdAt:          new Date().toISOString(),
    }
  );

  // ── 6. Audit log ─────────────────────────────────────────
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      {
        userId:      "public_form",
        userEmail:   formData.email ?? "public",
        userRole:    "public",
        action:      "STAFF_REGISTERED",
        targetType:  "staff",
        targetId:    staffId,
        targetName:  formData.nameBn || formData.nameEn,
        oldValue:    null,
        newValue:    JSON.stringify({ staffId, designation: formData.designation }),
        ipAddress:   "",
        userAgent:   "",
        createdAt:   new Date().toISOString(),
      }
    );
  } catch {
    // Audit log failure is non-critical — main flow চলবে
  }

  return { staffId, success: true };
}

// ─── Get staff list ────────────────────────────────────────
export async function getStaffList({
  search,
  limit = 25,
  offset = 0,
}: {
  search?: string;
  limit?:  number;
  offset?: number;
} = {}) {
  const { databases } = await createAdminClient();

  const queries = [
    Query.equal("isActive", true),
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc("createdAt"),
  ];

  if (search) {
    queries.push(Query.search("name", search));
  }

  return databases.listDocuments(DATABASE_ID, COLLECTIONS.STAFF, queries);
}

// ─── Get single staff ──────────────────────────────────────
export async function getStaffById(staffId: string) {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    [Query.equal("staffId", staffId), Query.limit(1)]
  );

  return result.documents[0] ?? null;
}

// ─── Toggle active status ──────────────────────────────────
export async function toggleStaffActive(documentId: string, isActive: boolean) {
  const { databases } = await createAdminClient();

  return databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.STAFF,
    documentId,
    { isActive }
  );
}