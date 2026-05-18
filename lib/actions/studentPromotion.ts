'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import { getSession } from '@/lib/auth/actions';
import { revalidatePath } from 'next/cache';

// ─── ID Generator (Copied from Admission for consistency) ───
async function generateSequentialId(
  databases: any,
  collectionId: string,
  fieldName: string,
  prefix: string,
  padLength: number = 4
): Promise<string> {
  const year = new Date().getFullYear();
  const fullPrefix = `${prefix}-${year}-`;

  try {
    const existing = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId,
      queries: [
        Query.startsWith(fieldName, fullPrefix),
        Query.orderDesc(fieldName),
        Query.limit(1),
      ],
    });

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

export interface PromotionPayload {
  studentDocId: string;
  studentId: string;
  actionType: 'promoted' | 'failed' | 'continued';
  boardingType: string;
  enrollments: {
    departmentId: string;
    departmentName?: string;
    classId: string;
    className?: string;
    session: string;
    section?: string;
    rollNo?: string;
    monthlyFee?: number;
  }[];
  sessionFee?: number;
  discount?: number;
  netPayable?: number;
}

/**
 * Main Action to Promote or Update Student Enrollment
 */
export async function promoteStudent(payload: PromotionPayload) {
  try {
    const { databases } = await createAdminClient();
    const session = await getSession();
    const currentUserName = session?.userDoc?.name || session?.user?.name || 'admin';

    // 1. Fetch current active enrollments
    const { documents: currentEnrollments } = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.STUDENT_ENROLLMENTS,
      queries: [
        Query.equal('studentId', payload.studentDocId),
        Query.equal('status', 'active'),
      ]
    });

    // 2. Deactivate them (Archiving previous year/session records)
    for (const en of currentEnrollments) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        en.$id,
        { status: 'archived' }
      );
    }

    // 3. Create New Enrollments
    const newEnrollmentIds: string[] = [];
    for (const en of payload.enrollments) {
      const enrollmentId = await generateSequentialId(
        databases,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        'enrollmentId',
        'ENR',
        4
      );

      const newEnDoc = await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.STUDENT_ENROLLMENTS,
        documentId: ID.unique(),
        data: {
          enrollmentId,
          studentId: payload.studentDocId, // This is the $id of the student document
          departmentId: en.departmentId,
          classId: en.classId,
          section: en.section || '',
          session: en.session,
          monthlyFee: Number(en.monthlyFee || 0),
          rollNo: en.rollNo || '',
          boardingType: payload.boardingType,
          status: 'active',
          enrollmentDate: new Date().toISOString(),
          promotionStatus: payload.actionType, // promoted, failed, or continued
          notes: `Updated via Promotion Dashboard - ${payload.actionType}`,
        },
      });
      newEnrollmentIds.push(enrollmentId);
    }

    // 4. Update Student Record with latest mapping (optional but helps for searching)
    // Most systems use the Student record as a "Last known state"
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      payload.studentDocId,
      {
        departmentId: payload.enrollments[0]?.departmentId,
        classId: payload.enrollments[0]?.classId,
        boardingType: payload.boardingType,
      }
    ).catch(() => {}); // Fallback if fields don't exist

    // 5. Create Session Fee Invoice (if applicable)
    if (payload.sessionFee && payload.sessionFee > 0) {
      const invoiceId = await generateSequentialId(
        databases,
        COLLECTIONS.FEE_INVOICES,
        'invoiceId',
        'INV',
        5
      );
      
      const receiptNo = await generateSequentialId(
        databases,
        COLLECTIONS.FEE_INVOICES,
        'receiptNo',
        'RCT',
        5
      );

      await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.FEE_INVOICES,
        documentId: ID.unique(),
        data: {
          invoiceId,
          receiptNo,
          studentId: payload.studentDocId,
          enrollmentId: newEnrollmentIds[0], // Connect to primary enrollment
          invoiceType: 'admission', // Re-admission or promotion fee
          session: payload.enrollments[0]?.session,
          month: new Date().toLocaleString('default', { month: 'long' }),
          totalAmount: Number(payload.sessionFee || 0),
          discount: Number(payload.discount || 0),
          netAmount: Number(payload.netPayable || 0),
          dueAmount: Number(payload.netPayable || 0),
          paidAmount: 0,
          status: 'unpaid',
          createdBy: currentUserName,
          createdAt: new Date().toISOString(),
          feeItems: JSON.stringify([{
            feeTypeCode: 'admission-fee',
            feeTypeName: payload.actionType === 'promoted' ? 'প্রমোশন ফি' : 'সেশন রিনিউয়াল ফি',
            amount: payload.sessionFee,
            isRequired: true,
            isIncluded: true
          }])
        }
      });
    }

    // Invalidate dashboard caches
    revalidatePath('/dashboard/admin/students');
    revalidatePath('/dashboard/admin/students/promote');

    return { 
      success: true, 
      message: `${payload.actionType === 'promoted' ? 'সফলভাবে প্রমোশন দেওয়া হয়েছে' : 'তথ্য আপডেট করা হয়েছে'}` 
    };

  } catch (error: any) {
    console.error('Promotion Action Error:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
  }
}
