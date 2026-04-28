'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { User } from 'next-auth';
import { updateUserProfile } from '@/api/customer';
import { updateWorkerProfile } from '@/api/worker';
import { mapBackendUserToAuthUser } from '@/lib/next-auth-config/mappers';
import type {
   BaseProfileFormData,
   WorkerInfoFormData,
} from '@/components/profile/schemas';

interface UseProfileSubmitReturn {
   isSubmitting: boolean;
   submitBase: (data: BaseProfileFormData) => Promise<void>;
   submitWorker: (data: WorkerInfoFormData) => Promise<void>;
}

export function useProfileSubmit(
   sessionUser: User | undefined,
   onSuccess: () => void
): UseProfileSubmitReturn {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { update } = useSession();

   const submitBase = useCallback(
      async (data: BaseProfileFormData) => {
         setIsSubmitting(true);
         try {
            const response = await updateUserProfile({
               name: data.name,
               phone_number: data.phone_number,
               profile_image: data.profile_image ?? undefined,
               latitude: data.latitude,
               longitude: data.longitude,
               detailed_address: data.detailed_address || undefined,
               area_address_id: data.area_address_id,
            });
            const freshUser = mapBackendUserToAuthUser(
               response.user,
               sessionUser?.accessToken
            );
            await update({ user: freshUser });
            toast.success(response.message || 'تم تحديث الملف الشخصي بنجاح');
            onSuccess();
         } catch (error) {
            toast.error(
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء تحديث الملف الشخصي'
            );
         } finally {
            setIsSubmitting(false);
         }
      },
      [update, sessionUser, onSuccess]
   );

   const submitWorker = useCallback(
      async (data: WorkerInfoFormData) => {
         setIsSubmitting(true);
         try {
            const response = await updateWorkerProfile({
               about: data.about || '',
               years_experience: Number(data.years_experience) || 0,
               services: data.services ?? [],
               images: data.worker_images,
               delete_images: data.delete_images,
            });
            await update({ user: { ...sessionUser, worker: response.data } });
            toast.success(response.message || 'تم تحديث بيانات الفني بنجاح');
            onSuccess();
         } catch (error) {
            toast.error(
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء تحديث بيانات الفني'
            );
         } finally {
            setIsSubmitting(false);
         }
      },
      [update, sessionUser, onSuccess]
   );

   return { isSubmitting, submitBase, submitWorker };
}

export default useProfileSubmit;
