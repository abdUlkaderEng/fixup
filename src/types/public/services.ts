/**
 * Public Services Types
 * Response shapes for public (unauthenticated) service endpoints
 */

import type { Service } from '@/types/admin/services';
import type {
   PaginationLinks,
   PaginationMeta,
   PaginationParams,
} from '@/types/admin/shared';

// ============================================
// Public API Response Shape
// ============================================

/**
 * Paginated response for public services endpoint
 * Shape: /services?career_id=1
 */
export interface PublicServicesResponse {
   data: Service[];
   links: PaginationLinks;
   meta: PaginationMeta;
}

// ============================================
// Filters
// ============================================

export interface PublicServiceFilters extends PaginationParams {
   career_id?: number;
}

// ============================================
// Backward Compatibility Aliases
// ============================================

/**
 * @deprecated Use PaginationLinks from '@/types/admin/shared' instead
 */
export type PublicPaginationLinks = PaginationLinks;

/**
 * @deprecated Use PaginationMeta from '@/types/admin/shared' instead
 */
export type PublicPaginationMeta = PaginationMeta;
