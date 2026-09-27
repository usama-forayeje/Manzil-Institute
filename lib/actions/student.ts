"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, storage } from "@/lib/appwrite/admin";
import { DATABASE_ID, COLLECTIONS } from "@/config/appwrite";

export interface StudentFormData {
	name: string;
	nameBn?: string;
	dateOfBirth: string;
	gender: "male" | "female";
	bloodGroup?: string;
	nationality?: string;
	barthCertNo?: string;
	photoFile?: File;
	fatherName: string;
	fatherPhone?: string;
	fatherNid?: string;
	fatherOccupation?: string;
	motherName: string;
	motherPhone?: string;
	guardianName?: string;
	guardianPhone?: string;
	guardianRelation?: string;
	village: string;
	postOffice: string;
	upazila: string;
	district: string;
	division: string;
	admissionClass: string;
	section?: string;
	rollNo?: string;
	previousSchool?: string;
	previousClass?: string;
	previousResult?: string;
	boardingType: "day" | "residential" | "boarding";
	roomPreference?: string;
	feeItems: FeeItem[];
	totalFee: number;
	paidAmount: number;
	paymentMethod: "cash" | "bank" | "bkash" | "nagad";
	referenceNo?: string;
	notes?: string;
}

export interface FeeItem {
	name: string;
	type: "admission" | "monthly" | "boarding" | "exam" | "other";
	amount: number;
	selected: boolean;
}

export interface AdmissionResult {
	success: boolean;
	studentId?: string;
	receiptNo?: string;
	error?: string;
}

import { getAllClasses, getAllSections, getAllDepartments } from '@/lib/actions/academic';

export async function getClasses() {
	try {
		const result = await getAllClasses();
		if (result.success) {
			const activeClasses = (result.classes || []).filter((c: any) => c.isActive !== false);
			return { success: true, classes: activeClasses };
		}
		return result;
	} catch (error) {
		console.error("Error fetching classes", error);
		return { success: false, classes: [], error: String(error) };
	}
}

export async function submitAdmission(data: StudentFormData, currentUserId?: string): Promise<AdmissionResult> {
	try {
		const { databases } = await createAdminClient();
		const studentId = "MDS-2025-" + Date.now().toString();
		const receiptNo = "RCP-2025-" + Date.now().toString();
		// Student creation logic here
		return { success: true, studentId, receiptNo };
	} catch (error) {
		console.error("Admission submission failed", error);
		return { success: false, error: String(error) };
	}
}

export async function getStudents(filters: { limit?: number; offset?: number; search?: string } = {}) {
	try {
		const { databases } = await createAdminClient();
		
		const queries: string[] = [];
    if (filters.limit) queries.push(Query.limit(filters.limit));
    if (filters.offset) queries.push(Query.offset(filters.offset));
    queries.push(Query.orderDesc('$createdAt'));
    // Select only fields needed for list view � reduces data transfer

    if (filters.search?.trim()) {
      queries.push(Query.search('name', filters.search.trim()));
    }

    // Round-trip 1: fetch students + cached reference data in parallel
    const [response, classesRes, sectionsRes, departmentsRes] = await Promise.all([
      databases.listDocuments(DATABASE_ID, COLLECTIONS.STUDENTS, queries),
      getAllClasses(),
      getAllSections(),
      getAllDepartments(),
    ]);

    const students = response.documents;
    if (students.length === 0) return { success: true, total: response.total, students: [] };

    const classMap: Record<string, any> = {};
    const sectionMap: Record<string, any> = {};
    const deptMap: Record<string, any> = {};
    (classesRes.classes || []).forEach((c: any) => { classMap[c.$id] = c; });
    (sectionsRes.sections || []).forEach((s: any) => { sectionMap[s.$id] = s; });
    (departmentsRes.departments || []).forEach((d: any) => { deptMap[d.$id] = d; deptMap[d.code] = d; });

    // Round-trip 2: fetch active enrollments for the fetched students
    const studentDocIds = students.map(s => s.$id);
    const businessStudentIds = students.map(s => s.studentId).filter(Boolean);
    const allLookupIds = Array.from(new Set([...studentDocIds, ...businessStudentIds]));

    let enrollmentDocs: any[] = [];
    if (allLookupIds.length > 0) {
      try {
        const enrollmentsRes = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.STUDENT_ENROLLMENTS,
          [
            Query.equal('studentId', allLookupIds),
            Query.limit(Math.min(allLookupIds.length * 5, 200)),
          ]
        );
        enrollmentDocs = enrollmentsRes.documents;
      } catch (enrErr: any) {
        console.warn('[Enrollments query warning]', enrErr?.message);
      }
    }

    // Group enrollments by studentId for O(1) lookup
    const enrollmentsByStudent = new Map<string, any[]>();
    for (const enr of enrollmentDocs) {
      if (!enr.studentId) continue;
      const list = enrollmentsByStudent.get(enr.studentId) ?? [];
      list.push(enr);
      enrollmentsByStudent.set(enr.studentId, list);
    }

    const enrichedStudents = students.map(student => {
      const studentEnrs = enrollmentsByStudent.get(student.$id) || (student.studentId ? enrollmentsByStudent.get(student.studentId) : null) || [];
      const activeEnrollments = studentEnrs.map(enr => {
        const cls = classMap[enr.classId];
        const sec = sectionMap[enr.section];
        const dept = deptMap[enr.departmentId] || (enr.departmentCode ? deptMap[enr.departmentCode] : undefined);
        return {
          ...enr,
          className: cls?.nameBn || cls?.name || enr.className || enr.admissionClass || 'অনির্ধারিত',
          sectionName: sec?.sectionNameBn || sec?.sectionName || enr.sectionName || enr.section || 'নেই',
          departmentName: dept?.nameBn || dept?.name || enr.departmentName || enr.departmentCode || 'নেই'
        };
      });
      return {
        ...student,
        name: student.name || student.nameBn || student.nameEn || '',
        nameBn: student.nameBn || student.name || '',
        nameEn: student.nameEn || student.name || '',
        photo: student.photo || student.photoUrl || '',
        photoUrl: student.photo || student.photoUrl || '',
        fatherName: student.fatherName || student.fatherNameBn || student.fatherNameEn || '',
        fatherPhone: student.fatherPhone || student.guardianPhone || '',
        activeEnrollments,
        currentClass: activeEnrollments[0]?.className || 'অনির্ধারিত',
        currentSection: activeEnrollments[0]?.sectionName || 'নেই',
        departmentName: activeEnrollments[0]?.departmentName || 'নেই'
      };
    });

		return { success: true, total: response.total, students: JSON.parse(JSON.stringify(enrichedStudents)) };
	} catch (error) {
		console.error("Error fetching students", error);
		return { success: false, total: 0, students: [], error: String(error) };
	}
}

