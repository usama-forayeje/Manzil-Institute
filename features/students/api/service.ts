'use server';

import { Query } from 'node-appwrite';
import { createAdminClient } from '@/lib/appwrite/admin';
import { DATABASE_ID, COLLECTIONS } from '@/config/appwrite';
import {
  ApiResponse,
  StudentTableResponse,
  StudentStatsResponse,
  DischargeStudentPayload,
} from '@/features/students/types';
import type { UpdateStudentValues } from '@/features/students/schemas/update';
import { revalidatePath } from 'next/cache';

export interface GetStudentsParams {
  pageParam?: string; // Appwrite after/cursor ID
  limit?: number;
  search?: string;
  departmentId?: string;
  classId?: string;
  session?: string;
  status?: string; // 'all' | 'active' | 'departed' | 'residential' | 'non_residential' | specific status
  boardingType?: string;
  exitReason?: string;
}

export async function getStudentStatsAction(): Promise<ApiResponse<StudentStatsResponse>> {
  try {
    const { databases } = await createAdminClient();

    const [totalRes, activeRes, departedRes, activeEnrsRes] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, [Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, [Query.equal('status', 'active'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, [Query.notEqual('status', 'active'), Query.limit(1)]),
      databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, [
        Query.equal('status', 'active'),
        Query.limit(2000),
      ]),
    ]);

    const activeEnrollments = activeEnrsRes.documents;
    const residentialStudentIds = new Set<string>();

    activeEnrollments.forEach((e: any) => {
      const bt = (e.boardingType || '').toLowerCase();
      if (bt === '6a004a370030578f7d07' || bt === 'residential' || bt === 'আবাসিক') {
        residentialStudentIds.add(e.studentId);
      }
    });

    const residentialCount = residentialStudentIds.size;
    const nonResidentialCount = Math.max(0, activeRes.total - residentialCount);

    return {
      success: true,
      data: {
        total: totalRes.total,
        active: activeRes.total,
        departed: departedRes.total,
        residential: residentialCount,
        nonResidential: nonResidentialCount,
      },
    };
  } catch (error: any) {
    console.error('Error fetching student stats:', error);
    return { success: false, error: error.message };
  }
}

