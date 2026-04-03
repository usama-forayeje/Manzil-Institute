// ============================================================
// DATABASE TYPES — Manzil Institute Management System
// সব Appwrite collection এর TypeScript interface এখানে
// ============================================================

// ─── Appwrite base document ────────────────────────────────
export interface AppwriteDocument {
  $id:         string;
  $createdAt:  string;
  $updatedAt:  string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
}

// ─── Enums ─────────────────────────────────────────────────
export type UserRole =
  | "super_admin"
  | "manager"
  | "teacher"
  | "student"
  | "parent";

export type Gender = "male" | "female";

export type StudentStatus    = "active" | "inactive" | "graduated";
export type BoardingType     = "day" | "residential" | "boarding";

export type FeeType =
  | "admission" | "monthly" | "boarding"
  | "exam"      | "other";

export type TransactionType  = "admission" | "monthly" | "boarding" | "exam";
export type PaymentMethod    = "cash" | "bank" | "bkash" | "nagad";
export type ExpenseStatus    = "pending" | "approved" | "rejected";
export type AttendanceStatus = "present" | "absent" | "late" | "leave";
export type RoomType         = "single" | "double" | "dorm";
export type NfcAssignedType  = "student" | "staff";

export type LeaveType =
  | "casual" | "sick" | "annual"
  | "earned" | "without_pay" | "hajj";

export type LeaveStatus      = "pending" | "approved" | "rejected" | "cancelled";
export type SalaryPayStatus  = "pending" | "paid" | "partial";
export type AdvanceStatus    = "pending" | "approved" | "rejected" | "repaid";

export type ExamType         = "monthly_test" | "midterm" | "annual" | "special";
export type DocType =
  | "birth_cert" | "nid" | "previous_marksheet"
  | "photo"      | "medical" | "transfer_cert" | "other";

export type VerificationStatus = "pending" | "verified" | "rejected";
export type IssueStatus        = "issued" | "returned" | "overdue";
export type NotificationChannel= "in_app" | "sms" | "email";
export type DayOfWeek =
  | "saturday" | "sunday" | "monday"
  | "tuesday"  | "wednesday" | "thursday";

// ─── 1. users ──────────────────────────────────────────────
export interface User extends AppwriteDocument {
  name:       string;
  email:      string;
  role:       UserRole;
  avatarUrl:  string;
  phone:      string;
  isActive:   boolean;
}

// ─── 2. students ───────────────────────────────────────────
export interface Student extends AppwriteDocument {
  studentId:     string;
  userId:        string;
  name:          string;
  fatherName:    string;
  motherName:    string;
  dateOfBirth:   string;
  gender:        Gender;
  class:         string;
  section:       string;
  rollNo:        string;
  address:       string;
  phone:         string;
  guardianPhone: string;
  photo:         string;
  nfcCardId:     string;
  admissionDate: string;
  status:        StudentStatus;
  boardingType:  BoardingType;
  createdAt:     string;
}

// ─── 3. staff ──────────────────────────────────────────────
export interface Staff extends AppwriteDocument {
  staffId:     string;
  userId:      string;
  name:        string;
  designation: string;
  department:  string;
  joiningDate: string;
  salary:      number;
  phone:       string;
  address:     string;
  nfcCardId:   string;
  photo:       string;
  isActive:    boolean;
  createdAt:   string;
}

// ─── 4. fee_structures ─────────────────────────────────────
export interface FeeStructure extends AppwriteDocument {
  name:         string;
  type:         FeeType;
  amount:       number;
  description:  string;
  isActive:     boolean;
  createdAt:    string;
}

// Fee item inside a transaction (JSON array)
export interface FeeItem {
  name:   string;
  type:   FeeType;
  amount: number;
}

