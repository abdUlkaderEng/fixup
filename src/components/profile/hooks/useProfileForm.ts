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

function buildDefaultValues(
   user: User | undefined,
   isWorker: boolean
): ProfileFormData {
   return {
      name: user?.name || '',
      phone_number: user?.phone_number || '',
      latitude: user?.latitude ? parseFloat(user.latitude) : undefined,
      longitude: user?.longitude ? parseFloat(user.longitude) : undefined,
      detailed_address: user?.detailed_address || '',
      area_address_id: user?.area_address_id ?? undefined,
      birth_date: user?.birth_date || '',
      ...(isWorker && {
         about: user?.worker?.about || '',
         years_experience:
            user?.worker?.years_experience != null
               ? String(user.worker.years_experience)
               : '',
         account_status:
            (user?.worker?.status as 'active' | 'waiting' | 'blocked') ||
            'waiting',
      }),
   };
}

export function useProfileForm({
   user,
   isWorker = false,
}: UseProfileFormOptions): UseProfileFormReturn {
   const [isEditing, setIsEditing] = useState(false);

   const defaultValues = useMemo(
      () => buildDefaultValues(user, isWorker),
      [user, isWorker]
   );

   const form = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues,
   });

   const handleEdit = useCallback(() => {
      form.reset(buildDefaultValues(user, isWorker));
      setIsEditing(true);
   }, [form, user, isWorker]);

   const handleCancel = useCallback(() => {
      setIsEditing(false);
   }, []);

   return { form, isEditing, handleEdit, handleCancel };
}

export default useProfileForm;
