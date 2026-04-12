"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/admin";
import {
  DATABASE_ID,
  COLLECTIONS,
  BUCKETS,
} from "@/config/appwrite";
import type { FullStaffData } from "@/validations/staff";

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
  file: File
): Promise<string> {
  const result = await storage.createFile(
    bucketId,
    ID.unique(),
    file
  );

  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
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
  }
): Promise<{ applicationId: string; success: true }> {
  const { databases, storage } = await createAdminClient();

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
    experienceLetterUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.experienceLetterFile);
  }

  let cvUrl = "";
  if (formData.cvFile instanceof File) {
    cvUrl = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.cvFile);
  }

  let tazkiyahUrl = "";
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
      phoneSecondary: formData.phoneSecondary ?? "",
      email: formData.email ?? "",
      // Address
      currentAddress: currentAddressStr,
      permanentAddress: permanentAddressStr,
      // NID
      nidNumber: formData.nidNumber,
      // Professional
      designation: formData.designationCustom || formData.designation,
      employmentType: formData.employmentType,
      // Education & Skills
      education: JSON.stringify(formData.education ?? []),
      socialLinks: JSON.stringify(formData.socialLinks ?? {}),
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
      bankBranch: formData.bankBranch || "",
      accountName: formData.accountName || "",
      accountNumber: formData.accountNumber || "",
      mobileBankingProvider: formData.mobileBankingProvider || "",
      mobileBankingNumber: formData.mobileBankingNumber || "",
      // Reference
      referenceName: formData.referenceName,
      referencePhone: formData.referencePhone,
      referenceOccupation: formData.referenceOccupation || "",
      // Emergency
      emergencyContactNo: formData.emergencyContactNo,
      emergencyRelationship: formData.emergencyRelationship,
      // Declaration
      declaration: formData.declaration,
      // Documents
      photoUrl,
      nidFrontCopyUrl,
      nidBackCopyUrl,
      certificateUrls: JSON.stringify(certificateUrls),
      experienceLetterUrl,
      cvUrl,
      tazkiyahUrl,
      // Meta
      assignedStaffId: "",
      reviewedBy: "",
      reviewedAt: "",
      reviewNotes: "",
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
