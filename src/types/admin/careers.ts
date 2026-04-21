/**
 * Admin Types - Career Management
 */

import type { MessageResponse } from './shared';

// ============================================
// Career Entity
// ============================================

export interface Career {
   id: number;
   name: string;
}

export interface CareerWithTimestamp extends Career {
   created_at: string;
}

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
