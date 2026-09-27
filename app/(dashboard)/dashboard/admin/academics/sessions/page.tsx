import { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { sessionsQueryOptions } from '@/features/academic/api/queries';
import SessionsClient from './sessions-client';

export const metadata: Metadata = {
  title: 'সেশন ব্যবস্থাপনা | Manzil International Institute',
  description: 'Manage academic sessions and academic calendar',
};

export default async function SessionsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(sessionsQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionsClient />
    </HydrationBoundary>
  );
}
