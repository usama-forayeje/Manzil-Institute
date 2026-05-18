'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import { revalidatePath } from 'next/cache';

export async function getFeeTypes() {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      [Query.orderDesc('$createdAt')]
    );
    return { success: true, feeTypes: JSON.parse(JSON.stringify(res.documents)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createFeeType(data: any) {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      ID.unique(),
      data
    );
    revalidatePath('/dashboard/admin/fees/structure');
    return { success: true, feeType: JSON.parse(JSON.stringify(res)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateFeeType(id: string, data: any) {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      id,
      data
    );
    revalidatePath('/dashboard/admin/fees/structure');
    return { success: true, feeType: JSON.parse(JSON.stringify(res)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteFeeType(id: string) {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FEE_TYPES, id);
    revalidatePath('/dashboard/admin/fees/structure');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
