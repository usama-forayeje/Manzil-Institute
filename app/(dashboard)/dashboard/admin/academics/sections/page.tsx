import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { sectionsQueryOptions } from '@/features/academic/api/queries';
import SectionsClient from './sections-client';

export const metadata: Metadata = {
  title: 'শাখা ব্যবস্থাপনা | Manzil International Institute',
  description: 'Manage academic sections and student capacity',
};

export default async function SectionsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(sectionsQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SectionsClient />
    </HydrationBoundary>
  );
}