// ─── 5. fee_transactions ───────────────────────────────────
export interface FeeTransaction extends AppwriteDocument {
  studentId:       string;
  transactionType: TransactionType;
  month:           string | null;
  year:            number;
  items:           FeeItem[];
  totalAmount:     number;
  paidAmount:      number;
  dueAmount:       number;
  paymentMethod:   PaymentMethod;
  receiptNo:       string;
  collectedBy:     string;
  notes:           string;
  createdAt:       string;
}

// ─── 6. expense_categories ─────────────────────────────────
export interface ExpenseCategory extends AppwriteDocument {
  name:        string;
  arabicName:  string;
  description: string;
  isActive:    boolean;
  createdAt:   string;
}

// ─── 7. expenses ───────────────────────────────────────────
export interface Expense extends AppwriteDocument {
  categoryId:    string;
  title:         string;
  amount:        number;
  description:   string;
  date:          string;
  receiptImage:  string;
  createdBy:     string;
  approvedBy:    string | null;
  status:        ExpenseStatus;
  createdAt:     string;
}

// ─── 8. attendance_staff ───────────────────────────────────
export interface AttendanceStaff extends AppwriteDocument {
  staffId:      string;
  date:         string;
  status:       AttendanceStatus;
  checkInTime:  string;
  checkOutTime: string;
  note:         string;
  markedBy:     string;
  nfcScanned:   boolean;
  createdAt:    string;
}

// ─── 9. attendance_students ────────────────────────────────
export interface AttendanceStudent extends AppwriteDocument {
  studentId:  string;
  date:       string;
  class:      string;
  section:    string;
  status:     AttendanceStatus;
  markedBy:   string;
  nfcScanned: boolean;
  createdAt:  string;
}

// ─── 10. boarding_rooms ────────────────────────────────────
export interface BoardingRoom extends AppwriteDocument {
  roomNo:           string;
  floor:            string;
  capacity:         number;
  currentOccupancy: number;
  type:             RoomType;
  isActive:         boolean;
  createdAt:        string;
}

// ─── 11. boarding_allocations ──────────────────────────────
export interface BoardingAllocation extends AppwriteDocument {
  studentId:   string;
  roomId:      string;
  bedNo:       string;
  startDate:   string;
  endDate:     string | null;
  monthlyFee:  number;
  status:      "active" | "inactive";
  createdAt:   string;
}

// ─── 12. classes ───────────────────────────────────────────
export interface Class extends AppwriteDocument {
  name:           string;
  arabicName:     string;
  level:          number;
  sections:       string[];   // JSON array e.g. ["A","B","C"]
  classTeacherId: string;
  totalStudents:  number;
  isActive:       boolean;
  createdAt:      string;
}

// ─── 13. notices ───────────────────────────────────────────
export interface Notice extends AppwriteDocument {
  title:       string;
  body:        string;
  targetRoles: UserRole[];  // JSON array
  isPinned:    boolean;
  publishedBy: string;
  publishedAt: string;
  expiresAt:   string | null;
  createdAt:   string;
}

// ─── 14. nfc_cards ─────────────────────────────────────────
export interface NfcCard extends AppwriteDocument {
  cardId:       string;
  assignedTo:   string;
  assignedType: NfcAssignedType;
  isActive:     boolean;
  lastScanned:  string;
  createdAt:    string;
}

// ─── 15. staff_salaries ────────────────────────────────────
export interface StaffSalary extends AppwriteDocument {
  staffId:             string;
  month:               string;   // "2025-01"
  basicSalary:         number;
  houseAllowance:      number;
  medicalAllowance:    number;
  transportAllowance:  number;
  otherAllowance:      number;
  deductionAbsent:     number;
  deductionLoan:       number;
  deductionOther:      number;
  grossSalary:         number;
  netSalary:           number;
  paymentStatus:       SalaryPayStatus;
  paidAmount:          number;
  paidDate:            string | null;
  paymentMethod:       PaymentMethod;
  transactionRef:      string;
  notes:               string;
  generatedBy:         string;
  createdAt:           string;
}

