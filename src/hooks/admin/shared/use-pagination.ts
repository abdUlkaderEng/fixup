'use client';

import { useState, useCallback, useMemo } from 'react';

// ============================================
// Types
// ============================================

export interface PaginationState {
   currentPage: number;
   totalPages: number;
   totalItems: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface UsePaginationOptions {
   initialPage?: number;
   perPage?: number;
}

export interface UsePaginationReturn extends PaginationState {
   setPage: (page: number) => void;
   nextPage: () => void;
   prevPage: () => void;
   firstPage: () => void;
   lastPage: () => void;
   updatePagination: (params: {
      currentPage: number;
      lastPage: number;
      total: number;
      nextPageUrl: string | null;
      prevPageUrl: string | null;
   }) => void;
   resetPagination: () => void;
   perPage: number;
}

// ============================================
// Pagination Hook
// ============================================

export function usePagination(
   onPageChange?: (page: number) => void,
   options: UsePaginationOptions = {}
): UsePaginationReturn {
   const { initialPage = 1, perPage = 20 } = options;

   const [pagination, setPagination] = useState<PaginationState>({
      currentPage: initialPage,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
   });

   const setPage = useCallback(
      (page: number) => {
         if (
            page < 1 ||
            page > pagination.totalPages ||
            page === pagination.currentPage
         ) {
            return;
         }

         setPagination((prev) => ({ ...prev, currentPage: page }));
         onPageChange?.(page);
      },
      [pagination.totalPages, pagination.currentPage, onPageChange]
   );

   const nextPage = useCallback(() => {
      if (pagination.hasNextPage) {
         setPage(pagination.currentPage + 1);
      }
   }, [pagination.hasNextPage, pagination.currentPage, setPage]);

   const prevPage = useCallback(() => {
      if (pagination.hasPrevPage) {
         setPage(pagination.currentPage - 1);
      }
   }, [pagination.hasPrevPage, pagination.currentPage, setPage]);

   const firstPage = useCallback(() => {
      setPage(1);
   }, [setPage]);

   const lastPage = useCallback(() => {
      setPage(pagination.totalPages);
   }, [pagination.totalPages, setPage]);

   const updatePagination = useCallback(
      (params: {
         currentPage: number;
         lastPage: number;
         total: number;
         nextPageUrl: string | null;
         prevPageUrl: string | null;
      }) => {
         setPagination({
            currentPage: params.currentPage,
            totalPages: params.lastPage,
            totalItems: params.total,
            hasNextPage: params.nextPageUrl !== null,
            hasPrevPage: params.prevPageUrl !== null,
         });
      },
      []
   );

   const resetPagination = useCallback(() => {
      setPagination({
         currentPage: initialPage,
         totalPages: 1,
         totalItems: 0,
         hasNextPage: false,
         hasPrevPage: false,
      });
   }, [initialPage]);

   return useMemo(
      () => ({
         ...pagination,
         setPage,
         nextPage,
         prevPage,
         firstPage,
         lastPage,
         updatePagination,
         resetPagination,
         perPage,
      }),
      [
         pagination,
         setPage,
         nextPage,
         prevPage,
         firstPage,
         lastPage,
         updatePagination,
         resetPagination,
         perPage,
      ]
   );
}

export default usePagination;
