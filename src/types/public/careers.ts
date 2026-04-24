/**
 * Public Careers Types
 * Response shapes for public (unauthenticated) career endpoints
 */

import type { CareerWithTimestamp } from '@/types/entities/career';

// ============================================
// Career Entity (Re-export from entities)
// ============================================

export type { CareerWithTimestamp as PublicCareer };

// ============================================
// API Response
// ============================================

/**
 * Response for GET /careers
 * Simple list response without pagination
 */
export interface PublicCareersResponse {
   data: CareerWithTimestamp[];
}
