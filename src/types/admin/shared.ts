/**
 * Admin Types - Shared/Common Types
 * Reusable pagination, response wrappers, and base interfaces
 */

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

export interface PaginationMeta {
   current_page: number;
   from: number;
   last_page: number;
   per_page: number;
   to: number;
   total: number;
}

export interface PaginationLinks {
   first: string | null;
   last: string | null;
   prev: string | null;
   next: string | null;
}

// ============================================
// Common Response Wrappers
// ============================================

export interface MessageResponse {
   message: string;
}

export interface DataResponse<T> {
   data: T;
}

export interface CreateResponse<T> extends MessageResponse {
   [key: string]: T | string;
}

// ============================================
// Common Filters
// ============================================

export interface PaginationParams {
   page?: number;
   perPage?: number;
}
