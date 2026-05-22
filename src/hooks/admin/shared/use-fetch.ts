'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// ============================================
// Types
// ============================================

export interface UseFetchOptions<T> {
   autoFetch?: boolean;
   enabled?: boolean;
   onError?: (error: Error) => void;
   onSuccess?: (data: T) => void;
   errorMessage?: string;
   skipAuthCheck?: boolean;
}

export interface UseFetchReturn<T> {
   data: T | null;
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   setData: (data: T | null | ((prev: T | null) => T | null)) => void;
}

// ============================================
// Request Deduplication & Cache
// ============================================

const pendingRequests = new Set<string>();
const dataCache = new Map<string, unknown>();

export function generateRequestKey(
   ...params: (string | number | undefined)[]
): string {
   return params.filter(Boolean).join('-');
}

export function isRequestPending(key: string): boolean {
   return pendingRequests.has(key);
}

export function markRequestPending(key: string): void {
   pendingRequests.add(key);
}

export function markRequestComplete(key: string): void {
   pendingRequests.delete(key);
}

export function getCachedData<T>(key: string): T | null {
   return (dataCache.get(key) as T | undefined) ?? null;
}

export function setCachedData<T>(key: string, value: T | null): void {
   if (value === null) {
      dataCache.delete(key);
   } else {
      dataCache.set(key, value);
   }
}

export function clearCachedData(key: string): void {
   dataCache.delete(key);
}

// ============================================
// Generic Fetch Hook
// ============================================

export function useFetch<T>(
   fetcher: () => Promise<T>,
   requestKey: string,
   options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
   const {
      autoFetch = true,
      enabled = true,
      onError,
      onSuccess,
      errorMessage = 'حدث خطأ أثناء جلب البيانات',
      skipAuthCheck = false,
   } = options;

   const { status: sessionStatus } = useSession();
   const isFetchingRef = useRef(false);
   const mountedRef = useRef(true);
   const attemptedFetchRef = useRef(false);
   // Read sessionStatus through a ref so executeFetch stays stable across session changes
   const sessionStatusRef = useRef(sessionStatus);
   useEffect(() => {
      sessionStatusRef.current = sessionStatus;
   }, [sessionStatus]);

   const [data, setDataState] = useState<T | null>(() =>
      getCachedData<T>(requestKey)
   );
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const setData = useCallback(
      (value: T | null | ((prev: T | null) => T | null)) => {
         if (typeof value === 'function') {
            setDataState((prev) => {
               const next = (value as (prev: T | null) => T | null)(prev);
               setCachedData(requestKey, next);
               return next;
            });
         } else {
            setCachedData(requestKey, value);
            setDataState(value);
         }
      },
      [requestKey]
   );

   const config = useMemo(
      () => ({ autoFetch, enabled, skipAuthCheck }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const executeFetch = useCallback(async () => {
      if (isFetchingRef.current || isRequestPending(requestKey)) {
         return;
      }

      if (!skipAuthCheck && sessionStatusRef.current !== 'authenticated') {
         return;
      }

      isFetchingRef.current = true;
      markRequestPending(requestKey);
      setIsLoading(true);
      setError(null);

      try {
         const result = await fetcher();
         if (mountedRef.current) {
            setData(result);
            onSuccess?.(result);
         }
      } catch (err) {
         const fetchError = err instanceof Error ? err : new Error(String(err));
         if (mountedRef.current) {
            setError(fetchError);
            onError?.(fetchError);
            toast.error(errorMessage, {
               description: fetchError.message,
            });
         }
      } finally {
         markRequestComplete(requestKey);
         if (mountedRef.current) {
            setIsLoading(false);
         }
         isFetchingRef.current = false;
      }
      // sessionStatus intentionally omitted — read via sessionStatusRef to keep this stable
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fetcher, requestKey, skipAuthCheck, errorMessage, onError, onSuccess]);

   const refetch = useCallback(() => {
      attemptedFetchRef.current = false;
      // Clear any stale pending lock so this refetch always goes through
      markRequestComplete(requestKey);
      executeFetch();
   }, [executeFetch, requestKey]);

   // Track mounted state
   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
      };
   }, []);

   // Auto-fetch
   useEffect(() => {
      if (!config.autoFetch || !config.enabled) return;
      if (!skipAuthCheck && sessionStatus !== 'authenticated') return;
      if (attemptedFetchRef.current) return;

      attemptedFetchRef.current = true;
      executeFetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [sessionStatus, config.autoFetch, config.enabled, skipAuthCheck]);

   return {
      data,
      isLoading,
      error,
      refetch,
      setData,
   };
}

export default useFetch;
