/**
 * Admin Types - Service Management
 */

import type {
   PaginatedResponse,
   PaginationParams,
   MessageResponse,
} from './shared';
import type { Service } from '@/types/entities/service';

// ============================================
// Service Entity (Re-export from entities)
// ============================================

export type { Service };

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
