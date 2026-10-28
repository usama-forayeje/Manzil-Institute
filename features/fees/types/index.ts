// ============================================================
// FEE MODULE TYPES — Manzil Institute Management System
// Production-grade TypeScript interfaces for fee management
// ============================================================

// ─── Fee Category (ফি ক্যাটাগরি / বিভাগ) ────────────────────
export interface FeeCategory {
  id: string;
  nameBn: string;
  nameEn: string;
  code: string;
  color: string;
  billingCycle: 'monthly' | 'one-time' | 'term' | 'yearly';
  description?: string;
  isSystem?: boolean;
}

export const DEFAULT_FEE_CATEGORIES: FeeCategory[] = [
  {
    id: 'monthly',
    nameBn: 'মাসিক বেতন',
    nameEn: 'Monthly Tuition',
    code: 'MONTHLY',
    color: 'blue',
    billingCycle: 'monthly',
    description: 'শিক্ষার্থীদের নিয়মিত মাসিক পড়াশোনা ও বেতন ফি',
    isSystem: true,
  },
  {
    id: 'admission',
    nameBn: 'ভর্তি ফি',
    nameEn: 'Admission Fee',
    code: 'ADMISSION',
    color: 'cyan',
    billingCycle: 'one-time',
    description: 'নতুন ও পুরাতন শিক্ষার্থীর ভর্তি ও পুনর্ভর্তি ফি',
    isSystem: true,
  },
  {
    id: 'session',
    nameBn: 'সেশন / বাৎসরিক ফি',
    nameEn: 'Session Fee',
    code: 'SESSION',
    color: 'indigo',
    billingCycle: 'yearly',
    description: 'নতুন শিক্ষাবর্ষের সেশন চার্জ ও প্রাতিষ্ঠানিক উন্নয়ন ফি',
    isSystem: true,
  },
  {
    id: 'exam',
    nameBn: 'পরীক্ষার ফি',
    nameEn: 'Exam Fee',
    code: 'EXAM',
    color: 'amber',
    billingCycle: 'term',
    description: 'ত্রৈমাসিক, ষাণ্মাসিক ও বার্ষিক পরীক্ষার ফি',
    isSystem: true,
  },
  {
    id: 'boarding',
    nameBn: 'বোর্ডিং ও খানা ফি',
    nameEn: 'Boarding & Food Fee',
    code: 'BOARDING',
    color: 'orange',
    billingCycle: 'monthly',
    description: 'আবাসিক ও ডে-কেয়ার শিক্ষার্থীদের খাবার ও কিচেন চার্জ',
    isSystem: true,
  },
  {
    id: 'hall',
    nameBn: 'আবাসিক হল ও সিট ফি',
    nameEn: 'Hall & Bed Fee',
    code: 'HALL',
    color: 'purple',
    billingCycle: 'monthly',
    description: 'দারুল ইকামা / আবাসিক হলে সিট ও রুম ভাড়া চার্জ',
    isSystem: true,
  },
  {
    id: 'books',
    nameBn: 'বই ও কিতাব ফি',
    nameEn: 'Books & Supplies',
    code: 'BOOKS',
    color: 'emerald',
    billingCycle: 'one-time',
    description: 'পাঠ্যবই, খাতা, ডায়েরি ও শিক্ষা উপকরণ ফি',
    isSystem: true,
  },
  {
    id: 'dress',
    nameBn: 'পোশাক ও ইউনিফর্ম',
    nameEn: 'Dress & Uniform',
    code: 'DRESS',
    color: 'teal',
    billingCycle: 'one-time',
    description: 'মাদ্রাসার নির্ধারিত পোশাক, টুপি ও ব্যাজ',
    isSystem: true,
  },
  {
    id: 'tour',
    nameBn: 'সফর ও কাফেলা ফি',
    nameEn: 'Tour & Event',
    code: 'TOUR',
    color: 'rose',
    billingCycle: 'one-time',
    description: 'বার্ষিক শিক্ষা সফর, কাফেলা বা ইসলামিক সাংস্কৃতিক অনুষ্ঠান',
    isSystem: true,
  },
  {
    id: 'other',
    nameBn: 'অন্যান্য ফি',
    nameEn: 'Other Miscellaneous',
    code: 'OTHER',
    color: 'zinc',
    billingCycle: 'one-time',
    description: 'বিবিধ বিশেষ ফি ও অপ্রত্যাশিত প্রাতিষ্ঠানিক চার্জ',
    isSystem: true,
  },
];

// ─── Fee Type (কাঠামো সংজ্ঞা) ──────────────────────────────
export interface FeeType {
  $id: string;
  name: string;
  nameBn: string;
  code: string;
  category: string;
  billingCycle: 'monthly' | 'one-time' | 'term' | 'yearly';
  applicableTo: 'student' | 'staff';
  description?: string;
  defaultAmount: number;
  isActive: boolean;
  isRequired?: boolean;
  showInAdmissionForm?: boolean;
  departmentIds?: string[];
  boardingTypes?: string[];
  sortOrder?: number;
  breakdown?: string | Array<{ name: string; amount: number }>;
}

