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
