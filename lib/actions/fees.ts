'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';

import type {
  FeeDashboardStats,
  MonthlyTrendItem,
  ClassDueSummary,
  DueStudentRow,
  FeeFilter,
  InvoiceWithStudent,
  PaymentWithStudent,
  ReceiptData,
} from '@/features/fees/types';

// ─── Helpers ────────────────────────────────────────────────
const BENGALI_MONTHS: Record<string, string> = {
  January: 'জানুয়ারি', February: 'ফেব্রুয়ারি', March: 'মার্চ',
  April: 'এপ্রিল', May: 'মে', June: 'জুন',
  July: 'জুলাই', August: 'আগস্ট', September: 'সেপ্টেম্বর',
  October: 'অক্টোবর', November: 'নভেম্বর', December: 'ডিসেম্বর',
};

const MONTHS_ORDER = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getCurrentMonth(): string {
  return new Date().toLocaleString('en-US', { month: 'long' });
}

function getMonthIndex(month: string): number {
  return MONTHS_ORDER.indexOf(month);
}

async function generateSequentialId(
  databases: any,
  collectionId: string,
  fieldName: string,
  prefix: string,
  padLength: number = 5
): Promise<string> {
  const year = new Date().getFullYear();
  const fullPrefix = `${prefix}-${year}-`;

  try {
    const existing = await databases.listDocuments(
      DATABASE_ID,
      collectionId,
      [
        Query.startsWith(fieldName, fullPrefix),
        Query.orderDesc(fieldName),
        Query.limit(1),
      ]
    );

    let next = 1;
    if (existing.total > 0) {
      const lastId = existing.documents[0][fieldName] as string;
      const parts = lastId.split('-');
      const lastNum = parseInt(parts[parts.length - 1] ?? '0', 10);
      next = lastNum + 1;
    }

    return `${fullPrefix}${String(next).padStart(padLength, '0')}`;
  } catch {
    const ts = Date.now().toString().slice(-6);
    return `${fullPrefix}${ts}`;
  }
}

// Helper: fetch student map from a list of studentDocIds
async function fetchStudentMap(databases: any, studentDocIds: string[]): Promise<Record<string, any>> {
  const map: Record<string, any> = {};
  if (studentDocIds.length === 0) return map;

  const uniqueIds = [...new Set(studentDocIds)];
  const batches = [];
  for (let i = 0; i < uniqueIds.length; i += 50) {
    batches.push(uniqueIds.slice(i, i + 50));
  }

  // Pre-fetch all classes, sections, and boarding types for mapping
  let classesMap: Record<string, string> = {};
  let sectionsMap: Record<string, string> = {};
  let boardingMap: Record<string, string> = {};
  
  try {
    const [clsRes, secRes, boardRes] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.CLASSES, [Query.limit(50)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.SECTIONS, [Query.limit(50)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, [Query.limit(50)])
    ]);

    clsRes.documents.forEach((c: any) => { classesMap[c.$id] = c.nameBn || c.name || ''; });
    secRes.documents.forEach((s: any) => { sectionsMap[s.$id] = s.sectionNameBn || s.sectionName || ''; });
    boardRes.documents.forEach((b: any) => { boardingMap[b.$id] = b.nameBn || b.name || ''; });
  } catch { /* silent */ }

  for (const batch of batches) {
    try {
      const { documents: studs } = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENTS,
        [Query.equal('$id', batch), Query.limit(100)]
      );

      let enrs: any[] = [];
      try {
        const enrRes = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.STUDENT_ENROLLMENTS,
          [Query.equal('studentId', batch), Query.limit(100)]
        );
        enrs = enrRes.documents;
      } catch { /* silent */ }

      for (const doc of studs) {
        const enr = enrs.find((e: any) => e.studentId === doc.$id && String(e.status) === 'active') || enrs.find((e: any) => e.studentId === doc.$id);
        const rawClassId = enr?.classId || '';
        const rawSectionId = enr?.section || '';
        const rawBoardingId = enr?.boardingType || '';
        
        const plainDoc = JSON.parse(JSON.stringify(doc));
        map[doc.$id] = {
          ...plainDoc,
          name: doc.nameBn || doc.nameEn || doc.nameAr || '---',
          phone: doc.phonePrimary || doc.guardianPhone || '',
          class: classesMap[rawClassId] || rawClassId,
          section: sectionsMap[rawSectionId] || rawSectionId,
          boardingType: boardingMap[rawBoardingId] || rawBoardingId,
        };
      }
    } catch {
      // silently continue
    }
  }
  return map;
}

// ═══════════════════════════════════════════════════════════════
// 1. DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════

