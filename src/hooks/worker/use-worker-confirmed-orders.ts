'use client';

import { useCallback } from 'react';
import { workerConfirmedOrdersApi } from '@/api/worker';
import type { WorkerConfirmedOrder } from '@/types/worker/orders-workflow';
import { useWorkerList } from './shared';

export interface UseWorkerConfirmedOrdersReturn {
   orders: WorkerConfirmedOrder[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export function useWorkerConfirmedOrders(): UseWorkerConfirmedOrdersReturn {
   const fetcher = useCallback(() => workerConfirmedOrdersApi.getAll(), []);

   const {
      items: orders,
      isLoading,
      error,
      refetch,
   } = useWorkerList<WorkerConfirmedOrder>({
      cacheKey: 'worker-confirmed-orders-list',
      fetcher,
      errorMessage: 'حدث خطأ أثناء جلب الطلبات المؤكدة',
   });

   return { orders, isLoading, error, refetch };
}
