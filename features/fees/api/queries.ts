import { queryOptions } from '@tanstack/react-query';
import { getFeeTypes } from './service';
import {
  fetchFeeDashboardStats,
  fetchInvoicesWithStudents,
  fetchDueStudents,
  fetchPaymentHistory,
  fetchFeeFilterOptions,
} from '@/lib/actions/fees';
import type { FeeFilter } from '@/features/fees/types';

// ─── Query Key Factory ─────────────────────────────────────
export const feeKeys = {
  all: ['fees'] as const,
  structures: () => [...feeKeys.all, 'structures'] as const,
  filterOptions: () => [...feeKeys.all, 'filter-options'] as const,
  dashboard: (session: string, feeType?: string, dateFrom?: string, dateTo?: string) =>
    [...feeKeys.all, 'dashboard', session, feeType || 'all', dateFrom || '', dateTo || ''] as const,
  invoices: (filter: FeeFilter) => [...feeKeys.all, 'invoices', filter] as const,
  dueStudents: (filter: FeeFilter) => [...feeKeys.all, 'due-students', filter] as const,
  paymentHistory: (filter: FeeFilter) => [...feeKeys.all, 'payment-history', filter] as const,
};

// ─── Fee Types (Structure page) ─────────────────────────────
export const feeTypesQueryOptions = queryOptions({
  queryKey: feeKeys.structures(),
  queryFn: () => getFeeTypes(),
  staleTime: 5 * 60 * 1000,
});

// ─── Dashboard Stats ────────────────────────────────────────
export const feeDashboardQueryOptions = (session: string, feeType?: string, dateFrom?: string, dateTo?: string) =>
  queryOptions({
    queryKey: feeKeys.dashboard(session, feeType, dateFrom, dateTo),
    queryFn: () => fetchFeeDashboardStats(session, feeType, dateFrom, dateTo),
    staleTime: 60 * 1000, // 1 minute
  });


// ─── Invoices with Students ─────────────────────────────────
export const invoicesQueryOptions = (filter: FeeFilter) =>
  queryOptions({
    queryKey: feeKeys.invoices(filter),
    queryFn: () => fetchInvoicesWithStudents(filter),
    staleTime: 1000 * 60,
  });

// ─── Due Students ───────────────────────────────────────────
export const dueStudentsQueryOptions = (filter: FeeFilter) =>
  queryOptions({
    queryKey: feeKeys.dueStudents(filter),
    queryFn: () => fetchDueStudents(filter),
    staleTime: 1000 * 60,
  });

// ─── Payment History ────────────────────────────────────────
export const paymentHistoryQueryOptions = (filter: FeeFilter) =>
  queryOptions({
    queryKey: feeKeys.paymentHistory(filter),
    queryFn: () => fetchPaymentHistory(filter),
    staleTime: 1000 * 60,
  });

// ─── Dynamic Filter Options ─────────────────────────────────
export const feeFilterOptionsQueryOptions = () =>
  queryOptions({
    queryKey: feeKeys.filterOptions(),
    queryFn: () => {
      return fetchFeeFilterOptions();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