export async function fetchFeeDashboardStats(session: string, feeType?: string, dateFrom?: string, dateTo?: string): Promise<{
  success: boolean;
  stats?: FeeDashboardStats;
  recentPayments?: PaymentWithStudent[];
  monthlyTrend?: MonthlyTrendItem[];
  classDueSummary?: ClassDueSummary[];
  error?: string;
}> {
  try {
    const { databases } = await createAdminClient();
    const currentMonthNum = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();

    // ── Pre-fetch Data (Higher Limit for Local Filtering) ──
    // Fetch more strictly to avoid Appwrite Index overhead failures for multiple EQUAL filters
    const invBaseQueries = [Query.limit(2000)];
    if (session && session !== 'all') {
      invBaseQueries.push(Query.equal('session', session));
    }
    
    // We execute a broader query and filter locally to bypass indexing issues
    let { documents: rawInvoices } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_INVOICES, invBaseQueries);

    // Apply Fee Type Filter Locally for precision (Ultra-Flexible matching)
    if (feeType && feeType !== 'all') {
      const filterVal = feeType.toLowerCase();
      rawInvoices = rawInvoices.filter(inv => {
        // 1. Check direct invoiceType column
        const typeCol = String(inv.invoiceType || '').toLowerCase();
        if (typeCol === filterVal || typeCol.includes(filterVal)) return true;

        // 2. Check deep into feeItems (JSON check)
        if (inv.feeItems) {
          try {
            const items = JSON.parse(inv.feeItems);
            return items.some((item: any) => 
              String(item.feeTypeCode || '').toLowerCase() === filterVal ||
              String(item.feeTypeName || '').toLowerCase().includes(filterVal)
            );
          } catch (e) { }
        }

        // 3. Fallback to generic partial match
        return false;
      });
    }

    const invoices = rawInvoices;
    const filteredInvoiceIds = invoices.map(i => i.$id);

    // Build Payment Queries
    const payQueries = [Query.orderDesc('$createdAt'), Query.limit(2000)];
    if (dateFrom) payQueries.push(Query.greaterThanEqual('paymentDate', dateFrom));
    if (dateTo) payQueries.push(Query.lessThanEqual('paymentDate', dateTo + 'T23:59:59.999Z'));

    // Broad fetch for payments
    let { documents: allPayments } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, payQueries);

    // Link payments back to filtered invoices locally
    if (session !== 'all' || feeType !== 'all') {
      allPayments = allPayments.filter(p => filteredInvoiceIds.includes(p.invoiceId));
    }

    // Stop early if no data matches our logic (Prevents overhead)
    if (invoices.length === 0 && allPayments.length === 0) {
      return {
        success: true,
        stats: { 
          totalCollectedThisMonth: 0, 
          totalDueAmount: 0, 
          totalInvoicesThisMonth: 0, 
          totalUnpaidInvoices: 0, 
          collectionRate: 0, 
          totalStudents: 0, 
          totalStudentsPaid: 0, 
          revenueByMethod: { cash: 0, bkash: 0, nagad: 0, bank: 0 } 
        },
        recentPayments: [],
        monthlyTrend: [],
        classDueSummary: []
      };
    }

    // ── Pre-fetch Student Data (Required for Class Mapping) ──
    const allRefStudentIds = [...new Set([
      ...invoices.map(i => i.studentId),
      ...allPayments.map(p => p.studentId)
    ])].filter(Boolean) as string[];

    const masterStudentMap = await fetchStudentMap(databases, allRefStudentIds);

    // ── Summary Calculations ──
    let totalCollectedInRange = 0;
    let totalDueAmount = 0;
    let totalInvoicesInRange = 0;
    let totalUnpaidInvoices = 0;
    const revenueByMethod: Record<string, number> = { cash: 0, bkash: 0, nagad: 0, bank: 0 };

    const start = dateFrom ? new Date(dateFrom) : null;
    const end = dateTo ? new Date(dateTo + 'T23:59:59.999Z') : null;

    // Process Invoices
    invoices.forEach((inv: any) => {
      totalDueAmount += Number(inv.dueAmount || 0);
      const invDate = new Date(inv.$createdAt);

      let isInRange = false;
      if (start && end) {
        if (invDate >= start && invDate <= end) isInRange = true;
      } else if (inv.month === currentMonth) {
        isInRange = true;
      }

      if (isInRange) {
        totalInvoicesInRange++;
      }
      if (inv.status !== 'paid') totalUnpaidInvoices++;
    });

    // Process Payments linked to these invoices
    allPayments.forEach((p: any) => {
      const pDate = new Date(p.paymentDate || p.$createdAt);
      
      let isInRange = false;
      if (start && end) {
        if (pDate >= start && pDate <= end) isInRange = true;
      } else if (pDate.getMonth() === currentMonthNum && pDate.getFullYear() === currentYear) {
        isInRange = true;
      }

      if (isInRange) {
        const amount = Number(p.amountPaid || p.amount || 0);
        totalCollectedInRange += amount;
        const method = (p.paymentMethod || 'cash').toLowerCase();
        if (revenueByMethod.hasOwnProperty(method)) {
          revenueByMethod[method] += amount;
        } else {
          revenueByMethod.cash += amount;
        }
      }
    });

    // ── Monthly Trend ──
    const monthlyTrend: MonthlyTrendItem[] = MONTHS_ORDER.map(m => ({
      month: m,
      monthBn: BENGALI_MONTHS[m] || m,
      collected: 0,
      due: 0
    }));

    invoices.forEach(inv => {
      const idx = getMonthIndex(inv.month);
      if (idx !== -1) monthlyTrend[idx].due += Number(inv.dueAmount || 0);
    });

    allPayments.forEach(p => {
      const pDate = new Date(p.paymentDate || p.$createdAt);
      const pMonth = MONTHS_ORDER[pDate.getMonth()];
      const idx = getMonthIndex(pMonth);
      if (idx !== -1) monthlyTrend[idx].collected += Number(p.amountPaid || p.amount || 0);
    });

    // ── Classwise Summary ──
    const classDueMap: Record<string, any> = {};
    invoices.forEach(inv => {
      const student = masterStudentMap[inv.studentId];
      const className = student?.class || 'অনির্ধারিত';
      if (!classDueMap[className]) {
        classDueMap[className] = { className, totalStudents: new Set(), totalDue: 0, paidCount: 0, unpaidCount: 0 };
      }
      classDueMap[className].totalStudents.add(inv.studentId);
      classDueMap[className].totalDue += Number(inv.dueAmount || 0);
      if (inv.status === 'paid') classDueMap[className].paidCount++;
      else classDueMap[className].unpaidCount++;
    });

    const classDueSummary: ClassDueSummary[] = Object.values(classDueMap).map((c: any) => ({
      ...c,
      totalStudents: c.totalStudents.size
    }));

    // ── Recent Payments Enrichment (Correct Avatars & Labels) ──
    const recentPayments: PaymentWithStudent[] = allPayments.slice(0, 10).map((p: any) => {
      const student = masterStudentMap[p.studentId];
      const invoice = invoices.find(inv => inv.$id === p.invoiceId);
      
      // Determine specific fee label from items if possible
      let feeLabel = invoice?.invoiceType || p.invoiceType || 'monthly';
      if (invoice?.feeItems) {
        try {
          const items = JSON.parse(invoice.feeItems);
          if (items && items.length >= 1) {
            feeLabel = items.map((i: any) => i.feeTypeName || i.name || i.feeTypeCode || '').filter(Boolean).join(' + ') || feeLabel;
          }
        } catch (e) { }
      }

      return {
        ...JSON.parse(JSON.stringify(p)),
        amount: Number(p.amountPaid || p.amount || 0),
        paidAt: p.paymentDate || p.$createdAt,
        studentName: student?.name || p.studentName || 'N/A',
        studentPhoto: student?.photo || student?.photoUrl || null, // Matches student table 'photo' column
        studentId: student?.studentId || p.studentId || 'N/A',
        studentClass: student?.class || p.studentClass || '',
        studentSection: student?.section || p.studentSection || '',
        feeLabel: feeLabel, // Custom label for UI
        invoiceType: feeLabel,
        month: invoice?.month || ''
      } as any;
    });

    const collectionRate = (totalCollectedInRange + totalDueAmount) > 0 
      ? Math.round((totalCollectedInRange / (totalCollectedInRange + totalDueAmount)) * 100) 
      : 0;

    return {
      success: true,
      stats: {
        totalCollectedThisMonth: totalCollectedInRange,
        totalDueAmount,
        totalStudents: Object.keys(masterStudentMap).length,
        totalStudentsPaid: new Set(allPayments.map(p => p.studentId)).size,
        totalUnpaidInvoices,
        totalInvoicesThisMonth: totalInvoicesInRange,
        revenueByMethod,
        collectionRate
      },
      recentPayments,
      monthlyTrend,
      classDueSummary
    };
  } catch (error: any) {
    console.error('Fee stats error:', error);
    return { success: false, error: error.message };
  }
}

