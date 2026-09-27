'use client';

import { useRealtimeTable } from '@/lib/appwrite/realtime';
import { COLLECTIONS } from '@/config/appwrite';
import { studentKeys } from '@/features/students/api/queries';

export function useStudentsRealtime(enabled = true) {
  useRealtimeTable({
    tableId: COLLECTIONS.STUDENTS,
    queryKey: studentKeys.all,
    enabled,
  });
}
