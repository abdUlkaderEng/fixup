'use client';

import { workerRequestCompletionApi } from '@/api/worker/orders';
import { useMutation } from '@/hooks/admin/shared';
import { RequestOrderCompletionResponse } from '@/types/entities/order';

export interface UseWorkerRequestCompletionOptions {
   onSuccess?: (orderId: number, message: string) => void;
}

export interface UseWorkerRequestCompletionReturn {
   requestCompletion: (
      orderId: number
   ) => Promise<RequestOrderCompletionResponse>;
   isRequestingCompletion: boolean;
   requestCompletionError: Error | null;
   resetRequestCompletion: () => void;
}

export function useWorkerRequestCompletion(
   options: UseWorkerRequestCompletionOptions = {}
): UseWorkerRequestCompletionReturn {
   const mutation = useMutation<RequestOrderCompletionResponse, number>(
      (orderId) => workerRequestCompletionApi.request(orderId),
      {
         successMessage: 'تم إرسال طلب إكمال الطلب بنجاح',
         errorMessage: 'تعذر إرسال طلب إكمال الطلب',
         onSuccess: (response, orderId) => {
            options.onSuccess?.(orderId, response.message);
         },
      }
   );

   return {
      requestCompletion: mutation.mutateAsync,
      isRequestingCompletion: mutation.isLoading,
      requestCompletionError: mutation.error,
      resetRequestCompletion: mutation.reset,
   };
}
