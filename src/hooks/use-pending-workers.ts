'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import type { Worker, WorkerStatus } from '@/types/worker';

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

interface UsePendingWorkersReturn {
   workers: Worker[];
   isLoading: boolean;
   error: string | null;
   currentPage: number;
   totalPages: number;
   totalWorkers: number;
   statusFilter: WorkerStatus;
   setStatusFilter: (status: WorkerStatus) => void;
   goToPage: (page: number) => void;
   nextPage: () => void;
   prevPage: () => void;
   refetch: () => void;
   fetch: (page?: number) => void;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

interface UsePendingWorkersOptions {
   initialPage?: number;
   perPage?: number;
   status?: WorkerStatus;
   autoFetch?: boolean;
}

const DEFAULT_OPTIONS: Required<UsePendingWorkersOptions> = {
   initialPage: 1,
   perPage: 10,
   status: 'waiting',
   autoFetch: false,
};

export function usePendingWorkers(
   options: UsePendingWorkersOptions = {}
): UsePendingWorkersReturn {
   const config = useMemo(
      () => ({ ...DEFAULT_OPTIONS, ...options }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const { status: sessionStatus } = useSession();
   const isFetchingRef = useRef(false);
   const mountedRef = useRef(true);
   const attemptedFetchRef = useRef(false);

   const [workers, setWorkers] = useState<Worker[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [pagination, setPagination] = useState({
      currentPage: config.initialPage,
      totalPages: 1,
      totalWorkers: 0,
      hasNextPage: false,
      hasPrevPage: false,
   });

   const [statusFilter, setStatusFilterState] = useState<WorkerStatus>(
      config.status
   );

   const fetchWorkers = useCallback(
      async (page: number, status: WorkerStatus = statusFilter) => {
         const requestKey = `${status}-${page}-${config.perPage}`;

         if (isFetchingRef.current || pendingRequests.has(requestKey)) {
            console.log(
               '[usePendingWorkers] Skipping duplicate request:',
               requestKey
            );
            return;
         }

         if (!canMakeRequest()) {
            console.log('[usePendingWorkers] Rate limited, skipping request');
            return;
         }

         isFetchingRef.current = true;
         pendingRequests.add(requestKey);

         console.log('[usePendingWorkers] Starting request:', requestKey);

         setIsLoading(true);
         setError(null);

         try {
            const response = await adminApi.getWorkers({
               status,
               page,
               perPage: config.perPage,
            });

            setWorkers(response.data);
            setPagination({
               currentPage: response.current_page,
               totalPages: response.last_page,
               totalWorkers: response.total,
               hasNextPage: response.next_page_url !== null,
               hasPrevPage: response.prev_page_url !== null,
            });
         } catch (err) {
            const message =
               err instanceof Error
                  ? err.message
                  : 'حدث خطأ أثناء جلب بيانات العمال';
            console.error(
               '[usePendingWorkers] Request failed:',
               requestKey,
               message
            );
            setError(message);
            toast.error('فشل تحميل البيانات', {
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
      [statusFilter, config.perPage]
   );

   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
      };
   }, []);

   const setStatusFilter = useCallback(
      (status: WorkerStatus) => {
         if (status === statusFilter) return;
         setStatusFilterState(status);
         // Reset to page 1 and fetch with new filter
         fetchWorkers(1, status);
      },
      [statusFilter, fetchWorkers]
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
         fetchWorkers(page, statusFilter);
      },
      [
         fetchWorkers,
         pagination.totalPages,
         pagination.currentPage,
         statusFilter,
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
      fetchWorkers(pagination.currentPage, statusFilter);
   }, [fetchWorkers, pagination.currentPage, statusFilter]);

   // Manual fetch function that resets attempt flag
   const fetch = useCallback(
      (page?: number) => {
         if (sessionStatus !== 'authenticated') {
            toast.error('غير مصرح', {
               description: 'يجب تسجيل الدخول أولاً',
            });
            return;
         }
         attemptedFetchRef.current = true;
         fetchWorkers(page ?? config.initialPage, statusFilter);
      },
      [sessionStatus, config.initialPage, fetchWorkers, statusFilter]
   );

   // Auto-fetch only if enabled and not already attempted
   useEffect(() => {
      if (!config.autoFetch) return;
      if (sessionStatus !== 'authenticated') return;
      if (attemptedFetchRef.current) return;

      attemptedFetchRef.current = true;
      fetchWorkers(config.initialPage, statusFilter);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [sessionStatus, config.autoFetch, statusFilter]);

   return {
      workers,
      isLoading,
      error,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalWorkers: pagination.totalWorkers,
      statusFilter,
      setStatusFilter,
      goToPage,
      nextPage,
      prevPage,
      refetch,
      fetch,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
   };
}

export default usePendingWorkers;
