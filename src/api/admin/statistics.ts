import { get, ENDPOINTS } from './shared';
import type { AdminStatistics } from '@/types/admin/statistics';

/**
 * Statistics API Module
 * Handles read-only dashboard aggregate counts
 */

export const statisticsApi = {
   /**
    * Fetch dashboard statistics (aggregate counts)
    */
   async getAll(): Promise<AdminStatistics> {
      return await get<AdminStatistics>(ENDPOINTS.STATISTICS.BASE);
   },
} as const;

export default statisticsApi;