export async function getStudentsInfinite({
  pageParam,
  limit = 25,
  search,
  status = 'active',
  departmentId,
  classId,
  session,
  boardingType,
  exitReason,
}: GetStudentsParams): Promise<ApiResponse<StudentTableResponse>> {
  try {
    const { databases } = await createAdminClient();

    const queries = [Query.limit(limit), Query.orderDesc('$createdAt')];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }

    let filterStudentIds: string[] | null = null;

    // Academic filters (department, class, session exist on student_enrollments)
    const hasAcademicFilter = Boolean(
      (departmentId && departmentId !== 'all') ||
      (classId && classId !== 'all') ||
      (session && session !== 'all')
    );

    if (hasAcademicFilter) {
      const enrQueries: any[] = [Query.limit(2500)];
      if (departmentId && departmentId !== 'all') {
        enrQueries.push(Query.equal('departmentId', departmentId));
      }
      if (classId && classId !== 'all') {
        enrQueries.push(Query.equal('classId', classId));
      }
      if (session && session !== 'all') {
        enrQueries.push(Query.equal('session', session));
      }

      const enrRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        enrQueries
      );

      const matchedIds = Array.from(new Set(enrRes.documents.map((e: any) => e.studentId)));
      if (matchedIds.length === 0) {
        return {
          success: true,
          data: {
            documents: [],
            total: 0,
            nextCursor: null,
          },
        };
      }
      filterStudentIds = matchedIds;
    }

    // Handle boarding type specific status tabs
    if (status === 'residential' || status === 'non_residential') {
      const activeEnrsRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.STUDENT_ENROLLMENTS,
        [Query.equal('status', 'active'), Query.limit(2000)]
      );

      const isRes = status === 'residential';
      const targetStudentIds = Array.from(
        new Set(
          activeEnrsRes.documents
            .filter((e: any) => {
              const bt = (e.boardingType || '').toLowerCase();
              const matchRes = bt === '6a004a370030578f7d07' || bt === 'residential' || bt === 'আবাসিক';
              return isRes ? matchRes : !matchRes;
            })
            .map((e: any) => e.studentId)
        )
      );

      if (filterStudentIds) {
        filterStudentIds = filterStudentIds.filter((id) => targetStudentIds.includes(id));
      } else {
        filterStudentIds = targetStudentIds;
      }

      queries.push(Query.equal('status', 'active'));
    } else if (status === 'departed') {
      queries.push(Query.notEqual('status', 'active'));
    } else if (status && status !== 'all') {
      queries.push(Query.equal('status', status));
    }

    if (filterStudentIds !== null) {
      if (filterStudentIds.length === 0) {
        return {
          success: true,
          data: {
            documents: [],
            total: 0,
            nextCursor: null,
          },
        };
      }
      queries.push(Query.equal('$id', filterStudentIds.slice(0, 100)));
    }

    if (search) {
      queries.push(
        Query.or([
          Query.contains('nameEn', search),
          Query.contains('studentId', search),
          Query.contains('nameBn', search),
          Query.contains('phonePrimary', search),
        ])
      );
    }

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, queries);

    const students = JSON.parse(JSON.stringify(response.documents));

    // --- Batch resolve latest enrollments ---
    if (students.length > 0) {
      const studentIds = students.map((s: any) => s.$id);

      // 1. Fetch latest enrollments for these students
      const enrollmentsRes = await databases
        .listDocuments(DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, [
          Query.equal('studentId', studentIds),
          Query.limit(Math.max(100, studentIds.length * 3)),
        ])
        .catch((e) => {
          console.error('Failed to fetch enrollments for students:', e);
          return { documents: [] };
        });

      let enrollments = enrollmentsRes.documents;

      // Filter and sort in JS
      enrollments = enrollments
        .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());

      // 2. Fetch classes and departments
      const classIds = Array.from(new Set(enrollments.map((e) => e.classId).filter(Boolean)));
      const deptIds = Array.from(new Set(enrollments.map((e) => e.departmentId).filter(Boolean)));
      const boardingTypeIds = Array.from(
        new Set([
          ...students.map((s: any) => s.boardingType).filter(Boolean),
          ...enrollments.map((e) => e.boardingType).filter(Boolean),
        ])
      );

      let classesMap: Record<string, string> = {};
      let deptsMap: Record<string, string> = {};
      let boardingTypesMap: Record<string, string> = {};

      const [cRes, dRes, bRes] = await Promise.all([
        classIds.length > 0
          ? databases
              .listDocuments(DATABASE_ID, COLLECTIONS.CLASSES, [Query.equal('$id', classIds as string[])])
              .catch((e) => {
                console.error('Class fetch err:', e);
                return { documents: [] };
              })
          : Promise.resolve({ documents: [] }),
        deptIds.length > 0
          ? databases
              .listDocuments(DATABASE_ID, COLLECTIONS.DEPARTMENTS, [Query.equal('$id', deptIds as string[])])
              .catch((e) => {
                console.error('Dept fetch err:', e);
                return { documents: [] };
              })
          : Promise.resolve({ documents: [] }),
        boardingTypeIds.length > 0
          ? databases
              .listDocuments(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, [
                Query.equal('$id', boardingTypeIds as string[]),
              ])
              .catch((e) => {
                console.error('Boarding fetch err:', e);
                return { documents: [] };
              })
          : Promise.resolve({ documents: [] }),
      ]);

      cRes.documents.forEach((c: any) => (classesMap[c.$id] = c.nameBn || c.name));
      dRes.documents.forEach((d: any) => (deptsMap[d.$id] = d.nameBn || d.name));
      bRes.documents.forEach((b: any) => (boardingTypesMap[b.$id] = b.nameBn || b.name));

      // 3. Attach metadata mapped by studentId and parse dischargeInfo
      for (const student of students) {
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
            enrolledAt: enr.$createdAt,
          }));

          const latestEnr = studentEnrollments[0];
          student.className = classesMap[latestEnr.classId] || '';
          student.departmentName = deptsMap[latestEnr.departmentId] || '';
          student.session = latestEnr.session || '';
          student.classId = latestEnr.classId || '';
          student.departmentId = latestEnr.departmentId || '';
          student.hallId = latestEnr.hallId || '';
          student.hallName = latestEnr.hallName || '';
          if (!student.boardingType || student.boardingType.length > 10) {
            student.boardingType = boardingTypesMap[latestEnr.boardingType] || latestEnr.boardingType || '';
          }
        } else {
          student.activeEnrollments = [];
        }

        // Attach discharge info
        let dischargeInfo = null;
        if (student.notes) {
          try {
            const parsed = JSON.parse(student.notes);
            if (parsed?.exit) {
              dischargeInfo = parsed.exit;
            }
          } catch {
            // plain text notes
          }
        }

        if (!dischargeInfo && student.status !== 'active') {
          let reasonBn = 'বিদায়ী';
          if (student.status === 'graduated') reasonBn = 'হিফজ সম্পন্ন / ফারেগ';
          else if (student.status === 'transferred') reasonBn = 'অন্যত্র স্থানান্তর / টিসি';
          else if (student.status === 'expelled') reasonBn = 'শৃঙ্খলাভঙ্গজনিত বহিষ্কার';
          else if (student.status === 'inactive') reasonBn = 'নিষ্ক্রিয়';

          dischargeInfo = {
            reason: student.status,
            reasonBn,
            date: student.$updatedAt ? student.$updatedAt.split('T')[0] : '',
            remarks: student.notes || 'সাধারণ বিদায় / ছাড়পত্র',
            tcNo: `TC-${student.studentId || 'N/A'}`,
            clearance: 'cleared',
          };
        }

        student.dischargeInfo = dischargeInfo;
      }
    }

    let finalStudents = students;
    if (status === 'departed' && exitReason && exitReason !== 'all') {
      finalStudents = finalStudents.filter((student: any) => {
        return (
          student.dischargeInfo?.reason === exitReason ||
          student.status === exitReason
        );
      });
    }

    return {
      success: true,
      data: {
        documents: finalStudents,
        total: finalStudents.length !== students.length ? finalStudents.length : response.total,
        nextCursor: response.documents.length > 0 ? response.documents[response.documents.length - 1].$id : null,
      },
    };
  } catch (error: any) {
    console.error('Error fetching students infinite:', error);
    return { success: false, error: error.message };
  }
}

