// ============================================
// Admin API - Backward Compatibility Layer
// ============================================
// This file re-exports from the new modular admin API structure.
// For new code, prefer importing directly from '@/api/admin' or
// use individual domain APIs (careersApi, servicesApi, etc.)
//
// New structure:
//   - '@/api/admin' - Main entry with all exports
//   - '@/api/admin/careers' - Career operations
//   - '@/api/admin/services' - Service operations
//   - '@/api/admin/addresses' - Address operations
//   - '@/api/admin/workers' - Worker operations

export {
   adminApi,
   careersApi,
   servicesApi,
   addressesApi,
   workersApi,
   AdminApiError,
   handleApiError,
   buildQueryString,
   buildWorkerQuery,
   buildServiceQuery,
   get,
   post,
   put,
   del,
   ENDPOINTS,
} from './admin/index';

export type {
   UpdateWorkerRequest,
   UpdateWorkerResponse,
   DeleteWorkerResponse,
   PaginationParams,
   WorkerFilters,
   ServiceFilters,
} from './admin/index';

export { default } from './admin/index';
