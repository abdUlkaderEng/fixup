'use client';

import { useCallback } from 'react';
import { messageTopicsApi } from '@/api/messages';
import { adminMessageTopicsApi } from '@/api/admin/index';
import { useFetch, useMutation, generateRequestKey } from './shared';
import type { MessageTopic } from '@/types/admin/messages';

export interface UseMessageTopicsReturn {
   topics: MessageTopic[];
   isLoading: boolean;
   isAdding: boolean;
   isUpdating: boolean;
   isDeleting: boolean;
   error: Error | null;
   refetch: () => void;
   addTopic: (topic: string) => Promise<void>;
   updateTopic: (id: number, topic: string) => Promise<void>;
   deleteTopic: (id: number) => Promise<void>;
}

export interface UseMessageTopicsOptions {
   autoFetch?: boolean;
}

/**
 * Combined fetch + mutations for message topics.
 * Mirrors `useAddresses` pattern with added update support.
 */
export function useMessageTopics(
   options: UseMessageTopicsOptions = {}
): UseMessageTopicsReturn {
   const { autoFetch = true } = options;

   const fetcher = useCallback(async () => {
      return await messageTopicsApi.getAll();
   }, []);

   const { data, isLoading, error, refetch, setData } = useFetch<
      MessageTopic[]
   >(fetcher, generateRequestKey('message-topics-list'), {
      autoFetch,
      errorMessage: 'حدث خطأ أثناء جلب المواضيع',
   });

   const addMutation = useMutation(
      async (topic: string) => {
         const trimmed = topic.trim();
         if (!trimmed) {
            throw new Error('اسم الموضوع مطلوب');
         }
         const response = await adminMessageTopicsApi.create({
            topic: trimmed,
         });
         return response.data;
      },
      {
         successMessage: 'تم إضافة الموضوع بنجاح',
         errorMessage: 'حدث خطأ أثناء إضافة الموضوع',
         onSuccess: (created) => {
            if (created) {
               setData((prev) => (prev ? [created, ...prev] : [created]));
            }
            refetch();
         },
      }
   );

   const updateMutation = useMutation(
      async ({ id, topic }: { id: number; topic: string }) => {
         const trimmed = topic.trim();
         if (!trimmed) {
            throw new Error('اسم الموضوع مطلوب');
         }
         const response = await adminMessageTopicsApi.update(id, {
            topic: trimmed,
         });
         return response.data;
      },
      {
         successMessage: 'تم تعديل الموضوع بنجاح',
         errorMessage: 'حدث خطأ أثناء تعديل الموضوع',
         onSuccess: (updated) => {
            if (updated) {
               setData((prev) =>
                  prev
                     ? prev.map((t) => (t.id === updated.id ? updated : t))
                     : []
               );
            }
         },
      }
   );

   const deleteMutation = useMutation(
      async (id: number) => {
         await adminMessageTopicsApi.delete(id);
         return id;
      },
      {
         successMessage: 'تم حذف الموضوع بنجاح',
         errorMessage: 'حدث خطأ أثناء حذف الموضوع',
         onSuccess: (_, id) => {
            setData((prev) => (prev ? prev.filter((t) => t.id !== id) : []));
         },
      }
   );

   const addTopic = useCallback(
      async (topic: string) => {
         await addMutation.mutateAsync(topic);
      },
      [addMutation]
   );

   const updateTopic = useCallback(
      async (id: number, topic: string) => {
         await updateMutation.mutateAsync({ id, topic });
      },
      [updateMutation]
   );

   const deleteTopic = useCallback(
      async (id: number) => {
         await deleteMutation.mutateAsync(id);
      },
      [deleteMutation]
   );

   return {
      topics: data ?? [],
      isLoading,
      isAdding: addMutation.isLoading,
      isUpdating: updateMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      error,
      refetch,
      addTopic,
      updateTopic,
      deleteTopic,
   };
}

export default useMessageTopics;
