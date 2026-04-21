/**
 * Worker Types - Backward Compatibility Re-export
 * @deprecated Import from '@/types/admin' instead
 */

export type {
   WorkerStatus,
   Worker,
   WorkerFilters,
   PaginatedWorkersResponse,
} from './admin/index';

// Re-export pagination types for backward compatibility
export type { PaginatedResponse, PaginationLink } from './admin/index';
