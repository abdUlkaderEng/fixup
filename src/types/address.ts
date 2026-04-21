/**
 * Address Types - Backward Compatibility Re-export
 * @deprecated Import from '@/types/admin' instead
 */

export type {
   Address,
   CreateAddressRequest,
   GetAddressesResponse,
   CreateAddressResponse,
   DeleteAddressResponse,
} from './admin/index';

// Re-export pagination types for backward compatibility
export type { PaginationMeta, PaginationLinks } from './admin/index';
