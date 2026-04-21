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
// Request Deduplication
// ============================================

const pendingRequests = new Set<string>();

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

   const [data, setDataState] = useState<T | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const setData = useCallback(
      (value: T | null | ((prev: T | null) => T | null)) => {
         if (typeof value === 'function') {
            setDataState((prev) =>
               (value as (prev: T | null) => T | null)(prev)
            );
         } else {
            setDataState(value);
         }
      },
      [setDataState]
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

      if (!skipAuthCheck && sessionStatus !== 'authenticated') {
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
   }, [
      fetcher,
      requestKey,
      sessionStatus,
      skipAuthCheck,
      errorMessage,
      onError,
      onSuccess,
   ]);

   const refetch = useCallback(() => {
      attemptedFetchRef.current = false;
      executeFetch();
   }, [executeFetch]);

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
