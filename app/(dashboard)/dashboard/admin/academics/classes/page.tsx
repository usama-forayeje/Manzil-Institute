import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { classesQueryOptions, departmentsQueryOptions } from '@/features/academic/api/queries';
import ClassesClient from './classes-client';

export const metadata: Metadata = {
  title: 'ক্লাস ব্যবস্থাপনা | Manzil International Institute',
  description: 'Manage academic classes and grades',
};

export default async function ClassesPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(classesQueryOptions),
    queryClient.prefetchQuery(departmentsQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClassesClient />
    </HydrationBoundary>
  );
}
