import { post } from '@/api/admin/shared';
import type {
   CreateWorkerPriceOfferRequest,
   CreateWorkerPriceOfferResponse,
} from '@/types/entities';

const ENDPOINT = '/price-offers' as const;

export const workerPriceOffersApi = {
   async create(
      payload: CreateWorkerPriceOfferRequest
   ): Promise<CreateWorkerPriceOfferResponse> {
      return post<
         CreateWorkerPriceOfferResponse,
         CreateWorkerPriceOfferRequest
      >(ENDPOINT, payload);
   },
};
