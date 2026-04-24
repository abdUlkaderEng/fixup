/**
 * Public Types - Index
 * Re-export all public API types for clean imports
 */

// Shared pagination types (preferred)
export type {
   PaginationLinks,
   PaginationMeta,
   PaginationParams,
} from '@/types/admin/shared';

// Careers
export type { PublicCareer, PublicCareersResponse } from './careers';

// Areas
export type {
   PublicArea,
   PublicAreaFilters,
   PublicAreasResponse,
   // Backward compatibility - prefer PaginationLinks/Meta from shared
   PublicAreaPaginationLinks,
   PublicAreaPaginationMeta,
} from './areas';
