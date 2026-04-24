/**
 * Admin Types - Address/Area Management
 * The admin manages Area records (area_name list), not user addresses
 */

import type {
   PaginationMeta,
   PaginationLinks,
   MessageResponse,
} from './shared';
import type { Area } from '@/types/entities/address';

export type { Area as Address };

export interface CreateAddressRequest {
   area_name: string;
}

export interface GetAddressesResponse {
   data: Area[];
   links: PaginationLinks;
   meta: PaginationMeta;
}

export type CreateAddressResponse = Area;

export type DeleteAddressResponse = MessageResponse;
