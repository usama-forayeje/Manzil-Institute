// ============================================================
// APPWRITE CONFIG — Manzil Institute Management System
// সব Collection ID, Bucket ID এখানে constants হিসেবে আছে
// Appwrite Console থেকে ID গুলো কপি করে .env.local এ বসাও
// ============================================================

// ─── Project ───────────────────────────────────────────────
export const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1";

export const APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";

// ─── Database ──────────────────────────────────────────────
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";

// ─── Collections ───────────────────────────────────────────
export const COLLECTIONS = {
  USERS:                process.env.NEXT_PUBLIC_COL_USERS                ?? "",
  STUDENTS:             process.env.NEXT_PUBLIC_COL_STUDENTS             ?? "",
  STAFF:                process.env.NEXT_PUBLIC_COL_STAFF                ?? "",
  FEE_STRUCTURES:       process.env.NEXT_PUBLIC_COL_FEE_STRUCTURES       ?? "",
  FEE_TRANSACTIONS:     process.env.NEXT_PUBLIC_COL_FEE_TRANSACTIONS     ?? "",
  EXPENSE_CATEGORIES:   process.env.NEXT_PUBLIC_COL_EXPENSE_CATEGORIES   ?? "",
  EXPENSES:             process.env.NEXT_PUBLIC_COL_EXPENSES             ?? "",
  ATTENDANCE_STAFF:     process.env.NEXT_PUBLIC_COL_ATTENDANCE_STAFF     ?? "",
  ATTENDANCE_STUDENTS:  process.env.NEXT_PUBLIC_COL_ATTENDANCE_STUDENTS  ?? "",
  BOARDING_ROOMS:       process.env.NEXT_PUBLIC_COL_BOARDING_ROOMS       ?? "",
  BOARDING_ALLOCATIONS: process.env.NEXT_PUBLIC_COL_BOARDING_ALLOCATIONS ?? "",
  CLASSES:              process.env.NEXT_PUBLIC_COL_CLASSES              ?? "",
  NOTICES:              process.env.NEXT_PUBLIC_COL_NOTICES              ?? "",
  NFC_CARDS:            process.env.NEXT_PUBLIC_COL_NFC_CARDS            ?? "",
  STAFF_SALARIES:       process.env.NEXT_PUBLIC_COL_STAFF_SALARIES       ?? "",
  SALARY_ADVANCES:      process.env.NEXT_PUBLIC_COL_SALARY_ADVANCES      ?? "",
  LEAVE_REQUESTS:       process.env.NEXT_PUBLIC_COL_LEAVE_REQUESTS       ?? "",
  LEAVE_BALANCES:       process.env.NEXT_PUBLIC_COL_LEAVE_BALANCES       ?? "",
  EXAMS:                process.env.NEXT_PUBLIC_COL_EXAMS                ?? "",
  SUBJECTS:             process.env.NEXT_PUBLIC_COL_SUBJECTS             ?? "",
  EXAM_RESULTS:         process.env.NEXT_PUBLIC_COL_EXAM_RESULTS         ?? "",
  MESSAGES:             process.env.NEXT_PUBLIC_COL_MESSAGES             ?? "",
  NOTIFICATION_LOGS:    process.env.NEXT_PUBLIC_COL_NOTIFICATION_LOGS    ?? "",
  LIBRARY_BOOKS:        process.env.NEXT_PUBLIC_COL_LIBRARY_BOOKS        ?? "",
  LIBRARY_ISSUES:       process.env.NEXT_PUBLIC_COL_LIBRARY_ISSUES       ?? "",
  STUDENT_DOCUMENTS:    process.env.NEXT_PUBLIC_COL_STUDENT_DOCUMENTS    ?? "",
  PERIOD_CONFIG:        process.env.NEXT_PUBLIC_COL_PERIOD_CONFIG        ?? "",
  TIMETABLE_SLOTS:      process.env.NEXT_PUBLIC_COL_TIMETABLE_SLOTS      ?? "",
  SUBSTITUTIONS:        process.env.NEXT_PUBLIC_COL_SUBSTITUTIONS        ?? "",
  AUDIT_LOGS:           process.env.NEXT_PUBLIC_COL_AUDIT_LOGS           ?? "",
  SETTINGS:             process.env.NEXT_PUBLIC_COL_SETTINGS             ?? "",
  POLICIES:             process.env.NEXT_PUBLIC_COL_POLICIES             ?? "",
  POLICY_ACKNOWLEDGEMENTS: process.env.NEXT_PUBLIC_COL_POLICY_ACKNOWLEDGEMENTS ?? "",
} as const;

