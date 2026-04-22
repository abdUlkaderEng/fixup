'use client';

import { useCallback, useEffect, useState } from 'react';
import { publicServicesApi } from '@/api/public/services';
import {
   usePublicDataStore,
   generateServiceCacheKey,
   isCacheValid,
} from '@/stores/public-data';
import { usePagination } from '@/hooks/admin';
import type { Service } from '@/types/admin/services';

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

export function usePublicServices(
   options: UsePublicServicesOptions = {}
): UsePublicServicesReturn {
   const {
      initialPage = 1,
      perPage = 10,
      careerId,
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
            fetchServices(page);
         },
         // eslint-disable-next-line react-hooks/exhaustive-deps
         [careerId, perPage]
      ),
      { initialPage, perPage }
   );

   // ============================================
   // Fetch Function
   // ============================================

   const fetchServices = useCallback(
      async (page: number = pagination.currentPage, forceRefresh = false) => {
         // Check cache first
         const currentCacheKey = generateServiceCacheKey(
            careerId,
            page,
            perPage
         );
         const cached = store.getServiceCache(currentCacheKey);

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

         store.setServicesLoading(true);
         store.setServicesError(null);
         setLocalError(null);

         try {
            const response = await publicServicesApi.getAll({
               career_id: careerId,
               page,
               perPage,
            });

            // Update cache
            store.setServiceCache(currentCacheKey, {
               services: response.data,
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
            store.setServicesError(error);
            setLocalError(error);
         } finally {
            store.setServicesLoading(false);
         }
      },
      [careerId, perPage, pagination, store]
   );

   // ============================================
   // Auto-fetch on mount
   // ============================================

   useEffect(() => {
      if (!autoFetch) return;
      fetchServices(initialPage, skipCache);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [autoFetch, initialPage, skipCache, careerId, perPage]);

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
         fetchServices(page);
      },
      [pagination, fetchServices]
   );

   const refresh = useCallback(async () => {
      await fetchServices(pagination.currentPage, true);
   }, [fetchServices, pagination.currentPage]);

   const refetch = useCallback(async () => {
      await fetchServices(pagination.currentPage, true);
   }, [fetchServices, pagination.currentPage]);

   // ============================================
   // Derived data
   // ============================================

   const currentCacheKey = generateServiceCacheKey(
      careerId,
      pagination.currentPage,
      perPage
   );
   const currentEntry = store.getServiceCache(currentCacheKey);
   const services = currentEntry?.services ?? [];

   // ============================================
   // Return
   // ============================================

   return {
      services,
      isLoading: store.isLoadingServices,
      error: localError ?? store.servicesError,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalServices: pagination.totalItems,
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

export default usePublicServices;
