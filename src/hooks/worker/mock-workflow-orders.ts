import type {
   WorkerConfirmedOrder,
   WorkerPendingOffer,
} from '@/types/worker/orders-workflow';

export const mockWorkerPendingOffers: WorkerPendingOffer[] = [
   {
      id: 9001,
      order_id: 4012,
      conversation_id: 1201,
      price: '75000.00',
      time_range: 'خلال 24 ساعة',
      sent_at: '2026-05-20T10:00:00.000Z',
      status: 'pending',
      order: {
         id: 4012,
         description: 'صيانة تمديدات كهربائية في غرفة الجلوس',
         scheduled_at: '2026-05-22T08:30:00.000Z',
         status: 'pending',
      },
   },
];

export const mockWorkerConfirmedOrders: WorkerConfirmedOrder[] = [
   {
      id: 7001,
      offer_id: 9002,
      conversation_id: 1202,
      confirmed_at: '2026-05-19T14:20:00.000Z',
      agreed_price: '120000.00',
      time_range: 'غدًا صباحًا',
      customer: {
         id: 221,
         name: 'سارة محمد',
         phone: '+963944000111',
         email: 'sara@example.com',
      },
      order: {
         id: 4021,
         description: 'تصليح تسريب مياه في المطبخ',
         status: 'accepted',
         scheduled_at: '2026-05-22T09:00:00.000Z',
      },
   },
];
