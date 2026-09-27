import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { departmentsQueryOptions } from '@/features/academic/api/queries';
import DepartmentsClient from './departments-client';

export const metadata: Metadata = {
  title: 'বিভাগ ব্যবস্থাপনা | Manzil International Institute',
  description: 'Manage academic departments and curriculum',
};

export default async function DepartmentsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(departmentsQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DepartmentsClient />
    </HydrationBoundary>
  );
}
