/**
 * Admin Types - Address/Area Management
 */

import type {
   PaginationMeta,
   PaginationLinks,
   MessageResponse,
} from './shared';
import type { Address } from '@/types/entities/address';

// ============================================
// Address Entity (Re-export from entities)
// ============================================

export type { Address };

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
