'use server';

import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import { ID, Query } from 'appwrite';

// Mock implementations for terms and conditions functions
export async function getDesignations() {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS || ''
    );
    // Convert to plain object to avoid class Prototype error
    return {
      documents: result.documents.map(doc => JSON.parse(JSON.stringify(doc))),
    };
  } catch (error) {
    console.error('Error fetching designations:', error);
    return { documents: [] };
  }
}

export async function getAllTerms() {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS || ''
    );
    // Convert to plain object to avoid class Prototype error
    return {
      documents: result.documents.map(doc => JSON.parse(JSON.stringify(doc))),
    };
  } catch (error) {
    console.error('Error fetching terms:', error);
    return { documents: [] };
  }
}

export async function getTermsByDesignationFromDB(designationId: string) {
  try {
    const { databases } = await createAdminClient();
    const result = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS || '',
      [Query.equal('designation_id', designationId)]
    );
    // Convert to plain object to avoid class Prototype error
    return {
      documents: result.documents.map(doc => JSON.parse(JSON.stringify(doc))),
    };
  } catch (error) {
    console.error('Error fetching terms by designation:', error);
    return { documents: [] };
  }
}

export async function saveTerms(data: any) {
  try {
    const { databases } = await createAdminClient();

    // Log what we received
    console.log('[saveTerms] Received data:', data);
    console.log('[saveTerms] designationId:', data?.designationId);

    // Ensure designation_id is always set - use string conversion
    const designationId = String(
      data.designationId || data.designation_id || ''
    );

    if (!designationId) {
      throw new Error('designationId is required');
    }

    const sectionsData = Array.isArray(data.sections)
      ? JSON.stringify(data.sections)
      : typeof data.sections === 'string'
        ? data.sections
        : '[]';

    const payload = {
      designation_id: designationId,
      title: String(data.title || ''),
      sections: sectionsData,
      is_active: Boolean(data.isActive ?? data.is_active ?? true),
    };

    console.log('[saveTerms] Created document with payload:', payload);

    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS || '',
      ID.unique(),
      payload
    );

    // Convert to plain object to avoid Next.js serialization error
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error saving terms:', error);
    throw error;
  }
}

export async function updateTerms(documentId: string, data: any) {
  try {
    const { databases } = await createAdminClient();

    // Build payload with proper field conversion
    const designationId = String(
      data.designationId || data.designation_id || ''
    );

    const sectionsData = Array.isArray(data.sections)
      ? JSON.stringify(data.sections)
      : typeof data.sections === 'string'
        ? data.sections
        : '[]';

    const payload = {
      ...(designationId ? { designation_id: designationId } : {}),
      title: String(data.title || ''),
      sections: sectionsData,
      is_active: Boolean(data.isActive ?? data.is_active ?? true),
    };

    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.TERMS_CONDITIONS || '',
      documentId,
      payload
    );
  } catch (error) {
    console.error('Error updating terms:', error);
    throw error;
  }
}

export async function updateDesignation(documentId: string, data: any) {
  try {
    const { databases } = await createAdminClient();
    const payload = {
      label_bn: data.labelBn || data.label_bn || '',
      label_en:
        data.labelEn || data.label_en || data.labelBn || data.label_bn || '',
      category: data.category || 'other',
      sort_order:
        typeof data.sortOrder === 'number'
          ? data.sortOrder
          : data.sort_order || 100,
      has_terms: Boolean(data.hasTerms ?? data.has_terms ?? true),
      is_active: Boolean(data.isActive ?? data.is_active ?? true),
    };
    const result = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS || '',
      documentId,
      payload
    );
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error updating designation:', error);
    throw error;
  }
}

export async function createDesignation(data: any) {
  try {
    const { databases } = await createAdminClient();
    // Build payload - handle both object and separate params
    const payload = {
      label_bn: data.labelBn || data.label_bn || '',
      label_en:
        data.labelEn || data.label_en || data.labelBn || data.label_bn || '',
      category: data.category || 'other',
      sort_order:
        typeof data.sortOrder === 'number'
          ? data.sortOrder
          : data.sort_order || 100,
      has_terms: Boolean(data.hasTerms ?? data.has_terms ?? true),
      is_active: Boolean(data.isActive ?? data.is_active ?? true),
    };
    const result = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.DESIGNATIONS || '',
      ID.unique(),
      payload
    );
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error('Error creating designation:', error);
    throw error;
  }
}

export async function invalidateTermsCache() {
  // Mock implementation - in a real app this would invalidate cache
  return true;
}
