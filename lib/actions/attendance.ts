'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';

// ─── Types ──────────────────────────────────────────────────
export interface ProcessNfcScanParams {
  cardUid: string;
  terminalId: string;
  gateMode: 'entry' | 'exit' | 'auto';
}

export interface MarkManualAttendanceParams {
  studentDocId: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  notes?: string;
  recordedBy: string;
}

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE ACTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Process NFC Card Scan
 */
export async function processNfcScan(params: ProcessNfcScanParams) {
  try {
    const { databases } = await createAdminClient();

    // 1. Find NFC Card
    const { documents: cards } = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.NFC_CARDS,
      [
        Query.equal('cardUid', params.cardUid),
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
    let actionType = params.gateMode;

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
          terminalId: params.terminalId,
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
            terminalId: params.terminalId,
            recordedBy: 'system_nfc',
          }
        );
      }
    }

    return { 
      success: true, 
      studentId: card.assignedToId, 
      actionType,
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
    
    // Check if record exists for date
    const { documents: exactRecords } = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ATTENDANCE_STUDENTS,
      [
        Query.equal('studentId', params.studentId),
        Query.equal('date', params.date),
      ]
    );

    if (exactRecords.length > 0) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE_STUDENTS,
        exactRecords[0].$id,
        {
          status: params.status,
          notes: params.notes || exactRecords[0].notes,
          recordedBy: params.recordedBy,
          updatedAt: new Date().toISOString()
        }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ATTENDANCE_STUDENTS,
        ID.unique(),
        {
          studentDocId: params.studentDocId,
          studentId: params.studentId,
          date: params.date,
          status: params.status,
          notes: params.notes || '',
          recordedBy: params.recordedBy,
        }
      );
    }

    return { success: true };
  } catch (err: any) {
    console.error('Manual attendance failed:', err);
    return { success: false, error: err.message };
  }
}
