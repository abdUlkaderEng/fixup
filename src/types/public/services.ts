/**
 * Public Services Types
 * Response shapes for public (unauthenticated) service endpoints
 */

import type { Service } from '@/types/admin/services';

// ============================================
// Public API Response Shape
// ============================================

export interface PublicPaginationLinks {
   first: string | null;
   last: string | null;
   prev: string | null;
   next: string | null;
}

export interface PublicPaginationMeta {
   current_page: number;
   from: number;
   last_page: number;
   per_page: number;
   to: number;
   total: number;
}

/**
 * Paginated response for public services endpoint
 * Shape: /services?career_id=1
 */
export interface PublicServicesResponse {
   data: Service[];
   links: PublicPaginationLinks;
   meta: PublicPaginationMeta;
}

// ============================================
// Filters
// ============================================

export interface PublicServiceFilters {
   career_id?: number;
   page?: number;
   perPage?: number;
}