// 2. FETCH INVOICES WITH STUDENTS
export async function fetchInvoicesWithStudents(filter: FeeFilter) {
  try {
    const { databases } = await createAdminClient();
    const queries = [Query.orderDesc('$createdAt'), Query.limit(filter.limit || 50)];

    if (filter.session && filter.session !== 'all') queries.push(Query.equal('session', filter.session));
    if (filter.invoiceType && filter.invoiceType !== 'all') queries.push(Query.equal('invoiceType', filter.invoiceType));
    if (filter.status) queries.push(Query.equal('status', filter.status));

    const { documents: invoices, total } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_INVOICES, queries);

    const studentIds = [...new Set(invoices.map(i => i.studentId))].filter(Boolean);
    const studentMap = await fetchStudentMap(databases, studentIds);

    const items: InvoiceWithStudent[] = invoices.map(inv => {
      const student = studentMap[inv.studentId];
      return {
        ...inv,
        studentName: student?.name || inv.studentName || 'N/A',
        studentPhoto: student?.photoUrl || null,
        className: student?.class || inv.studentClass || inv.className || 'অনির্ধারিত',
        studentId: student?.studentId || inv.studentId || 'N/A'
      } as any;
    });

    return { items, total_items: total };
  } catch (error: any) {
    console.error('Fetch invoices error:', error);
    return { items: [], total_items: 0 };
  }
}

