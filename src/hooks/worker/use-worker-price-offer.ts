'use client';

import { useMutation } from '@/hooks/admin/shared';
import { workerPriceOffersApi } from '@/api/worker';
import type {
   CreateWorkerPriceOfferResponse,
   WorkerPriceOfferDraft,
} from '@/types/entities';

export interface UseWorkerPriceOfferReturn {
   submitPriceOffer: (
      draft: WorkerPriceOfferDraft
   ) => Promise<CreateWorkerPriceOfferResponse>;
   isSubmittingPriceOffer: boolean;
   priceOfferError: Error | null;
   resetPriceOffer: () => void;
}

export function useWorkerPriceOffer(): UseWorkerPriceOfferReturn {
   const mutation = useMutation<
      CreateWorkerPriceOfferResponse,
      WorkerPriceOfferDraft
   >(
      async (draft) =>
         workerPriceOffersApi.create({
            order_id: draft.order_id,
            price: Number(draft.price),
            time_range: draft.time_range.trim(),
         }),
      {
         successMessage: 'تم تجهيز عرض السعر بنجاح',
         errorMessage: 'تعذر إرسال عرض السعر',
      }
   );

   return {
      submitPriceOffer: mutation.mutateAsync,
      isSubmittingPriceOffer: mutation.isLoading,
      priceOfferError: mutation.error,
      resetPriceOffer: mutation.reset,
   };
}
