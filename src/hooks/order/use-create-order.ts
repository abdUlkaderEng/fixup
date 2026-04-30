'use client';

import { useCallback } from 'react';
import { useMutation } from '@/hooks/admin/shared';
import { ordersApi } from '@/api/orders';
import type {
   CreateOrderRequest,
   CreateOrderResponse,
} from '@/types/entities/order';
import type { UseMutationReturn } from '@/hooks/admin/shared';

export interface UseCreateOrderReturn extends UseMutationReturn<
   CreateOrderResponse,
   CreateOrderRequest
> {
   createOrder: (
      data: CreateOrderRequest
   ) => Promise<CreateOrderResponse | null>;
}

export function useCreateOrder(): UseCreateOrderReturn {
   const mutationFn = useCallback(
      (data: CreateOrderRequest) => ordersApi.create(data),
      []
   );

   const { mutate, mutateAsync, isLoading, error, reset } = useMutation<
      CreateOrderResponse,
      CreateOrderRequest
   >(mutationFn, {
      successMessage: 'تم إرسال الطلب بنجاح',
      errorMessage: 'تعذر إرسال الطلب',
   });

   return {
      createOrder: mutate,
      mutate,
      mutateAsync,
      isLoading,
      error,
      reset,
   };
}

export default useCreateOrder;