export async function dischargeStudentAction(payload: DischargeStudentPayload): Promise<ApiResponse<any>> {
  try {
    const { databases } = await createAdminClient();

    // 1. Determine valid status enum
    let appwriteStatus = 'left';
    if (payload.reason === 'graduated') appwriteStatus = 'graduated';
    else if (payload.reason === 'transferred') appwriteStatus = 'transferred';
    else if (payload.reason === 'expelled') appwriteStatus = 'expelled';
    else appwriteStatus = 'left';

    // 2. Prepare structured exit metadata (under 500 chars)
    const exitData = {
      exit: {
        reason: payload.reason,
        reasonBn: payload.reasonBn,
        date: payload.date || new Date().toISOString().split('T')[0],
        tcNo: payload.tcNo || `TC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        remarks: (payload.remarks || '').trim().slice(0, 250),
        clearance: payload.waiveDues ? 'waived' : 'cleared',
        dischargedAt: new Date().toISOString(),
        dischargedBy: payload.operatorName || 'Admin',
      },
    };

    // 3. Update student document
    const updatedStudent = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      payload.studentDocId,
      {
        status: appwriteStatus,
        notes: JSON.stringify(exitData),
      }
    );

    // 4. Update active enrollments and free hall bed
    try {
      const enrs = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, [
        Query.equal('studentId', payload.studentDocId),
        Query.equal('status', 'active'),
      ]);

      for (const enr of enrs.documents) {
        let enrStatus = 'withdrawn';
        if (payload.reason === 'transferred') enrStatus = 'transferred';
        else if (payload.reason === 'expelled') enrStatus = 'expelled';

        await databases.updateDocument(DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, enr.$id, {
          status: enrStatus,
        });

        // Release hall bed
        if (enr.hallId) {
          try {
            const hallCol = COLLECTIONS.BOARDING_ROOMS || 'hall_rooms';
            const room = await databases.getDocument(DATABASE_ID, hallCol, enr.hallId);
            if (room && room.occupiedSeats > 0) {
              await databases.updateDocument(DATABASE_ID, hallCol, enr.hallId, {
                occupiedSeats: Math.max(0, room.occupiedSeats - 1),
              });
            }
          } catch (hallErr) {
            console.error('Error releasing hall seat on discharge:', hallErr);
          }
        }
      }
    } catch (enrErr) {
      console.error('Error updating enrollments on discharge:', enrErr);
    }

    revalidatePath('/dashboard/admin/students');
    return {
      success: true,
      data: {
        student: JSON.parse(JSON.stringify(updatedStudent)),
        dischargeInfo: exitData.exit,
      },
    };
  } catch (error: any) {
    console.error('Error discharging student:', error);
    return { success: false, error: error.message };
  }
}

export async function reactivateStudentAction(studentDocId: string): Promise<ApiResponse<any>> {
  try {
    const { databases } = await createAdminClient();

    // 1. Reset student status to active
    const updatedStudent = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.STUDENTS,
      studentDocId,
      {
        status: 'active',
        notes: '',
      }
    );

    // 2. Reactivate latest enrollment
    try {
      const enrs = await databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENT_ENROLLMENTS, [
        Query.equal('studentId', studentDocId),
        Query.orderDesc('$createdAt'),
        Query.limit(1),
      ]);

      if (enrs.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.STUDENT_ENROLLMENTS,
          enrs.documents[0].$id,
          { status: 'active' }
        );
      }
    } catch (enrErr) {
      console.error('Error reactivating enrollment:', enrErr);
    }

    revalidatePath('/dashboard/admin/students');
    return { success: true, data: JSON.parse(JSON.stringify(updatedStudent)) };
  } catch (error: any) {
    console.error('Error reactivating student:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStudent(id: string, data: UpdateStudentValues): Promise<ApiResponse<any>> {
  try {
    const { databases } = await createAdminClient();
    const res = await databases.updateDocument(DATABASE_ID, COLLECTIONS.STUDENTS, id, data);

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
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.STUDENTS, id, { status: 'inactive' });

    revalidatePath('/dashboard/admin/students');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message };
  }
}
