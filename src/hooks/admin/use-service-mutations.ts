'use client';

import { useCallback } from 'react';
import { servicesApi } from '@/api/admin';
import { useMutation } from './shared';
import type {
   CreateServiceRequest,
   UpdateServiceRequest,
} from '@/types/service';

export interface CreateServiceResult {
   success: boolean;
   serviceId?: number;
}

export interface UseServiceMutationsReturn {
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   createService: (data: CreateServiceRequest) => Promise<CreateServiceResult>;
   updateService: (
      serviceId: number,
      data: UpdateServiceRequest
   ) => Promise<boolean>;
   deleteService: (serviceId: number) => Promise<boolean>;
}

/**
 * Hook for service mutations (create/update/delete)
 */
export function useServiceMutations(
   onSuccess?: () => void
): UseServiceMutationsReturn {
   const createMutation = useMutation(
      async (data: CreateServiceRequest) => {
         const response = await servicesApi.create(data);
         return response;
      },
      {
         successMessage: 'تم إضافة الخدمة بنجاح',
         errorMessage: 'حدث خطأ أثناء إضافة الخدمة',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const updateMutation = useMutation(
      async (params: { serviceId: number; data: UpdateServiceRequest }) => {
         const response = await servicesApi.update(
            params.serviceId,
            params.data
         );
         return response;
      },
      {
         successMessage: 'تم تحديث الخدمة بنجاح',
         errorMessage: 'حدث خطأ أثناء تحديث الخدمة',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const deleteMutation = useMutation(
      async (serviceId: number) => {
         await servicesApi.delete(serviceId);
         return serviceId;
      },
      {
         successMessage: 'تم حذف الخدمة بنجاح',
         errorMessage: 'حدث خطأ أثناء حذف الخدمة',
         onSuccess: () => {
            onSuccess?.();
         },
      }
   );

   const createService = useCallback(
      async (data: CreateServiceRequest): Promise<CreateServiceResult> => {
         const result = await createMutation.mutate(data);
         if (result) {
            return { success: true, serviceId: result.service.id };
         }
         return { success: false };
      },
      [createMutation]
   );

   const updateService = useCallback(
      async (
         serviceId: number,
         data: UpdateServiceRequest
      ): Promise<boolean> => {
         const result = await updateMutation.mutate({ serviceId, data });
         return result !== null;
      },
      [updateMutation]
   );

   const deleteService = useCallback(
      async (serviceId: number): Promise<boolean> => {
         const result = await deleteMutation.mutate(serviceId);
         return result !== null;
      },
      [deleteMutation]
   );

   return {
      isCreating: createMutation.isLoading,
      isUpdating: updateMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      createService,
      updateService,
      deleteService,
   };
}

export default useServiceMutations;
