'use client';

import { useCallback } from 'react';
import { workersApi } from '@/api/admin';
import { useMutation } from './shared';
import type { UpdateWorkerRequest, WorkerStatus } from '@/types/admin/index';

export interface UseWorkerMutationsReturn {
   isUpdating: boolean;
   isDeleting: boolean;
   updateWorker: (
      workerId: number,
      data: UpdateWorkerRequest
   ) => Promise<boolean>;
   deleteWorker: (workerId: number) => Promise<boolean>;
   approveWorker: (workerId: number) => Promise<boolean>;
   blockWorker: (workerId: number) => Promise<boolean>;
}

/**
 * Hook for worker mutations (update, delete, approve, block)
 */
export function useWorkerMutations(
   onSuccess?: () => void
): UseWorkerMutationsReturn {
   const updateMutation = useMutation(
      async (params: { workerId: number; data: UpdateWorkerRequest }) => {
         const response = await workersApi.update(params.workerId, params.data);
         return response;
      },
      {
         successMessage: 'تم تحديث العامل بنجاح',
         errorMessage: 'حدث خطأ أثناء تحديث العامل',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const deleteMutation = useMutation(
      async (workerId: number) => {
         await workersApi.delete(workerId);
         return workerId;
      },
      {
         successMessage: 'تم حذف العامل بنجاح',
         errorMessage: 'حدث خطأ أثناء حذف العامل',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const updateWorker = useCallback(
      async (workerId: number, data: UpdateWorkerRequest): Promise<boolean> => {
         const result = await updateMutation.mutate({ workerId, data });
         return result !== null;
      },
      [updateMutation]
   );

   const deleteWorker = useCallback(
      async (workerId: number): Promise<boolean> => {
         const result = await deleteMutation.mutate(workerId);
         return result !== null;
      },
      [deleteMutation]
   );

   const approveWorker = useCallback(
      async (workerId: number): Promise<boolean> => {
         return updateWorker(workerId, { status: 'active' as WorkerStatus });
      },
      [updateWorker]
   );

   const blockWorker = useCallback(
      async (workerId: number): Promise<boolean> => {
         return updateWorker(workerId, { status: 'blocked' as WorkerStatus });
      },
      [updateWorker]
   );

   return {
      isUpdating: updateMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      updateWorker,
      deleteWorker,
      approveWorker,
      blockWorker,
   };
}

export default useWorkerMutations;
