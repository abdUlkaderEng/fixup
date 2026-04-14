'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import type { User } from 'next-auth';
import { userApi } from '@/api/user';
import type { ProfileFormData } from '@/components/profile/schemas';

interface UseProfileSubmitReturn {
   isSubmitting: boolean;
   onSubmit: (data: ProfileFormData) => Promise<void>;
}

/**
 * Hook to handle profile update submission
 * Single Responsibility: Profile update API calls and session refresh
 */
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
            const response = await userApi.updateProfile(data);
            const freshUser = await userApi.getCurrentUser();

            await update({
               user: {
                  ...sessionUser,
                  ...freshUser,
               },
            });

            toast.success(response.message || 'تم تحديث الملف الشخصي بنجاح');
            onSuccess();
         } catch (error) {
            const message =
               error instanceof Error
                  ? error.message
                  : 'حدث خطأ أثناء تحديث الملف الشخصي';
            toast.error(message);
            console.error('Profile update error:', error);
         } finally {
            setIsSubmitting(false);
         }
      },
      [update, sessionUser, onSuccess]
   );

   return {
      isSubmitting,
      onSubmit,
   };
}

export default useProfileSubmit;
