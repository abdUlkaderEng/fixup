'use client';

import { useCallback } from 'react';
import {
   clearCachedData,
   generateRequestKey,
   useMutation,
} from '@/hooks/admin/shared';
import { customerOrdersApi } from '@/api/customer';
import type { CancelOrderResponse } from '@/types/entities/order';

interface CancelOrderVariables {
   orderId: number;
}

export interface UseCancelOrderReturn {
   cancelOrder: (
      vars: CancelOrderVariables
   ) => Promise<CancelOrderResponse | null>;
   isLoading: boolean;
   error: Error | null;
}

export interface UseCancelOrderOptions {
   /** Fired after the backend confirms the cancellation. */
   onSuccess?: (response: CancelOrderResponse) => void;
}

/**
 * Customer mutation: cancel an order that hasn't received any price offers.
 *
 * Side effect: clears the pending/cancelled order-list caches so those tabs
 * re-fetch fresh data. Callers should also `refetch()` the current view for an
 * immediate update.
 */
export function useCancelOrder(
   options: UseCancelOrderOptions = {}
): UseCancelOrderReturn {
   const { onSuccess } = options;

   const mutationFn = useCallback(
      ({ orderId }: CancelOrderVariables) => customerOrdersApi.cancel(orderId),
      []
   );

   const { mutate, isLoading, error } = useMutation<
      CancelOrderResponse,
      CancelOrderVariables
   >(mutationFn, {
      successMessage: 'تم إلغاء الطلب بنجاح',
      errorMessage: 'تعذر إلغاء الطلب',
      onSuccess: (response) => {
         clearCachedData(generateRequestKey('customer-orders-list', 'pending'));
         clearCachedData(
            generateRequestKey('customer-orders-list', 'cancelled')
         );
         if (response) onSuccess?.(response);
      },
   });

   return {
      cancelOrder: mutate,
      isLoading,
      error,
   };
}

export default useCancelOrder;
