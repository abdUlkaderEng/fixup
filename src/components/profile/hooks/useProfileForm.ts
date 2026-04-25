'use client';

import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from 'next-auth';
import {
   baseProfileSchema,
   workerInfoSchema,
   type BaseProfileFormData,
   type WorkerInfoFormData,
} from '@/components/profile/schemas';

type EditMode = 'base' | 'worker' | null;

interface UseProfileFormOptions {
   user: User | undefined;
   isWorker?: boolean;
}

export interface UseProfileFormReturn {
   baseForm: ReturnType<typeof useForm<BaseProfileFormData>>;
   workerForm: ReturnType<typeof useForm<WorkerInfoFormData>>;
   editMode: EditMode;
   handleEditBase: () => void;
   handleEditWorker: () => void;
   handleCancel: () => void;
}

function buildBaseValues(user: User | undefined): BaseProfileFormData {
   return {
      name: user?.name || '',
      phone_number: user?.phone_number || '',
      latitude: user?.latitude ? parseFloat(user.latitude) : undefined,
      longitude: user?.longitude ? parseFloat(user.longitude) : undefined,
      detailed_address: user?.detailed_address || '',
      area_address_id: user?.area_address_id ?? undefined,
      birth_date: user?.birth_date || '',
   };
}

function buildWorkerValues(user: User | undefined): WorkerInfoFormData {
   return {
      about: user?.worker?.about || '',
      years_experience:
         user?.worker?.years_experience != null
            ? String(user.worker.years_experience)
            : '',
      account_status:
         (user?.worker?.status as 'active' | 'waiting' | 'blocked') ||
         'waiting',
      services: user?.worker?.services?.map((s) => s.id) ?? [],
      worker_images: [],
      delete_images: [],
   };
}

export function useProfileForm({
   user,
}: UseProfileFormOptions): UseProfileFormReturn {
   const [editMode, setEditMode] = useState<EditMode>(null);

   const baseDefaults = useMemo(() => buildBaseValues(user), [user]);
   const workerDefaults = useMemo(() => buildWorkerValues(user), [user]);

   const baseForm = useForm<BaseProfileFormData>({
      resolver: zodResolver(baseProfileSchema),
      defaultValues: baseDefaults,
   });

   const workerForm = useForm<WorkerInfoFormData>({
      resolver: zodResolver(workerInfoSchema),
      defaultValues: workerDefaults,
   });

   const handleEditBase = useCallback(() => {
      baseForm.reset(buildBaseValues(user));
      setEditMode('base');
   }, [baseForm, user]);

   const handleEditWorker = useCallback(() => {
      workerForm.reset(buildWorkerValues(user));
      setEditMode('worker');
   }, [workerForm, user]);

   const handleCancel = useCallback(() => setEditMode(null), []);

   return {
      baseForm,
      workerForm,
      editMode,
      handleEditBase,
      handleEditWorker,
      handleCancel,
   };
}

export default useProfileForm;
