/**
 * Service Types - Type definitions for admin services management
 */

// ============================================
// Service Entity
// ============================================
export interface Service {
   id: number;
   name: string;
   career_id: number;
   created_at: string;
}

// ============================================
// Career Entity (for dropdown)
// ============================================
export interface Career {
   id: number;
   name: string;
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

export type PaginatedServicesResponse = PaginatedResponse<Service>;

// ============================================
// Filters
// ============================================
export interface ServiceFilters {
   career_id?: number;
   page?: number;
   perPage?: number;
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
export interface ServiceResponse {
   message: string;
   service: Service;
}

export interface DeleteServiceResponse {
   message: string;
}
