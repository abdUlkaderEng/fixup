'use client';

import { useCallback, useState } from 'react';
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
   // legacy behaviour of hiding orders past their expiry date — but only when
   // `expires_at` is actually present and parseable. The backend sometimes
   // omits it, in which case `new Date(undefined)` is Invalid Date and the
   // order would be wrongly dropped, so we keep those visible.
   // Snapshot "now" once at mount. Reading the clock during render is impure;
   // an approximate cutoff is fine for hiding already-expired orders.
   const [nowMs] = useState(() => Date.now());
   const orders = status
      ? (data ?? [])
      : (data ?? []).filter((order) => {
           const expiryMs = new Date(order.expires_at).getTime();
           return Number.isNaN(expiryMs) || expiryMs > nowMs;
        });

   return {
      orders,
      isLoading,
      error,
      refetch,
   };
}

export default useCustomerOrders;
