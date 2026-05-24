import { get } from '@/api/admin/shared';
import type {
   WorkerOfferBackend,
   WorkerOffersApiResponse,
   WorkerPendingOffer,
} from '@/types/worker/orders-workflow';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

function mapPendingOffer(offer: WorkerOfferBackend): WorkerPendingOffer {
   return {
      id: offer.id,
      order_id: offer.order_id,
      conversation_id: offer.conversation_id ?? 0,
      price: offer.price,
      time_range: offer.time_range,
      status: offer.status,
      sent_at: offer.created_at,
      order: {
         id: offer.order.id,
         description: offer.order.description,
         scheduled_at: offer.order.scheduled_at,
         status: offer.order.status,
         priority: offer.order.priority ?? null,
      },
   };
}

export const workerPendingOffersApi = {
   async getAll(): Promise<WorkerPendingOffer[]> {
      const response = await get<WorkerOffersApiResponse>(
         WORKER_ENDPOINTS.PENDING_OFFERS
      );
      return response.data.map(mapPendingOffer);
   },
} as const;
