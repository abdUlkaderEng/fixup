'use client';

import { useCallback } from 'react';
import { statisticsApi } from '@/api/admin';
import { useFetch, generateRequestKey } from './shared';
import type { AdminStatistics } from '@/types/admin/statistics';

export interface UseStatisticsReturn {
   statistics: AdminStatistics | null;
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export interface UseStatisticsOptions {
   autoFetch?: boolean;
}

/**
 * Hook for fetching admin dashboard statistics (aggregate counts).
 * Read-only — no mutations.
 */
export function useStatistics(
   options: UseStatisticsOptions = {}
): UseStatisticsReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(() => statisticsApi.getAll(), []);

   const { data, isLoading, error, refetch } = useFetch<AdminStatistics>(
      fetcher,
      generateRequestKey('admin-statistics'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب الإحصائيات',
      }
   );

   return {
      statistics: data,
      isLoading,
      error,
      refetch,
   };
}

export default useStatistics;
