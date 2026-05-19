'use server';

import { Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import { ApiResponse, StudentTableResponse } from '@/features/students/types';
import type { UpdateStudentValues } from '@/features/students/schemas/update';
import { revalidatePath } from 'next/cache';

export interface GetStudentsParams {
  pageParam?: string; // Appwrite after/cursor ID
  limit?: number;
  search?: string;
  departmentId?: string;
  classId?: string;
  status?: string;
  boardingType?: string;
}

export async function getStudentsInfinite({
  pageParam,
  limit = 20,
  search,
  status = 'active',
  departmentId,
  classId,
  boardingType
}: GetStudentsParams): Promise<ApiResponse<StudentTableResponse>> {
  try {
    const { databases } = await createAdminClient();
    
    const queries = [
      Query.limit(limit),
      Query.orderDesc('$createdAt'),
    ];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }

    if (status && status !== 'all') {
      queries.push(Query.equal('status', status));
    }

    if (departmentId) {
      queries.push(Query.equal('departmentId', departmentId));
    }

    if (boardingType) {
      queries.push(Query.equal('boardingType', boardingType));
    }

    if (search) {
      queries.push(Query.or([
        Query.contains('nameEn', search),
        Query.contains('studentId', search),
        Query.contains('nameBn', search),
        Query.contains('phonePrimary', search)
      ]));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      queries
    );

    const students = JSON.parse(JSON.stringify(response.documents));

    // --- Batch resolve latest enrollments ---
    if (students.length > 0) {
      const studentIds = students.map((s: any) => s.$id);

      // 1. Fetch latest enrollments for these students
      const enrollmentsRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        [
          Query.equal('studentId', studentIds),
          Query.limit(100) // fetch enough for batch
        ]
      ).catch((e) => {
        console.error('Failed to fetch enrollments for students:', e);
        return { documents: [] };
      });

      let enrollments = enrollmentsRes.documents;

      // Filter active and sort in JS to avoid appwrite compound index issues
      enrollments = enrollments
        .filter(e => e.status !== 'inactive' && e.status !== 'archived')
        .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());

      // 2. Fetch classes and departments
      const classIds = Array.from(new Set(enrollments.map((e) => e.classId).filter(Boolean)));
      const deptIds = Array.from(new Set(enrollments.map((e) => e.departmentId).filter(Boolean)));
      const boardingTypeIds = Array.from(new Set([
        ...students.map((s: any) => s.boardingType).filter(Boolean),
        ...enrollments.map((e) => e.boardingType).filter(Boolean)
      ]));

      let classesMap: Record<string, string> = {};
      let deptsMap: Record<string, string> = {};
      let boardingTypesMap: Record<string, string> = {};

      if (classIds.length > 0) {
        const cRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CLASSES, [Query.equal('$id', classIds as string[])]).catch((e) => { console.error('Class fetch err:', e); return { documents: [] }; });
        cRes.documents.forEach(c => classesMap[c.$id] = c.nameBn || c.name);
      }
      if (deptIds.length > 0) {
        const dRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DEPARTMENTS, [Query.equal('$id', deptIds as string[])]).catch((e) => { console.error('Dept fetch err:', e); return { documents: [] }; });
        dRes.documents.forEach(d => deptsMap[d.$id] = d.nameBn || d.name);
      }
      if (boardingTypeIds.length > 0) {
        const bRes = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, [Query.equal('$id', boardingTypeIds as string[])]).catch((e) => { console.error('Boarding fetch err:', e); return { documents: [] }; });
        bRes.documents.forEach(b => boardingTypesMap[b.$id] = b.nameBn || b.name);
      }

      // 3. Attach metadata mapped by studentId
      for (const student of students) {
        // Map top-level boardingType if it's an ID
        if (student.boardingType && boardingTypesMap[student.boardingType]) {
          student.boardingType = boardingTypesMap[student.boardingType];
        }

        const studentEnrollments = enrollments.filter((e) => e.studentId === student.$id);
        if (studentEnrollments.length > 0) {
           student.activeEnrollments = studentEnrollments.map((enr) => ({
             departmentId: enr.departmentId || '',
             classId: enr.classId || '',
             className: classesMap[enr.classId] || '',
             departmentName: deptsMap[enr.departmentId] || '',
             session: enr.session || '',
             boardingType: boardingTypesMap[enr.boardingType] || enr.boardingType || '',
             boardingTypeId: enr.boardingType || '',
             section: enr.section || '',
             monthlyFee: enr.monthlyFee || 0,
             hallId: enr.hallId || '',
             hallName: enr.hallName || '',
             enrolledAt: enr.$createdAt
          }));
          
          // Keep top-level properties for legacy compatibility
          const latestEnr = studentEnrollments[0];
          student.className = classesMap[latestEnr.classId] || '';
          student.departmentName = deptsMap[latestEnr.departmentId] || '';
          student.session = latestEnr.session || '';
          student.classId = latestEnr.classId || '';
          student.departmentId = latestEnr.departmentId || '';
          student.hallId = latestEnr.hallId || '';
          student.hallName = latestEnr.hallName || '';
          // Only overwrite if it wasn't already mapped or was empty
          if (!student.boardingType || student.boardingType.length > 10) { 
            student.boardingType = boardingTypesMap[latestEnr.boardingType] || latestEnr.boardingType || '';
          }
        } else {
          student.activeEnrollments = [];
        }
      }
    }

    return {
      success: true,
      data: {
        documents: students,
        total: response.total,
        nextCursor: response.documents.length > 0 ? response.documents[response.documents.length - 1].$id : null
      }
    };
  } catch (error: any) {
    console.error('Error fetching students infinite:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStudent(id: string, data: UpdateStudentValues): Promise<ApiResponse<any>> {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      id,
      data
    );

    revalidatePath('/dashboard/admin/students');
    
    return { success: true, data: JSON.parse(JSON.stringify(res)) };
  } catch (error: any) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteStudent(id: string): Promise<ApiResponse<any>> {
  try {
    const { databases } = await createAdminClient();
    // Soft delete by setting status to inactive
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      id,
      { status: 'inactive' }
    );

    revalidatePath('/dashboard/admin/students');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message };
  }
}
