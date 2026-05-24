'use client';

import { useCallback, useEffect, useState } from 'react';
import {
   isCacheValid,
   usePublicDataStore,
   type SingleResource,
   type SingleRowMap,
} from '@/stores/public-data';

export interface UsePublicResourceOptions {
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
   /** Skip cache and force refresh (default: false) */
   skipCache?: boolean;
}

export interface UsePublicResourceReturn<TRow> {
   /** Cached rows for this resource */
   rows: TRow[];
   /** Loading state */
   isLoading: boolean;
   /** Error state (local takes precedence over store) */
   error: Error | null;
   /** Refresh data, bypassing cache */
   refresh: () => Promise<void>;
   /** Alias for refresh */
   refetch: () => Promise<void>;
}

interface FetchOptions<TRow> {
   resource: SingleResource;
   fetcher: () => Promise<{ data: TRow[] }>;
}

/**
 * Generic hook for non-paginated public resources.
 *
 * Reads/writes through `usePublicDataStore` so the cache is shared across all
 * components. The first mount that misses the cache fires the request; later
 * mounts within the TTL get an instant render from the store.
 */
export function usePublicResource<R extends SingleResource>(
   { resource, fetcher }: FetchOptions<SingleRowMap[R]>,
   options: UsePublicResourceOptions = {}
): UsePublicResourceReturn<SingleRowMap[R]> {
   const { autoFetch = true, skipCache = false } = options;

   const [localError, setLocalError] = useState<Error | null>(null);
   const store = usePublicDataStore();

   const cached = store.getSingleEntry(resource);
   const rows = cached?.rows ?? [];

   const fetchData = useCallback(
      async (forceRefresh = false) => {
         const entry = store.getSingleEntry(resource);
         if (!forceRefresh && isCacheValid(entry)) return;

         store.setLoading(resource, true);
         store.setError(resource, null);
         setLocalError(null);

         try {
            const response = await fetcher();
            store.setSingleEntry(resource, { rows: response.data });
         } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            store.setError(resource, error);
            setLocalError(error);
         } finally {
            store.setLoading(resource, false);
         }
      },
      [resource, fetcher, store]
   );

   useEffect(() => {
      if (!autoFetch) return;
      fetchData(skipCache);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [autoFetch, skipCache]);

   const refresh = useCallback(() => fetchData(true), [fetchData]);

   return {
      rows,
      isLoading: store.loading[resource],
      error: localError ?? store.errors[resource],
      refresh,
      refetch: refresh,
   };
}
