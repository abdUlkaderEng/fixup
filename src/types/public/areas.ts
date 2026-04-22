/**
 * Public Areas Types
 * Response shapes for public (unauthenticated) area endpoints
 */

// ============================================
// Area Entity
// ============================================

export interface PublicArea {
   id: number;
   area_name: string;
   created_at: string;
}

// ============================================
// Pagination
// ============================================

export interface PublicAreaPaginationLinks {
   first: string | null;
   last: string | null;
   prev: string | null;
   next: string | null;
}

export interface PublicAreaPaginationMeta {
   current_page: number;
   from: number;
   last_page: number;
   per_page: number;
   to: number;
   total: number;
}

// ============================================
// API Response
// ============================================

/**
 * Response for GET /areas
 * Full paginated response
 */
export interface PublicAreasResponse {
   data: PublicArea[];
   links: PublicAreaPaginationLinks;
   meta: PublicAreaPaginationMeta;
}

// ============================================
// Filters
// ============================================

export interface PublicAreaFilters {
   page?: number;
   perPage?: number;
}
