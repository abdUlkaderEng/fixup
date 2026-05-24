'use client';

import { useCallback } from 'react';
import { publicServicesApi } from '@/api/public/services';
import type { Service } from '@/types/admin/services';
import { usePaginatedPublicResource } from './shared';

// ============================================
// Types
// ============================================

export interface UsePublicServicesOptions {
   /** Initial page number (default: 1) */
   initialPage?: number;
   /** Items per page (default: 10) */
   perPage?: number;
   /** Filter by career ID */
   careerId?: number;
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
   /** Skip cache and force refresh (default: false) */
   skipCache?: boolean;
}

export interface UsePublicServicesReturn {
   /** List of services */
   services: Service[];
   /** Loading state */
   isLoading: boolean;
   /** Error state */
   error: Error | null;
   /** Current page number */
   currentPage: number;
   /** Total number of pages */
   totalPages: number;
   /** Total number of services */
   totalServices: number;
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

interface ServiceFilters extends Record<string, string | number | undefined> {
   career_id: number | undefined;
}

export function usePublicServices(
   options: UsePublicServicesOptions = {}
): UsePublicServicesReturn {
   const { careerId, ...rest } = options;

   const fetcher = useCallback(
      (params: ServiceFilters & { page: number; perPage: number }) =>
         publicServicesApi.getAll({
            career_id: params.career_id,
            page: params.page,
            perPage: params.perPage,
         }),
      []
   );

   const result = usePaginatedPublicResource<'services', ServiceFilters>(
      { resource: 'services', fetcher },
      { ...rest, filters: { career_id: careerId } }
   );

   return {
      services: result.rows,
      isLoading: result.isLoading,
      error: result.error,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalServices: result.totalItems,
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
