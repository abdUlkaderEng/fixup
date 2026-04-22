'use client';

import { useCallback, useState } from 'react';
import { workersApi } from '@/api/admin';
import { useFetch, usePagination, generateRequestKey } from './shared';
import type {
   Worker,
   WorkerStatus,
   WorkerFilters,
   PaginatedWorkersResponse,
} from '@/types/admin/index';
import { Cagliostro } from 'next/font/google';

export interface UseWorkersReturn {
   workers: Worker[];
   isLoading: boolean;
   error: Error | null;
   currentPage: number;
   totalPages: number;
   totalWorkers: number;
   statusFilter: WorkerStatus | undefined;
   setStatusFilter: (status: WorkerStatus | undefined) => void;
   goToPage: (page: number) => void;
   nextPage: () => void;
   prevPage: () => void;
   refetch: () => void;
   fetch: (page?: number) => void;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface UseWorkersOptions {
   initialPage?: number;
   perPage?: number;
   status?: WorkerStatus;
   autoFetch?: boolean;
}

/**
 * Hook for fetching workers with pagination and status filtering
 */
export function useWorkers(options: UseWorkersOptions = {}): UseWorkersReturn {
   const { initialPage = 1, perPage = 10, status, autoFetch = false } = options;

   const [statusFilter, setStatusFilterState] = useState<
      WorkerStatus | undefined
   >(status);
   const [workersState, setWorkersState] = useState<Worker[]>([]);

   const handlePageChange = useCallback(
      (page: number) => {
         void fetchWorkers(page);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [statusFilter, perPage]
   );

   const pagination = usePagination(handlePageChange, { initialPage, perPage });

   const fetchWorkers = useCallback(
      async (
         page: number = pagination.currentPage,
         filterStatus: WorkerStatus | undefined = statusFilter
      ) => {
         const filters: WorkerFilters = {
            status: filterStatus,
            page,
            perPage,
         };

         const response = await workersApi.getAll(filters);
         console.log(response.data);
         setWorkersState(response.data);
         pagination.updatePagination({
            currentPage: response.current_page,
            lastPage: response.last_page,
            total: response.total,
            nextPageUrl: response.next_page_url,
            prevPageUrl: response.prev_page_url,
         });

         return response;
      },
      [statusFilter, perPage, pagination]
   );

   const { isLoading, error, refetch } = useFetch<PaginatedWorkersResponse>(
      () => fetchWorkers(initialPage),
      generateRequestKey(
         'workers',
         statusFilter ?? 'all',
         initialPage,
         perPage
      ),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب بيانات العمال',
      }
   );

   const setStatusFilter = useCallback(
      (newStatus: WorkerStatus | undefined) => {
         if (newStatus === statusFilter) return;
         setStatusFilterState(newStatus);
         if (pagination.currentPage === 1) {
            void fetchWorkers(1, newStatus);
         } else {
            pagination.firstPage();
         }
      },
      [statusFilter, pagination, fetchWorkers]
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
         pagination.setPage(page);
      },
      [pagination]
   );

   const fetch = useCallback(
      (page?: number) => {
         void fetchWorkers(page ?? initialPage);
      },
      [fetchWorkers, initialPage]
   );

   return {
      workers: workersState,
      isLoading,
      error,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalWorkers: pagination.totalItems,
      statusFilter,
      setStatusFilter,
      goToPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      refetch,
      fetch,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
   };
}

export default useWorkers;
