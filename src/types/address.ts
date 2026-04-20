/**
 * Address Types - Type definitions for admin addresses management
 */

// ============================================
// Address Entity
// ============================================
export interface Address {
   id: number;
   area_name: string;
   created_at: string;
}

// ============================================
// Pagination
// ============================================
export interface PaginationLink {
   url: string | null;
   label: string;
   active: boolean;
}

export interface PaginatedResponse<T> {
   current_page: number;
   data: T[];
   first_page_url: string;
   from: number;
   last_page: number;
   last_page_url: string;
   links: PaginationLink[];
   next_page_url: string | null;
   path: string;
   per_page: number;
   prev_page_url: string | null;
   to: number;
   total: number;
}

export type PaginatedAddressesResponse = PaginatedResponse<Address>;

// ============================================
// API Requests
// ============================================
export interface CreateAddressRequest {
   area_name: string;
}

// ============================================
// Pagination Links & Meta
// ============================================
export interface PaginationLink {
   url: string | null;
   label: string;
   active: boolean;
}

export interface PaginationMeta {
   current_page: number;
   from: number;
   last_page: number;
   per_page: number;
   to: number;
   total: number;
}

// ============================================
// API Responses
// ============================================

/**
 * GET /admin/services response
 * {
 *   "data": [...],
 *   "links": { pagination links... },
 *   "meta": { pagination meta... }
 * }
 */
export interface GetAddressesResponse {
   data: Address[];
   links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
   };
   meta: PaginationMeta;
}

/**
 * POST /admin/services response
 * {
 *   "id": 1,
 *   "area_name": "Downtown",
 *   "created_at": "2024-01-01 12:00:00"
 * }
 */
export type CreateAddressResponse = Address;

export interface DeleteAddressResponse {
   message: string;
}
