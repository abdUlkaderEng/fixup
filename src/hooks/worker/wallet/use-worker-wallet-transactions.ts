'use client';

import { useCallback, useState } from 'react';
import { workerWalletApi } from '@/api/worker';
import {
   useFetch,
   usePagination,
   generateRequestKey,
} from '@/hooks/admin/shared';
import type {
   WorkerWalletTransaction,
   WorkerWalletTransactionsResponse,
} from '@/types/worker/wallet';

export interface UseWorkerWalletTransactionsReturn {
   transactions: WorkerWalletTransaction[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   currentPage: number;
   totalPages: number;
   totalItems: number;
   perPage: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
   goToPage: (page: number) => void;
   nextPage: () => void;
   prevPage: () => void;
}

export interface UseWorkerWalletTransactionsOptions {
   initialPage?: number;
   perPage?: number;
   autoFetch?: boolean;
}

/**
 * Fetch the worker's wallet transactions with numbered pagination.
 *
 * Wraps useFetch + usePagination so the page component only deals with
 * `transactions`, page-state, and `goToPage`.
 */
export function useWorkerWalletTransactions(
   options: UseWorkerWalletTransactionsOptions = {}
): UseWorkerWalletTransactionsReturn {
   const { initialPage = 1, perPage = 20, autoFetch = true } = options;

   const [transactions, setTransactions] = useState<WorkerWalletTransaction[]>(
      []
   );

   const handlePageChange = useCallback(
      (page: number) => {
         void fetchPage(page);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [perPage]
   );

   const pagination = usePagination(handlePageChange, {
      initialPage,
      perPage,
   });

   const fetchPage = useCallback(
      async (page: number = pagination.currentPage) => {
         const response = await workerWalletApi.getTransactions({
            page,
            perPage,
         });
         setTransactions(response.data);
         pagination.updatePagination({
            currentPage: response.current_page,
            lastPage: response.last_page,
            total: response.total,
            nextPageUrl: response.next_page_url,
            prevPageUrl: response.prev_page_url,
         });
         return response;
      },
      [pagination, perPage]
   );

   const { isLoading, error, refetch } =
      useFetch<WorkerWalletTransactionsResponse>(
         () => fetchPage(initialPage),
         generateRequestKey('worker-wallet-transactions', initialPage, perPage),
         {
            autoFetch,
            errorMessage: 'حدث خطأ أثناء جلب حركات المحفظة',
         }
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

   return {
      transactions,
      isLoading,
      error,
      refetch,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      perPage: pagination.perPage,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      goToPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
   };
}

export default useWorkerWalletTransactions;
