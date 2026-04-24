'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { servicesApi } from '@/api/admin';
import { useFetch, usePagination, generateRequestKey } from './shared';
import type {
   Service,
   PaginatedServicesResponse,
} from '@/types/admin/services';

export interface UseServicesReturn {
   services: Service[];
   isLoading: boolean;
   error: Error | null;
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

export interface UseServicesOptions {
   initialPage?: number;
   perPage?: number;
   careerId?: number;
   autoFetch?: boolean;
}

/**
 * Hook for fetching services with pagination and career filtering
 */
export function useServices(
   options: UseServicesOptions = {}
): UseServicesReturn {
   const {
      initialPage = 1,
      perPage = 20,
      careerId,
      autoFetch = true,
   } = options;

   const [careerFilter, setCareerFilterState] = useState<number | undefined>(
      careerId
   );

   const handlePageChange = useCallback(
      (page: number) => {
         fetchServices(page);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [careerFilter]
   );

   const pagination = usePagination(handlePageChange, { initialPage, perPage });

   const fetchServices = useCallback(
      async (page: number = pagination.currentPage) => {
         const response = await servicesApi.getAll({
            career_id: careerFilter,
            page,
            perPage,
         });

         setServicesState(response.data);
         pagination.updatePagination({
            currentPage: response.current_page,
            lastPage: response.last_page,
            total: response.total,
            nextPageUrl: response.next_page_url,
            prevPageUrl: response.prev_page_url,
         });

         return response;
      },
      [careerFilter, perPage, pagination]
   );

   const [servicesState, setServicesState] = useState<Service[]>([]);
   const [isFilterLoading, setIsFilterLoading] = useState(false);

   const { isLoading, error, refetch } = useFetch<PaginatedServicesResponse>(
      () => fetchServices(initialPage),
      generateRequestKey(
         'services',
         careerFilter ?? 'all',
         initialPage,
         perPage
      ),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب الخدمات',
      }
   );

   // Fetch when career filter changes (handles stale closure issue)
   const previousCareerFilterRef = useRef(careerFilter);
   useEffect(() => {
      if (previousCareerFilterRef.current !== careerFilter) {
         previousCareerFilterRef.current = careerFilter;
         setIsFilterLoading(true);
         fetchServices(1).finally(() => setIsFilterLoading(false));
      }
   }, [careerFilter, fetchServices]);

   const setCareerFilter = useCallback(
      (careerId: number | undefined) => {
         if (careerId === careerFilter) return;
         setCareerFilterState(careerId);
         pagination.firstPage();
         // Reset will trigger refetch via useEffect if needed
      },
      [careerFilter, pagination]
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
         fetchServices(page);
      },
      [pagination, fetchServices]
   );

   const fetch = useCallback(
      (page?: number) => {
         fetchServices(page ?? initialPage);
      },
      [fetchServices, initialPage]
   );

   return {
      services: servicesState,
      isLoading: isLoading || isFilterLoading,
      error,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalServices: pagination.totalItems,
      careerFilter,
      setCareerFilter,
      goToPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      refetch,
      fetch,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
   };
}

export default useServices;
