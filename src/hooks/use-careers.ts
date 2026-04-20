'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import type { CareerWithTimestamp } from '@/types/service';

const pendingRequests = new Set<string>();

interface UseCareersReturn {
   careers: CareerWithTimestamp[];
   isLoading: boolean;
   error: string | null;
   refetch: () => void;
}

interface UseCareersOptions {
   autoFetch?: boolean;
}

const DEFAULT_OPTIONS: UseCareersOptions = {
   autoFetch: true,
};

export function useCareers(options: UseCareersOptions = {}): UseCareersReturn {
   const config = useMemo(
      () => ({ ...DEFAULT_OPTIONS, ...options }) as Required<UseCareersOptions>,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const { status: sessionStatus } = useSession();
   const isFetchingRef = useRef(false);
   const mountedRef = useRef(true);
   const attemptedFetchRef = useRef(false);

   const [careers, setCareers] = useState<CareerWithTimestamp[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchCareers = useCallback(async () => {
      const requestKey = 'careers-list';

      if (isFetchingRef.current || pendingRequests.has(requestKey)) {
         return;
      }

      isFetchingRef.current = true;
      pendingRequests.add(requestKey);

      setIsLoading(true);
      setError(null);

      try {
         const response = await adminApi.getCareersList();
         setCareers(response.data);
      } catch (err) {
         const message =
            err instanceof Error ? err.message : 'حدث خطأ أثناء جلب المهن';
         setError(message);
         toast.error('فشل تحميل المهن', {
            description: message,
         });
      } finally {
         pendingRequests.delete(requestKey);
         if (mountedRef.current) {
            setIsLoading(false);
         }
         isFetchingRef.current = false;
      }
   }, []);

   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
      };
   }, []);

   const refetch = useCallback(() => {
      fetchCareers();
   }, [fetchCareers]);

   // Auto-fetch only if enabled and not already attempted
   useEffect(() => {
      if (!config.autoFetch) return;
      if (sessionStatus !== 'authenticated') return;
      if (attemptedFetchRef.current) return;

      attemptedFetchRef.current = true;
      fetchCareers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [sessionStatus, config.autoFetch]);

   return {
      careers,
      isLoading,
      error,
      refetch,
   };
}

export default useCareers;
