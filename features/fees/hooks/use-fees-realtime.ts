'use client';

import { useRealtimeTable } from '@/lib/appwrite/realtime';
import { COLLECTIONS } from '@/config/appwrite';
import { feeKeys } from '@/features/fees/api/queries';

export function useFeesRealtime(enabled = true) {
  // Listen to fee invoice changes
  useRealtimeTable({
    tableId: COLLECTIONS.FEE_INVOICES,
    queryKey: feeKeys.all,
    enabled,
  });

  // Listen to fee payment changes
  useRealtimeTable({
    tableId: COLLECTIONS.FEE_PAYMENTS,
    queryKey: feeKeys.all,
    enabled,
  });
}
