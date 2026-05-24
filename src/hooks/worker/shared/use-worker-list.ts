'use client';

import { useCallback } from 'react';
import {
   generateRequestKey,
   useFetch,
   type UseFetchReturn,
} from '@/hooks/admin/shared';

export interface UseWorkerListOptions {
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
}

export interface UseWorkerListReturn<T> extends Pick<
   UseFetchReturn<T[]>,
   'isLoading' | 'error' | 'refetch' | 'setData'
> {
   items: T[];
}

interface UseWorkerListConfig<T> {
   /** Stable cache key for request deduplication. */
   cacheKey: string;
   /** Stable fetcher — the caller should `useCallback` it. */
   fetcher: () => Promise<T[]>;
   /** Toast message shown when the fetch fails. */
   errorMessage: string;
}

/**
 * Generic list-fetch hook for worker resources. Wraps `useFetch` with the
 * default options the worker domain wants and exposes the standard
 * `{ items, isLoading, error, refetch, setData }` shape that composers extend.
 */
export function useWorkerList<T>(
   { cacheKey, fetcher, errorMessage }: UseWorkerListConfig<T>,
   options: UseWorkerListOptions = {}
): UseWorkerListReturn<T> {
   const { autoFetch = true } = options;

   const { data, isLoading, error, refetch, setData } = useFetch<T[]>(
      fetcher,
      generateRequestKey(cacheKey),
      { autoFetch, errorMessage }
   );

   const items = data ?? [];

   // Re-bind setData with the same shape so composers don't need to import
   // useFetch types directly.
   const setItems = useCallback(setData, [setData]);

   return {
      items,
      isLoading,
      error,
      refetch,
      setData: setItems,
   };
}
