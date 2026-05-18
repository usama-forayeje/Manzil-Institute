import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import StudentDocumentsClient from '@/features/students/components/StudentDocumentsClient';

export const metadata = {
  title: 'শিক্ষার্থীর ডকুমেন্টস | Manzil Dashboard',
  description: 'View and manage student documents — photos, NID copies, birth certificates and transfer certificates.',
};

function DocumentsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-100 bg-white p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <Skeleton key={j} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDocumentsPage() {
  return (
    <Suspense fallback={<DocumentsLoading />}>
      <StudentDocumentsClient />
    </Suspense>
  );
}
