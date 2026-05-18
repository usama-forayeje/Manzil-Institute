'use client';

import React, { Suspense } from 'react';
import FeeStructureManager from '@/features/fees/components/FeeStructureManager';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeeStructurePage() {
  return (
    <Suspense fallback={<FeeStructureSkeleton />}>
      <FeeStructureManager />
    </Suspense>
  );
}

function FeeStructureSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] animate-pulse" />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
