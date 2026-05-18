import { render } from 'vitest-browser-react';
import { expect, test, vi } from 'vitest';
import FeeDashboardPage from '../../app/(dashboard)/dashboard/admin/fees/page';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

import { useQuery } from '@tanstack/react-query';

test('FeeDashboard renders correctly and shows stats', async () => {
  // 1. Mock the API responses
  (useQuery as any).mockReturnValue({
    data: {
      stats: {
        totalCollectedThisMonth: 50000,
        totalDueAmount: 12000,
        totalStudents: 100,
        totalStudentsPaid: 85,
        totalUnpaidInvoices: 15,
        totalInvoicesThisMonth: 100,
        revenueByMethod: { cash: 50000, bkash: 0, nagad: 0, bank: 0 },
        collectionRate: 80,
      },
      options: {
        sessions: ['2026-2027'],
        feeTypes: [{ $id: 'admission', name: 'admission', nameBn: 'ভর্তি ফি', code: 'ADMISSION_FEE' }],
      },
      recentPayments: [],
      monthlyTrend: [],
      classDueSummary: [],
    },
    isLoading: false,
  });

  const screen = await render(<FeeDashboardPage />);

  // 2. Check for Bengali numbers and text
  await expect.element(screen.getByText(/৳৫০,০০০/)).toBeVisible();
  await expect.element(screen.getByText(/৳১২,০০০/)).toBeVisible();
  await expect.element(screen.getByText(/৮০%/)).toBeVisible();

  // 3. Verify labels exist
  await expect.element(screen.getByText(/মাসিক সংগ্রহ/i)).toBeVisible();
  await expect.element(screen.getByText(/মোট বকেয়া/i)).toBeVisible();
});