// 3. FETCH DUE STUDENTS
export async function fetchDueStudents(filter: FeeFilter) {
  try {
    const { databases } = await createAdminClient();
    const queries = [
      Query.notEqual('status', 'paid'),
      Query.greaterThan('dueAmount', 0),
      Query.limit(500) // fetch up to 500 invoices to aggregate
    ];

    if (filter.session && filter.session !== 'all') queries.push(Query.equal('session', filter.session));
    if (filter.invoiceType && filter.invoiceType !== 'all') queries.push(Query.equal('invoiceType', filter.invoiceType));

    const { documents: dueInvoices } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_INVOICES, queries);

    let totalDueAmount = 0;
    const studentAggMap: Record<string, any> = {};

    dueInvoices.forEach(inv => {
      totalDueAmount += (inv.dueAmount || 0);
      const sId = inv.studentId;
      if (!sId) return;

      if (!studentAggMap[sId]) {
        studentAggMap[sId] = {
          studentDocId: sId,
          totalDue: 0,
          invoiceCount: 0,
          oldestInvoiceTimestamp: new Date().getTime(),
        };
      }
      studentAggMap[sId].totalDue += (inv.dueAmount || 0);
      studentAggMap[sId].invoiceCount += 1;

      const invDate = new Date(inv.$createdAt).getTime();
      if (invDate < studentAggMap[sId].oldestInvoiceTimestamp) {
        studentAggMap[sId].oldestInvoiceTimestamp = invDate;
      }
    });

    const studentIds = Object.keys(studentAggMap);
    const studentMap = await fetchStudentMap(databases, studentIds);

    const now = new Date().getTime();

    const dueStudents = Object.values(studentAggMap).map((agg: any) => {
      const student = studentMap[agg.studentDocId] || {};

      // Calculate months overdue roughly
      const diffMs = now - agg.oldestInvoiceTimestamp;
      let monthsOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
      if (monthsOverdue < 1) monthsOverdue = 1;

      return {
        studentDocId: agg.studentDocId,
        studentId: student.studentId || 'N/A',
        studentName: student.nameBn || student.nameEn || student.name || 'N/A',
        studentClass: student.class || 'N/A',
        studentSection: student.section || 'N/A',
        studentPhone: student.phonePrimary || '',
        guardianPhone: student.guardianPhone || '',
        totalDue: agg.totalDue,
        monthsOverdue: monthsOverdue,
        invoiceCount: agg.invoiceCount,
        lastPaymentDate: null
      };
    }).sort((a, b) => b.totalDue - a.totalDue);

    return { dueStudents, totalDueAmount };
  } catch (error: any) {
    console.error('Fetch due students error:', error);
    return { dueStudents: [], totalDueAmount: 0 };
  }
}

// 4. FETCH PAYMENT HISTORY
export async function fetchPaymentHistory(filter: any) {
  try {
    const { databases } = await createAdminClient();
    const limit = filter.limit || 30;
    const page = filter.page || 1;
    let offset = (page - 1) * limit;

    // Build invoice-based filter if session or feeType is restricted
    let filteredInvoiceIds: string[] = [];
    if ((filter.session && filter.session !== 'all') || (filter.invoiceType && filter.invoiceType !== 'all')) {
      const invQueries = [Query.limit(500)];
      if (filter.session && filter.session !== 'all') invQueries.push(Query.equal('session', filter.session));
      if (filter.invoiceType && filter.invoiceType !== 'all') invQueries.push(Query.equal('invoiceType', filter.invoiceType));
      
      const { documents: invoices } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_INVOICES, invQueries);
      filteredInvoiceIds = invoices.map(i => i.$id);
      
      if (filteredInvoiceIds.length === 0) return { success: true, payments: [], total: 0, totalAmount: 0 };
    }

    const queries = [Query.orderDesc('$createdAt')];
    if (filteredInvoiceIds.length > 0) {
      queries.push(Query.equal('invoiceId', filteredInvoiceIds.slice(0, 100)));
    }

    // Filter by payment method
    if (filter.paymentMethod && filter.paymentMethod !== 'all') {
      queries.push(Query.equal('paymentMethod', filter.paymentMethod));
    }
    // Date ranges
    if (filter.dateFrom) {
      queries.push(Query.greaterThanEqual('paymentDate', filter.dateFrom));
    }
    if (filter.dateTo) {
      queries.push(Query.lessThanEqual('paymentDate', filter.dateTo + 'T23:59:59.999Z'));
    }

    // In-memory search workaround
    if (filter.searchTerm) {
      queries.push(Query.limit(500)); // Fetch a big batch to filter locally
      offset = 0;
    } else {
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset));
    }

    const { documents: paymentsResponse, total } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, queries);

    let rawPayments = paymentsResponse;
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      rawPayments = rawPayments.filter(p =>
        (p.receiptNo || '').toLowerCase().includes(term) ||
        (p.studentId || '').toLowerCase().includes(term) ||
        (p.paymentId || '').toLowerCase().includes(term) ||
        (p.transactionRef || '').toLowerCase().includes(term)
      );
      // Pagination locally after filter
      rawPayments = rawPayments.slice((page - 1) * limit, page * limit);
    }

    const studentIds = [...new Set(rawPayments.map((p: any) => p.studentId))].filter(Boolean);
    const studentMap = await fetchStudentMap(databases, studentIds);

    const payments = rawPayments.map((p: any) => {
      const student = studentMap[p.studentId];
      return {
        ...p,
        amount: p.amountPaid || p.amount || 0,
        paidAt: p.paymentDate || p.$createdAt,
        studentName: student?.nameBn || student?.nameEn || student?.name || 'N/A',
        studentId: student?.studentId || p.studentId || 'N/A',
        studentClass: student?.class || p.departmentCode || 'অনির্ধারিত'
      };
    });

    const totalAmount = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

    return {
      success: true,
      payments,
      total: filter.searchTerm ? rawPayments.length : total,
      totalAmount
    };
  } catch (error: any) {
    console.error('Fetch payment history error:', error);
    return { success: false, error: error.message, payments: [], total: 0, totalAmount: 0 };
  }
}

