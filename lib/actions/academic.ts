'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';

// ═══════════════════════════════════════════════════════════════
// ACADEMIC & SETTINGS ACTIONS
// ═══════════════════════════════════════════════════════════════

// ─── Categories & Types ─────────────────────────────────────

export interface DepartmentParams {
  code: string;
  name: string;
  nameBn: string;
  isActive: boolean;
  docId?: string;
}

export interface ClassParams {
  name: string;
  nameBn: string;
  level: number;
  departmentId: string;
  departmentCode?: string;
  section?: string; 
  isActive: boolean;
  monthlyFee?: number;
  docId?: string;
}

export interface BoardingTypeParams {
  name: string;
  nameBn: string;
  order: number;
  monthlyFee: number;
  isActive: boolean;
  docId?: string;
}

// ─── DEPARTMENTS ────────────────────────────────────────────

export async function upsertDepartment(data: DepartmentParams) {
  try {
    const { databases } = await createAdminClient();

    const isUpdate = data.docId && data.docId !== 'undefined' && data.docId !== '$undefined';

    if (isUpdate && data.docId) {
      console.log('[Appwrite Debug] Updating department:', data.docId);
      // Update
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.DEPARTMENTS,
        data.docId,
        {
          code: data.code,
          name: data.name,
          nameBn: data.nameBn,
          type: 'madrasa',
          hasBoardingFee: true,
          hasExamFee: true,
          hasMonthlyFee: true,
          isActive: data.isActive,
        }
      );
      return { success: true };
    } else {
      console.log('[Appwrite Debug] Creating new department');
      // Check if already exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.DEPARTMENTS,
        [Query.equal('code', data.code)]
      );

      if (existing.total > 0) {
        return { success: false, error: 'এই ডিপার্টমেন্ট কোডটি ইতিমধ্যে ব্যবহৃত হয়েছে।' };
      }

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.DEPARTMENTS,
        ID.unique(),
        {
          code: data.code,
          name: data.name,
          nameBn: data.nameBn,
          type: 'madrasa',
          hasBoardingFee: true,
          hasExamFee: true,
          hasMonthlyFee: true,
          isActive: data.isActive,
        }
      );
      return { success: true };
    }
  } catch (error: any) {
    console.error('Failed to upsert department:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteDepartment(docId: string) {
  try {
    if (!DATABASE_ID || !COLLECTIONS.DEPARTMENTS) return { success: false, error: 'Config missing' };
    if (!docId || docId === 'undefined' || docId === '$undefined') return { success: false, error: 'Invalid ID' };

    const { databases } = await createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, docId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllDepartments() {
  try {
    if (!DATABASE_ID || !COLLECTIONS.DEPARTMENTS) {
      console.error('[Appwrite Error] DATABASE_ID or DEPARTMENTS Collection ID is missing in .env.local');
      return { success: false, departments: [], error: 'Configuration missing: DATABASE_ID or DEPARTMENTS_ID' };
    }

    console.log('[Appwrite Debug] Listing Documents from:', COLLECTIONS.DEPARTMENTS);
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DEPARTMENTS,
      [Query.orderAsc('code'), Query.limit(100)]
    );
    // Plain-ify documents for Next.js Client Components
    return { success: true, departments: JSON.parse(JSON.stringify(result.documents)) };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, departments: [], error: error.message };
  }
}

// ─── CLASSES ────────────────────────────────────────────────

export async function upsertClass(data: ClassParams) {
  try {
    const { databases } = await createAdminClient();

    const isUpdate = data.docId && data.docId !== 'undefined' && data.docId !== '$undefined';

    const payload = {
      name: data.name,
      nameBn: data.nameBn,
      level: data.level,
      departmentId: data.departmentId,
      departmentCode: data.departmentCode,
      sections: data.section ? [data.section] : [], 
      isActive: data.isActive,
      monthlyFee: data.monthlyFee ? Number(data.monthlyFee) : 0,
    };

    if (isUpdate && data.docId) {
      console.log('[Appwrite Debug] Updating class:', data.docId);
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CLASSES,
        data.docId,
        payload
      );
      return { success: true };
    } else {
      console.log('[Appwrite Debug] Creating new class');
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CLASSES,
        ID.unique(),
        payload
      );
      return { success: true };
    }
  } catch (error: any) {
    console.error('Failed to upsert class:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteClass(docId: string) {
  try {
    if (!DATABASE_ID || !COLLECTIONS.CLASSES) return { success: false, error: 'Config missing' };
    if (!docId || docId === 'undefined' || docId === '$undefined') return { success: false, error: 'Invalid ID' };

    const { databases } = await createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CLASSES, docId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllClasses() {
  try {
    if (!DATABASE_ID || !COLLECTIONS.CLASSES) {
      console.error('[Appwrite Error] DATABASE_ID or CLASSES Collection ID is missing in .env.local');
      return { success: false, classes: [], error: 'Configuration missing: DATABASE_ID or CLASSES_ID' };
    }

    console.log('[Appwrite Debug] Listing Documents from:', COLLECTIONS.CLASSES);
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CLASSES,
      [Query.orderAsc('level'), Query.limit(100)]
    );
    // Plain-ify documents for Next.js Client Components
    return { success: true, classes: JSON.parse(JSON.stringify(result.documents)) };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, classes: [], error: error.message };
  }
}

// ─── SESSIONS ───────────────────────────────────────────────

export interface SessionParams {
  sessionName: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  isCurrent: boolean;
  docId?: string;
}

export async function upsertSession(data: SessionParams) {
  try {
    if (!DATABASE_ID || !COLLECTIONS.SESSIONS) {
      console.error('[Appwrite Error] DATABASE_ID or SESSIONS Collection ID is missing in .env.local');
      return { success: false, error: 'Configuration missing: DATABASE_ID or SESSIONS_ID' };
    }

    const { databases } = await createAdminClient();

    const payload = {
      sessionName: data.sessionName,
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date().toISOString(),
      isActive: data.isActive,
      isCurrent: data.isCurrent,
    };

    // Handle case where frontend might send "undefined" as a string
    const isUpdate = data.docId && data.docId !== 'undefined' && data.docId !== '$undefined';

    if (isUpdate && data.docId) {
      console.log('[Appwrite Debug] Updating session:', data.docId);
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.SESSIONS, data.docId, payload);
    } else {
      console.log('[Appwrite Debug] Creating new session');
      await databases.createDocument(DATABASE_ID, COLLECTIONS.SESSIONS, ID.unique(), {
        ...payload,
      });
    }
    return { success: true };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, error: error.message };
  }
}

