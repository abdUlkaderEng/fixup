'use client';

import { useCallback } from 'react';
import { workerWalletApi } from '@/api/worker';
import {
   useFetch,
   generateRequestKey,
   type UseFetchReturn,
} from '@/hooks/admin/shared';
import type { WorkerWallet } from '@/types/worker/wallet';

export interface UseWorkerWalletReturn extends Pick<
   UseFetchReturn<WorkerWallet>,
   'isLoading' | 'error' | 'refetch'
> {
   wallet: WorkerWallet | null;
   /** False when the worker has no wallet yet (e.g. pending admin approval). */
   hasWallet: boolean;
}

export interface UseWorkerWalletOptions {
   /** Auto-fetch on mount (default: true). */
   autoFetch?: boolean;
}

/**
 * Fetch the authenticated worker's wallet snapshot (balance + totals).
 */
export function useWorkerWallet(
   options: UseWorkerWalletOptions = {}
): UseWorkerWalletReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(() => workerWalletApi.getWallet(), []);

   const { data, isLoading, error, refetch } = useFetch<WorkerWallet>(
      fetcher,
      generateRequestKey('worker-wallet'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب بيانات المحفظة',
      }
   );

   return {
      wallet: data,
      hasWallet: data !== null,
      isLoading,
      error,
      refetch,
   };
}

export default useWorkerWallet;
