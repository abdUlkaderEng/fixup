'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from 'next-auth';
import { profileSchema, type ProfileFormData } from '@/app/profile/schemas';

interface UseProfileFormReturn {
   form: ReturnType<typeof useForm<ProfileFormData>>;
   isEditing: boolean;
   handleEdit: () => void;
   handleCancel: () => void;
}

/**
 * Hook to manage profile form state and edit mode
 * Single Responsibility: Form state management and edit mode toggle
 */
export function useProfileForm(user: User | undefined): UseProfileFormReturn {
   const [isEditing, setIsEditing] = useState(false);

   const defaultValues = useMemo(
      () => ({
         name: user?.name || '',
         phone: user?.phone || '',
         address: user?.address || '',
         birth_date: user?.birth_date || '',
      }),
      [user]
   );

   const form = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues,
   });

   const handleEdit = useCallback(() => {
      if (user) {
         form.reset({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            birth_date: user.birth_date || '',
         });
      }
      setIsEditing(true);
   }, [form, user]);

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