export async function getAllSessions() {
  try {
    if (!DATABASE_ID || !COLLECTIONS.SESSIONS) return { success: false, sessions: [], error: 'Config missing' };

    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SESSIONS, [
      Query.orderDesc('sessionName'), Query.limit(100)
    ]);
    return { success: true, sessions: JSON.parse(JSON.stringify(result.documents)) };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, sessions: [], error: error.message };
  }
}

export async function deleteSession(docId: string) {
  try {
    if (!DATABASE_ID || !COLLECTIONS.SESSIONS) return { success: false, error: 'Config missing' };
    if (!docId || docId === 'undefined' || docId === '$undefined') return { success: false, error: 'Invalid ID' };

    const { databases } = await createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SESSIONS, docId);
    return { success: true };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, error: error.message };
  }
}

// ─── SECTIONS ───────────────────────────────────────────────

export interface SectionParams {
  sectionName: string;
  sectionNameBn: string;
  capacity?: number;
  isActive: boolean;
  docId?: string;
}

export async function upsertSection(data: SectionParams) {
  try {
    if (!DATABASE_ID || !COLLECTIONS.SECTIONS) {
      console.error('[Appwrite Error] DATABASE_ID or SECTIONS Collection ID is missing in .env.local');
      return { success: false, error: 'Configuration missing: DATABASE_ID or SECTIONS_ID' };
    }

    const { databases } = await createAdminClient();

    const payload = {
      sectionName: data.sectionName,
      sectionNameBn: data.sectionNameBn,
      capacity: data.capacity || 0,
      isActive: data.isActive,
    };

    const isUpdate = data.docId && data.docId !== 'undefined' && data.docId !== '$undefined';

    if (isUpdate && data.docId) {
      console.log('[Appwrite Debug] Updating section:', data.docId);
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.SECTIONS, data.docId, payload);
    } else {
      console.log('[Appwrite Debug] Creating new section');
      await databases.createDocument(DATABASE_ID, COLLECTIONS.SECTIONS, ID.unique(), {
        ...payload,
      });
    }
    return { success: true };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, error: error.message };
  }
}

export async function getAllSections() {
  try {
    if (!DATABASE_ID || !COLLECTIONS.SECTIONS) return { success: false, sections: [], error: 'Config missing' };

    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SECTIONS, [
      Query.orderAsc('sectionName'), Query.limit(100)
    ]);
    return { success: true, sections: JSON.parse(JSON.stringify(result.documents)) };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, sections: [], error: error.message };
  }
}

export async function deleteSection(docId: string) {
  try {
    if (!DATABASE_ID || !COLLECTIONS.SECTIONS) return { success: false, error: 'Config missing' };
    if (!docId || docId === 'undefined' || docId === '$undefined') return { success: false, error: 'Invalid ID' };

    const { databases } = await createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SECTIONS, docId);
    return { success: true };
  } catch (error: any) {
    console.error('[Appwrite Error]', error.message);
    return { success: false, error: error.message };
  }
}

// ─── BOARDING TYPES ──────────────────────────────────────────

export async function upsertBoardingType(data: BoardingTypeParams) {
  try {
    const { databases } = await createAdminClient();
    
    const payload = {
      name: data.name,
      nameBn: data.nameBn,
      order: Number(data.order),
      monthlyFee: Number(data.monthlyFee || 0),
      isActive: data.isActive,
    };

    const isUpdate = data.docId && data.docId !== 'undefined' && data.docId !== '$undefined';

    if (isUpdate && data.docId) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BOARDING_TYPES,
        data.docId,
        payload
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BOARDING_TYPES,
        ID.unique(),
        payload
      );
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getAllBoardingTypes() {
  try {
    const { databases } = await createAdminClient();
    if (!DATABASE_ID || !COLLECTIONS.BOARDING_TYPES) return { success: false, boardingTypes: [], error: 'Config missing' };
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.BOARDING_TYPES,
      [Query.orderAsc('order'), Query.limit(100)]
    );
    return {
      success: true,
      boardingTypes: JSON.parse(JSON.stringify(response.documents)),
    };
  } catch (err: any) {
    return { success: false, boardingTypes: [], error: err.message };
  }
}

export async function deleteBoardingType(docId: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.BOARDING_TYPES,
      docId
    );
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
