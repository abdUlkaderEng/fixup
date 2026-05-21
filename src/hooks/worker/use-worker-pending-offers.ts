'use client';

import { useCallback } from 'react';
import { workerOffersApi } from '@/api/worker';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import type { WorkerPendingOffer } from '@/types/worker/orders-workflow';
import { mockWorkerPendingOffers } from './mock-workflow-orders';

export interface UseWorkerPendingOffersReturn {
   offers: WorkerPendingOffer[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export function useWorkerPendingOffers(): UseWorkerPendingOffersReturn {
   const fetcher = useCallback(async () => {
      try {
         return await workerOffersApi.getPending();
      } catch {
         return mockWorkerPendingOffers;
      }
   }, []);

   const { data, isLoading, error, refetch } = useFetch<WorkerPendingOffer[]>(
      fetcher,
      generateRequestKey('worker-pending-offers-list'),
      {
         errorMessage: 'حدث خطأ أثناء جلب عروض الأسعار المرسلة',
      }
   );

   return {
      offers: data ?? [],
      isLoading,
      error,
      refetch,
   };
}