// ─── 16. salary_advances ───────────────────────────────────
export interface SalaryAdvance extends AppwriteDocument {
  staffId:      string;
  amount:       number;
  requestDate:  string;
  reason:       string;
  status:       AdvanceStatus;
  approvedBy:   string | null;
  repaidMonth:  string | null;
  createdAt:    string;
}

// ─── 17. leave_requests ────────────────────────────────────
export interface LeaveRequest extends AppwriteDocument {
  staffId:       string;
  leaveType:     LeaveType;
  startDate:     string;
  endDate:       string;
  totalDays:     number;
  reason:        string;
  attachmentUrl: string | null;
  status:        LeaveStatus;
  approvedBy:    string | null;
  approvalNote:  string | null;
  appliedAt:     string;
  updatedAt:     string;
}

// ─── 18. leave_balances ────────────────────────────────────
export interface LeaveBalance extends AppwriteDocument {
  staffId:      string;
  year:         number;
  casualTotal:  number;
  casualUsed:   number;
  sickTotal:    number;
  sickUsed:     number;
  annualTotal:  number;
  annualUsed:   number;
  earnedTotal:  number;
  earnedUsed:   number;
}

// ─── 19. exams ─────────────────────────────────────────────
export interface Exam extends AppwriteDocument {
  name:            string;
  type:            ExamType;
  class:           string;
  session:         string;   // "2025-26"
  startDate:       string;
  endDate:         string;
  resultPublished: boolean;
  createdBy:       string;
  createdAt:       string;
}

// ─── 20. subjects ──────────────────────────────────────────
export interface Subject extends AppwriteDocument {
  name:        string;
  arabicName:  string;
  class:       string;
  fullMarks:   number;
  passMarks:   number;
  isOptional:  boolean;
  teacherId:   string;
  sortOrder:   number;
}

// ─── 21. exam_results ──────────────────────────────────────
export interface ExamResult extends AppwriteDocument {
  examId:         string;
  studentId:      string;
  subjectId:      string;
  theoryMarks:    number;
  practicalMarks: number | null;
  totalMarks:     number;
  grade:          string;
  gradePoint:     number;
  isAbsent:       boolean;
  createdAt:      string;
}

// ─── 22. messages ──────────────────────────────────────────
export interface Message extends AppwriteDocument {
  senderId:        string;
  recipientId:     string | null;
  recipientRole:   string | null;
  subject:         string;
  body:            string;
  isRead:          boolean;
  isBroadcast:     boolean;
  targetRoles:     UserRole[] | null;
  attachmentUrl:   string | null;
  sentAt:          string;
  parentMessageId: string | null;
}

// ─── 23. notification_logs ─────────────────────────────────
export interface NotificationLog extends AppwriteDocument {
  type:          string;
  targetUserId:  string | null;
  targetRole:    string | null;
  channel:       NotificationChannel;
  message:       string;
  status:        "sent" | "failed" | "pending";
  triggeredBy:   string;
  sentAt:        string;
}

// ─── 24. library_books ─────────────────────────────────────
export type BookLanguage = "arabic" | "bengali" | "english" | "urdu" | "other";

export interface LibraryBook extends AppwriteDocument {
  title:           string;
  titleArabic:     string | null;
  author:          string;
  category:        string;
  isbn:            string | null;
  totalCopies:     number;
  availableCopies: number;
  publishYear:     number | null;
  language:        BookLanguage;
  location:        string;
  coverImageUrl:   string | null;
  isActive:        boolean;
  createdAt:       string;
}

// ─── 25. library_issues ────────────────────────────────────
export interface LibraryIssue extends AppwriteDocument {
  bookId:         string;
  issuedTo:       string;
  issuedToType:   "student" | "staff";
  issueDate:      string;
  dueDate:        string;
  returnDate:     string | null;
  status:         IssueStatus;
  fineAmount:     number;
  finePaid:       boolean;
  issuedBy:       string;
  createdAt:      string;
}

