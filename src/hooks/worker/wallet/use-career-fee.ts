'use client';

import { useCallback } from 'react';
import getCareerFee from '@/api/worker/shared/get-fee';
import {
   useFetch,
   generateRequestKey,
   type UseFetchReturn,
} from '@/hooks/admin/shared';
import type { JobFeeResponse } from '@/types/worker/wallet';

export interface UseCareerFeeReturn extends Pick<
   UseFetchReturn<JobFeeResponse>,
   'isLoading' | 'error' | 'refetch'
> {
   fee: number | null;
   hasFee: boolean;
}

export interface UseCareerFeeOptions {
   autoFetch?: boolean;
}

export function useCareerFee(
   options: UseCareerFeeOptions = {}
): UseCareerFeeReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(() => getCareerFee(), []);

   const { data, isLoading, error, refetch } = useFetch<JobFeeResponse>(
      fetcher,
      generateRequestKey('worker-career-fee'),
      {
         autoFetch,
         errorMessage: 'حدث خطأ أثناء جلب رسوم المهنة',
      }
   );

   const fee = data?.data?.fee ?? null;

   return {
      fee,
      hasFee: fee !== null,
      isLoading,
      error,
      refetch,
   };
}

export default useCareerFee;
