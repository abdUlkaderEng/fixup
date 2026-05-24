import { post } from '@/api/admin/shared';
import type {
   CreateWorkerPriceOfferRequest,
   CreateWorkerPriceOfferResponse,
} from '@/types/entities';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

export const workerPriceOffersApi = {
   async create(
      payload: CreateWorkerPriceOfferRequest
   ): Promise<CreateWorkerPriceOfferResponse> {
      return post<
         CreateWorkerPriceOfferResponse,
         CreateWorkerPriceOfferRequest
      >(WORKER_ENDPOINTS.PRICE_OFFERS, payload);
   },
} as const;
