'use client';

import { useCallback } from 'react';
import { careersApi } from '@/api/admin';
import { useFetch, generateRequestKey } from './shared';
import type { CareerWithTimestamp } from '@/types/admin/careers';

export interface UseCareersReturn {
   careers: CareerWithTimestamp[];
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
}

export interface UseCareersOptions {
   autoFetch?: boolean;
}

/**
 * Hook for fetching careers list with timestamps
 */
export function useCareers(options: UseCareersOptions = {}): UseCareersReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(async () => {
      const response = await careersApi.getList();
      return response.data;
   }, []);

   const { data, isLoading, error, refetch } = useFetch<CareerWithTimestamp[]>(
      fetcher,
      generateRequestKey('careers-list'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب المهن',
      }
   );
   return {
      careers: data ?? [],
      isLoading,
      error,
      refetch,
   };
}

export default useCareers;
