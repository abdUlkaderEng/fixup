'use client';

import { useCallback, useEffect, useState } from 'react';
import { publicAreasApi } from '@/api/public/areas';
import {
   usePublicDataStore,
   generateAreaCacheKey,
   isCacheValid,
} from '@/stores/public-data';
import { usePagination } from '@/hooks/admin';
import type { PublicArea } from '@/types/public/areas';

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
   const {
      initialPage = 1,
      perPage = 20,
      autoFetch = true,
      skipCache = false,
   } = options;

   // Local state for immediate UI updates
   const [localError, setLocalError] = useState<Error | null>(null);

   // Zustand store
   const store = usePublicDataStore();

   // Use existing pagination hook
   const pagination = usePagination(
      useCallback(
         (page: number) => {
            fetchAreas(page);
         },
         // eslint-disable-next-line react-hooks/exhaustive-deps
         [perPage]
      ),
      { initialPage, perPage }
   );

   // ============================================
   // Fetch Function
   // ============================================

   const fetchAreas = useCallback(
      async (page: number = pagination.currentPage, forceRefresh = false) => {
         // Check cache first
         const currentCacheKey = generateAreaCacheKey(page, perPage);
         const cached = store.getAreaCache(currentCacheKey);

         if (!forceRefresh && cached && isCacheValid(cached)) {
            // Use cached data
            pagination.updatePagination({
               currentPage: cached.currentPage,
               lastPage: cached.lastPage,
               total: cached.total,
               nextPageUrl:
                  cached.currentPage < cached.lastPage ? 'next' : null,
               prevPageUrl: cached.currentPage > 1 ? 'prev' : null,
            });
            return;
         }

         store.setAreasLoading(true);
         store.setAreasError(null);
         setLocalError(null);

         try {
            const response = await publicAreasApi.getAll({ page, perPage });

            // Update cache
            store.setAreaCache(currentCacheKey, {
               areas: response.data,
               currentPage: response.meta.current_page,
               lastPage: response.meta.last_page,
               total: response.meta.total,
               perPage: response.meta.per_page,
            });

            // Update pagination state
            pagination.updatePagination({
               currentPage: response.meta.current_page,
               lastPage: response.meta.last_page,
               total: response.meta.total,
               nextPageUrl: response.links.next,
               prevPageUrl: response.links.prev,
            });
         } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            store.setAreasError(error);
            setLocalError(error);
         } finally {
            store.setAreasLoading(false);
         }
      },
      [perPage, pagination, store]
   );

   // ============================================
   // Auto-fetch on mount
   // ============================================

   useEffect(() => {
      if (!autoFetch) return;
      fetchAreas(initialPage, skipCache);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [autoFetch, initialPage, skipCache, perPage]);

   // ============================================
   // Navigation handlers
   // ============================================

   const goToPage = useCallback(
      (page: number) => {
         if (
            page < 1 ||
            page > pagination.totalPages ||
            page === pagination.currentPage
         ) {
            return;
         }
         pagination.setPage(page);
         fetchAreas(page);
      },
      [pagination, fetchAreas]
   );

   const refresh = useCallback(async () => {
      await fetchAreas(pagination.currentPage, true);
   }, [fetchAreas, pagination.currentPage]);

   const refetch = useCallback(async () => {
      await fetchAreas(pagination.currentPage, true);
   }, [fetchAreas, pagination.currentPage]);

   // ============================================
   // Derived data
   // ============================================

   const currentCacheKey = generateAreaCacheKey(
      pagination.currentPage,
      perPage
   );
   const currentEntry = store.getAreaCache(currentCacheKey);
   const areas = currentEntry?.areas ?? [];

   // ============================================
   // Return
   // ============================================

   return {
      areas,
      isLoading: store.isLoadingAreas,
      error: localError ?? store.areasError,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalAreas: pagination.totalItems,
      perPage,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      goToPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      firstPage: pagination.firstPage,
      lastPage: pagination.lastPage,
      refresh,
      refetch,
   };
}

export default usePublicAreas;
