import type { OrderStatus } from '@/types/entities/order';

export interface WorkerOfferOrderBackend {
   id: number;
   user_id: number;
   description: string;
   priority: number;
   status: OrderStatus;
   expires_at: string;
   address_id: number;
   career_id: number;
   scheduled_at: string;
   created_at: string;
   updated_at: string;
   address?: {
      id: number;
      user_id: number;
      latitude: string;
      longitude: string;
      detailed_address: string;
      area_address_id: number;
      created_at: string;
      updated_at: string;
      area_address?: {
         id: number;
         area_name: string;
         created_at: string | null;
         updated_at: string | null;
      } | null;
   } | null;
   user?: {
      id: number;
      name: string;
      email: string;
      phone_number?: string | null;
   } | null;
}

export interface WorkerOfferBackend {
   id: number;
   worker_id: number;
   order_id: number;
   conversation_id: number | null;
   price: string;
   time_range: string;
   status: 'pending' | 'accepted' | 'rejected';
   created_at: string;
   updated_at: string;
   order: WorkerOfferOrderBackend;
}

export interface WorkerOffersApiResponse {
   status: boolean;
   data: WorkerOfferBackend[];
}

export interface WorkerAcceptedOfferOrderUserBackend {
   id: number;
   name: string;
   email: string;
   email_verified_at: string | null;
   created_at: string;
   updated_at: string;
   is_active: number;
   phone_number: string | null;
   profile_image: string | null;
   birth_date: string | null;
   fcm_token: string | null;
   role: string;
}

export interface WorkerAcceptedOfferOrderAddressAreaBackend {
   id: number;
   area_name: string;
   created_at: string | null;
   updated_at: string | null;
}

export interface WorkerAcceptedOfferOrderAddressBackend {
   id: number;
   user_id: number;
   latitude: string;
   longitude: string;
   detailed_address: string;
   area_address_id: number;
   created_at: string;
   updated_at: string;
   area_address: WorkerAcceptedOfferOrderAddressAreaBackend | null;
}

export interface WorkerAcceptedOfferOrderBackend {
   id: number;
   user_id: number;
   description: string;
   priority: number;
   status: OrderStatus;
   expires_at: string;
   address_id: number;
   career_id: number;
   scheduled_at: string;
   created_at: string;
   updated_at: string;
   user: WorkerAcceptedOfferOrderUserBackend | null;
   address: WorkerAcceptedOfferOrderAddressBackend | null;
}

export interface WorkerAcceptedOfferBackend {
   id: number;
   worker_id: number;
   order_id: number;
   conversation_id: number | null;
   price: string;
   time_range: string;
   status: 'accepted';
   created_at: string;
   updated_at: string;
   order: WorkerAcceptedOfferOrderBackend;
}

export interface WorkerAcceptedOffersApiResponse {
   status: boolean;
   data: WorkerAcceptedOfferBackend[];
}

export type WorkerOfferStatus = 'pending' | 'accepted' | 'rejected';

export interface WorkerPendingOffer {
   id: number;
   order_id: number;
   conversation_id: number;
   price: string;
   time_range: string;
   status: WorkerOfferStatus;
   sent_at: string;
   order: {
      id: number;
      description: string;
      scheduled_at: string;
      status: OrderStatus;
      priority?: number | null;
   };
}

export interface WorkerConfirmedOrder {
   id: number;
   offer_id: number;
   conversation_id: number;
   agreed_price: string;
   time_range: string;
   confirmed_at: string;
   order: {
      id: number;
      description: string;
      scheduled_at: string;
      status: OrderStatus;
      area_name: string;
      detailed_address: string;
      latitude: string;
      longitude: string;
   };
   customer: {
      id: number;
      name: string;
      email: string;
      phone: string;
   };
}
