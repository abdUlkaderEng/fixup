import { get } from '@/api/admin/shared';
import type {
   WorkerAcceptedOfferBackend,
   WorkerAcceptedOffersApiResponse,
   WorkerConfirmedOrder,
} from '@/types/worker/orders-workflow';

const ENDPOINT = '/worker/offers/accepted' as const;

function mapConfirmedOrder(
   offer: WorkerAcceptedOfferBackend
): WorkerConfirmedOrder {
   return {
      id: offer.id,
      offer_id: offer.id,
      conversation_id: offer.conversation_id ?? 0,
      agreed_price: offer.price,
      time_range: offer.time_range,
      confirmed_at: offer.updated_at,
      order: {
         id: offer.order.id,
         description: offer.order.description,
         scheduled_at: offer.order.scheduled_at,
         status: offer.order.status,
         area_name: offer.order.address?.area_address?.area_name ?? 'غير متوفر',
         detailed_address: offer.order.address?.detailed_address ?? 'غير متوفر',
         latitude: offer.order.address?.latitude ?? '0',
         longitude: offer.order.address?.longitude ?? '0',
      },
      customer: {
         id: offer.order.user?.id ?? 0,
         name: offer.order.user?.name ?? 'غير متوفر',
         email: offer.order.user?.email ?? 'غير متوفر',
         phone: offer.order.user?.phone_number ?? 'غير متوفر',
      },
   };
}

export const workerConfirmedOrdersApi = {
   async getAll(): Promise<WorkerConfirmedOrder[]> {
      const response = await get<WorkerAcceptedOffersApiResponse>(ENDPOINT);
      return response.data.map(mapConfirmedOrder);
   },
};
