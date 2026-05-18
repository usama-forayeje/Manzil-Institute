import { Suspense } from 'react';
import StudentPromotionClient from '@/features/students/components/StudentPromotionClient';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'শিক্ষার্থী প্রমোশন (স্টুডেন্ট পাস) | Manzil Dashboard',
  description: 'Promote multiple students from one class/session to another academic session.',
};

function PromotionLoading() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
      <Skeleton className="h-96 w-full rounded-2xl mt-8" />
    </div>
  );
}

export default function StudentPromotionPage() {
  return (
    <Suspense fallback={<PromotionLoading />}>
      <StudentPromotionClient />
    </Suspense>
  );
}
