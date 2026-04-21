/**
 * Admin Types - Service Management
 */

import type {
   PaginatedResponse,
   PaginationParams,
   MessageResponse,
} from './shared';

// ============================================
// Service Entity
// ============================================

export interface Service {
   id: number;
   name: string;
   career_id: number;
   created_at: string;
}

// ============================================
// Filters
// ============================================

export interface ServiceFilters extends PaginationParams {
   career_id?: number;
}

// ============================================
// API Requests
// ============================================

export interface CreateServiceRequest {
   name: string;
   career_id: number;
}

export interface UpdateServiceRequest {
   name?: string;
   career_id?: number;
}

// ============================================
// API Responses
// ============================================

export type PaginatedServicesResponse = PaginatedResponse<Service>;

export interface ServiceResponse extends MessageResponse {
   service: Service;
}

export type DeleteServiceResponse = MessageResponse;
