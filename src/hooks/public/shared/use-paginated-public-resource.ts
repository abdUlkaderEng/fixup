'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePagination } from '@/hooks/admin';
import {
   generatePublicCacheKey,
   isCacheValid,
   usePublicDataStore,
   type PaginatedResource,
   type PaginatedRowMap,
} from '@/stores/public-data';
import type { PaginationLinks, PaginationMeta } from '@/types/admin/shared';

export interface UsePaginatedPublicResourceOptions<
   TFilters extends Record<string, string | number | undefined | null>,
> {
   /** Initial page number (default: 1) */
   initialPage?: number;
   /** Items per page (default: 10) */
   perPage?: number;
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
   /** Skip cache and force refresh (default: false) */
   skipCache?: boolean;
   /** Extra filters that are part of the cache key (e.g., { career_id }) */
   filters?: TFilters;
}

export interface UsePaginatedPublicResourceReturn<TRow> {
   /** Rows for the current page */
   rows: TRow[];
   /** Loading state */
   isLoading: boolean;
   /** Error state (local takes precedence over store) */
   error: Error | null;
   /** Current page number */
   currentPage: number;
   /** Total number of pages */
   totalPages: number;
   /** Total number of rows across all pages */
   totalItems: number;
   /** Items per page */
   perPage: number;
   /** Whether there is a next page */
   hasNextPage: boolean;
   /** Whether there is a previous page */
   hasPrevPage: boolean;
   /** Navigate to a specific page */
   goToPage: (page: number) => void;
   /** Go to next page */
   nextPage: () => void;
   /** Go to previous page */
   prevPage: () => void;
   /** Go to first page */
   firstPage: () => void;
   /** Go to last page */
   lastPage: () => void;
   /** Refresh current page, bypassing cache */
   refresh: () => Promise<void>;
   /** Alias for refresh */
   refetch: () => Promise<void>;
}

interface FetcherResponse<TRow> {
   data: TRow[];
   links: PaginationLinks;
   meta: PaginationMeta;
}

interface UsePaginatedPublicResourceConfig<
   R extends PaginatedResource,
   TFilters extends Record<string, string | number | undefined | null>,
> {
   resource: R;
   fetcher: (
      params: TFilters & { page: number; perPage: number }
   ) => Promise<FetcherResponse<PaginatedRowMap[R]>>;
}

/**
 * Generic hook for paginated public resources.
 *
 * Wraps `usePagination` for navigation and `usePublicDataStore` for
 * cross-component caching. Each (filters, page, perPage) combination has its
 * own cache entry, so flipping back to a previously-loaded page is instant.
 */
export function usePaginatedPublicResource<
   R extends PaginatedResource,
   TFilters extends Record<string, string | number | undefined | null> = Record<
      string,
      never
   >,
>(
   { resource, fetcher }: UsePaginatedPublicResourceConfig<R, TFilters>,
   options: UsePaginatedPublicResourceOptions<TFilters> = {}
): UsePaginatedPublicResourceReturn<PaginatedRowMap[R]> {
   const {
      initialPage = 1,
      perPage = 10,
      autoFetch = true,
      skipCache = false,
      filters = {} as TFilters,
   } = options;

   const [localError, setLocalError] = useState<Error | null>(null);
   const store = usePublicDataStore();

   const buildCacheKey = useCallback(
      (page: number) => generatePublicCacheKey({ ...filters, page, perPage }),
      [filters, perPage]
   );

   const pagination = usePagination(
      useCallback(
         (page: number) => {
            fetchPage(page);
         },
         // eslint-disable-next-line react-hooks/exhaustive-deps
         [perPage, JSON.stringify(filters)]
      ),
      { initialPage, perPage }
   );

   const fetchPage = useCallback(
      async (page: number = pagination.currentPage, forceRefresh = false) => {
         const cacheKey = buildCacheKey(page);
         const cached = store.getPaginatedEntry(resource, cacheKey);

         if (!forceRefresh && cached && isCacheValid(cached)) {
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

         store.setLoading(resource, true);
         store.setError(resource, null);
         setLocalError(null);

         try {
            const response = await fetcher({
               ...filters,
               page,
               perPage,
            } as TFilters & { page: number; perPage: number });

            store.setPaginatedEntry(resource, cacheKey, {
               rows: response.data,
               currentPage: response.meta.current_page,
               lastPage: response.meta.last_page,
               total: response.meta.total,
               perPage: response.meta.per_page,
            });

            pagination.updatePagination({
               currentPage: response.meta.current_page,
               lastPage: response.meta.last_page,
               total: response.meta.total,
               nextPageUrl: response.links.next,
               prevPageUrl: response.links.prev,
            });
         } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            store.setError(resource, error);
            setLocalError(error);
         } finally {
            store.setLoading(resource, false);
         }
      },
      [resource, fetcher, buildCacheKey, filters, perPage, pagination, store]
   );

   useEffect(() => {
      if (!autoFetch) return;
      fetchPage(initialPage, skipCache);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [autoFetch, initialPage, skipCache, perPage, JSON.stringify(filters)]);

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
         fetchPage(page);
      },
      [pagination, fetchPage]
   );

   const refresh = useCallback(
      () => fetchPage(pagination.currentPage, true),
      [fetchPage, pagination.currentPage]
   );

   const currentEntry = store.getPaginatedEntry(
      resource,
      buildCacheKey(pagination.currentPage)
   );
   const rows = currentEntry?.rows ?? [];

   return {
      rows,
      isLoading: store.loading[resource],
      error: localError ?? store.errors[resource],
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      perPage,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      goToPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      firstPage: pagination.firstPage,
      lastPage: pagination.lastPage,
      refresh,
      refetch: refresh,
   };
}
