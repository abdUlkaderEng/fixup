'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminApi } from '@/api/admin';
import type {
   CreateServiceRequest,
   UpdateServiceRequest,
} from '@/types/service';

interface UseServiceManagementReturn {
   isCreating: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   createService: (
      data: CreateServiceRequest
   ) => Promise<{ success: boolean; serviceId?: number }>;
   updateService: (
      serviceId: number,
      data: UpdateServiceRequest
   ) => Promise<boolean>;
   deleteService: (serviceId: number) => Promise<boolean>;
}

export function useServiceManagement(
   onSuccess?: () => void
): UseServiceManagementReturn {
   const [isCreating, setIsCreating] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const createService = useCallback(
      async (
         data: CreateServiceRequest
      ): Promise<{ success: boolean; serviceId?: number }> => {
         setIsCreating(true);

         try {
            const response = await adminApi.createService(data);
            toast.success(response.message || 'تم إضافة الخدمة بنجاح');
            onSuccess?.();
            return { success: true, serviceId: response.service.id };
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء إضافة الخدمة';
            toast.error(message);
            return { success: false };
         } finally {
            setIsCreating(false);
         }
      },
      [onSuccess]
   );

   const updateService = useCallback(
      async (
         serviceId: number,
         data: UpdateServiceRequest
      ): Promise<boolean> => {
         setIsUpdating(true);

         try {
            const response = await adminApi.updateService(serviceId, data);
            toast.success(response.message || 'تم تحديث الخدمة بنجاح');
            onSuccess?.();
            return true;
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء تحديث الخدمة';
            toast.error(message);
            return false;
         } finally {
            setIsUpdating(false);
         }
      },
      [onSuccess]
   );

   const deleteService = useCallback(
      async (serviceId: number): Promise<boolean> => {
         setIsDeleting(true);

         try {
            const response = await adminApi.deleteService(serviceId);
            toast.success(response.message || 'تم حذف الخدمة بنجاح');
            onSuccess?.();
            return true;
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء حذف الخدمة';
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
      isUpdating,
      isDeleting,
      createService,
      updateService,
      deleteService,
   };
}

export default useServiceManagement;
