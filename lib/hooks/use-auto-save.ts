"use client";

import { useEffect, useRef } from 'react';

/**
 * useAutoSave - Debounced auto-save hook for form data
 * 
 * @param form - react-hook-form form instance
 * @param onSave - Callback when data should be saved
 * @param delay - Debounce delay in ms (default 800)
 * @param enabled - Whether auto-save is enabled (default true)
 * @param watchFields - Specific fields to watch (default all)
 * 
 * @returns Cleanup function
 * 
 * @example
 * const cleanup = useAutoSave(form, (data) => {
 *   saveToStore(data);
 * }, 800);
 */
export function useAutoSave<T extends Record<string, any>>(
  form: any, // UseFormReturn<T>
  onSave: (data: T) => void,
  delay: number = 800,
  enabled: boolean = true,
  watchFields?: string[]
): () => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!enabled) {
      return () => {};
    }

    const watchOptions = watchFields ? { name: watchFields } : undefined;

    const subscription = form.watch?.(watchOptions || undefined, (value: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onSave(value);
      }, delay);
    });

    if (subscription) {
      subscriptionRef.current = subscription;
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [form, onSave, delay, enabled, watchFields]);

  // Return cleanup function for manual usage if needed
  return () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}
