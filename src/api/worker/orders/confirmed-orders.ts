import { get } from '@/api/admin/shared';
import type {
   WorkerAcceptedOfferBackend,
   WorkerAcceptedOffersApiResponse,
   WorkerConfirmedOrder,
} from '@/types/worker/orders-workflow';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

const UNAVAILABLE = 'غير متوفر';

function mapConfirmedOrder(
   offer: WorkerAcceptedOfferBackend
): WorkerConfirmedOrder {
   const { order } = offer;
   const address = order.address;
   const user = order.user;

   return {
      id: offer.id,
      offer_id: offer.id,
      conversation_id: offer.conversation_id ?? 0,
      agreed_price: offer.price,
      time_range: offer.time_range,
      confirmed_at: offer.updated_at,
      order: {
         id: order.id,
         description: order.description,
         scheduled_at: order.scheduled_at,
         status: order.status,
         area_name: address?.area_address?.area_name ?? UNAVAILABLE,
         detailed_address: address?.detailed_address ?? UNAVAILABLE,
         latitude: address?.latitude ?? '0',
         longitude: address?.longitude ?? '0',
      },
      customer: {
         id: user?.id ?? 0,
         name: user?.name ?? UNAVAILABLE,
         email: user?.email ?? UNAVAILABLE,
         phone: user?.phone_number ?? UNAVAILABLE,
      },
   };
}

export const workerConfirmedOrdersApi = {
   async getAll(): Promise<WorkerConfirmedOrder[]> {
      const response = await get<WorkerAcceptedOffersApiResponse>(
         WORKER_ENDPOINTS.CONFIRMED_OFFERS
      );
      return response.data.map(mapConfirmedOrder);
   },
} as const;