// ─── 26. student_documents ─────────────────────────────────
export interface StudentDocument extends AppwriteDocument {
  studentId:          string;
  docType:            DocType;
  docName:            string;
  fileUrl:            string;
  fileSize:           number;
  uploadedBy:         string;
  verificationStatus: VerificationStatus;
  verifiedBy:         string | null;
  notes:              string | null;
  createdAt:          string;
}

// ─── 27. period_config ─────────────────────────────────────
export interface PeriodConfig extends AppwriteDocument {
  periodNo:  number;
  startTime: string;   // "08:00"
  endTime:   string;
  name:      string;   // "1st Period"
  isBreak:   boolean;
  createdAt: string;
}

// ─── 28. timetable_slots ───────────────────────────────────
export interface TimetableSlot extends AppwriteDocument {
  classId:   string;
  section:   string;
  dayOfWeek: DayOfWeek;
  periodNo:  number;
  subjectId: string;
  teacherId: string;
  room:      string | null;
  session:   string;
  createdAt: string;
}

// ─── 29. substitutions ─────────────────────────────────────
export interface Substitution extends AppwriteDocument {
  date:                 string;
  originalTeacherId:    string;
  substituteTeacherId:  string;
  classId:              string;
  section:              string;
  periodNo:             number;
  reason:               string;
  createdBy:            string;
  createdAt:            string;
}

// ─── 30. audit_logs ────────────────────────────────────────
export interface AuditLog extends AppwriteDocument {
  userId:      string;
  userEmail:   string;
  userRole:    string;
  action:      string;
  targetType:  string;
  targetId:    string;
  targetName:  string;
  oldValue:    Record<string, unknown> | null;
  newValue:    Record<string, unknown> | null;
  ipAddress:   string;
  userAgent:   string;
  createdAt:   string;
}

// ─── 31. settings (single document) ───────────────────────
export interface SystemSettings extends AppwriteDocument {
  madrasaNameEn:     string;
  madrasaNameBn:     string;
  madrasaNameAr:     string;
  logoUrl:           string;
  address:           string;
  phone:             string;
  email:             string;
  website:           string;
  principalName:     string;
  eiinNumber:        string;
  registrationNo:    string;
  foundingYear:      number;
  currentSession:    string;   // "2025-2026"
  sessionStartMonth: number;   // 1=Jan, 7=Jul
  workingDays:       number[]; // [0,1,2,3,4,5] (0=Sun)
  smsEnabled:        boolean;
  libraryFinePerDay: number;
  loanDays:          number;   // default borrow days
}

// ─── 32. policies ──────────────────────────────────────────
export type PolicyType =
  | "general" | "attendance" | "code_of_conduct"
  | "salary"  | "academic";

export type PolicyTarget = "all" | "teachers_only" | "admin_only";

export interface Policy extends AppwriteDocument {
  titleEn:       string;
  titleBn:       string;
  type:          PolicyType;
  content:       string;   // rich text HTML
  effectiveDate: string;
  resignEvery:   "never" | "1_year" | "6_months";
  target:        PolicyTarget;
  isActive:      boolean;
  createdAt:     string;
}

// ─── 33. policy_acknowledgements ───────────────────────────
export interface PolicyAcknowledgement extends AppwriteDocument {
  policyId:   string;
  staffId:    string;
  signedAt:   string;
  ipAddress:  string;
}

// ─── Helper / DTO types ────────────────────────────────────

// Student with populated relations (joined data)
export interface StudentWithFees extends Student {
  currentMonthFee?: FeeTransaction | null;
  totalDue?:        number;
}

// Dashboard KPI
export interface KpiData {
  totalStudents:    number;
  newThisMonth:     number;
  totalStaff:       number;
  incomeThisMonth:  number;
  expenseThisMonth: number;
}

// Grade calculation result
export interface GradeResult {
  grade:      string;
  gradePoint: number;
}

// Appwrite list response wrapper
export interface AppwriteList<T> {
  total:     number;
  documents: T[];
}