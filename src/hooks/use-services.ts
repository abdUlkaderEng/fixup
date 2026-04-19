'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import type { Service } from '@/types/service';

const pendingRequests = new Set<string>();

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000;

function canMakeRequest(): boolean {
   const now = Date.now();
   if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return false;
   }
   lastRequestTime = now;
   return true;
}

interface UseServicesReturn {
   services: Service[];
   isLoading: boolean;
   error: string | null;
   currentPage: number;
   totalPages: number;
   totalServices: number;
   careerFilter: number | undefined;
   setCareerFilter: (careerId: number | undefined) => void;
   goToPage: (page: number) => void;
   nextPage: () => void;
   prevPage: () => void;
   refetch: () => void;
   fetch: (page?: number) => void;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

interface UseServicesOptions {
   initialPage?: number;
   perPage?: number;
   careerId?: number;
   autoFetch?: boolean;
}

const DEFAULT_OPTIONS: UseServicesOptions = {
   initialPage: 1,
   perPage: 20,
   careerId: undefined,
   autoFetch: true,
};

export function useServices(
   options: UseServicesOptions = {}
): UseServicesReturn {
   const config = useMemo(
      () =>
         ({ ...DEFAULT_OPTIONS, ...options }) as Required<UseServicesOptions>,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const { status: sessionStatus } = useSession();
   const isFetchingRef = useRef(false);
   const mountedRef = useRef(true);
   const attemptedFetchRef = useRef(false);

   const [services, setServices] = useState<Service[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [pagination, setPagination] = useState({
      currentPage: config.initialPage,
      totalPages: 1,
      totalServices: 0,
      hasNextPage: false,
      hasPrevPage: false,
   });

   const [careerFilter, setCareerFilterState] = useState<number | undefined>(
      config.careerId
   );

   const fetchServices = useCallback(
      async (page: number, careerId?: number | undefined) => {
         // Use provided careerId or fall back to current state
         const effectiveCareerId =
            careerId !== undefined ? careerId : careerFilter;
         const requestKey = `${effectiveCareerId ?? 'all'}-${page}-${config.perPage}`;

         if (isFetchingRef.current || pendingRequests.has(requestKey)) {
            console.log(
               '[useServices] Skipping duplicate request:',
               requestKey
            );
            return;
         }

         if (!canMakeRequest()) {
            console.log('[useServices] Rate limited, skipping request');
            return;
         }

         isFetchingRef.current = true;
         pendingRequests.add(requestKey);

         console.log(
            '[useServices] Starting request:',
            requestKey,
            'careerId:',
            effectiveCareerId
         );

         setIsLoading(true);
         setError(null);

         try {
            const response = await adminApi.getServices({
               career_id: effectiveCareerId,
               page,
               perPage: config.perPage,
            });

            setServices(response.data);
            setPagination({
               currentPage: response.current_page,
               totalPages: response.last_page,
               totalServices: response.total,
               hasNextPage: response.next_page_url !== null,
               hasPrevPage: response.prev_page_url !== null,
            });
         } catch (err) {
            const message =
               err instanceof Error ? err.message : 'حدث خطأ أثناء جلب الخدمات';
            console.error('[useServices] Request failed:', requestKey, message);
            setError(message);
            toast.error('فشل تحميل الخدمات', {
               description: message,
            });
         } finally {
            pendingRequests.delete(requestKey);
            if (mountedRef.current) {
               setIsLoading(false);
            }
            isFetchingRef.current = false;
         }
      },
      [careerFilter, config.perPage]
   );

   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
      };
   }, []);

   const setCareerFilter = useCallback(
      (careerId: number | undefined) => {
         if (careerId === careerFilter) return;
         setCareerFilterState(careerId);
         // Reset to page 1 and fetch with new filter
         fetchServices(1, careerId);
      },
      [careerFilter, fetchServices]
   );

   const goToPage = useCallback(
      (page: number) => {
         if (
            page < 1 ||
            page > pagination.totalPages ||
            page === pagination.currentPage
         ) {
            return;
         }
         fetchServices(page, careerFilter);
      },
      [
         fetchServices,
         pagination.totalPages,
         pagination.currentPage,
         careerFilter,
      ]
   );

   const nextPage = useCallback(() => {
      if (pagination.hasNextPage) {
         goToPage(pagination.currentPage + 1);
      }
   }, [goToPage, pagination.hasNextPage, pagination.currentPage]);

   const prevPage = useCallback(() => {
      if (pagination.hasPrevPage) {
         goToPage(pagination.currentPage - 1);
      }
   }, [goToPage, pagination.hasPrevPage, pagination.currentPage]);

   const refetch = useCallback(() => {
      fetchServices(pagination.currentPage ?? 1, careerFilter);
   }, [fetchServices, pagination.currentPage, careerFilter]);

   // Manual fetch function
   const fetch = useCallback(
      (page?: number) => {
         if (sessionStatus !== 'authenticated') {
            toast.error('غير مصرح', {
               description: 'يجب تسجيل الدخول أولاً',
            });
            return;
         }
         attemptedFetchRef.current = true;
         fetchServices(page ?? config.initialPage ?? 1, careerFilter);
      },
      [sessionStatus, config.initialPage, fetchServices, careerFilter]
   );

   // Auto-fetch only if enabled and not already attempted
   useEffect(() => {
      if (!config.autoFetch) return;
      if (sessionStatus !== 'authenticated') return;
      if (attemptedFetchRef.current) return;

      attemptedFetchRef.current = true;
      fetchServices(config.initialPage ?? 1, careerFilter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [sessionStatus, config.autoFetch, careerFilter]);

   return {
      services,
      isLoading,
      error,
      currentPage: pagination.currentPage ?? 1,
      totalPages: pagination.totalPages ?? 1,
      totalServices: pagination.totalServices ?? 0,
      careerFilter,
      setCareerFilter,
      goToPage,
      nextPage,
      prevPage,
      refetch,
      fetch,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
   };
}

export default useServices;