// 5. FETCH FEE FILTER OPTIONS
export async function fetchFeeFilterOptions() {
  try {
    const { databases } = await createAdminClient();

    let sessions: string[] = [];

    // 1. Attempt to fetch from dedicated SESSIONS collection
    try {
      const { documents: sessionDocs } = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SESSIONS,
        [Query.limit(50)]
      );
      // sessionName is the actual field in the SESSIONS collection
      sessions = sessionDocs
        .map(s => s.sessionName || s.name || s.year || s.session || s.title)
        .filter(Boolean);
      console.log('[Fees] Sessions from DB:', sessions);
    } catch (err) {
      console.warn('SESSIONS collection empty or missing:', err);
    }

    // 2. Backup: If SESSIONS failed or is empty, fetch from FEE_INVOICES
    if (sessions.length === 0) {
      try {
        const { documents: invRes } = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.FEE_INVOICES,
          [Query.limit(100), Query.orderDesc('$createdAt')]
        );
        sessions = [...new Set(invRes.map(s => s.session))].filter(Boolean).sort().reverse();
      } catch (err) {
        console.warn('FEE_INVOICES collection session fetch failed:', err);
      }
    }

    // 3. Fallback: fetch from STUDENTS
    if (sessions.length === 0) {
      try {
        const { documents: stdRes } = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.STUDENTS,
          [Query.limit(100), Query.orderDesc('$createdAt')]
        );
        sessions = [...new Set(stdRes.map(s => s.session || s.enrollmentSession))].filter(Boolean).sort().reverse();
      } catch (err) {
        console.warn('STUDENTS collection session fetch failed:', err);
      }
    }

    // 4. Fetch fee types directly from FEE_TYPES collection
    let feeTypes: any[] = [];
    try {
      const { documents: ftDocs } = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FEE_TYPES,
        [Query.limit(100)]
      );
      
      if (ftDocs.length > 0) {
        // ft.code is what gets stored in invoice's `invoiceType` field via generateBulkInvoices
        feeTypes = ftDocs.map(ft => ({
          $id: ft.$id,
          name: ft.code || ft.feeCode || ft.name || '', // filter key = what's in invoiceType DB field
          nameBn: ft.nameBn || ft.feeNameBn || ft.name || '',
          code: ft.code || ft.feeCode || '',
          category: ft.category || ft.feeCategory || 'other',
          defaultAmount: ft.defaultAmount || 0,
        }));
        console.log('[Fees] Fee types from DB:', feeTypes.map(f => `${f.nameBn}(${f.code})`));
      }
    } catch (err) {
      console.warn('FEE_TYPES collection fetch failed:', err);
    }

    // 5. Backup: If FEE_TYPES empty, fetch from existing invoices
    if (feeTypes.length === 0) {
      try {
        const { documents: invRes } = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.FEE_INVOICES,
          [Query.limit(100), Query.orderDesc('$createdAt')]
        );
        const uniqueTypes = [...new Set(invRes.map(i => i.invoiceType))].filter(Boolean);

        const typeLabels: Record<string, string> = {
          'monthly': 'মাসিক ফি',
          'admission': 'ভর্তি ফি',
          'session': 'সেশন ফি',
          'exam': 'পরীক্ষা ফি',
          'other': 'অন্যান্য ফি'
        };

        feeTypes = uniqueTypes.map(type => ({
          $id: type as string,
          name: type as string,
          nameBn: typeLabels[type as string] || type,
        }));
      } catch (err) { }
    }

    // Hardcoded fallback for feeTypes if empty (so dashboard doesn't break)
    if (feeTypes.length === 0) {
      feeTypes = [
        { $id: 'admission', name: 'admission', nameBn: 'ভর্তি ফি' },
        { $id: 'monthly', name: 'monthly', nameBn: 'মাসিক ফি' },
        { $id: 'session', name: 'session', nameBn: 'সেশন ফি' },
        { $id: 'exam', name: 'exam', nameBn: 'পরীক্ষা ফি' },
      ];
    }

    // Hardcoded fallback for sessions if empty
    if (sessions.length === 0) {
      const currentYear = new Date().getFullYear();
      sessions = [`${currentYear}-${currentYear + 1}`, `${currentYear}`];
    }

    return {
      success: true,
      options: {
        sessions,
        feeTypes
      }
    };
  } catch (error: any) {
    console.error('Fetch options error:', error);
    return { success: false, options: { sessions: [], feeTypes: [] } };
  }
}

