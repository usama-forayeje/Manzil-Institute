'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import { revalidatePath } from 'next/cache';
import { DEFAULT_FEE_CATEGORIES, type FeeCategory } from '@/features/fees/types';

const CATEGORIES_CONFIG_CODE = '__FEE_CATEGORIES_CONFIG__';

export async function getFeeTypes() {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );

    // Filter out internal system config documents
    const filtered = res.documents.filter(
      (d: any) => d.code !== CATEGORIES_CONFIG_CODE
    );

    return { success: true, feeTypes: JSON.parse(JSON.stringify(filtered)) };
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
    revalidatePath('/dashboard/admin/fees/collect');
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
    revalidatePath('/dashboard/admin/fees/collect');
    return { success: true, feeType: JSON.parse(JSON.stringify(res)) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleFeeTypeStatus(id: string, currentStatus: boolean) {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.FEE_TYPES,
      id,
      { isActive: !currentStatus }
    );
    revalidatePath('/dashboard/admin/fees/structure');
    revalidatePath('/dashboard/admin/fees/collect');
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
    revalidatePath('/dashboard/admin/fees/collect');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── FEE CATEGORIES MANAGEMENT ─────────────────────────────────

export async function getFeeCategories(): Promise<{
  success: boolean;
  categories: FeeCategory[];
  error?: string;
}> {
  try {
    const { databases } = await createAdminClient();
    let customCategories: FeeCategory[] = [];

    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_TYPES, [
        Query.equal('code', CATEGORIES_CONFIG_CODE),
        Query.limit(1),
      ]);

      if (res.documents.length > 0 && res.documents[0].breakdown) {
        try {
          const parsed = JSON.parse(res.documents[0].breakdown);
          if (Array.isArray(parsed)) {
            customCategories = parsed;
          }
        } catch {}
      }
    } catch (fetchErr) {
      console.warn('Fee categories config fetch error, using defaults:', fetchErr);
    }

    // Merge system categories with custom categories
    const categoryMap = new Map<string, FeeCategory>();
    DEFAULT_FEE_CATEGORIES.forEach((c) => categoryMap.set(c.id, c));
    customCategories.forEach((c) => {
      if (c && c.id) {
        categoryMap.set(c.id, { ...c, isSystem: false });
      }
    });

    return {
      success: true,
      categories: Array.from(categoryMap.values()),
    };
  } catch (err: any) {
    return { success: false, categories: DEFAULT_FEE_CATEGORIES, error: err.message };
  }
}

export async function saveFeeCategory(category: FeeCategory) {
  try {
    const { databases } = await createAdminClient();

    let existingCustom: FeeCategory[] = [];
    let configDocId: string | null = null;

    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_TYPES, [
        Query.equal('code', CATEGORIES_CONFIG_CODE),
        Query.limit(1),
      ]);

      if (res.documents.length > 0) {
        configDocId = res.documents[0].$id;
        if (res.documents[0].breakdown) {
          try {
            const parsed = JSON.parse(res.documents[0].breakdown);
            if (Array.isArray(parsed)) existingCustom = parsed;
          } catch {}
        }
      }
    } catch {}

    const cleanCategory: FeeCategory = {
      id: category.id || `cat_${Date.now()}`,
      nameBn: category.nameBn.trim(),
      nameEn: (category.nameEn || '').trim(),
      code: category.code.trim().toUpperCase(),
      color: category.color || 'blue',
      billingCycle: category.billingCycle || 'monthly',
      description: (category.description || '').trim(),
      isSystem: false,
    };

    const existingIdx = existingCustom.findIndex((c) => c.id === cleanCategory.id || c.code === cleanCategory.code);
    if (existingIdx >= 0) {
      existingCustom[existingIdx] = cleanCategory;
    } else {
      existingCustom.push(cleanCategory);
    }

    const payload = {
      name: 'Fee Categories Configuration',
      nameBn: 'ফি ক্যাটাগরি কনফিগারেশন',
      code: CATEGORIES_CONFIG_CODE,
      category: 'system_config',
      billingCycle: 'monthly',
      applicableTo: 'system',
      defaultAmount: 0,
      isActive: true,
      isRequired: false,
      showInAdmissionForm: false,
      breakdown: JSON.stringify(existingCustom),
    };

    if (configDocId) {
      await databases.updateDocument(DATABASE_ID, COLLECTIONS.FEE_TYPES, configDocId, payload);
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.FEE_TYPES, ID.unique(), payload);
    }

    revalidatePath('/dashboard/admin/fees/structure');
    revalidatePath('/dashboard/admin/fees/collect');
    return { success: true, category: cleanCategory };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteFeeCategory(categoryId: string) {
  try {
    const { databases } = await createAdminClient();

    const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FEE_TYPES, [
      Query.equal('code', CATEGORIES_CONFIG_CODE),
      Query.limit(1),
    ]);

    if (res.documents.length === 0) return { success: true };

    const configDoc = res.documents[0];
    let existingCustom: FeeCategory[] = [];
    if (configDoc.breakdown) {
      try {
        const parsed = JSON.parse(configDoc.breakdown);
        if (Array.isArray(parsed)) existingCustom = parsed;
      } catch {}
    }

    const updated = existingCustom.filter((c) => c.id !== categoryId);
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.FEE_TYPES, configDoc.$id, {
      breakdown: JSON.stringify(updated),
    });

    revalidatePath('/dashboard/admin/fees/structure');
    revalidatePath('/dashboard/admin/fees/collect');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
