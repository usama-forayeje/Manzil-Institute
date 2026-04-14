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
  phonePrimary?: string,
  nidNumber?: string
): Promise<{ isDuplicate: boolean; existingApplicationId?: string }> {
  // Primary check: NID + Email combination (most restrictive)
  if (nidNumber && email) {
    console.log("🔍 Checking NID + Email combination:");
    console.log("- Email:", email);
    console.log("- NID:", nidNumber);

    const { databases } = await createAdminClient();

    try {
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [
          Query.equal("email", email),
          Query.equal("nidNumber", nidNumber),
          Query.equal("status", "pending")
        ]
      );

      if (existing.total > 0) {
        console.log("🚫 Duplicate found - Same NID + Email combination exists");
        return {
          isDuplicate: true,
          existingApplicationId: existing.documents[0].applicationId,
        };
      }
    } catch (error) {
      console.error("❌ NID+Email duplicate check error:", error);
    }
  }

  // Fallback checks: individual field checks
  if (nidNumber) {
    console.log("🔍 Checking NID only:", nidNumber);
    try {
      const { databases } = await createAdminClient();
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [
          Query.equal("nidNumber", nidNumber),
          Query.equal("status", "pending")
        ]
      );

      if (existing.total > 0) {
        console.log("🚫 Duplicate found - Same NID exists");
        return {
          isDuplicate: true,
          existingApplicationId: existing.documents[0].applicationId,
        };
      }
    } catch (error) {
      console.error("❌ NID duplicate check error:", error);
    }
  }

  if (email) {
    console.log("🔍 Checking Email only:", email);
    try {
      const { databases } = await createAdminClient();
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STAFF_APPLICATIONS,
        [
          Query.equal("email", email),
          Query.equal("status", "pending")
        ]
      );

      if (existing.total > 0) {
        console.log("🚫 Duplicate found - Same Email exists");
        return {
          isDuplicate: true,
          existingApplicationId: existing.documents[0].applicationId,
        };
      }
    } catch (error) {
      console.error("❌ Email duplicate check error:", error);
    }
  }

  console.log("✅ No duplicates found");
  return { isDuplicate: false };
}