// 6. SEARCH STUDENTS
export async function searchStudentsForFee(term: string) {
  try {
    const { databases } = await createAdminClient();
    const cleanTerm = term.trim();
    if (!cleanTerm) return { success: true, students: [] };

    const { documents } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, [
      Query.limit(50),
      Query.orderDesc('$createdAt')
    ]);

    // Simple client-side search across multiple fields for safety
    const lowerTerm = cleanTerm.toLowerCase();
    const matchedDocs = documents.filter(d =>
      (d.studentId || '').toLowerCase().includes(lowerTerm) ||
      (d.nameEn || '').toLowerCase().includes(lowerTerm) ||
      (d.nameBn || '').toLowerCase().includes(lowerTerm) ||
      (d.phonePrimary || '').includes(lowerTerm) ||
      (d.guardianPhone || '').includes(lowerTerm)
    );

    const studentMap = await fetchStudentMap(databases, matchedDocs.map(d => d.$id));
    // Serialize to plain objects to prevent Client Component serialization errors
    return { success: true, students: JSON.parse(JSON.stringify(Object.values(studentMap))) };
  } catch (error: any) {
    console.error('search error', error);
    return { success: false, students: [] };
  }
}

// 7. FETCH UNPAID INVOICES
export async function fetchUnpaidInvoices({ studentDocId, studentId }: { studentDocId?: string; studentId?: string }) {
  try {
    const { databases } = await createAdminClient();
    const targetId = studentDocId || studentId || '';
    const { documents: invoices } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_INVOICES, [
      Query.equal('studentId', targetId),
      Query.notEqual('status', 'paid')
    ]);
    // Serialize to plain objects — Appwrite docs have non-plain prototypes
    // which cannot be passed from Server Actions to Client Components
    return { success: true, invoices: JSON.parse(JSON.stringify(invoices)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 8. COLLECT FEE PAYMENT
export async function collectFeePayment({
  invoiceId, studentId, studentDocId, amount, discount = 0, paymentMethod, transactionRef, notes, recordedBy
}: any) {
  try {
    const { databases } = await createAdminClient();

    // 1. Fetch invoice
    const inv = await databases.getDocument(DATABASE_ID, COLLECTIONS.FEE_INVOICES, invoiceId);

    const newPaidAmount = (inv.paidAmount || 0) + amount;
    const newDiscount = (inv.discount || 0) + discount;
    const newDue = inv.totalAmount - newPaidAmount - newDiscount;
    const newStatus = newDue <= 0 ? 'paid' : (newPaidAmount > 0 ? 'partial' : 'unpaid');

    // 2. Update invoice
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.FEE_INVOICES, invoiceId, {
      paidAmount: newPaidAmount,
      discount: newDiscount,
      dueAmount: newDue,
      status: newStatus
    });

    // 3. Create payment record
    const paymentIdStr = await generateSequentialId(databases, COLLECTIONS.FEE_PAYMENTS, 'receiptNo', 'PAY');
    const payment = await databases.createDocument(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, ID.unique(), {
      paymentId: paymentIdStr,
      receiptNo: paymentIdStr,
      invoiceId: invoiceId,
      studentId: studentDocId || studentId || '',
      enrollmentId: inv.enrollmentId || '',
      departmentCode: inv.departmentCode || '',
      amountPaid: amount,
      paymentMethod: paymentMethod,
      transactionRef: transactionRef || '',
      paymentDate: new Date().toISOString(),
      collectedBy: recordedBy,
      notes: notes || ''
    });

    return { success: true, paymentId: payment.$id, receiptNo: paymentIdStr };
  } catch (error: any) {
    console.error('Payment error', error);
    return { success: false, error: 'Payment failed' };
  }
}

// 9. GENERATE RECEIPT DATA
export async function generateReceiptData(paymentDocId: string) {
  try {
    const { databases } = await createAdminClient();

    let payment;
    try {
      // First try as direct document ID
      payment = await databases.getDocument(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, paymentDocId);
    } catch (e) {
      // If not found, try searching by paymentId/receiptNo field
      const { documents } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, [
        Query.equal('paymentId', paymentDocId),
        Query.limit(1)
      ]);
      if (documents.length > 0) {
        payment = documents[0];
      } else {
        const { documents: docsByReceipt } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_PAYMENTS, [
          Query.equal('receiptNo', paymentDocId),
          Query.limit(1)
        ]);
        if (docsByReceipt.length > 0) payment = docsByReceipt[0];
      }
    }

    if (!payment) {
      console.error('Payment record not found for ID:', paymentDocId);
      return { success: false, error: 'রসিদ পাওয়া যায়নি' };
    }

    // Fetch related docs with fallbacks
    let inv: any = {};
    try { inv = await databases.getDocument(DATABASE_ID, COLLECTIONS.FEE_INVOICES, payment.invoiceId); } catch (e) { console.warn('Invoice not found'); }

    let student: any = {};
    try { student = await databases.getDocument(DATABASE_ID, COLLECTIONS.STUDENTS, payment.studentId); } catch (e) { console.warn('Student not found'); }

    let items = [];
    try { items = JSON.parse(inv.feeItems || '[]'); } catch (e) { }
    if (items.length === 0) {
      items = [{ name: inv.invoiceType || 'ফি', amount: inv.totalAmount || payment.amountPaid }];
    } else {
      items = items.map((i: any) => ({ name: i.feeTypeName || i.name, amount: i.amount }));
    }

    let className = '---';
    let sectionName = '---';
    try {
      const { documents: enrs } = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, [
        Query.equal('studentId', student.$id || payment.studentId),
        Query.limit(1)
      ]);
      if (enrs.length > 0) {
        className = enrs[0].classId || '';
        sectionName = enrs[0].section || '';

        if (className) {
          try {
            const cls = await databases.getDocument(DATABASE_ID, COLLECTIONS.CLASSES, className);
            className = cls.nameBn || cls.name || className;
          } catch (e) { }
        }
      }
    } catch (e) { }

    const receiptData = {
      receiptNo: payment.receiptNo || payment.paymentId || '---',
      paymentId: payment.paymentId || payment.$id,
      date: payment.paymentDate || payment.$createdAt,
      studentName: student.nameBn || student.nameEn || student.name || 'শিক্ষার্থীর নাম নেই',
      studentId: student.studentId || '---',
      studentClass: className,
      studentSection: sectionName,
      fatherName: student.fatherNameBn || student.fatherNameEn || '',
      month: inv.month || '',
      session: inv.session || '',
      items: items,
      totalAmount: inv.totalAmount || payment.amountPaid,
      discount: inv.discount || 0,
      netAmount: (inv.totalAmount || payment.amountPaid) - (inv.discount || 0),
      paidAmount: payment.amountPaid,
      dueAfterPayment: inv.dueAmount || 0,
      paymentMethod: payment.paymentMethod,
      transactionRef: payment.transactionRef || '',
      collectedBy: payment.collectedBy || '',
      instituteName: "Manzil International Institute",
      instituteNameBn: "মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট",
      instituteAddress: "Dhaka, Bangladesh",
      institutePhone: "",
      instituteLogo: ""
    };

    return { success: true, receipt: receiptData };
  } catch (e: any) {
    console.error('Receipt generation error:', e);
    return { success: false, error: 'রসিদ প্রসেস করতে সমস্যা হয়েছে' };
  }
}