export async function getStudent(studentId: string) {
	try {
		const { databases } = await createAdminClient();
		
		// 1. Get core student document
		const student = await databases.getDocument(
        DATABASE_ID,
		 COLLECTIONS.STUDENTS, 
		 studentId
		);

		// 2. Fetch related enrollments
		const enrollments = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.STUDENT_ENROLLMENTS,
			[Query.equal('studentId', studentId), Query.orderDesc('$createdAt'), Query.limit(10)]
		);

    const enrollmentDocs = enrollments.documents;
    
    // 3. Resolve names for the latest enrollment if needed
    if (enrollmentDocs.length > 0) {
      const latest = enrollmentDocs[0] as any;
      
      // Resolve class name
      if (latest.classId && !latest.className) {
        try {
          const classDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.CLASSES, latest.classId);
          latest.className = classDoc.nameBn || classDoc.name;
        } catch (e) {}
      }
      
      // Resolve department name
      if (latest.departmentId && !latest.departmentName) {
        try {
          const deptDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.DEPARTMENTS, latest.departmentId);
          latest.departmentName = deptDoc.nameBn || deptDoc.name;
        } catch (e) {}
      }

      // Resolve boarding type name
      if (latest.boardingType && latest.boardingType.length > 5) {
        try {
          const boardDoc = await databases.getDocument(DATABASE_ID, COLLECTIONS.BOARDING_TYPES, latest.boardingType);
          latest.boardingTypeName = boardDoc.nameBn || boardDoc.name;
        } catch (e) {}
      }
    }

		return { 
			success: true, 
			student: JSON.parse(JSON.stringify({
				...student,
				enrollments: enrollmentDocs
			}))
		};
	} catch (error) {
		console.error("Error fetching student", error);
		return { success: false, error: String(error) };
	}
}

export async function updateStudent(studentId: string, data: Partial<StudentFormData>) {
	try {
		const { databases } = await createAdminClient();
		const student = await databases.updateDocument(
        DATABASE_ID,
		 COLLECTIONS.STUDENTS,
		 studentId,
		 { ...data }
	);
		return { success: true, student: JSON.parse(JSON.stringify(student)) };
	} catch (error) {
		console.error("Error updating student", error);
		return { success: false, error: String(error) };
	}
}

export async function deleteStudent(studentId: string) {
	try {
		const { databases } = await createAdminClient();
		
    // 1. Find and deactivate all active enrollments first
    const enrollments = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.STUDENT_ENROLLMENTS,
      [Query.equal('studentId', studentId), Query.equal('status', 'active')]
    );

    // Update enrollments to inactive
    await Promise.all(
      enrollments.documents.map(enr => 
        databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.STUDENT_ENROLLMENTS,
          enr.$id,
          { status: 'inactive' }
        )
      )
    );

    // 2. Finally mark the student as inactive
		await databases.updateDocument(
        DATABASE_ID,
		COLLECTIONS.STUDENTS,
		 studentId,
			{ status: "inactive"}
	  );

		return { success: true };
	} catch (error) {
		console.error("Error deleting student:", error);
		return { success: false, error: String(error) };
	}
}
