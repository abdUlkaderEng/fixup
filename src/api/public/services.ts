import { apiClient } from '@/lib/axios';
import type {
   PublicServicesResponse,
   PublicServiceFilters,
} from '@/types/public/services';

/**
 * Public Services API
 * Unauthenticated endpoints for fetching services data
 * Used across the application for reference data
 */

/**
 * Build query string for service filters
 */
function buildQueryString(filters: PublicServiceFilters): string {
   const params = new URLSearchParams();

   if (filters.career_id !== undefined && filters.career_id !== null) {
      params.append('career_id', String(filters.career_id));
   }
   if (filters.page !== undefined && filters.page > 1) {
      params.append('page', String(filters.page));
   }
   if (filters.perPage !== undefined && filters.perPage > 0) {
      params.append('per_page', String(filters.perPage));
   }

   const query = params.toString();
   return query ? `?${query}` : '';
}

/**
 * Fetch services with optional filtering by career and pagination
 * Public endpoint - no authentication required
 */
export async function getServices(
   filters: PublicServiceFilters = {}
): Promise<PublicServicesResponse> {
   const queryString = buildQueryString(filters);
   const url = `/services${queryString}`;
   const response = await apiClient.get<PublicServicesResponse>(url);
   return response.data;
}

/**
 * Public Services API namespace
 */
export const publicServicesApi = {
   getAll: getServices,
} as const;

export default publicServicesApi;
