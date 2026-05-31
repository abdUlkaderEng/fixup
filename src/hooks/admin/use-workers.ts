'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { workersApi } from '@/api/admin';
import { useFetch, usePagination, generateRequestKey } from './shared';
import type {
   Worker,
   WorkerStatus,
   WorkerFilters,
   PaginatedWorkersResponse,
} from '@/types/admin/index';

// ============================================
// Internal filter state
// ============================================

interface WorkerFilterState {
   status: WorkerStatus | undefined;
   name: string;
   phoneNumber: string;
   // careerId is intentionally omitted — career filtering is disabled for now.
   // careerId: number | undefined;
}

/** Partial patch accepted by the public `setFilters` batch setter. */
export type WorkerFilterPatch = Partial<{
   status: WorkerStatus | undefined;
   name: string;
   phoneNumber: string;
}>;

export interface UseWorkersReturn {
   workers: Worker[];
   isLoading: boolean;
   error: Error | null;
   currentPage: number;
   totalPages: number;
   totalWorkers: number;
   // Filters
   statusFilter: WorkerStatus | undefined;
   nameFilter: string;
   phoneFilter: string;
   setStatusFilter: (status: WorkerStatus | undefined) => void;
   setNameFilter: (name: string) => void;
   setPhoneFilter: (phone: string) => void;
   /** Apply several filter fields in a single request (resets to page 1). */
   setFilters: (patch: WorkerFilterPatch) => void;
   resetFilters: () => void;
   // Pagination
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
   name?: string;
   phoneNumber?: string;
   autoFetch?: boolean;
}

/** True when at least one filter narrows the result set. */
function hasActiveFilter(filters: WorkerFilters): boolean {
   return Boolean(filters.status || filters.name || filters.phone_number);
}

/**
 * Hook for fetching workers with pagination and server-side filtering.
 *
 * Filtering by status / name / phone number hits `/admin/workers/filters`
 * (via `workersApi.getFiltered`); when no filter is active it falls back to
 * the plain list endpoint (`workersApi.getAll`).
 */
export function useWorkers(options: UseWorkersOptions = {}): UseWorkersReturn {
   const {
      initialPage = 1,
      perPage = 10,
      status,
      name = '',
      phoneNumber = '',
      autoFetch = false,
   } = options;

   const [filters, setFiltersState] = useState<WorkerFilterState>({
      status,
      name,
      phoneNumber,
   });
   // Mirror filters in a ref so direct fetches / rapid setter calls always
   // compose against the latest committed value (avoids stale closures).
   const filtersRef = useRef(filters);
   useEffect(() => {
      filtersRef.current = filters;
   }, [filters]);

   const [workersState, setWorkersState] = useState<Worker[]>([]);
   const [isFetching, setIsFetching] = useState(false);

   const handlePageChange = useCallback(
      (page: number) => {
         runFetch(page);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const pagination = usePagination(handlePageChange, { initialPage, perPage });

   const fetchWorkers = useCallback(
      async (
         page: number = pagination.currentPage,
         override?: WorkerFilterState
      ) => {
         const active = override ?? filtersRef.current;
         const requestFilters: WorkerFilters = {
            status: active.status,
            name: active.name.trim() || undefined,
            phone_number: active.phoneNumber.trim() || undefined,
            page,
            perPage,
         };

         setIsFetching(true);
         try {
            const response = hasActiveFilter(requestFilters)
               ? await workersApi.getFiltered(requestFilters)
               : await workersApi.getAll(requestFilters);

            setWorkersState(response.data);
            pagination.updatePagination({
               currentPage: response.current_page,
               lastPage: response.last_page,
               total: response.total,
               nextPageUrl: response.next_page_url,
               prevPageUrl: response.prev_page_url,
            });

            return response;
         } finally {
            setIsFetching(false);
         }
      },
      [perPage, pagination]
   );

   const {
      isLoading: isInitialLoading,
      error,
      refetch,
   } = useFetch<PaginatedWorkersResponse>(
      () => fetchWorkers(initialPage),
      generateRequestKey(
         'workers',
         filters.status ?? 'all',
         filters.name || 'all',
         filters.phoneNumber || 'all',
         initialPage,
         perPage
      ),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب بيانات العمال',
      }
   );

   // Fire a fetch outside of useFetch (filters / pagination) while still
   // surfacing errors as a toast and toggling the shared loading flag.
   const runFetch = useCallback(
      (page?: number, override?: WorkerFilterState) => {
         void fetchWorkers(page, override).catch((err) => {
            toast.error('حدث خطأ أثناء جلب بيانات العمال', {
               description: err instanceof Error ? err.message : undefined,
            });
         });
      },
      [fetchWorkers]
   );

   const setFilters = useCallback(
      (patch: WorkerFilterPatch) => {
         const current = filtersRef.current;
         const next: WorkerFilterState = { ...current, ...patch };
         // Idempotent: skip the request when nothing actually changed (also
         // makes a debounced "empty search" on mount a no-op).
         if (
            next.status === current.status &&
            next.name === current.name &&
            next.phoneNumber === current.phoneNumber
         ) {
            return;
         }
         filtersRef.current = next;
         setFiltersState(next);
         runFetch(1, next);
      },
      [runFetch]
   );

   const setStatusFilter = useCallback(
      (newStatus: WorkerStatus | undefined) =>
         setFilters({ status: newStatus }),
      [setFilters]
   );

   const setNameFilter = useCallback(
      (newName: string) => setFilters({ name: newName }),
      [setFilters]
   );

   const setPhoneFilter = useCallback(
      (newPhone: string) => setFilters({ phoneNumber: newPhone }),
      [setFilters]
   );

   const resetFilters = useCallback(
      () => setFilters({ status: undefined, name: '', phoneNumber: '' }),
      [setFilters]
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
         runFetch(page ?? initialPage);
      },
      [runFetch, initialPage]
   );

   return {
      workers: workersState,
      isLoading: isInitialLoading || isFetching,
      error,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalWorkers: pagination.totalItems,
      statusFilter: filters.status,
      nameFilter: filters.name,
      phoneFilter: filters.phoneNumber,
      setStatusFilter,
      setNameFilter,
      setPhoneFilter,
      setFilters,
      resetFilters,
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
