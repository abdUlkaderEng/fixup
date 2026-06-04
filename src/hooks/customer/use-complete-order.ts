'use client';

import { useCallback } from 'react';
import {
   clearCachedData,
   generateRequestKey,
   useMutation,
} from '@/hooks/admin/shared';
import { customerOrdersApi } from '@/api/customer';
import type { CompleteOrderResponse } from '@/types/entities/order';

interface CompleteOrderVariables {
   orderId: number;
}

export interface UseCompleteOrderReturn {
   completeOrder: (
      vars: CompleteOrderVariables
   ) => Promise<CompleteOrderResponse | null>;
   isLoading: boolean;
   error: Error | null;
}

export interface UseCompleteOrderOptions {
   /** Fired after the backend confirms the completion. */
   onSuccess?: (response: CompleteOrderResponse) => void;
}

/**
 * Customer mutation: mark an order as complete.
 *
 * Side effect: clears the customer-orders-list cache so tabs refresh.
 */
export function useCompleteOrder(
   options: UseCompleteOrderOptions = {}
): UseCompleteOrderReturn {
   const { onSuccess } = options;

   const mutationFn = useCallback(
      ({ orderId }: CompleteOrderVariables) =>
         customerOrdersApi.complete(orderId),
      []
   );

   const { mutate, isLoading, error } = useMutation<
      CompleteOrderResponse,
      CompleteOrderVariables
   >(mutationFn, {
      successMessage: 'تم إتمام الطلب بنجاح',
      errorMessage: 'تعذر إتمام الطلب',
      onSuccess: (response) => {
         clearCachedData(generateRequestKey('customer-orders-list'));
         if (response) onSuccess?.(response);
      },
   });

   return {
      completeOrder: mutate,
      isLoading,
      error,
   };
}

export default useCompleteOrder;
