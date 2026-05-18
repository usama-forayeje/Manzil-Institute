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

export async function getClasses() {
	try {
		const { databases } = await createAdminClient();
		const response = await databases.listDocuments(
        DATABASE_ID,
		 COLLECTIONS.CLASSES,
        [Query.equal("isActive",true), Query.orderAsc("level"), Query.limit(100)]
		);
		return { success: true, classes: JSON.parse(JSON.stringify(response.documents)) };
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

export async function getStudents(filters: { limit?: number; cursorAfter?: string } = {}) {
	try {
		const { databases } = await createAdminClient();
		
		const queries = [];
		queries.push(Query.limit(filters.limit || 100));
		if (filters.cursorAfter) {
			queries.push(Query.cursorAfter(filters.cursorAfter));
		}
		
		const response = await databases.listDocuments(
        DATABASE_ID,
		 COLLECTIONS.STUDENTS,
		 queries
		);
		return { success: true, total: response.total, students: JSON.parse(JSON.stringify(response.documents)) };
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
		await databases.updateDocument(
        DATABASE_ID,
		COLLECTIONS.STUDENTS,
		 studentId,
			{ status: "inactive"}
	);
		return { success: true };
	} catch (error) {
		console.error("Error deleting student", error);
		return { success: false, error: String(error) };
	}
}
