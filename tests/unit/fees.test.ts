import { expect, test, vi } from 'vitest';

// Fix: Import dependencies after environment overrides
vi.mock('@/config/appwrite', () => ({
  DATABASE_ID: 'test_db',
  COLLECTIONS: {
    FEE_INVOICES: 'fee_invoices',
    FEE_PAYMENTS: 'fee_payments',
    STUDENTS: 'students',
  },
}));

vi.mock('@/lib/appwrite/admin', () => ({
  createAdminClient: vi.fn(),
}));

import { fetchFeeDashboardStats } from '@/lib/actions/fees';
import { createAdminClient } from '@/lib/appwrite/admin';

test('fetchFeeDashboardStats aggregates data correctly', async () => {
  const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' });
  const today = new Date().toISOString().split('T')[0];

  const mockDatabases = {
    listDocuments: vi.fn().mockImplementation((dbId, colId, queries) => {
      // Logic mirrors simple aggregation
      if (colId === 'fee_invoices') {
        return Promise.resolve({
          documents: [
            { 
              $id: 'inv1', 
              invoiceType: 'admission_fee', 
              dueAmount: 500, 
              session: '2026-2027', 
              studentId: 'stu1', 
              month: currentMonthName, 
              $createdAt: new Date().toISOString() 
            },
          ],
        });
      }
      if (colId === 'fee_payments') {
        return Promise.resolve({
          documents: [
            { 
              $id: 'pay1', 
              amountPaid: 1000, 
              paymentMethod: 'cash', 
              paymentDate: today, 
              invoiceId: 'inv1', 
              studentId: 'stu1', 
              $createdAt: new Date().toISOString() 
            },
          ],
        });
      }
      if (colId === 'students') {
        return Promise.resolve({ documents: [{ $id: 'stu1', name: 'Test Student', class: 'Class 1' }] });
      }
      return Promise.resolve({ documents: [] });
    }),
  };

  (createAdminClient as any).mockResolvedValue({ databases: mockDatabases });

  const result = await fetchFeeDashboardStats('2026-2027', 'admission_fee');

  expect(result.success).toBe(true);
  // Based on currentMonth matching:
  expect(result.stats?.totalCollectedThisMonth).toBe(1000);
  expect(result.stats?.totalDueAmount).toBe(500);
});
