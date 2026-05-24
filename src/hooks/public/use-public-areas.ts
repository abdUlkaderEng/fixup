'use client';

import { useCallback } from 'react';
import { publicAreasApi } from '@/api/public/areas';
import type { PublicArea } from '@/types/public/areas';
import { usePaginatedPublicResource } from './shared';

// ============================================
// Types
// ============================================

export interface UsePublicAreasOptions {
   /** Initial page number (default: 1) */
   initialPage?: number;
   /** Items per page (default: 20) */
   perPage?: number;
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
   /** Skip cache and force refresh (default: false) */
   skipCache?: boolean;
}

export interface UsePublicAreasReturn {
   /** List of areas */
   areas: PublicArea[];
   /** Loading state */
   isLoading: boolean;
   /** Error state */
   error: Error | null;
   /** Current page number */
   currentPage: number;
   /** Total number of pages */
   totalPages: number;
   /** Total number of areas */
   totalAreas: number;
   /** Items per page */
   perPage: number;
   /** Whether there is a next page */
   hasNextPage: boolean;
   /** Whether there is a previous page */
   hasPrevPage: boolean;
   /** Navigate to specific page */
   goToPage: (page: number) => void;
   /** Go to next page */
   nextPage: () => void;
   /** Go to previous page */
   prevPage: () => void;
   /** Go to first page */
   firstPage: () => void;
   /** Go to last page */
   lastPage: () => void;
   /** Refresh data (bypasses cache) */
   refresh: () => Promise<void>;
   /** Refetch current page */
   refetch: () => Promise<void>;
}

// ============================================
// Hook
// ============================================

export function usePublicAreas(
   options: UsePublicAreasOptions = {}
): UsePublicAreasReturn {
   const { perPage = 20, ...rest } = options;

   const fetcher = useCallback(
      (params: { page: number; perPage: number }) =>
         publicAreasApi.getAll({ page: params.page, perPage: params.perPage }),
      []
   );

   const result = usePaginatedPublicResource(
      { resource: 'areas', fetcher },
      { ...rest, perPage }
   );

   return {
      areas: result.rows,
      isLoading: result.isLoading,
      error: result.error,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalAreas: result.totalItems,
      perPage: result.perPage,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      goToPage: result.goToPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
      firstPage: result.firstPage,
      lastPage: result.lastPage,
      refresh: result.refresh,
      refetch: result.refetch,
   };
}
