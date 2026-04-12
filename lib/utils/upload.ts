"use client";

import { ID } from "appwrite";
import { storage, client } from "@/lib/appwrite/client";
import { BUCKETS, FILE_LIMITS, ACCEPTED_IMAGE_TYPES, ACCEPTED_DOC_TYPES } from "@/config/appwrite";

export type UploadProgress = {
  fileIndex: number;
  totalFiles: number;
  fileName: string;
  percentage: number;
  status: "uploading" | "completed" | "error";
};

export type ProgressCallback = (progress: UploadProgress) => void;

export type FileValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateFile(
  file: File,
  type: "photo" | "document"
): FileValidationResult {
  const maxSize = type === "photo" ? FILE_LIMITS.PHOTO : FILE_LIMITS.DOCUMENT;
  const acceptedTypes = type === "photo" ? ACCEPTED_IMAGE_TYPES : ACCEPTED_DOC_TYPES;

  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `ফাইল "${file.name}" এর সাইজ ${maxMB}MB এর বেশি হতে পারবে না। বর্তমান সাইজ: ${Math.round(file.size / (1024 * 1024))}MB`,
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

export function validateAllFiles(files: {
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
    const result = validateFile(files.photoFile, "photo");
    if (!result.valid && result.error) errors.push(result.error);
  }

  for (const file of [files.nidFrontCopyFile, files.nidBackCopyFile]) {
    if (file) {
      const result = validateFile(file, "document");
      if (!result.valid && result.error) errors.push(result.error);
    }
  }

  if (files.certificateFiles) {
    for (const file of files.certificateFiles) {
      if (file) {
        const result = validateFile(file, "document");
        if (!result.valid && result.error) errors.push(result.error);
      }
    }
  }

  for (const file of [files.experienceLetterFile, files.cvFile, files.tazkiyahFile]) {
    if (file) {
      const result = validateFile(file, "document");
      if (!result.valid && result.error) errors.push(result.error);
    }
  }

  return { valid: errors.length === 0, errors };
}

async function uploadSingleFile(
  file: File,
  bucketId: string,
  onProgress?: (percentage: number) => void
): Promise<string> {
  const fileId = ID.unique();
  
  const response = await storage.createFile(
    bucketId,
    fileId,
    file,
    onProgress
      ? [
          (res: any) => {
            if (res && typeof res.progress === "number") {
              onProgress(Math.round(res.progress));
            }
          },
        ]
      : undefined
  );

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  return `${endpoint}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${projectId}`;
}

export type FileUploadInput = {
  photoFile?: File;
  nidFrontCopyFile?: File;
  nidBackCopyFile?: File;
  certificateFiles?: File[];
  experienceLetterFile?: File;
  cvFile?: File;
  tazkiyahFile?: File;
};

export type FileUploadResult = {
  photoUrl: string;
  nidFrontCopyUrl: string;
  nidBackCopyUrl: string;
  certificateUrls: string[];
  experienceLetterUrl: string;
  cvUrl: string;
  tazkiyahUrl: string;
};

export async function uploadAllFiles(
  files: FileUploadInput,
  onProgress?: ProgressCallback
): Promise<FileUploadResult> {
  const allFiles: { file: File; bucketId: string; key: string }[] = [];

  if (files.photoFile) {
    allFiles.push({ file: files.photoFile, bucketId: BUCKETS.STAFF_PHOTOS, key: "photo" });
  }
  if (files.nidFrontCopyFile) {
    allFiles.push({ file: files.nidFrontCopyFile, bucketId: BUCKETS.DOCUMENTS, key: "nidFront" });
  }
  if (files.nidBackCopyFile) {
    allFiles.push({ file: files.nidBackCopyFile, bucketId: BUCKETS.DOCUMENTS, key: "nidBack" });
  }
  if (files.certificateFiles) {
    files.certificateFiles.forEach((file, idx) => {
      if (file) {
        allFiles.push({ file, bucketId: BUCKETS.DOCUMENTS, key: `certificate_${idx}` });
      }
    });
  }
  if (files.experienceLetterFile) {
    allFiles.push({ file: files.experienceLetterFile, bucketId: BUCKETS.DOCUMENTS, key: "experienceLetter" });
  }
  if (files.cvFile) {
    allFiles.push({ file: files.cvFile, bucketId: BUCKETS.DOCUMENTS, key: "cv" });
  }
  if (files.tazkiyahFile) {
    allFiles.push({ file: files.tazkiyahFile, bucketId: BUCKETS.DOCUMENTS, key: "tazkiyah" });
  }

  const totalFiles = allFiles.length;
  const results: Record<string, string> = {};
  const certificateUrls: string[] = [];

  for (let i = 0; i < allFiles.length; i++) {
    const { file, bucketId, key } = allFiles[i];

    onProgress?.({
      fileIndex: i + 1,
      totalFiles,
      fileName: file.name,
      percentage: 0,
      status: "uploading",
    });

    try {
      const url = await uploadSingleFile(file, bucketId, (percentage) => {
        onProgress?.({
          fileIndex: i + 1,
          totalFiles,
          fileName: file.name,
          percentage,
          status: "uploading",
        });
      });

      if (key.startsWith("certificate_")) {
        certificateUrls.push(url);
      } else {
        results[key] = url;
      }

      onProgress?.({
        fileIndex: i + 1,
        totalFiles,
        fileName: file.name,
        percentage: 100,
        status: "completed",
      });
    } catch (error) {
      onProgress?.({
        fileIndex: i + 1,
        totalFiles,
        fileName: file.name,
        percentage: 0,
        status: "error",
      });
      throw new Error(`"${file.name}" আপলোড করতে ব্যর্থ হয়েছে।`);
    }
  }

  return {
    photoUrl: results.photo || "",
    nidFrontCopyUrl: results.nidFront || "",
    nidBackCopyUrl: results.nidBack || "",
    certificateUrls,
    experienceLetterUrl: results.experienceLetter || "",
    cvUrl: results.cv || "",
    tazkiyahUrl: results.tazkiyah || "",
  };
}
