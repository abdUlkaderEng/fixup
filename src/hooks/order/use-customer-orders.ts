'use client';

import { useCallback } from 'react';
import { ordersApi } from '@/api/orders';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import type { CustomerOrder } from '@/types/entities/order';

export interface UseCustomerOrdersReturn {
   orders: CustomerOrder[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export interface UseCustomerOrdersOptions {
   autoFetch?: boolean;
}

export function useCustomerOrders(
   options: UseCustomerOrdersOptions = {}
): UseCustomerOrdersReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(() => ordersApi.getAll(), []);

   const { data, isLoading, error, refetch } = useFetch<CustomerOrder[]>(
      fetcher,
      generateRequestKey('customer-orders-list'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب طلباتك',
      }
   );

   const now = new Date();
   const validOrders =
      data?.filter((order) => new Date(order.expires_at) > now) ?? [];

   return {
      orders: validOrders ?? [],
      isLoading,
      error,
      refetch,
   };
}

export default useCustomerOrders;
