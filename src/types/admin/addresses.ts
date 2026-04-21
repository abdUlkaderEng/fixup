/**
 * Admin Types - Address/Area Management
 */

import type {
   PaginationMeta,
   PaginationLinks,
   MessageResponse,
} from './shared';

// ============================================
// Address Entity
// ============================================

export interface Address {
   id: number;
   area_name: string;
   created_at: string;
}

// ============================================
// API Requests
// ============================================

export interface CreateAddressRequest {
   area_name: string;
}

// ============================================
// API Responses
// ============================================

export interface GetAddressesResponse {
   data: Address[];
   links: PaginationLinks;
   meta: PaginationMeta;
}

export type CreateAddressResponse = Address;

export type DeleteAddressResponse = MessageResponse;
