import { apiClient } from '@/lib/axios';
import type { PublicCareersResponse } from '@/types/public/careers';

/**
 * Public Careers API
 * Unauthenticated endpoints for fetching careers data
 * Used across the application for reference data
 */

/**
 * Fetch all careers
 * Public endpoint - no authentication required
 * Response: { data: PublicCareer[] }
 */
export async function getCareers(): Promise<PublicCareersResponse> {
   const url = '/careers';
   const response = await apiClient.get<PublicCareersResponse>(url);
   return response.data;
}

/**
 * Public Careers API namespace
 */
export const publicCareersApi = {
   getAll: getCareers,
} as const;

export default publicCareersApi;
