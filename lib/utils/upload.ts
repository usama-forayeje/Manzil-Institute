"use client";

import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, validateR2Config, R2_BUCKET, buildR2Key, buildR2Url } from "@/config/r2";
import { FILE_LIMITS, ACCEPTED_IMAGE_TYPES, ACCEPTED_DOC_TYPES } from "@/config/appwrite";

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
  folder: string,
  fileId: string,
  onProgress?: (percentage: number) => void
): Promise<string> {
  const r2Validation = validateR2Config();
  if (!r2Validation.valid) {
    throw new Error("R2 storage not configured properly");
  }

  const r2Key = buildR2Key(folder, fileId);
  const bucketName = R2_BUCKET;

  try {
    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
    });
    await r2Client.send(headCommand);
  } catch (headErr: any) {
    if (headErr.name !== 'NotFound' && headErr.name !== 'NoSuchKey') {
      throw headErr;
    }
  }

  const uploadCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2Key,
    Body: file,
    ContentType: file.type,
    Metadata: {
      uploadedAt: new Date().toISOString(),
      originalName: file.name,
      fileSize: file.size.toString(),
    },
  });

  await r2Client.send(uploadCommand);
  const url = buildR2Url(folder, fileId);
  return url;
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
};

const FILE_TYPE_EXTENSIONS: Record<string, string> = {
  photo:       "jpg",
  nid_front:   "jpg",
  nid_back:    "jpg",
  cv:          "pdf",
  exp_letter:  "pdf",
  tazkiyah:    "pdf",
  certificate: "jpg",
};

function generateFileId(fileName: string, type: string, index?: number): string {
  const timestamp = Date.now();
  const suffix = index !== undefined ? `_${index}` : "";
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 20);
  const folder = `${sanitizedName}_${timestamp}`;
  const ext = FILE_TYPE_EXTENSIONS[type] ?? "jpg";
  return `${folder}/${type}${suffix}.${ext}`;
}

export async function uploadAllFiles(
  files: FileUploadInput,
  onProgress?: ProgressCallback
): Promise<FileUploadResult> {
  const STAFF_PHOTOS = "staff-photos";
  const DOCUMENTS = "staff-documents";
  const allFiles: { file: File; folder: string; fileId: string; key: string }[] = [];

  if (files.photoFile) {
    const fileId = generateFileId(files.photoFile.name, 'photo');
    allFiles.push({ file: files.photoFile, folder: STAFF_PHOTOS, fileId, key: "photo" });
  }
  if (files.nidFrontCopyFile) {
    const fileId = generateFileId(files.nidFrontCopyFile.name, 'nid_front');
    allFiles.push({ file: files.nidFrontCopyFile, folder: DOCUMENTS, fileId, key: "nidFront" });
  }
  if (files.nidBackCopyFile) {
    const fileId = generateFileId(files.nidBackCopyFile.name, 'nid_back');
    allFiles.push({ file: files.nidBackCopyFile, folder: DOCUMENTS, fileId, key: "nidBack" });
  }
  if (files.certificateFiles) {
    files.certificateFiles.forEach((file, idx) => {
      if (file) {
        const fileId = generateFileId(file.name, 'certificate', idx);
        allFiles.push({ file, folder: DOCUMENTS, fileId, key: `certificate_${idx}` });
      }
    });
  }
  if (files.experienceLetterFile) {
    const fileId = generateFileId(files.experienceLetterFile.name, 'exp_letter');
    allFiles.push({ file: files.experienceLetterFile, folder: DOCUMENTS, fileId, key: "experienceLetter" });
  }
  if (files.cvFile) {
    const fileId = generateFileId(files.cvFile.name, 'cv');
    allFiles.push({ file: files.cvFile, folder: DOCUMENTS, fileId, key: "cv" });
  }
  if (files.tazkiyahFile) {
    const fileId = generateFileId(files.tazkiyahFile.name, 'tazkiyah');
    allFiles.push({ file: files.tazkiyahFile, folder: DOCUMENTS, fileId, key: "tazkiyah" });
  }

  const totalFiles = allFiles.length;
  const results: Record<string, string> = {};
  const certificateUrls: string[] = [];

  for (let i = 0; i < allFiles.length; i++) {
    const { file, folder, fileId, key } = allFiles[i];

    onProgress?.({
      fileIndex: i + 1,
      totalFiles,
      fileName: file.name,
      percentage: 0,
      status: "uploading",
    });

    try {
      const url = await uploadSingleFile(file, folder, fileId, (percentage) => {
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
  };
}