/**
 * Public Areas Types
 * Response shapes for public (unauthenticated) area endpoints
 */

import type {
   PaginationLinks,
   PaginationMeta,
   PaginationParams,
} from '@/types/admin/shared';
import type { Area } from '@/types/entities/address';

// ============================================
// Area Entity (Re-export from entities)
// ============================================

export type { Area as PublicArea };

// ============================================
// API Response
// ============================================

/**
 * Response for GET /areas
 * Full paginated response
 */
export interface PublicAreasResponse {
   data: Area[];
   links: PaginationLinks;
   meta: PaginationMeta;
}

// ============================================
// Filters
// ============================================

export interface PublicAreaFilters extends PaginationParams {}

// ============================================
// Backward Compatibility Aliases
// ============================================

/**
 * @deprecated Use PaginationLinks from '@/types/admin/shared' instead
 */
export type PublicAreaPaginationLinks = PaginationLinks;

/**
 * @deprecated Use PaginationMeta from '@/types/admin/shared' instead
 */
export type PublicAreaPaginationMeta = PaginationMeta;