// Shorthand aliases (বেশি ব্যবহৃত collections)
export const USERS_COLLECTION_ID             = COLLECTIONS.USERS;
export const STUDENTS_COLLECTION_ID          = COLLECTIONS.STUDENTS;
export const STAFF_COLLECTION_ID             = COLLECTIONS.STAFF;
export const FEE_TRANSACTIONS_COLLECTION_ID  = COLLECTIONS.FEE_TRANSACTIONS;
export const EXPENSES_COLLECTION_ID          = COLLECTIONS.EXPENSES;
export const ATTENDANCE_STUDENTS_COLLECTION_ID = COLLECTIONS.ATTENDANCE_STUDENTS;
export const ATTENDANCE_STAFF_COLLECTION_ID  = COLLECTIONS.ATTENDANCE_STAFF;

// ─── Storage Buckets ───────────────────────────────────────
export const BUCKETS = {
  STUDENT_PHOTOS:    process.env.NEXT_PUBLIC_BUCKET_STUDENT_PHOTOS    ?? "",
  STAFF_PHOTOS:      process.env.NEXT_PUBLIC_BUCKET_STAFF_PHOTOS      ?? "",
  RECEIPT_IMAGES:    process.env.NEXT_PUBLIC_BUCKET_RECEIPT_IMAGES    ?? "",
  EXPENSE_RECEIPTS:  process.env.NEXT_PUBLIC_BUCKET_EXPENSE_RECEIPTS  ?? "",
  DOCUMENTS:         process.env.NEXT_PUBLIC_BUCKET_DOCUMENTS         ?? "",
  NOTICE_ATTACHMENTS:process.env.NEXT_PUBLIC_BUCKET_NOTICE_ATTACHMENTS ?? "",
  MADRASA_ASSETS:    process.env.NEXT_PUBLIC_BUCKET_MADRASA_ASSETS    ?? "",
  BOOK_COVERS:       process.env.NEXT_PUBLIC_BUCKET_BOOK_COVERS       ?? "",
  POLICY_DOCS:       process.env.NEXT_PUBLIC_BUCKET_POLICY_DOCS       ?? "",
} as const;

// ─── Role constants ────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  MANAGER:     "manager",
  TEACHER:     "teacher",
  STUDENT:     "student",
  PARENT:      "parent",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Role → Dashboard route mapping
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  super_admin: "/dashboard/admin",
  manager:     "/dashboard/manager",
  teacher:     "/dashboard/teacher",
  student:     "/dashboard/student",
  parent:      "/dashboard/parent",
};

// Role → Bengali label
export const ROLE_LABEL_BN: Record<UserRole, string> = {
  super_admin: "সুপার অ্যাডমিন",
  manager:     "ম্যানেজার",
  teacher:     "শিক্ষক",
  student:     "শিক্ষার্থী",
  parent:      "অভিভাবক",
};

// ─── Pagination defaults ───────────────────────────────────
export const PAGE_LIMIT = 25;
export const MAX_LIMIT  = 100; // Appwrite max per query

// ─── File size limits (bytes) ──────────────────────────────
export const FILE_LIMITS = {
  PHOTO:    5  * 1024 * 1024, //  5 MB
  DOCUMENT: 10 * 1024 * 1024, // 10 MB
  RECEIPT:  5  * 1024 * 1024, //  5 MB
} as const;

// ─── Accepted MIME types ───────────────────────────────────
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_DOC_TYPES   = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];