'use client';

import { useCallback } from 'react';
import {
   clearCachedData,
   generateRequestKey,
   useMutation,
} from '@/hooks/admin/shared';
import { customerOrdersApi } from '@/api/customer';
import type { RateOrderResponse } from '@/types/entities/order';

interface RateOrderVariables {
   orderId: number;
   /** Integer star rating, 1–5. */
   rate: number;
}

export interface UseRateOrderReturn {
   rateOrder: (vars: RateOrderVariables) => Promise<RateOrderResponse | null>;
   isLoading: boolean;
   error: Error | null;
}

export interface UseRateOrderOptions {
   /** Fired after the backend confirms the rating. */
   onSuccess?: (response: RateOrderResponse) => void;
}

/**
 * Customer mutation: rate the worker who handled a completed order.
 *
 * Side effect: clears the completed order-list cache so that tab re-fetches
 * fresh data. Callers should also `refetch()` the current view for an
 * immediate update.
 */
export function useRateOrder(
   options: UseRateOrderOptions = {}
): UseRateOrderReturn {
   const { onSuccess } = options;

   const mutationFn = useCallback(
      ({ orderId, rate }: RateOrderVariables) =>
         customerOrdersApi.rate(orderId, rate),
      []
   );

   const { mutate, isLoading, error } = useMutation<
      RateOrderResponse,
      RateOrderVariables
   >(mutationFn, {
      successMessage: 'تم إرسال تقييمك بنجاح',
      errorMessage: 'تعذر إرسال التقييم',
      onSuccess: (response) => {
         clearCachedData(
            generateRequestKey('customer-orders-list', 'completed')
         );
         if (response) onSuccess?.(response);
      },
   });

   return {
      rateOrder: mutate,
      isLoading,
      error,
   };
}

export default useRateOrder;
