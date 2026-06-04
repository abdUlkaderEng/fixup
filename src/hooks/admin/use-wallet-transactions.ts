'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { adminWalletTransactionsApi } from '@/api/admin';
import { useFetch, usePagination, generateRequestKey } from './shared';
import type { PaginatedResponse } from '@/types/admin/shared';
import type { AdminWalletTransaction } from '@/types/admin/wallet';

export interface UseAdminWalletTransactionsReturn {
   transactions: AdminWalletTransaction[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   currentPage: number;
   totalPages: number;
   totalItems: number;
   perPage: number;
   goToPage: (page: number) => void;
}

export interface UseAdminWalletTransactionsOptions {
   initialPage?: number;
   perPage?: number;
   autoFetch?: boolean;
}

export function useAdminWalletTransactions(
   options: UseAdminWalletTransactionsOptions = {}
): UseAdminWalletTransactionsReturn {
   const { initialPage = 1, perPage = 20, autoFetch = true } = options;

   const [transactions, setTransactions] = useState<AdminWalletTransaction[]>(
      []
   );
   const [isFetching, setIsFetching] = useState(false);
   const [fetchError, setFetchError] = useState<Error | null>(null);

   const pagination = usePagination(undefined, {
      initialPage,
      perPage,
   });

   const fetchPage = useCallback(
      async (
         page: number = pagination.currentPage
      ): Promise<PaginatedResponse<AdminWalletTransaction>> => {
         setIsFetching(true);
         setFetchError(null);

         try {
            const response = await adminWalletTransactionsApi.getTransactions({
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
         } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setFetchError(error);
            throw error;
         } finally {
            setIsFetching(false);
         }
      },
      [pagination, perPage]
   );

   const runFetch = useCallback(
      (page: number) => {
         void fetchPage(page).catch((err) => {
            toast.error('حدث خطأ أثناء جلب حركات المحفظة', {
               description: err instanceof Error ? err.message : undefined,
            });
         });
      },
      [fetchPage]
   );

   const {
      isLoading: isInitialLoading,
      error: initialError,
      refetch: refetchInitialPage,
   } = useFetch<PaginatedResponse<AdminWalletTransaction>>(
      () => fetchPage(initialPage),
      generateRequestKey('admin-wallet-transactions', initialPage, perPage),
      { autoFetch, errorMessage: 'حدث خطأ أثناء جلب حركات المحفظة' }
   );

   const refetch = useCallback(() => {
      if (pagination.currentPage === initialPage) {
         refetchInitialPage();
         return;
      }

      runFetch(pagination.currentPage);
   }, [initialPage, pagination.currentPage, refetchInitialPage, runFetch]);

   const goToPage = useCallback(
      (page: number) => {
         if (
            page < 1 ||
            page > pagination.totalPages ||
            page === pagination.currentPage
         ) {
            return;
         }

         runFetch(page);
      },
      [pagination.currentPage, pagination.totalPages, runFetch]
   );

   return {
      transactions,
      isLoading: isInitialLoading || isFetching,
      error: initialError ?? fetchError,
      refetch,
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalItems: pagination.totalItems,
      perPage: pagination.perPage,
      goToPage,
   };
}

export default useAdminWalletTransactions;
