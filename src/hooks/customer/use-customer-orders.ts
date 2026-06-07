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

   // Expiry filtering is handled by the backend in production — expired orders
   // are returned under the "expired" status. The previous client-side
   // `expires_at` re-filtering dropped live orders due to timezone/format skew,
   // so we trust the server list as-is.
   const orders = data ?? [];

   return {
      orders,
      isLoading,
      error,
      refetch,
   };
}

export default useCustomerOrders;
