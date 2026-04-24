'use client';

import { useCallback } from 'react';
import { careersApi } from '@/api/admin';
import { useMutation } from './shared';
import type {
   CreateCareerRequest,
   CareerWithTimestamp,
} from '@/types/admin/careers';

export interface CreateCareerResult {
   success: boolean;
   career?: CareerWithTimestamp;
}

export interface UseCareerMutationsReturn {
   isCreating: boolean;
   isDeleting: boolean;
   createCareer: (data: CreateCareerRequest) => Promise<CreateCareerResult>;
   deleteCareer: (careerId: number) => Promise<boolean>;
}

/**
 * Hook for career mutations (create/delete)
 */
export function useCareerMutations(
   onSuccess?: () => void
): UseCareerMutationsReturn {
   const createMutation = useMutation(
      async (data: CreateCareerRequest) => {
         const response = await careersApi.create(data);
         return response;
      },
      {
         successMessage: 'تم إضافة المهنة بنجاح',
         errorMessage: 'حدث خطأ أثناء إضافة المهنة',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const deleteMutation = useMutation(
      async (careerId: number) => {
         await careersApi.delete(careerId);
         return careerId;
      },
      {
         successMessage: 'تم حذف المهنة بنجاح',
         errorMessage: 'حدث خطأ أثناء حذف المهنة',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const createCareer = useCallback(
      async (data: CreateCareerRequest): Promise<CreateCareerResult> => {
         const result = await createMutation.mutate(data);
         if (result) {
            return { success: true, career: result.career };
         }
         return { success: false };
      },
      [createMutation]
   );

   const deleteCareer = useCallback(
      async (careerId: number): Promise<boolean> => {
         const result = await deleteMutation.mutate(careerId);
         return result !== null;
      },
      [deleteMutation]
   );

   return {
      isCreating: createMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      createCareer,
      deleteCareer,
   };
}

export default useCareerMutations;
