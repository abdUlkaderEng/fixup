'use client';

import { useCallback, useMemo, useState } from 'react';
import { workerPendingOffersApi } from '@/api/worker';
import type { WorkerPendingOffer } from '@/types/worker/orders-workflow';
import { useWorkerList } from './shared';

export interface UseWorkerPendingOffersReturn {
   offers: WorkerPendingOffer[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   /** Order ids the worker has already submitted an offer for (server + optimistic). */
   offeredOrderIds: Set<number>;
   /** Optimistically mark an order as already offered (e.g. right after submit success). */
   markOrderAsOffered: (orderId: number) => void;
}

export function useWorkerPendingOffers(): UseWorkerPendingOffersReturn {
   const fetcher = useCallback(() => workerPendingOffersApi.getAll(), []);

   const {
      items: offers,
      isLoading,
      error,
      refetch,
   } = useWorkerList<WorkerPendingOffer>({
      cacheKey: 'worker-pending-offers-list',
      fetcher,
      errorMessage: 'حدث خطأ أثناء جلب عروض الأسعار المرسلة',
   });

   // Locally-tracked ids for offers just submitted in this session, so the
   // dashboard can hide them immediately without waiting for the canonical
   // refetch to complete.
   const [optimisticIds, setOptimisticIds] = useState<Set<number>>(
      () => new Set()
   );

   const offeredOrderIds = useMemo(() => {
      const set = new Set<number>(offers.map((o) => o.order_id));
      optimisticIds.forEach((id) => set.add(id));
      return set;
   }, [offers, optimisticIds]);

   const markOrderAsOffered = useCallback((orderId: number) => {
      setOptimisticIds((prev) => {
         if (prev.has(orderId)) return prev;
         const next = new Set(prev);
         next.add(orderId);
         return next;
      });
   }, []);

   return {
      offers,
      isLoading,
      error,
      refetch,
      offeredOrderIds,
      markOrderAsOffered,
   };
}
