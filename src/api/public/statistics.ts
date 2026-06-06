import { apiClient } from '@/lib/axios';
import type {
   HomepageStatistics,
   HomepageStatisticsResponse,
} from '@/types/public/statistics';

/**
 * Public Statistics API
 * Unauthenticated endpoints for aggregate platform figures.
 */

/**
 * Fetch the public homepage statistics (total customers + workers).
 *
 * Endpoint: GET /statistics/homepage
 * Response: { users_count, workers_count }
 */
export async function getHomepageStatistics(): Promise<HomepageStatistics> {
   const response = await apiClient.get<
      HomepageStatisticsResponse | { data: HomepageStatisticsResponse }
   >('/statistics/homepage');

   // Tolerate both a bare object and a Laravel `{ data: … }` envelope, and
   // coerce to numbers in case the backend serialises the counts as strings.
   const raw = 'data' in response.data ? response.data.data : response.data;

   return {
      users_count: Number(raw.users_count) || 0,
      workers_count: Number(raw.workers_count) || 0,
   };
}

/**
 * Public Statistics API namespace
 */
export const statisticsApi = {
   getHomepage: getHomepageStatistics,
} as const;

export default statisticsApi;
