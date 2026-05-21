'use client';

import { useCallback } from 'react';
import { workerOrdersApi } from '@/api/worker';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import type { WorkerOrder } from '@/types/entities/order';

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
   const { autoFetch = true } = options;

   const fetcher = useCallback(() => workerOrdersApi.getAll(), []);

   const { data, isLoading, error, refetch, setData } = useFetch<WorkerOrder[]>(
      fetcher,
      generateRequestKey('worker-orders-list'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب الطلبات',
      }
   );

   const now = new Date();
   const validOrders =
      data?.filter((order) => new Date(order.expires_at) > now) ?? [];

   const removeOrder = useCallback(
      (orderId: number) => {
         setData((prev) =>
            prev ? prev.filter((order) => order.id !== orderId) : prev
         );
      },
      [setData]
   );

   return {
      orders: validOrders,
      isLoading,
      error,
      refetch,
      removeOrder,
   };
}
