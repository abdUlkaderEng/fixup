import { apiClient } from '@/lib/axios';
import type {
   PublicAreasResponse,
   PublicAreaFilters,
} from '@/types/public/areas';

/**
 * Public Areas API
 * Unauthenticated endpoints for fetching areas/addresses data
 * Used across the application for reference data
 */

/**
 * Fetch all areas with pagination
 * Public endpoint - no authentication required
 * Response: { data: PublicArea[], links: {...}, meta: {...} }
 */
export async function getAreas(
   filters: PublicAreaFilters = {}
): Promise<PublicAreasResponse> {
   const { page = 1, perPage = 20 } = filters;
   const params = new URLSearchParams();
   if (page > 1) params.append('page', String(page));
   if (perPage > 0) params.append('per_page', String(perPage));

   const query = params.toString();
   const url = `/areas${query ? `?${query}` : ''}`;
   const response = await apiClient.get<PublicAreasResponse>(url);
   return response.data;
}

/**
 * Public Areas API namespace
 */
export const publicAreasApi = {
   getAll: getAreas,
} as const;

export default publicAreasApi;