// ─── Application ID generator ───────────────────────────────
async function generateApplicationId(databases: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `MI-${year}-`;

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
  file: File | string, // Accept File or base64 string
  customFileId?: string // Optional custom file ID for standard naming
): Promise<{ url: string; fileId: string } | null> {
  // If bucket ID is empty, skip upload and return empty string
  if (!bucketId) {
    console.warn("Bucket ID is empty, skipping upload for bucket:", bucketId);
    return null;
  }

  // Check if bucket exists by trying to list files (just to check bucket)
  try {
    await storage.listFiles(bucketId, [], 1);
  } catch (bucketError: any) {
    console.error("Bucket check failed for:", bucketId, "Error:", bucketError.message);
    console.error("Make sure the bucket exists and is properly configured in Appwrite");
    return null;
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

  // Use custom file ID or generate unique one
  const fileId = customFileId || ID.unique();

  try {
    const uploadSize = (fileToUpload.size / 1024 / 1024).toFixed(2); // MB
    console.log(`📤 Uploading to bucket ${bucketId}: ${uploadSize}MB (${fileId})`);

    const result = await storage.createFile(
      bucketId,
      fileId,
      fileToUpload
    );

    const finalFileId = result.$id;
    console.log(`✅ Successfully uploaded: ${finalFileId}`);
    const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${finalFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    // Ensure URL is within Appwrite's 500 char limit
    let finalUrl = url;
    if (url.length > 500) {
      console.warn("Generated URL too long, using shorter version:", url.length);
      finalUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${finalFileId}/view`;
    }

    return { url: finalUrl, fileId: finalFileId };
  } catch (error: any) {
    console.error("Upload failed for bucket:", bucketId, "Error:", error.message, "Code:", error.code);
    // If bucket doesn't exist, return null instead of empty string
    if (error.code === 404 || error.message?.includes("bucket")) {
      console.warn("Storage bucket not found, skipping upload:", bucketId);
      return null;
    }
    // For other errors, return null
    return null;
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
  }
): Promise<{ applicationId: string; success: true }> {
  // Rate limiting check - prevent duplicate applications
  console.log("🔒 Starting duplicate check...");
  const duplicateCheck = await checkDuplicateApplication(
    formData.email,
    formData.phonePrimary,
    formData.nidNumber
  );

  if (duplicateCheck.isDuplicate) {
    console.log("🚫 Duplicate application detected!");
    // Create a custom error that can be handled gracefully
    const duplicateError = new Error(`DUPLICATE_APPLICATION:এই তথ্য দিয়ে ইতিমধ্যে একটি আবেদন জমা হয়েছে। আবেদন ID: ${duplicateCheck.existingApplicationId}`);
    duplicateError.name = "DuplicateApplicationError";
    throw duplicateError;
  }
  console.log("✅ Duplicate check passed");

  // Debug: Check bucket configuration
  console.log("=== Bucket Configuration Check ===");
  console.log("STAFF_PHOTOS bucket:", BUCKETS.STAFF_PHOTOS || "NOT CONFIGURED");
  console.log("DOCUMENTS bucket:", BUCKETS.DOCUMENTS || "NOT CONFIGURED");
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

  let uploadedFileIds: string[] = [];
  // Handle both photoUrl and photoBase64 from Step 1
  let photoUrl = formData.photoUrl || formData.photoBase64 || null;
  let nidFrontCopyUrl = formData.nidFrontCopyUrl || null;
  let nidBackCopyUrl = formData.nidBackCopyUrl || null;
  let certificateUrls: string[] = [];
  let experienceLetterUrl = formData.experienceLetterUrl || null;
  let cvUrl = formData.cvUrl || null;
  let tazkiyahUrl: string | null = null;

  // DEBUG: Log received form data keys
  console.log("=== Server Action: Received form data ===");
  console.log("Keys:", Object.keys(formData));
  console.log("photoUrl:", photoUrl ? "present" : "none");
  console.log("photoBase64:", formData.photoBase64 ? "present" : "none");
  console.log("nidFrontCopyUrl:", nidFrontCopyUrl ? "present" : "none");
  console.log("nidBackCopyUrl:", nidBackCopyUrl ? "present" : "none");
  console.log("formData.nidFrontCopyUrl:", formData.nidFrontCopyUrl ? "present" : "none");
  console.log("formData.nidBackCopyUrl:", formData.nidBackCopyUrl ? "present" : "none");
  console.log("certificateUrls:", formData.certificateUrls?.length ?? 0);
  console.log("cvUrl:", formData.cvUrl ? "present" : "none");
  console.log("whatsappNo:", formData.whatsappNo);
  console.log("socialLinks.facebook:", formData.socialLinks?.facebook || "none");
  console.log("designation:", formData.designation || "none");
  console.log("designation length:", formData.designation?.length || "N/A");
  console.log("designation starts with MI?:", formData.designation?.startsWith("MI-") ? "NO - this is App ID format" : "YES - this is designation ID");
  console.log("nidNumber:", formData.nidNumber || "none");
  console.log("email:", formData.email || "none");

  // Generate application ID first for file naming
  const applicationId = await generateApplicationId(databases);
  const timestamp = Date.now();

  // Get user name for file naming (sanitize: remove spaces, special chars)
  const rawName = formData.nameEn || formData.nameBn || "user";
  const sanitizedName = rawName
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF]/g, "") // Keep Bengali chars too
    .replace(/\s+/g, "")
    .substring(0, 20); // Limit length

  // Helper function for standard file naming (Appwrite limit: 36 chars max)
  const getFileId = (type: string, index?: number) => {
    const idx = index !== undefined ? `_${index}` : '';

    // Create readable format: username_applicationId_type[_index]
    // Truncate to fit within 36 char limit
    const maxNameLen = 8; // Leave room for other parts
    const shortName = sanitizedName.substring(0, maxNameLen).toLowerCase();
    const shortAppId = applicationId.replace('MI-', 'MI'); // Remove hyphen to save space
    const shortType = type.substring(0, 10); // Type can be longer

    let fileId = `${shortName}_${shortAppId}_${shortType}${idx}`;

    // If still too long, truncate further
    if (fileId.length > 36) {
      const nameLen = Math.max(3, 36 - shortAppId.length - shortType.length - idx.length - 3); // 3 for underscores
      const truncatedName = shortName.substring(0, nameLen);
      fileId = `${truncatedName}_${shortAppId}_${shortType}${idx}`;
    }

    console.log(`📁 Generated readable fileId: ${fileId} (length: ${fileId.length})`);
    return fileId;
  };

  // Photo: Handle File object OR base64 URL
  console.log("Starting photo upload, photoUrl value:", photoUrl?.substring(0, 30));
  if (formData.photoFile instanceof File) {
    const photoResult = await uploadFile(storage, BUCKETS.STAFF_PHOTOS, formData.photoFile, getFileId('profile'));
    console.log("Photo upload (File) result:", photoResult?.url ? "success" : "null");
    photoUrl = photoResult?.url || null; if (photoResult?.fileId) uploadedFileIds.push(photoResult.fileId);
  } else if (photoUrl && photoUrl.startsWith("data:")) {
    console.log("Photo upload (base64) starting...");
    const photoResult2 = await uploadFile(storage, BUCKETS.STAFF_PHOTOS, photoUrl, getFileId('profile'));
    console.log("Photo upload (base64) result:", photoResult2?.url ? "success" : "null");
    photoUrl = photoResult2?.url || null; if (photoResult2?.fileId) uploadedFileIds.push(photoResult2.fileId);
  }

  // NID Front: Handle File object OR base64 URL
  console.log("NID Front - hasFile:", !!formData.nidFrontCopyFile, "hasUrl:", !!nidFrontCopyUrl);
  if (formData.nidFrontCopyFile instanceof File) {
    const nidFrontResult = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidFrontCopyFile, getFileId('nid_front'));
    console.log("NID Front upload result:", nidFrontResult?.url ? "success" : "failed");
    nidFrontCopyUrl = nidFrontResult?.url || null; if (nidFrontResult?.fileId) uploadedFileIds.push(nidFrontResult.fileId);
  } else if (nidFrontCopyUrl && nidFrontCopyUrl.startsWith("data:")) {
    const nidFrontResult2 = await uploadFile(storage, BUCKETS.DOCUMENTS, nidFrontCopyUrl, getFileId('nid_front'));
    console.log("NID Front base64 upload result:", nidFrontResult2?.url ? "success" : "failed");
    nidFrontCopyUrl = nidFrontResult2?.url || null; if (nidFrontResult2?.fileId) uploadedFileIds.push(nidFrontResult2.fileId);
  }

  // NID Back: Handle File object OR base64 URL
  console.log("NID Back - hasFile:", !!formData.nidBackCopyFile, "hasUrl:", !!nidBackCopyUrl);
  if (formData.nidBackCopyFile instanceof File) {
    const nidBackResult = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.nidBackCopyFile, getFileId('nid_back'));
    console.log("NID Back upload result:", nidBackResult?.url ? "success" : "failed");
    nidBackCopyUrl = nidBackResult?.url || null; if (nidBackResult?.fileId) uploadedFileIds.push(nidBackResult.fileId);
  } else if (nidBackCopyUrl && nidBackCopyUrl.startsWith("data:")) {
    const nidBackResult2 = await uploadFile(storage, BUCKETS.DOCUMENTS, nidBackCopyUrl, getFileId('nid_back'));
    console.log("NID Back base64 upload result:", nidBackResult2?.url ? "success" : "failed");
    nidBackCopyUrl = nidBackResult2?.url || null; if (nidBackResult2?.fileId) uploadedFileIds.push(nidBackResult2.fileId);
  } else {
    console.log("NID Back - no file and no base64 URL found");
  }

  // Certificates: Handle File objects OR base64 URLs from draft
  console.log("Starting certificate upload, count:", formData.certificateUrls?.length ?? 0);
  if (Array.isArray(formData.certificateFiles)) {
    for (let i = 0; i < formData.certificateFiles.length; i++) {
      const file = formData.certificateFiles[i];
      if (file instanceof File) {
        const certResult = await uploadFile(storage, BUCKETS.DOCUMENTS, file, getFileId('certificate', i));
        if (certResult?.url) { certificateUrls.push(certResult.url); if (certResult.fileId) uploadedFileIds.push(certResult.fileId); }
      }
    }
  }
  if (Array.isArray(formData.certificateUrls)) {
    for (let i = 0; i < formData.certificateUrls.length; i++) {
      const url = formData.certificateUrls[i];
      if (url && url.startsWith("data:")) {
        const certResult2 = await uploadFile(storage, BUCKETS.DOCUMENTS, url, getFileId('certificate', i));
        if (certResult2?.url) { certificateUrls.push(certResult2.url); if (certResult2.fileId) uploadedFileIds.push(certResult2.fileId); }
      }
    }
  }

  // Experience Letter: Handle File OR base64 URL
  console.log("Starting exp letter upload, has value:", !!formData.experienceLetterUrl);
  if (formData.experienceLetterFile instanceof File) {
    const expResult = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.experienceLetterFile, getFileId('experience_letter'));
    experienceLetterUrl = expResult?.url || null; if (expResult?.fileId) uploadedFileIds.push(expResult.fileId);
  } else if (formData.experienceLetterUrl && formData.experienceLetterUrl.startsWith("data:")) {
    const expResult2 = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.experienceLetterUrl, getFileId('experience_letter'));
    experienceLetterUrl = expResult2?.url || null; if (expResult2?.fileId) uploadedFileIds.push(expResult2.fileId);
  }

  // CV: Handle File OR base64 URL
  console.log("Starting CV upload, has value:", !!formData.cvUrl);
  if (formData.cvFile instanceof File) {
    const cvResult = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.cvFile, getFileId('cv'));
    cvUrl = cvResult?.url || null; if (cvResult?.fileId) uploadedFileIds.push(cvResult.fileId);
  } else if (formData.cvUrl && formData.cvUrl.startsWith("data:")) {
    const cvResult2 = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.cvUrl, getFileId('cv'));
    cvUrl = cvResult2?.url || null; if (cvResult2?.fileId) uploadedFileIds.push(cvResult2.fileId);
  }

  // Tazkiyah: Handle File OR base64 URL
  if (formData.tazkiyahFile instanceof File) {
    const tazResult = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.tazkiyahFile, getFileId('tazkiyah'));
    tazkiyahUrl = tazResult?.url || null; if (tazResult?.fileId) uploadedFileIds.push(tazResult.fileId);
  } else if (formData.tazkiyahUrl && formData.tazkiyahUrl.startsWith("data:")) {
    const tazResult2 = await uploadFile(storage, BUCKETS.DOCUMENTS, formData.tazkiyahUrl, getFileId('tazkiyah'));
    tazkiyahUrl = tazResult2?.url || null; if (tazResult2?.fileId) uploadedFileIds.push(tazResult2.fileId);
  }

  console.log("=== After uploads ===");
  console.log("photoUrl:", photoUrl ? "UPLOADED" : "null");
  console.log("nidFrontCopyUrl:", nidFrontCopyUrl ? "UPLOADED" : "null");
  console.log("certificateUrls:", certificateUrls.length);
  console.log("cvUrl:", cvUrl ? "UPLOADED" : "null");
  console.log("experienceLetterUrl:", experienceLetterUrl ? "UPLOADED" : "null");

  // If no buckets are configured, skip file uploads but continue with application
  const hasBuckets = BUCKETS.STAFF_PHOTOS && BUCKETS.DOCUMENTS;
  if (!hasBuckets) {
    console.warn("⚠️ Storage buckets not configured - files will not be uploaded but application will be saved");
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
  try {
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
      // Contact - Convert Bengali numbers to English
      phonePrimary: convertBengaliToEnglish(formData.phonePrimary),
      phoneSecondary: formData.phoneSecondary ? convertBengaliToEnglish(formData.phoneSecondary) : null,
      whatsappNo: formData.whatsappNo ? convertBengaliToEnglish(formData.whatsappNo) : null,
      email: formData.email && formData.email.includes("@") ? formData.email : null,
      // Address
      currentAddress: currentAddressStr,
      permanentAddress: permanentAddressStr,
      // NID
      nidNumber: formData.nidNumber,
      // Professional
      
      designation_id: formData.designation || "", // Should be the document $id from designation collection
      
      employmentType: formData.employmentType,
      // Education & Skills - Appwrite expects array of strings
      education: Array.isArray(formData.education) && formData.education.length > 0
        ? formData.education.map((e: any) => `${e.degree} - ${e.institution} (${e.year})`)
        : [],
      // Social Links - individual fields (not JSON)
      fb_links: formData.socialLinks?.facebook || null,
      x_link: formData.socialLinks?.twitter || null,
      linedin_ink: formData.socialLinks?.linkedin || null, // Note: database has "linedin_ink" (typo)
      instagram_link: formData.socialLinks?.instagram || null,
      website_link: formData.socialLinks?.website || null,
      totalExperienceYears: parseInt(formData.totalExperienceYears) || 0,
      isHafiz: formData.isHafiz ?? false,
      specialSkills: formData.specialSkills ?? "",
      // Expected Terms
      expectedSalary: formData.expectedSalary,
      expectedJoiningDate: formData.expectedJoiningDate,
      
      // Payment
      paymentMethod: formData.paymentMethod,
      bankName: formData.bankName || "",
      bankBranch: formData.bankBranch || null,
      accountName: formData.accountName || null,
      accountNumber: formData.accountNumber || null,
      mobileBankingProvider: formData.mobileBankingProvider || null,
      mobileBankingNumber: formData.mobileBankingNumber ? convertBengaliToEnglish(formData.mobileBankingNumber) : null,
      // Reference
      referenceName: formData.referenceName,
      referencePhone: convertBengaliToEnglish(formData.referencePhone),
      referenceOccupation: formData.referenceOccupation || null,
      // Emergency
      emergencyContactNo: convertBengaliToEnglish(formData.emergencyContactNo),
      emergencyRelationship: formData.emergencyRelationship,
      // Declaration
      declaration: formData.declaration,
      // Documents - only use URLs, not base64 data
      photoUrl: (photoUrl && !photoUrl.startsWith("data:")) ? photoUrl : "",
      nidFrontCopyUrl: (nidFrontCopyUrl && !nidFrontCopyUrl.startsWith("data:")) ? nidFrontCopyUrl : "",
      nidBackCopyUrl: (nidBackCopyUrl && !nidBackCopyUrl.startsWith("data:")) ? nidBackCopyUrl : "",
      certificateUrls: certificateUrls.filter((url: string) => url && !url.startsWith("data:")), // Filter out base64
      experienceLetterUrl: (experienceLetterUrl && !experienceLetterUrl.startsWith("data:")) ? experienceLetterUrl : "",
      cvUrl: (cvUrl && !cvUrl.startsWith("data:")) ? cvUrl : "",
      
      // Meta - Only include required fields
      appliedAt: new Date().toISOString(),
      }
    );
  } catch (docError) {
    // Cleanup uploaded files on document creation failure
    for (const fileId of uploadedFileIds) {
      try { await storage.deleteFile(BUCKETS.STAFF_PHOTOS, fileId); } catch {}
      try { await storage.deleteFile(BUCKETS.DOCUMENTS, fileId); } catch {}
    }
    throw docError;
  }

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
async function generateStaffId(databases: any): Promise<{ url: string; fileId: string } | null> {
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
