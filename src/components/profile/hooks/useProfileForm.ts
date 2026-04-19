'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from 'next-auth';
import {
   profileSchema,
   type ProfileFormData,
} from '@/components/profile/schemas';

interface UseProfileFormOptions {
   user: User | undefined;
   isWorker?: boolean;
}

interface UseProfileFormReturn {
   form: ReturnType<typeof useForm<ProfileFormData>>;
   isEditing: boolean;
   handleEdit: () => void;
   handleCancel: () => void;
}

/**
 * Hook to manage profile form state and edit mode
 * Supports both customer and worker profiles
 */
export function useProfileForm({
   user,
   isWorker = false,
}: UseProfileFormOptions): UseProfileFormReturn {
   const [isEditing, setIsEditing] = useState(false);

   const defaultValues = useMemo(
      () => ({
         name: user?.name || '',
         phone_number: user?.phone_number || '',
         latitude: user?.latitude ?? undefined,
         longitude: user?.longitude ?? undefined,
         detailed_address: user?.detailed_address || '',
         area_address_id: user?.area_address_id ?? undefined,
         birth_date: user?.birth_date || '',
         ...(isWorker && {
            about: (user as { about?: string })?.about || '',
            nearly_date: (user as { nearly_date?: string })?.nearly_date || '',
            years_experience:
               (user as { years_experience?: string })?.years_experience || '',
            account_status: ((user as { account_status?: string })
               ?.account_status || 'pending') as
               | 'active'
               | 'pending'
               | 'suspended',
         }),
      }),
      [user, isWorker]
   );

   const form = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues,
   });

   const handleEdit = useCallback(() => {
      if (user) {
         form.reset({
            name: user.name || '',
            phone_number: user.phone_number || '',
            latitude: user.latitude ?? undefined,
            longitude: user.longitude ?? undefined,
            detailed_address: user.detailed_address || '',
            area_address_id: user.area_address_id ?? undefined,
            birth_date: user.birth_date || '',
            ...(isWorker && {
               about: (user as { about?: string })?.about || '',
               nearly_date:
                  (user as { nearly_date?: string })?.nearly_date || '',
               years_experience:
                  (user as { years_experience?: string })?.years_experience ||
                  '',
               account_status: ((user as { account_status?: string })
                  ?.account_status || 'pending') as
                  | 'active'
                  | 'pending'
                  | 'suspended',
            }),
         });
      }
      setIsEditing(true);
   }, [form, user, isWorker]);

   const handleCancel = useCallback(() => {
      setIsEditing(false);
   }, []);

   return {
      form,
      isEditing,
      handleEdit,
      handleCancel,
   };
}

export default useProfileForm;
