'use client';

import { useCallback, useMemo, useState } from 'react';
import { workerOffersApi } from '@/api/worker';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import type { WorkerPendingOffer } from '@/types/worker/orders-workflow';
import { mockWorkerPendingOffers } from './mock-workflow-orders';

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
      { errorMessage: 'حدث خطأ أثناء جلب عروض الأسعار المرسلة' }
   );

   const offers = useMemo(() => data ?? [], [data]);

   // Locally-tracked ids for offers just submitted in this session, so the dashboard
   // can hide them immediately without waiting for the canonical refetch to complete.
   const [optimisticIds, setOptimisticIds] = useState<Set<number>>(
      () => new Set()
   );

   const offeredOrderIds = useMemo(() => {
      const s = new Set<number>(offers.map((o) => o.order_id));
      optimisticIds.forEach((id) => s.add(id));
      return s;
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
