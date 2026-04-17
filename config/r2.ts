import { S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
  maxAttempts: 3,
  retryMode: "adaptive",
});

export const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET ?? "manzilinstitutebucket";

export const R2_FOLDERS = {
  STAFF_PHOTOS:       "staff-photos",
  STUDENT_PHOTOS:     "student-photos",
  DOCUMENTS:          "staff-documents",
  RECEIPT_IMAGES:     "receipts",
  EXPENSE_RECEIPTS:   "expense-receipts",
  NOTICE_ATTACHMENTS: "notices",
  MADRASA_ASSETS:     "assets",
  BOOK_COVERS:        "book-covers",
  POLICY_DOCS:        "policies",
} as const;

export type R2FolderKey = keyof typeof R2_FOLDERS;

const cdnDomain = process.env.CLOUDFLARE_R2_CDN_DOMAIN;
const R2_BASE_URL = cdnDomain
  ? `https://${cdnDomain}`
  : process.env.CLOUDFLARE_R2_ENDPOINT?.replace("/v1", "") ?? "";

export const R2_PUBLIC_URLS = {
  STAFF_PHOTOS:       `${R2_BASE_URL}/staff-photos`,
  STUDENT_PHOTOS:     `${R2_BASE_URL}/student-photos`,
  DOCUMENTS:          `${R2_BASE_URL}/staff-documents`,
  RECEIPT_IMAGES:     `${R2_BASE_URL}/receipts`,
  EXPENSE_RECEIPTS:   `${R2_BASE_URL}/expense-receipts`,
  NOTICE_ATTACHMENTS: `${R2_BASE_URL}/notices`,
  MADRASA_ASSETS:     `${R2_BASE_URL}/assets`,
  BOOK_COVERS:        `${R2_BASE_URL}/book-covers`,
  POLICY_DOCS:        `${R2_BASE_URL}/policies`,
} as const;

export function buildR2Key(folder: string, fileId: string): string {
  return `${folder}/${fileId}`;
}

export function buildR2Url(folder: string, fileId: string): string {
  return `${R2_BASE_URL}/${folder}/${fileId}`;
}

export function getR2PublicUrl(folderKey: R2FolderKey, fileName: string): string {
  const baseUrl = R2_PUBLIC_URLS[folderKey];
  return `${baseUrl}/${fileName}`;
}

export function validateR2Config(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.CLOUDFLARE_R2_ENDPOINT) {
    errors.push("CLOUDFLARE_R2_ENDPOINT is required");
  }

  if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    errors.push("CLOUDFLARE_R2_ACCESS_KEY_ID is required");
  }

  if (!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    errors.push("CLOUDFLARE_R2_SECRET_ACCESS_KEY is required");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
