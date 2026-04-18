'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminApi, UpdateWorkerRequest } from '@/api/admin';
import type { WorkerStatus } from '@/types/worker';

interface UseWorkerManagementReturn {
   isUpdating: boolean;
   isDeleting: boolean;
   updateWorker: (
      workerId: number,
      data: UpdateWorkerRequest
   ) => Promise<boolean>;
   deleteWorker: (workerId: number) => Promise<boolean>;
   approveWorker: (workerId: number) => Promise<boolean>;
}

export function useWorkerManagement(
   onSuccess: () => void
): UseWorkerManagementReturn {
   const [isUpdating, setIsUpdating] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const updateWorker = useCallback(
      async (workerId: number, data: UpdateWorkerRequest): Promise<boolean> => {
         setIsUpdating(true);

         try {
            const response = await adminApi.updateWorker(workerId, data);
            toast.success(response.message || 'تم تحديث العامل بنجاح');
            onSuccess();
            return true;
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء تحديث العامل';
            toast.error(message);
            return false;
         } finally {
            setIsUpdating(false);
         }
      },
      [onSuccess]
   );

   const deleteWorker = useCallback(
      async (workerId: number): Promise<boolean> => {
         setIsDeleting(true);

         try {
            const response = await adminApi.deleteWorker(workerId);
            toast.success(response.message || 'تم حذف العامل بنجاح');
            onSuccess();
            return true;
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء حذف العامل';
            toast.error(message);
            return false;
         } finally {
            setIsDeleting(false);
         }
      },
      [onSuccess]
   );

   const approveWorker = useCallback(
      async (workerId: number): Promise<boolean> => {
         return updateWorker(workerId, { status: 'active' as WorkerStatus });
      },
      [updateWorker]
   );

   return {
      isUpdating,
      isDeleting,
      updateWorker,
      deleteWorker,
      approveWorker,
   };
}

export default useWorkerManagement;
