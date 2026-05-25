'use client';

import { useCallback, useState } from 'react';
import { jobFeesApi } from '@/api/admin';
import { useFetch, useMutation, generateRequestKey } from '../shared';
import type {
   JobFee,
   CreateJobFeeRequest,
   UpdateJobFeeRequest,
} from '@/types/admin/wallet';

export interface UseJobFeesReturn {
   /** Fees keyed by career_id for O(1) lookup in the UI. */
   feesByCareer: Map<number, JobFee>;
   /** True until the (optional) list endpoint resolves the first time. */
   isLoading: boolean;
   isSaving: boolean;
   error: Error | null;
   refetch: () => void;
   /** Look up a fee by career id; undefined if unset. */
   getFee: (careerId: number) => JobFee | undefined;
   /** Upsert: PUT when a fee already exists for the career, POST otherwise. */
   saveFee: (
      careerId: number,
      input: { fee: number; is_active: boolean }
   ) => Promise<JobFee | null>;
}

export interface UseJobFeesOptions {
   autoFetch?: boolean;
}

/**
 * Job fees hook.
 *
 * Backend currently exposes only POST/PUT. We attempt a GET on mount and
 * silently degrade to a write-only cache if the endpoint is missing — once
 * the GET ships, the modal will start prepopulating fees automatically.
 *
 * Updates are upserts: callers don't need to know whether a fee exists yet.
 */
export function useJobFees(options: UseJobFeesOptions = {}): UseJobFeesReturn {
   const { autoFetch = true } = options;

   const [localFees, setLocalFees] = useState<Map<number, JobFee>>(new Map());

   const fetcher = useCallback(async () => {
      try {
         const list = await jobFeesApi.getAll();
         return list;
      } catch {
         // GET endpoint not implemented yet — degrade gracefully.
         return [] as JobFee[];
      }
   }, []);

   const { data, isLoading, error, refetch } = useFetch<JobFee[]>(
      fetcher,
      generateRequestKey('wallet-job-fees'),
      {
         autoFetch,
         // Errors here are non-fatal (backend may not have GET yet).
         errorMessage: '',
      }
   );

   // Merge server + local fees. Local writes win because they're fresher.
   const feesByCareer = useCallback(() => {
      const merged = new Map<number, JobFee>();
      (data ?? []).forEach((fee) => merged.set(fee.career_id, fee));
      localFees.forEach((fee, careerId) => merged.set(careerId, fee));
      return merged;
   }, [data, localFees])();

   const saveMutation = useMutation(
      async (variables: {
         careerId: number;
         existing: JobFee | undefined;
         input: { fee: number; is_active: boolean };
      }) => {
         const { careerId, existing, input } = variables;
         const payload: CreateJobFeeRequest | UpdateJobFeeRequest = {
            career_id: careerId,
            fee: input.fee,
            is_active: input.is_active,
         };

         const response = existing
            ? await jobFeesApi.update(careerId, payload)
            : await jobFeesApi.create(payload);
         return response;
      },
      {
         successMessage: 'تم حفظ رسوم المهنة بنجاح',
         errorMessage: 'حدث خطأ أثناء حفظ رسوم المهنة',
         onSuccess: (saved) => {
            if (!saved) return;
            setLocalFees((prev) => {
               const next = new Map(prev);
               next.set(saved.career_id, saved);
               return next;
            });
         },
      }
   );

   const getFee = useCallback(
      (careerId: number) => feesByCareer.get(careerId),
      [feesByCareer]
   );

   const saveFee = useCallback(
      async (careerId: number, input: { fee: number; is_active: boolean }) => {
         const existing = feesByCareer.get(careerId);
         return await saveMutation.mutate({ careerId, existing, input });
      },
      [feesByCareer, saveMutation]
   );

   return {
      feesByCareer,
      isLoading,
      isSaving: saveMutation.isLoading,
      error,
      refetch,
      getFee,
      saveFee,
   };
}

export default useJobFees;
