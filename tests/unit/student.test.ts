import { expect, test, vi } from 'vitest';

// Mock dependencies
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

vi.mock('@/lib/appwrite/admin', () => ({
  createAdminClient: vi.fn(),
}));

import { getStudent } from '@/lib/actions/student';
import { createAdminClient } from '@/lib/appwrite/admin';

test('getStudent fetches core data and resolves enrollment names', async () => {
  const mockDatabases = {
    getDocument: vi.fn().mockImplementation((dbId, colId, docId) => {
      if (colId === 'students') {
        return Promise.resolve({ $id: docId, name: 'John Doe', studentId: 'S-001' });
      }
      if (colId === 'classes') {
        return Promise.resolve({ $id: 'c1', nameBn: 'Class 1' });
      }
      if (colId === 'departments') {
        return Promise.resolve({ $id: 'd1', nameBn: 'Madrassa' });
      }
      return Promise.reject('Not Found');
    }),
    listDocuments: vi.fn().mockImplementation((dbId, colId, queries) => {
      if (colId === 'enrollments') {
        return Promise.resolve({
          documents: [
            { $id: 'en1', studentId: 'stu1', classId: 'c1', departmentId: 'd1' },
          ],
          total: 1
        });
      }
      return Promise.resolve({ documents: [], total: 0 });
    }),
  };

  (createAdminClient as any).mockResolvedValue({ databases: mockDatabases });

  const result = await getStudent('stu1');

  expect(result.success).toBe(true);
  expect(result.student.$id).toBe('stu1');
  
  // Verify enrollment enrichment
  const enrollment = result.student.enrollments[0];
  expect(enrollment.className).toBe('Class 1');
  expect(enrollment.departmentName).toBe('Madrassa');
});
