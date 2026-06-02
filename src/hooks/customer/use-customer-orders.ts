'use client';

import { useCallback } from 'react';
import { customerOrdersApi } from '@/api/customer';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import type {
   CustomerOrder,
   CustomerOrderFilterStatus,
} from '@/types/entities/order';

export interface UseCustomerOrdersReturn {
   orders: CustomerOrder[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export interface UseCustomerOrdersOptions {
   /** Filter orders server-side by status. Omit for all orders. */
   status?: CustomerOrderFilterStatus;
   autoFetch?: boolean;
}

export function useCustomerOrders(
   options: UseCustomerOrdersOptions = {}
): UseCustomerOrdersReturn {
   const { status, autoFetch = true } = options;

   const fetcher = useCallback(
      () => customerOrdersApi.getAll({ status }),
      [status]
   );

   const { data, isLoading, error, refetch } = useFetch<CustomerOrder[]>(
      fetcher,
      generateRequestKey('customer-orders-list', status ?? 'all'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب طلباتك',
      }
   );

   // When a status is requested the server already returns the right set
   // (including expired orders), so we trust it. Without a status we keep the
   // legacy behaviour of hiding orders past their expiry date.
   const now = new Date();
   const orders = status
      ? (data ?? [])
      : (data ?? []).filter((order) => new Date(order.expires_at) > now);

   return {
      orders,
      isLoading,
      error,
      refetch,
   };
}

export default useCustomerOrders;
