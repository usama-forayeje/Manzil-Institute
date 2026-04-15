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

// ─── File ID generator ─────────────────────────────────────
// Format: {username}_{staffId}_{type}  (max 36 chars — Appwrite limit)
function buildFileId(
  rawName: string,    // nameEn or nameBn
  staffId: string,     // "STF-2026-001"
  type: string,        // "profile" | "nid_front" | "nid_back" | "cv" | "certificate" | "exp_letter" | "tazkiyah"
  index?: number       // for multi-file types (certificates)
): string {
  // Sanitize name: only lowercase a-z and 0-9, max 12 chars
  const name = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 12);

  // Compact staff ID: "STF-2026-001" → "stf2026001"
  const sId = staffId
    .toLowerCase()
    .replace(/-/g, "");

  const suffix = index !== undefined ? `_${index}` : "";
  const id     = `${name}_${sId}_${type}${suffix}`;

  console.log(`📝 Generated file ID: ${id} (name: ${name}, staffId: ${staffId}, type: ${type}, suffix: ${suffix})`);

  // Hard cap at 36 chars (Appwrite fileId limit)
  if (id.length <= 36) return id;

  // Truncate name to fit
  const overhead   = sId.length + type.length + suffix.length + 3; // 3 underscores
  const allowedName = Math.max(3, 36 - overhead);
  return `${name.substring(0, allowedName)}_${sId}_${type}${suffix}`;
}

  // ── 1. File upload helper ───────────────────────────────────
  async function uploadFile(
    storage:   any,
    bucketId:  string,
    source:    File | string,    // File object OR base64 data URL
    fileId:    string
  ): Promise<string> {
    if (!bucketId) {
      console.warn(`⚠️ Bucket not configured, skipping upload (type: ${fileId})`);
      return "";
    }

    let fileToUpload: File;

    if (typeof source === "string") {
      // base64 data URL → File
      if (!source.startsWith("data:")) return "";

      const [meta, base64Data] = source.split(",");
      if (!base64Data) return "";

      const mimeType = meta.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
      try {
        const binary = atob(base64Data);
        const bytes  = new Uint8Array(binary.length);
        for (let i =0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        fileToUpload = new File([bytes], `${fileId}.jpg`, { type: mimeType });
      } catch (err) {
        console.error(`Failed to convert base64 for ${fileId}:`, err);
        return "";
      }
    } else {
      fileToUpload = source;
    }

    try {
      const result = await storage.createFile(bucketId, fileId, fileToUpload);
      const url    = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      console.log(`✅ Uploaded: ${result.$id} (${(fileToUpload.size / 1024).toFixed(1)} KB)`);
      return url;
    } catch (err: any) {
      console.error(`❌ Upload failed (${fileId}):`, err.message);
      return "";
    }
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

  // ── 1. Staff ID generate ─────────────────────────────────
  const staffId = await generateStaffId(databases);

  // ── 2. Generate file ID helper ───────────────────────────
  const rawName = formData.nameEn || formData.nameBn || "user";
  const fid = (type: string, index?: number) => buildFileId(rawName, staffId, type, index);

  // ── 3. Photo upload ──────────────────────────────────────
  let photoUrl = "";
  const photoSource = formData.photoFile ?? (formData as any).photoBase64;
  if (photoSource && (photoSource instanceof File || typeof photoSource === "string")) {
    photoUrl = await uploadFile(
      storage,
      BUCKETS.STAFF_PHOTOS,
      photoSource,
      fid("profile")
    );
  }

  // ── 2. Documents upload ──────────────────────────────────
  let nidFrontCopyUrl = "";
  const nidFrontSource = formData.nidFrontCopyFile ?? (formData as any).nidFrontBase64;
  if (nidFrontSource && (nidFrontSource instanceof File || typeof nidFrontSource === "string")) {
    nidFrontCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, nidFrontSource, fid("nid_front"));
  }
  
  let nidBackCopyUrl = "";
  const nidBackSource = formData.nidBackCopyFile ?? (formData as any).nidBackBase64;
  if (nidBackSource && (nidBackSource instanceof File || typeof nidBackSource === "string")) {
    nidBackCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, nidBackSource, fid("nid_back"));
  }

  const certificateUrls: string[] = [];
  if (Array.isArray(formData.certificateFiles)) {
    for (let i =0; i < formData.certificateFiles.length; i++) {
      const file = formData.certificateFiles[i];
      if (file && (file instanceof File || typeof file === "string")) {
        const url = await uploadFile(storage, BUCKETS.DOCUMENTS, file, `certificate_${i}`);
        if (url) certificateUrls.push(url);
      }
    }
  }

  let experienceLetterUrl = "";
  const expLetterSource = formData.experienceLetterFile ?? (formData as any).experienceLetterUrl;
  // Only upload if URL is base64 (not blob or empty)
  if (expLetterSource && typeof expLetterSource === "string" && expLetterSource.startsWith("data:")) {
    experienceLetterUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, expLetterSource, fid("exp_letter"));
  } else if (expLetterSource instanceof File) {
    experienceLetterUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, expLetterSource, fid("exp_letter"));
  }

  let cvUrl = "";
  const cvSource = formData.cvFile ?? (formData as any).cvUrl;
  // Only upload if URL is base64 (not blob or empty)
  if (cvSource && typeof cvSource === "string" && cvSource.startsWith("data:")) {
    cvUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, cvSource, fid("cv"));
  } else if (cvSource instanceof File) {
    cvUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, cvSource, fid("cv"));
  }
  let nidBackCopyUrl = "";
  if (formData.nidBackCopyFile instanceof File) {
    nidBackCopyUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidBackCopyFile, fid("nid_back"));
  }

  const certificateUrls: string[] = [];
  if (Array.isArray(formData.certificateFiles)) {
    for (let i = 0; i < formData.certificateFiles.length; i++) {
      const file = formData.certificateFiles[i];
      if (file instanceof File) {
        const url = await uploadFile(storage, BUCKETS.DOCUMENTS, file, fid("certificate", i));
        certificateUrls.push(url);
      }
    }
  }

  let experienceLetterUrl = "";
  if (formData.experienceLetterFile instanceof File) {
    experienceLetterUrl = await uploadFile(
      storage,
      BUCKETS.DOCUMENTS,
      formData.experienceLetterFile,
      fid("exp_letter")
    );
  }

  let cvUrl = "";
  if (formData.cvFile instanceof File) {
    cvUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.cvFile, fid("cv"));
  }



  // ── 4. Full address string build ─────────────────────────
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
    .join(", ");

  const permanentAddressStr = [
    permanentAddr.village,
    permanentAddr.postOffice,
    permanentAddr.thana,
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