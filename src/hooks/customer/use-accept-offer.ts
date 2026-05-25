'use client';

import { useCallback } from 'react';
import {
   clearCachedData,
   generateRequestKey,
   useMutation,
} from '@/hooks/admin/shared';
import { customerOrdersApi } from '@/api/customer';
import type { AcceptOfferResponse } from '@/types/entities/order';

interface AcceptOfferVariables {
   orderId: number;
   offerId: number;
}

export interface UseAcceptOfferReturn {
   acceptOffer: (
      vars: AcceptOfferVariables
   ) => Promise<AcceptOfferResponse | null>;
   isLoading: boolean;
   error: Error | null;
}

export interface UseAcceptOfferOptions {
   /** Fired after the backend confirms the accept. */
   onSuccess?: (response: AcceptOfferResponse) => void;
}

/**
 * Customer mutation: accept a worker's price offer for an order.
 *
 * Side effect: clears the customer-orders-list cache so the next render
 * of useCustomerOrders re-fetches the now-updated order. Callers should
 * still trigger `refetch()` for an immediate refresh of the current view.
 */
export function useAcceptOffer(
   options: UseAcceptOfferOptions = {}
): UseAcceptOfferReturn {
   const { onSuccess } = options;

   const mutationFn = useCallback(
      ({ orderId, offerId }: AcceptOfferVariables) =>
         customerOrdersApi.acceptOffer(orderId, offerId),
      []
   );

   const { mutate, isLoading, error } = useMutation<
      AcceptOfferResponse,
      AcceptOfferVariables
   >(mutationFn, {
      successMessage: 'تم قبول العرض بنجاح',
      errorMessage: 'تعذر قبول العرض',
      onSuccess: (response) => {
         clearCachedData(generateRequestKey('customer-orders-list'));
         if (response) onSuccess?.(response);
      },
   });

   return {
      acceptOffer: mutate,
      isLoading,
      error,
   };
}

export default useAcceptOffer;
