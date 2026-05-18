import { expect, test, vi } from 'vitest';

vi.mock('@/lib/appwrite/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('@/config/appwrite', () => ({
  DATABASE_ID: 'test_db',
  COLLECTIONS: {
    STUDENTS: 'students',
    STUDENT_ENROLLMENTS: 'enrollments',
    CLASSES: 'classes',
    DEPARTMENTS: 'departments',
    BOARDING_TYPES: 'boarding_types',
  },
}));

import { getStudentsInfinite } from '@/features/students/api/service';
import { createAdminClient } from '@/lib/appwrite/admin';

test('getStudentsInfinite batches metadata resolution correctly', async () => {
  const mockDatabases = {
    listDocuments: vi.fn().mockImplementation((dbId, colId, queries) => {
      // console.log(`Listing ${colId} with queries:`, queries);
      if (colId === 'students') {
        return Promise.resolve({
          documents: [
            { $id: 'stu1', nameBn: 'Student 1', boardingType: 'b1' },
          ],
          total: 1
        });
      }
      if (colId === 'enrollments') {
        return Promise.resolve({
          documents: [
            { 
                $id: 'en1', 
                studentId: 'stu1', 
                classId: 'c1', 
                departmentId: 'd1', 
                session: '2025', 
                status: 'active',
                boardingType: 'b1', // Enr also has boardingType
                $createdAt: new Date().toISOString() 
            },
          ],
          total: 1
        });
      }
      if (colId === 'classes') {
        return Promise.resolve({ documents: [{ $id: 'c1', nameBn: 'Class 1' }] });
      }
      if (colId === 'departments') {
        return Promise.resolve({ documents: [{ $id: 'd1', nameBn: 'Department 1' }] });
      }
      if (colId === 'boarding_types') {
        return Promise.resolve({ documents: [{ $id: 'b1', nameBn: 'Residential' }] });
      }
      return Promise.resolve({ documents: [], total: 0 });
    }),
  };

  (createAdminClient as any).mockResolvedValue({ databases: mockDatabases });

  const result = await getStudentsInfinite({});

  expect(result.success).toBe(true);
  const student = result.data?.documents[0];
  
  // Verify metadata resolution
  expect(student.className).toBe('Class 1');
  expect(student.departmentName).toBe('Department 1');
  
  // boardingType mapping check
  // console.log('Mapped boardingType:', student.boardingType);
  expect(student.boardingType).toBe('Residential');
  
  expect(student.activeEnrollments).toHaveLength(1);
  expect(student.activeEnrollments[0].boardingType).toBe('Residential');
});
