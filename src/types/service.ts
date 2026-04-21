/**
 * Service Types - Backward Compatibility Re-export
 * @deprecated Import from '@/types/admin' instead
 */

export type {
   Service,
   Career,
   CareerWithTimestamp,
   ServiceFilters,
   CreateServiceRequest,
   UpdateServiceRequest,
   CreateCareerRequest,
   GetCareersResponse,
   CareerResponse,
   DeleteCareerResponse,
   ServiceResponse,
   DeleteServiceResponse,
   PaginatedServicesResponse,
} from './admin/index';

// Re-export PaginatedResponse for backward compatibility
export type { PaginatedResponse, PaginationLink } from './admin/index';
