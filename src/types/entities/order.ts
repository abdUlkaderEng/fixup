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

export type OrderStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

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
   latitude: number;
   longitude: number;
   detailed_address: string;
   area_address?: CustomerOrderAreaAddress | null;
}

export interface CustomerOrderImage {
   id: number;
   url?: string;
   path?: string;
}

export interface CustomerOrderCareer {
   id: number;
   name: string;
}

export interface CustomerOrderWorker {
   id: number;
   name: string;
   phone?: string | null;
   rating?: number | null;
}

export interface CustomerOrder {
   id: number;
   user_id: number;
   description: string;
   status: OrderStatus;
   scheduled_at: string;
   expires_at: string;
   created_at: string;
   updated_at: string;
   priority?: WorkerOrderPriority | boolean;
   career?: CustomerOrderCareer | null;
   services: WorkerOrderService[];
   images: CustomerOrderImage[];
   address: CustomerOrderAddress;
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
   address: OrderAddressRequest;
}

export interface CreateOrderResponse {
   message: string;
   data: Order;
}