// ─── Fee Structure (ফি কাঠামো) ──────────────────────────────
export interface FeeStructure {
  $id: string;
  departmentId: string;
  departmentName?: string;
  classId?: string;
  className?: string;
  boardingType: string;
  boardingName?: string;
  feeTypeId: string;
  feeTypeName?: string;
  defaultAmount: number;
  session: string;
  isActive: boolean;
  notes?: string;
}

// ─── Invoice (ইনভয়েস) ──────────────────────────────────────
export interface FeeInvoice {
  $id: string;
  receiptNo: string;
  studentDocId: string;
  studentId: string;
  invoiceType: 'monthly' | 'admission' | 'session' | 'exam' | 'other';
  session: string;
  month: string;
  feeItems: string; // JSON stringified FeeLineItem[]
  totalAmount: number;
  discount: number;
  discountNote: string;
  netAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'unpaid' | 'partial' | 'paid';
  $createdAt?: string;
  $updatedAt?: string;
}

// ─── Fee Line Item (inside invoice JSON) ────────────────────
export interface FeeLineItem {
  feeTypeCode: string;
  feeTypeName: string;
  amount: number;
  isRequired: boolean;
  isIncluded: boolean;
  departmentCode?: string;
}

// ─── Payment Record (পেমেন্ট রেকর্ড) ───────────────────────
export interface FeePayment {
  $id: string;
  paymentId: string;
  invoiceId: string;
  receiptNo: string;
  studentDocId: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'bank';
  transactionRef: string;
  notes: string;
  paidAt: string;
  recordedBy: string;
  $createdAt?: string;
}

// ─── Invoice with Student (joined data for tables) ──────────
export interface InvoiceWithStudent extends FeeInvoice {
  studentName?: string;
  studentClass?: string;
  studentSection?: string;
  studentPhone?: string;
  studentPhoto?: string;
  boardingType?: string;
}

// ─── Due Student Row (বকেয়াদার) ─────────────────────────────
export interface DueStudentRow {
  studentDocId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  boardingType: string;
  studentPhone: string;
  guardianPhone: string;
  totalDue: number;
  invoiceCount: number;
  oldestDueMonth: string;
  monthsOverdue: number;
  lastPaymentDate: string | null;
}

// ─── Payment with Student (for history table) ───────────────
export interface PaymentWithStudent extends FeePayment {
  studentName?: string;
  studentClass?: string;
  studentSection?: string;
  discount?: number;
}

// ─── Dashboard KPI Stats ────────────────────────────────────
export interface FeeDashboardStats {
  totalCollectedThisMonth: number;
  totalDueAmount: number;
  collectionRate: number; // percentage
  totalStudentsPaid: number;
  totalStudents: number;
  totalInvoicesThisMonth: number;
  totalUnpaidInvoices: number;
  revenueByMethod: Record<string, number>;
}

// ─── Monthly Trend Data ─────────────────────────────────────
export interface MonthlyTrendItem {
  month: string;
  monthBn: string;
  collected: number;
  due: number;
}

// ─── Class-wise Due Summary ─────────────────────────────────
export interface ClassDueSummary {
  className: string;
  totalStudents: number;
  totalDue: number;
  paidCount: number;
  unpaidCount: number;
}

// ─── Receipt Data (for printing) ────────────────────────────
export interface ReceiptData {
  receiptNo: string;
  paymentId: string;
  date: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  studentSection: string;
  fatherName: string;
  month: string;
  session: string;
  items: { name: string; amount: number }[];
  totalAmount: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  dueAfterPayment: number;
  paymentMethod: string;
  transactionRef: string;
  collectedBy: string;
  instituteName: string;
  instituteNameBn: string;
  instituteAddress: string;
  institutePhone: string;
  instituteLogo: string;
  previouslyPaid?: number;
  totalPaidCumulative?: number;
}

// ─── Filter Types ───────────────────────────────────────────
export interface FeeFilter {
  session?: string;
  month?: string;
  classId?: string;
  section?: string;
  status?: 'unpaid' | 'partial' | 'paid' | '';
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  invoiceType?: string;
  page?: number;
  limit?: number;
}

// ─── Payment Method Labels ──────────────────────────────────
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'নগদ (Cash)',
  bkash: 'বিকাশ (bKash)',
  nagad: 'নগদ (Nagad)',
  bank: 'ব্যাংক (Bank)',
};

// ─── Month names (Bengali) ──────────────────────────────────
export const MONTH_NAMES_BN: Record<string, string> = {
  January: 'জানুয়ারি',
  February: 'ফেব্রুয়ারি',
  March: 'মার্চ',
  April: 'এপ্রিল',
  May: 'মে',
  June: 'জুন',
  July: 'জুলাই',
  August: 'আগস্ট',
  September: 'সেপ্টেম্বর',
  October: 'অক্টোবর',
  November: 'নভেম্বর',
  December: 'ডিসেম্বর',
};

export const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;
