'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import type { CreateCareerRequest, CareerWithTimestamp } from '@/types/service';

interface UseCareerManagementReturn {
   isCreating: boolean;
   isDeleting: boolean;
   createCareer: (
      data: CreateCareerRequest
   ) => Promise<{ success: boolean; career?: CareerWithTimestamp }>;
   deleteCareer: (careerId: number) => Promise<boolean>;
}

export function useCareerManagement(
   onSuccess?: () => void
): UseCareerManagementReturn {
   const [isCreating, setIsCreating] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const createCareer = useCallback(
      async (
         data: CreateCareerRequest
      ): Promise<{ success: boolean; career?: CareerWithTimestamp }> => {
         setIsCreating(true);

         try {
            const response = await adminApi.createCareer(data);
            toast.success(response.message || 'تم إضافة المهنة بنجاح');
            onSuccess?.();
            return { success: true, career: response.career };
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء إضافة المهنة';
            toast.error(message);
            return { success: false };
         } finally {
            setIsCreating(false);
         }
      },
      [onSuccess]
   );

   const deleteCareer = useCallback(
      async (careerId: number): Promise<boolean> => {
         setIsDeleting(true);

         try {
            const response = await adminApi.deleteCareer(careerId);
            toast.success(response.message || 'تم حذف المهنة بنجاح');
            onSuccess?.();
            return true;
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء حذف المهنة';
            toast.error(message);
            return false;
         } finally {
            setIsDeleting(false);
         }
      },
      [onSuccess]
   );

   return {
      isCreating,
      isDeleting,
      createCareer,
      deleteCareer,
   };
}

export default useCareerManagement;