// ═══════════════════════════════════════════════════════════════
// 10. BULK INVOICE GENERATION — Preview & Generate
// ═══════════════════════════════════════════════════════════════

/**
 * Row shape expected by InvoiceGenerator.tsx Step 2 table
 */
export interface InvoicePreviewRow {
  studentDocId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentSection: string;
  boardingType: string;
  feeAmount: number;
  hasExistingInvoice: boolean;
  existingStatus: string;
}

/**
 * Preview which students will receive a new invoice.
 *
 * Params come directly from InvoiceGenerator config:
 *   feeTypeId, feeTypeCode, feeTypeName, feeTypeBn,
 *   invoiceType, session, month?,
 *   classId?, boardingType?, departmentCode?, section?
 */
export async function previewInvoiceGeneration(params: {
  feeTypeId: string;
  feeTypeCode: string;
  feeTypeName: string;
  feeTypeBn: string;
  invoiceType: string;
  session: string;
  month?: string;
  classId?: string;
  boardingType?: string;
  departmentCode?: string;
  section?: string;
}): Promise<{ success: boolean; previewRows?: InvoicePreviewRow[]; error?: string }> {
  try {
    const { databases } = await createAdminClient();

    // 1. Resolve fee type default amount from FEE_TYPES collection
    let defaultAmount = 0;
    if (params.feeTypeId) {
      try {
        const ftDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.FEE_TYPES, params.feeTypeId);
        defaultAmount = ftDoc.defaultAmount || 0;
      } catch {
        console.warn('Could not fetch fee type doc by ID, using 0 as default');
      }
    }

    // 2. Find enrolled students matching filters
    const enrQueries = [Query.limit(500)];
    if (params.session) enrQueries.push(Query.equal('session', params.session));
    if (params.departmentCode) enrQueries.push(Query.equal('departmentId', params.departmentCode));
    if (params.classId) enrQueries.push(Query.equal('classId', params.classId));
    if (params.section) enrQueries.push(Query.equal('section', params.section));
    if (params.boardingType) enrQueries.push(Query.equal('boardingType', params.boardingType));

    const { documents: enrollments } = await databases.listDocuments(
      DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, enrQueries
    );

    if (enrollments.length === 0) {
      return { success: true, previewRows: [] };
    }

    // 3. Fetch student details
    const studentIds = enrollments.map(e => e.studentId).filter(Boolean);
    const studentMap = await fetchStudentMap(databases, studentIds);

    // 4. Check for existing invoices to mark duplicates
    const existingMap: Record<string, string> = {}; // studentId → status
    try {
      const dupQueries = [
        Query.equal('session', params.session),
        Query.limit(1000),
      ];
      // Use feeTypeCode (e.g. "FORM_FEE") as the invoiceType stored in DB
      const invoiceTypeVal = params.feeTypeCode || params.invoiceType || params.feeTypeName;
      if (invoiceTypeVal) dupQueries.push(Query.equal('invoiceType', invoiceTypeVal));
      if (params.month) dupQueries.push(Query.equal('month', params.month));

      const { documents: existing } = await databases.listDocuments(
        DATABASE_ID, COLLECTIONS.FEE_INVOICES, dupQueries
      );
      existing.forEach(inv => {
        existingMap[inv.studentId] = inv.status || 'unpaid';
      });
    } catch (e) {
      console.warn('Duplicate check query failed, treating all as new:', e);
    }

    // 5. Build preview rows
    const previewRows: InvoicePreviewRow[] = enrollments.map(enr => {
      const student = studentMap[enr.studentId] || {};
      const hasExisting = enr.studentId in existingMap;

      let finalFeeAmount = defaultAmount;
      if (params.invoiceType === 'monthly' && Number(enr.monthlyFee) > 0) {
        finalFeeAmount = Number(enr.monthlyFee);
      }

      return {
        studentDocId: enr.studentId,
        studentId: student.studentId || enr.studentId?.substring(0, 10) || 'N/A',
        studentName: student.nameBn || student.nameEn || student.name || 'অজানা',
        studentClass: student.class || enr.classId || 'N/A',
        studentSection: student.section || enr.section || '',
        boardingType: student.boardingType || enr.boardingType || '',
        feeAmount: finalFeeAmount,
        hasExistingInvoice: hasExisting,
        existingStatus: existingMap[enr.studentId] || '',
      };
    });

    return { success: true, previewRows };
  } catch (error: any) {
    console.error('previewInvoiceGeneration error:', error);
    return { success: false, error: error.message || 'প্রিভিউ জেনারেট করতে সমস্যা হয়েছে' };
  }
}

