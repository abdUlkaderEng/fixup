/**
 * Order Entity - Unified Type Definition
 * Single source of truth for Order across the application
 */

import type { Service } from './service';
import type { Worker } from './worker';

// ============================================
// Nested Address in Order Response
// ============================================

export interface OrderAddress {
   id: number;
   latitude: number;
   longitude: number;
   detailed_address: string;
}

// ============================================
// Nested Address in Order Request
// ============================================

export interface OrderAddressRequest {
   latitude: number;
   longitude: number;
   detailed_address: string;
   area_address_id: number;
}

// ============================================
// Order Image
// ============================================

export interface OrderImage {
   id: number;
   order_id: number;
   path: string;
}

// ============================================
// Order User (embedded in response)
// ============================================

export interface OrderUser {
   id: number;
   name: string;
   email: string;
}

// ============================================
// Order Entity
// ============================================

export type OrderStatus =
   | 'pending'
   | 'accepted'
   | 'completion_requested'
   | 'completed'
   | 'cancelled';

/**
 * Customer-facing order statuses. Extends the shared {@link OrderStatus} with
 * the two extra terminal states the customer orders endpoint can return.
 */
export type CustomerOrderStatus = OrderStatus | 'rejected' | 'expired';

/** The statuses customers can filter their orders by (one tab each). */
export type CustomerOrderFilterStatus =
   | 'pending'
   | 'accepted'
   | 'completed'
   | 'rejected'
   | 'expired'
   | 'cancelled'
   | 'completion_requested';

/** Query filters accepted by the customer orders list endpoint. */
export interface CustomerOrderFilters {
   status?: CustomerOrderFilterStatus;
}

export interface Order {
   id: number;
   user_id: number;
   description: string;
   address_id: number;
   scheduled_at: string;
   expires_at: string;
   status: OrderStatus;
   created_at: string;
   updated_at: string;
   services: Pick<Service, 'id' | 'name' | 'career_id'>[];
   address: OrderAddress;
   worker: Worker | null;
   user: OrderUser;
   images: OrderImage[];
}

// ============================================
// Worker Orders — response shape from /worker/orders
// Kept separate to avoid polluting the shared Order entity
// ============================================

export interface WorkerOrderAreaAddress {
   id: number;
   area_name: string;
}

export interface WorkerOrderAddress {
   id: number;
   latitude: number;
   longitude: number;
   detailed_address: string;
   area_address: WorkerOrderAreaAddress;
}

export interface WorkerOrderImage {
   id: number;
   url: string;
}

export interface WorkerOrderService {
   id: number;
   name: string;
}

export interface WorkerOrderCareer {
   id: number;
   name: string;
}

export type WorkerOrderPriority = 'high' | 'normal';

export interface CustomerOrderAreaAddress {
   id: number;
   name: string;
}

export interface CustomerOrderAddress {
   id: number;
   user_id: number;
   latitude: string;
   longitude: string;
   detailed_address: string;
   area_address_id: number;
   area_address?: CustomerOrderAreaAddress | null;
   created_at: string;
   updated_at: string;
}

export interface CustomerOrderImage {
   id: number;
   url?: string;
   path?: string;
}

export interface ServicePivot {
   order_id: number;
   service_id: number;
}

export interface CustomerOrderService {
   id: number;
   career_id: number;
   name: string;
   created_at: string;
   updated_at: string;
   pivot: ServicePivot;
}

export interface OrderOffer {
   id: number;
   worker_id: number;
   order_id: number;
   conversation_id: number | null;
   price: string;
   time_range: string;
   status: string;
   created_at: string;
   updated_at: string;
}

export interface CustomerOrderCareer {
   id: number;
   name: string;
}

export interface CustomerOrderWorkerAreaAddress {
   id: number | null;
   area_name: string | null;
}

export interface CustomerOrderWorkerAddress {
   latitude: string | null;
   longitude: string | null;
   detailed_address: string | null;
   area_address: CustomerOrderWorkerAreaAddress | null;
}

export interface CustomerOrderWorkerUser {
   id: number;
   name: string;
   profile_image: string | null;
   phone?: string | null;
   address: CustomerOrderWorkerAddress | null;
}

export interface CustomerOrderWorkerCareer {
   id: number;
   name: string;
}

export interface CustomerOrderWorkerService {
   id: number;
   name: string;
}

export interface CustomerOrderWorker {
   id: number;
   about: string | null;
   status: string;
   years_experience: number | null;
   rating?: number | null;
   user: CustomerOrderWorkerUser;
   career: CustomerOrderWorkerCareer | null;
   services: CustomerOrderWorkerService[];
}

export interface CustomerOrder {
   id: number;
   user_id: number;
   description: string;
   status: CustomerOrderStatus;
   priority: number;
   address_id: number;
   career_id: number;
   scheduled_at: string;
   expires_at: string;
   created_at: string;
   updated_at: string;
   /**
    * Whether the customer has already rated this order's worker. Backend sends
    * a tinyint (0/1); may also arrive as a boolean. Truthy means "already
    * rated" — the rate action is hidden so a second rating can't be submitted.
    */
   is_rating?: boolean | number | null;
   career?: CustomerOrderCareer | null;
   services: CustomerOrderService[];
   images: CustomerOrderImage[];
   address: CustomerOrderAddress;
   offers: OrderOffer[];
   worker?: CustomerOrderWorker | null;
}

export interface CustomerOrdersResponse {
   data: CustomerOrder[];
}

export interface WorkerOrder {
   id: number;
   user_id: number;
   description: string;
   status: OrderStatus;
   expires_at: string;
   scheduled_at: string;
   priority: WorkerOrderPriority;
   address_id: number;
   career_id: number;
   career: WorkerOrderCareer;
   services: WorkerOrderService[];
   images: WorkerOrderImage[];
   address: WorkerOrderAddress;
   services_count: number;
   matched_services_count: number;
}

export interface WorkerOrdersResponse {
   data: WorkerOrder[];
}

// ============================================
// API Request / Response
// ============================================

export interface CreateOrderRequest {
   description: string;
   scheduled_at: string;
   priority: boolean;
   career_id: number;
   services: number[];
   images: File[];
   address: OrderAddressRequest;
}

export interface CreateOrderResponse {
   message: string;
   data: Order;
}

// ============================================
// Accept Offer
// ============================================

export interface AcceptOfferResponse {
   message: string;
   order: Order;
}

// ============================================
// Request Completion
// ============================================

export interface RequestOrderCompletionResponse {
   message: string;
}

// ============================================
// Complete Order
// ============================================
export interface CompleteOrderResponse {
   message: string;
}

// ============================================
// Cancel Order
// ============================================

export interface CancelOrderResponse {
   message: string;
}

// ============================================
// Rate Order
// ============================================

export interface RateOrderRequest {
   order_id: number;
   /** Integer star rating, 1–5. */
   rate: number;
}

export interface RateOrderResponse {
   message: string;
}
