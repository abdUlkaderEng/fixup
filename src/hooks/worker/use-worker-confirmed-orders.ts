'use client';

import { useCallback } from 'react';
import { workerConfirmedOrdersApi } from '@/api/worker';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import type { WorkerConfirmedOrder } from '@/types/worker/orders-workflow';
import { mockWorkerConfirmedOrders } from './mock-workflow-orders';

export interface UseWorkerConfirmedOrdersReturn {
   orders: WorkerConfirmedOrder[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export function useWorkerConfirmedOrders(): UseWorkerConfirmedOrdersReturn {
   const fetcher = useCallback(async () => {
      try {
         return await workerConfirmedOrdersApi.getAll();
      } catch {
         return mockWorkerConfirmedOrders;
      }
   }, []);

   const { data, isLoading, error, refetch } = useFetch<WorkerConfirmedOrder[]>(
      fetcher,
      generateRequestKey('worker-confirmed-orders-list'),
      {
         errorMessage: 'حدث خطأ أثناء جلب الطلبات المؤكدة',
      }
   );

   return {
      orders: data ?? [],
      isLoading,
      error,
      refetch,
   };
}
