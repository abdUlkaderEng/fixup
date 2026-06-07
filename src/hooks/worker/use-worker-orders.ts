'use client';

import { useCallback } from 'react';
import { workerPendingOrdersApi } from '@/api/worker';
import type { WorkerOrder } from '@/types/entities/order';
import { useWorkerList } from './shared';

export interface UseWorkerOrdersReturn {
   orders: WorkerOrder[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   /** Optimistically drop an order from the list (e.g. right after submitting an offer). */
   removeOrder: (orderId: number) => void;
}

export interface UseWorkerOrdersOptions {
   autoFetch?: boolean;
}

export function useWorkerOrders(
   options: UseWorkerOrdersOptions = {}
): UseWorkerOrdersReturn {
   const fetcher = useCallback(() => workerPendingOrdersApi.getAll(), []);

   const { items, isLoading, error, refetch, setData } =
      useWorkerList<WorkerOrder>(
         {
            cacheKey: 'worker-orders-list',
            fetcher,
            errorMessage: 'حدث خطأ أثناء جلب الطلبات',
         },
         options
      );

   // Expiry filtering is handled by the backend in production — it only returns
   // still-live pending orders. Re-filtering by `expires_at` on the client was
   // dropping live orders due to timezone/format skew, so we trust the server.
   // const now = new Date();
   // const orders = items.filter((order) => new Date(order.expires_at) > now);
   const orders = items;

   const removeOrder = useCallback(
      (orderId: number) => {
         setData((prev) =>
            prev ? prev.filter((order) => order.id !== orderId) : prev
         );
      },
      [setData]
   );

   return { orders, isLoading, error, refetch, removeOrder };
}
