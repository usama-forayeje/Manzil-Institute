'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import type { AdmissionFormValues as AdmissionPayload } from '../schemas/form';

// --- Re-export common functions from existing actions ---
import {
  getDepartments as originalGetDepartments,
  getSessions as originalGetSessions,
  getSections as originalGetSections,
  getClassesByDepartment as originalGetClasses,
  getBoardingTypes as originalGetBoardTypes,
  getAdmissionFees as originalGetAdmissionFees,
  createAdmission as originalCreateAdmission,
  updateStudentAdmission as originalUpdateStudentAdmission,
} from '@/lib/actions/studentAdmission';

export async function getDepartments() { return originalGetDepartments(); }
export async function getSessions() { return originalGetSessions(); }
export async function getSections() { return originalGetSections(); }
export async function getClassesByDepartment(id: string) { return originalGetClasses(id); }
export async function getBoardingTypes() { return originalGetBoardTypes(); }
export async function getAdmissionFees(code: string, type: string, classId?: string) { 
  return originalGetAdmissionFees(code, type, classId); 
}
export async function createAdmission(payload: AdmissionPayload) { return originalCreateAdmission(payload); }
export async function updateStudentAdmission(id: string, payload: AdmissionPayload) { return originalUpdateStudentAdmission(id, payload); }

// --- Specific additional functions needed by UI components ---

export async function getBoardingRooms() {
  try {
    const { databases } = await createAdminClient();
    if (!COLLECTIONS.BOARDING_ROOMS) return { success: true, rooms: [] };
    const res = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.BOARDING_ROOMS,
      queries: [Query.equal('isActive', true)],
    });
    return { success: true, rooms: JSON.parse(JSON.stringify(res.documents)) as any };
  } catch (err: any) {
    return { success: false, rooms: [], error: err?.message };
  }
}

export async function createBoardingRoom(data: any): Promise<{success: boolean, room?: any, error?: string}> {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.BOARDING_ROOMS,
      documentId: ID.unique(),
      data: data,
    });
    return { success: true, room: JSON.parse(JSON.stringify(res)) };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateBoardingRoom(id: string, data: any): Promise<{success: boolean, room?: any, error?: string}> {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.updateDocument({
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.BOARDING_ROOMS,
      documentId: id,
      data: data,
    });
    return { success: true, room: JSON.parse(JSON.stringify(res)) };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteBoardingRoom(id: string, permanent: boolean = false): Promise<{success: boolean, error?: string}> {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument({
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.BOARDING_ROOMS,
      documentId: id,
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function getMonthlyFee(departmentId: string, boardingType: string, classId: string) {
  try {
    const { databases } = await createAdminClient();
    if (!COLLECTIONS.FEE_TYPES) return { success: true, amount: 2000 };
    
    // 1. Fetch the department to get its code (if provided ID)
    let deptCode = departmentId;
    try {
      const dept = await databases.getDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, departmentId);
      if (dept.code) deptCode = dept.code;
    } catch (e) {
      // It might already be a code or ID not found
    }

    // 2. Fetch all active fees
    const feeConfig = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.FEE_TYPES,
      queries: [
        Query.equal('isActive', true),
        Query.limit(100)
      ],
    });
    
    const fees = JSON.parse(JSON.stringify(feeConfig.documents)) as any[];
    console.log(`[Fee Sync] Found ${fees.length} active fees total.`);
    
    // 3. Filter by Category (match 'category' or 'feeCategory')
    const monthlyFees = fees.filter(f => 
      (f.category === 'monthly' || f.feeCategory === 'monthly')
    );
    console.log(`[Fee Sync] Found ${monthlyFees.length} monthly fees.`);

    // 4. Filter by department (match ID or Code)
    const deptFees = monthlyFees.filter(f => {
      if (!f.applicableDepartments || f.applicableDepartments.length === 0) return true;
      return f.applicableDepartments.includes(departmentId) || f.applicableDepartments.includes(deptCode);
    });
    console.log(`[Fee Sync] Matches Dept ${deptCode}: ${deptFees.length}`);

    // 5. Filter by boarding type
    const matchedFee = deptFees.find((f) => {
      if (f.applicableBoardingTypes && f.applicableBoardingTypes.length > 0) {
        return f.applicableBoardingTypes.includes(boardingType);
      }
      return true;
    });

    if (matchedFee) {
      console.log(`[Fee Sync] Success! Found fee: ${matchedFee.nameBn} - Amount: ${matchedFee.defaultAmount}`);
      return { success: true, amount: matchedFee.defaultAmount || 0 };
    }
    
    console.log(`[Fee Sync] No matching fee in FEE_TYPES. Checking Boarding Type fallback...`);
    
    // 6. Fallback: Check the Boarding Type document itself for a monthlyFee
    try {
      const bType = await databases.getDocument(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, boardingType);
      if (bType && bType.monthlyFee) {
        console.log(`[Fee Sync] Fallback Success! Found fee in Boarding Type: ${bType.monthlyFee}`);
        return { success: true, amount: bType.monthlyFee };
      }
    } catch (e) {
      console.error('[Fee Sync] Fallback check failed', e);
    }
    
    console.log(`[Fee Sync] No matching fee found anywhere for Dept: ${deptCode}, Boarding: ${boardingType}`);
    
    // Final fallback
    return { success: true, amount: 0 };
  } catch(err) {
     console.error('Error in getMonthlyFee:', err);
     return { success: false, amount: 0, error: 'বেতন খুঁজে পাওয়া যায়নি' };
  }
}

export async function getNextStudentId() {
  try {
      const { databases } = await createAdminClient();
      const existing = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: COLLECTIONS.STUDENTS,
        queries: [
          Query.orderDesc('studentId'),
          Query.limit(1),
        ],
      });
      if (existing.total > 0) {
         const lastId = existing.documents[0].studentId;
         const parts = lastId.split('-');
         const lastNum = parseInt(parts[parts.length - 1] ?? '0', 10);
         const next = lastNum + 1;
         const year = new Date().getFullYear();
         return `MNC-${year}-${String(next).padStart(4, '0')}`;
      }
  } catch (err) {}
  
  const year = new Date().getFullYear();
  return `MNC-${year}-0001`;
}

