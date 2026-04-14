'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDesignations,
  getAllTerms,
  getTermsByDesignationFromDB,
  saveTerms,
  updateTerms,
  updateDesignation,
  createDesignation,
  invalidateTermsCache
} from '@/lib/actions/terms';

// Query keys for consistent caching
export const termsQueryKeys = {
  designations: ['terms', 'designations'] as const,
  allTerms: ['terms', 'all'] as const,
  termsByDesignation: (designationId: string) => ['terms', 'designation', designationId] as const,
};

// Custom hooks for terms management with React Query

export function useDesignations() {
  return useQuery({
    queryKey: termsQueryKeys.designations,
    queryFn: getDesignations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useAllTerms() {
  return useQuery({
    queryKey: termsQueryKeys.allTerms,
    queryFn: getAllTerms,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useTermsByDesignation(designationId: string) {
  const normalizedId = designationId?.trim() || '';

  return useQuery({
    queryKey: termsQueryKeys.termsByDesignation(normalizedId),
    queryFn: () => getTermsByDesignationFromDB(normalizedId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!normalizedId,
  });
}

// Mutation hooks with automatic cache invalidation

export function useSaveTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ designationId, title, sections, isActive }: {
      designationId: string;
      title: string;
      sections: any[];
      isActive?: boolean;
    }) => saveTerms(designationId, title, sections, isActive),

    onSuccess: () => {
      // Invalidate all terms-related queries
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      // Also invalidate server-side cache
      invalidateTermsCache();
    },
  });
}

export function useUpdateTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ designationId, title, sections, updatedBy }: {
      designationId: string;
      title: string;
      sections: any[];
      updatedBy: string;
    }) => updateTerms(designationId, title, sections, updatedBy),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      invalidateTermsCache();
    },
  });
}

export function useUpdateDesignation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ designationId, labelBn, labelEn }: {
      designationId: string;
      labelBn: string;
      labelEn: string;
    }) => updateDesignation(designationId, labelBn, labelEn),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      invalidateTermsCache();
    },
  });
}

export function useCreateDesignation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ labelBn, labelEn, category, hasTerms, isActive, sortOrder }: {
      labelBn: string;
      labelEn?: string;
      category: string;
      hasTerms?: boolean;
      isActive?: boolean;
      sortOrder?: number;
    }) => createDesignation(labelBn, labelEn, category, hasTerms, isActive, sortOrder),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
      invalidateTermsCache();
    },
  });
}

// Utility hook to manually invalidate cache
export function useInvalidateTermsCache() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['terms'] });
    invalidateTermsCache();
  };
}