/**
 * Create invoices in bulk for selected students.
 *
 * Params from InvoiceGenerator:
 *   feeTypeId, feeTypeCode, feeTypeName, feeTypeBn,
 *   invoiceType, session, month?,
 *   targetStudentIds: string[],
 *   amountOverrides: Record<studentDocId, number>,
 *   recordedBy: string
 */
export async function generateBulkInvoices(params: {
  feeTypeId: string;
  feeTypeCode: string;
  feeTypeName: string;
  feeTypeBn: string;
  invoiceType: string;
  session: string;
  month?: string;
  targetStudentIds: string[];
  amountOverrides: Record<string, number>;
  recordedBy: string;
}): Promise<{ success: boolean; generatedCount?: number; skippedCount?: number; error?: string }> {
  try {
    const { databases } = await createAdminClient();

    // Resolve default amount
    let defaultAmount = 0;
    if (params.feeTypeId) {
      try {
        const ftDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.FEE_TYPES, params.feeTypeId);
        defaultAmount = ftDoc.defaultAmount || 0;
      } catch { /* use 0 */ }
    }

    let generatedCount = 0;
    let skippedCount = 0;
    const invoiceTypeVal = params.feeTypeCode || params.invoiceType || params.feeTypeName;

    for (const studentDocId of params.targetStudentIds) {
      try {
        // Check if invoice already exists for this student+session+month+type
        const dupCheck = [
          Query.equal('studentId', studentDocId),
          Query.equal('session', params.session),
          Query.equal('invoiceType', invoiceTypeVal),
          Query.limit(1),
        ];
        if (params.month) dupCheck.push(Query.equal('month', params.month));

        const { documents: existing } = await databases.listDocuments(
          DATABASE_ID, COLLECTIONS.FEE_INVOICES, dupCheck
        );

        if (existing.length > 0) {
          skippedCount++;
          continue;
        }

        // Fetch enrollment for this student
        let enrollmentId = '';
        let departmentCode = '';
        let baseAmount = defaultAmount;

        try {
          const { documents: enrs } = await databases.listDocuments(
            DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS,
            [Query.equal('studentId', studentDocId), Query.limit(1)]
          );
          if (enrs.length > 0) {
            enrollmentId = enrs[0].$id;
            departmentCode = enrs[0].departmentId || '';
            if (params.invoiceType === 'monthly' && Number(enrs[0].monthlyFee) > 0) {
              baseAmount = Number(enrs[0].monthlyFee);
            }
          }
        } catch { /* continue without enrollment */ }

        // Determine amount (override or base)
        const amount = params.amountOverrides[studentDocId] ?? baseAmount;

        // Generate sequential invoice ID
        const invoiceIdStr = await generateSequentialId(
          databases, COLLECTIONS.FEE_INVOICES, 'invoiceId', 'INV'
        );

        // Create the invoice document
        await databases.createDocument(DATABASE_ID, COLLECTIONS.FEE_INVOICES, ID.unique(), {
          invoiceId: invoiceIdStr,
          studentId: studentDocId,
          enrollmentId,
          departmentCode,
          invoiceType: invoiceTypeVal,
          month: params.month || '',
          session: params.session,
          totalAmount: amount,
          paidAmount: 0,
          discount: 0,
          dueAmount: amount,
          status: 'unpaid',
          createdBy: params.recordedBy || 'admin',
          feeItems: JSON.stringify([{
            feeTypeCode: params.feeTypeCode,
            feeTypeName: params.feeTypeBn || params.feeTypeName,
            amount,
          }]),
        });

        generatedCount++;
      } catch (err: any) {
        console.error(`Failed to create invoice for student ${studentDocId}:`, err.message);
        skippedCount++;
      }
    }

    return { success: true, generatedCount, skippedCount };
  } catch (error: any) {
    console.error('generateBulkInvoices error:', error);
    return { success: false, error: error.message || 'ইনভয়েস জেনারেশন ব্যর্থ হয়েছে' };
  }
}
