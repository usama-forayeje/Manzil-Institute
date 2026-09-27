'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { client } from '@/lib/appwrite/client';
import { DATABASE_ID } from '@/config/appwrite';

export interface UseRealtimeTableOptions {
  tableId: string;
  databaseId?: string;
  queryKey: QueryKey;
  enabled?: boolean;
  onEvent?: (payload: any) => void;
}

/**
 * Standard Appwrite Realtime hook integrated with TanStack Query.
 * Follows docs/appwrite.md §3.7 pattern.
 *
 * Automatically subscribes to table / collection events over persistent WebSocket
 * and invalidates relevant TanStack Query keys with zero layout shift.
 * Replaces any setInterval polling.
 */
export function useRealtimeTable({
  tableId,
  databaseId = DATABASE_ID,
  queryKey,
  enabled = true,
  onEvent,
}: UseRealtimeTableOptions) {
  const queryClient = useQueryClient();
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled || !tableId || !databaseId || typeof window === 'undefined') {
      return;
    }

    // Appwrite channel pattern for table/collection documents
    const channel = `databases.${databaseId}.collections.${tableId}.documents`;
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = client.subscribe(channel, (response) => {
        // Trigger optional custom callback
        if (onEventRef.current) {
          onEventRef.current(response);
        }

        // Standard pattern (§3.7): Invalidate cache so React Query re-fetches in background
        queryClient.invalidateQueries({ queryKey, exact: false });
      });
    } catch (err) {
      console.error(`[Appwrite Realtime] Failed to subscribe to ${channel}:`, err);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (err) {
          console.error(`[Appwrite Realtime] Failed to unsubscribe from ${channel}:`, err);
        }
      }
    };
  }, [databaseId, tableId, queryClient, JSON.stringify(queryKey), enabled]);
}

/**
 * Hook to subscribe to a single row/document in real-time.
 */
export function useRealtimeRow({
  tableId,
  rowId,
  databaseId = DATABASE_ID,
  queryKey,
  enabled = true,
}: {
  tableId: string;
  rowId: string;
  databaseId?: string;
  queryKey: QueryKey;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !tableId || !rowId || !databaseId || typeof window === 'undefined') {
      return;
    }

    const channel = `databases.${databaseId}.collections.${tableId}.documents.${rowId}`;
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = client.subscribe(channel, () => {
        queryClient.invalidateQueries({ queryKey, exact: false });
      });
    } catch (err) {
      console.error(`[Appwrite Realtime] Failed to subscribe to row ${channel}:`, err);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch (err) {
          console.error(`[Appwrite Realtime] Failed to unsubscribe from row:`, err);
        }
      }
    };
  }, [databaseId, tableId, rowId, queryClient, JSON.stringify(queryKey), enabled]);
}
