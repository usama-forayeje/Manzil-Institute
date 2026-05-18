import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import AdmissionForm from '@/features/admission/components/AdmissionForm';
import { 
  departmentsQueryOptions, 
  sessionsQueryOptions, 
  sectionsQueryOptions 
} from '@/features/admission/api/queries';

export const metadata: Metadata = {
  title: 'ছাত্র ভর্তি | Manzil International Institute',
  description: 'Student Admission Form',
};

export default async function StudentAdmissionPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(departmentsQueryOptions),
    queryClient.prefetchQuery(sessionsQueryOptions),
    queryClient.prefetchQuery(sectionsQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdmissionForm />
    </HydrationBoundary>
  );
}
