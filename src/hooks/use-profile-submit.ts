'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { User } from 'next-auth';
import { updateUserProfile } from '@/api/customer';
import { mapBackendUserToAuthUser } from '@/lib/next-auth-config/mappers';
import type { ProfileFormData } from '@/app/customer/profile/schemas';

interface UseProfileSubmitReturn {
   isSubmitting: boolean;
   onSubmit: (data: ProfileFormData) => Promise<void>;
}

export function useProfileSubmit(
   sessionUser: User | undefined,
   onSuccess: () => void
): UseProfileSubmitReturn {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const { update } = useSession();

   const onSubmit = useCallback(
      async (data: ProfileFormData) => {
         setIsSubmitting(true);
         try {
            const response = await updateUserProfile({
               name: data.name,
               phone_number: data.phone_number,
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

   return { isSubmitting, onSubmit };
}

export default useProfileSubmit;
