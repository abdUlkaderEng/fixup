/**
 * Admin Types - Career Management
 */

import type { MessageResponse } from './shared';
import type { Career, CareerWithTimestamp } from '@/types/entities/career';

// ============================================
// Career Entity (Re-export from entities)
// ============================================

export type { Career, CareerWithTimestamp };

// ============================================
// API Requests
// ============================================

export interface CreateCareerRequest {
   name: string;
}

// ============================================
// API Responses
// ============================================

export interface GetCareersResponse {
   data: CareerWithTimestamp[];
}

export interface CareerResponse extends MessageResponse {
   career: CareerWithTimestamp;
}

export type DeleteCareerResponse = MessageResponse;
