/**
 * Admin Types - Main Entry Point
 * Consolidated type definitions for all admin operations
 */

// ============================================
// Shared/Common Types
// ============================================
export type {
   PaginationLink,
   PaginatedResponse,
   PaginationMeta,
   PaginationLinks,
   MessageResponse,
   DataResponse,
   CreateResponse,
   PaginationParams,
} from './shared';

// ============================================
// Career Types
// ============================================
export type {
   Career,
   CareerWithTimestamp,
   CreateCareerRequest,
   GetCareersResponse,
   CareerResponse,
   DeleteCareerResponse,
} from './careers';

// ============================================
// Service Types
// ============================================
export type {
   Service,
   ServiceFilters,
   CreateServiceRequest,
   UpdateServiceRequest,
   PaginatedServicesResponse,
   ServiceResponse,
   DeleteServiceResponse,
} from './services';

// ============================================
// Address Types
// ============================================
export type {
   Address,
   CreateAddressRequest,
   GetAddressesResponse,
   CreateAddressResponse,
   DeleteAddressResponse,
} from './addresses';

// ============================================
// Worker Types
// ============================================
export type {
   WorkerStatus,
   Worker,
   WorkerFilters,
   UpdateWorkerRequest,
   PaginatedWorkersResponse,
   UpdateWorkerResponse,
   DeleteWorkerResponse,
} from './workers';
