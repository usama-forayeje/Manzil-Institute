'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';

// ─── Types ──────────────────────────────────────────────────
export interface ProcessNfcScanParams {
  cardUid: string;
  terminalId?: string;
  gateMode?: 'entry' | 'exit' | 'auto';
}

export interface MarkManualAttendanceParams {
  studentDocId?: string;
  studentId?: string;
  entityId?: string;
  entityType?: 'student' | 'staff';
  date?: string;
  status?: 'present' | 'absent' | 'late' | 'leave';
  action?: 'entry' | 'exit';
  manuallyMarkedBy?: string;
  notes?: string;
  recordedBy?: string;
}

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE ACTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Process NFC Card Scan
 */
export async function processNfcScan(params: ProcessNfcScanParams | string) {
  try {
    const cardUid = typeof params === 'string' ? params : params.cardUid;
    const terminalId = typeof params === 'string' ? 'main-gate' : (params.terminalId || 'main-gate');
    const gateMode = typeof params === 'string' ? 'auto' : (params.gateMode || 'auto');

    const { databases } = await createAdminClient();

    // 1. Find NFC Card
    const { documents: cards } = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.NFC_CARDS,
      [
        Query.equal('cardUid', cardUid),
        Query.equal('isActive', true),
      ]
    );

    if (cards.length === 0) {
      return { success: false, error: 'Unregistered or inactive card.' };
    }

    const card = cards[0];
    let actualStatus: 'present' | 'late' = 'present';
    
    // Simple logic: if scanned after 9:00 AM, mark late
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // For demo: Let's say late after 08:30 (8.5)
    if (currentHour > 8 || (currentHour === 8 && currentMinute > 30)) {
      actualStatus = 'late';
    }

    const todayDateStr = now.toISOString().split('T')[0];
    let actionType = gateMode;

    // Default 'auto' logic:
    // If not checked in today, it's 'entry'
    if (actionType === 'auto') {
       const { total } = await databases.listDocuments(
         DATABASE_ID,
         COLLECTIONS.ATTENDANCE_STUDENTS,
         [
           Query.equal('studentId', card.assignedToId),
           Query.equal('date', todayDateStr),
         ]
       );
       actionType = total === 0 ? 'entry' : 'exit';
    }

    // Process logic here for saving attendance record
    const attendanceDocId = ID.unique();
    const timeStr = now.toISOString();

    if (actionType === 'entry') {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE_STUDENTS,
        attendanceDocId,
        {
          studentDocId: card.assignedToId, // Depending on relation structuring
          studentId: card.assignedToId,
          date: todayDateStr,
          status: actualStatus,
          checkIn: timeStr,
          terminalId,
          recordedBy: 'system_nfc',
        }
      );
    } else {
      // Find today's record to add checkOut
      const { documents: records } = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE_STUDENTS,
        [
          Query.equal('studentId', card.assignedToId),
          Query.equal('date', todayDateStr),
        ]
      );

      if (records.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.ATTENDANCE_STUDENTS,
          records[0].$id,
          {
            checkOut: timeStr,
            updatedAt: timeStr,
          }
        );
      } else {
        // Checking out without check-in
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.ATTENDANCE_STUDENTS,
          attendanceDocId,
          {
            studentDocId: card.assignedToId,
            studentId: card.assignedToId,
            date: todayDateStr,
            status: 'leave', // or present depending on rules
            checkOut: timeStr,
            terminalId,
            recordedBy: 'system_nfc',
          }
        );
      }
    }

    // Lookup user information for feedback
    let user: { name?: string; nameBn?: string } = { name: card.assignedToId };
    try {
      const student = await databases.getDocument(DATABASE_ID, COLLECTIONS.STUDENTS, card.assignedToId);
      user = { name: (student as any).nameEn || (student as any).name, nameBn: (student as any).nameBn };
    } catch {
      try {
        const studentList = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, [
          Query.equal('studentId', card.assignedToId),
          Query.limit(1)
        ]);
        if (studentList.documents.length > 0) {
          const s = studentList.documents[0] as any;
          user = { name: s.nameEn || s.name, nameBn: s.nameBn };
        }
      } catch {}
    }

    return { 
      success: true, 
      studentId: card.assignedToId, 
      action: actionType,
      actionType,
      user,
      status: actualStatus 
    };
  } catch (err: any) {
    console.error('NFC scanning failed:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Mark Attendance Manually
 */
export async function markManualAttendance(params: MarkManualAttendanceParams) {
  try {
    const { databases } = await createAdminClient();
    const targetStudentId = params.studentId || params.entityId || '';
    const date = params.date || new Date().toISOString().split('T')[0];
    const recordedBy = params.recordedBy || params.manuallyMarkedBy || 'admin';
    const status = params.status || 'present';
    const docId = params.studentDocId || targetStudentId;

    let userName = targetStudentId;
    try {
      const student = await databases.getDocument(DATABASE_ID, COLLECTIONS.STUDENTS, targetStudentId);
      userName = (student as any).nameBn || (student as any).nameEn || (student as any).name || targetStudentId;
    } catch {
      try {
        const list = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, [
          Query.equal('studentId', targetStudentId),
          Query.limit(1)
        ]);
        if (list.documents.length > 0) {
          const s = list.documents[0] as any;
          userName = s.nameBn || s.nameEn || s.name || targetStudentId;
        }
      } catch {}
    }
    
    // Check if record exists for date
    const { documents: exactRecords } = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ATTENDANCE_STUDENTS,
      [
        Query.equal('studentId', targetStudentId),
        Query.equal('date', date),
      ]
    );

    if (exactRecords.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE_STUDENTS,
        exactRecords[0].$id,
        {
          status,
          notes: params.notes || exactRecords[0].notes,
          recordedBy,
          updatedAt: new Date().toISOString()
        }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE_STUDENTS,
        ID.unique(),
        {
          studentDocId: docId,
          studentId: targetStudentId,
          date,
          status,
          notes: params.notes || '',
          recordedBy,
        }
      );
    }

    return { success: true, userName };
  } catch (err: any) {
    console.error('Manual attendance failed:', err);
    return { success: false, error: err.message };
  }
}
