'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { messageTemplatesApi } from '@/api/messages';
import { useMutation, markRequestComplete, generateRequestKey } from './shared';
import type { MessageTemplate, SenderType } from '@/types/admin/messages';
import { adminMessageTemplatesApi } from '@/api/admin/index';

export interface UseMessageTemplatesReturn {
   templates: MessageTemplate[];
   isLoading: boolean;
   isAdding: boolean;
   isDeleting: boolean;
   error: Error | null;
   refetch: () => void;
   addTemplate: (text: string) => Promise<void>;
   deleteTemplate: (id: number) => Promise<void>;
}

export interface UseMessageTemplatesOptions {
   topicId?: number;
   senderType?: SenderType;
}

/**
 * Combined fetch + mutations for message templates.
 *
 * Templates are filtered server-side by topic id and sender_type, so this
 * hook re-fetches whenever either filter changes. Skips fetching entirely
 * until both filters are provided (no "all templates" view).
 *
 * The same topic id is used for both the GET filter and creating templates.
 */
export function useMessageTemplates(
   options: UseMessageTemplatesOptions = {}
): UseMessageTemplatesReturn {
   const { topicId, senderType } = options;
   const { status: sessionStatus } = useSession();

   const [templates, setTemplates] = useState<MessageTemplate[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   const isFetchingRef = useRef(false);
   const mountedRef = useRef(true);

   useEffect(() => {
      mountedRef.current = true;
      return () => {
         mountedRef.current = false;
      };
   }, []);

   const fetchTemplates = useCallback(async () => {
      if (!topicId || !senderType) {
         setTemplates([]);
         return;
      }
      if (sessionStatus !== 'authenticated') return;
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
         const list = await messageTemplatesApi.getAll({
            topic_id: topicId,
            sender_type: senderType,
         });
         if (mountedRef.current) {
            setTemplates(list);
         }
      } catch (err) {
         const fetchError = err instanceof Error ? err : new Error(String(err));
         if (mountedRef.current) {
            setError(fetchError);
            toast.error('حدث خطأ أثناء جلب القوالب', {
               description: fetchError.message,
            });
         }
      } finally {
         if (mountedRef.current) {
            setIsLoading(false);
         }
         isFetchingRef.current = false;
      }
   }, [topicId, senderType, sessionStatus]);

   // Refetch when filters change
   useEffect(() => {
      const key = generateRequestKey(
         'message-templates',
         topicId != null ? String(topicId) : '-',
         senderType ?? '-'
      );
      markRequestComplete(key);
      fetchTemplates();
   }, [fetchTemplates, topicId, senderType]);

   const addMutation = useMutation(
      async (text: string) => {
         const trimmed = text.trim();
         if (!trimmed) {
            throw new Error('نص الرسالة مطلوب');
         }
         if (!topicId) {
            throw new Error('يجب اختيار موضوع');
         }
         if (!senderType) {
            throw new Error('يجب اختيار نوع المرسل');
         }
         const response = await adminMessageTemplatesApi.create({
            text: trimmed,
            sender_type: senderType,
            topic_id: topicId,
         });
         return response.data;
      },
      {
         successMessage: 'تم إضافة القالب بنجاح',
         errorMessage: 'حدث خطأ أثناء إضافة القالب',
         onSuccess: (created) => {
            if (created) {
               setTemplates((prev) => [created, ...prev]);
            }
         },
      }
   );

   const deleteMutation = useMutation(
      async (id: number) => {
         await adminMessageTemplatesApi.delete(id);
         return id;
      },
      {
         successMessage: 'تم حذف القالب بنجاح',
         errorMessage: 'حدث خطأ أثناء حذف القالب',
         onSuccess: (_, id) => {
            setTemplates((prev) => prev.filter((t) => t.id !== id));
         },
      }
   );

   const refetch = useCallback(() => {
      fetchTemplates();
   }, [fetchTemplates]);

   const addTemplate = useCallback(
      async (text: string) => {
         await addMutation.mutateAsync(text);
      },
      [addMutation]
   );

   const deleteTemplate = useCallback(
      async (id: number) => {
         await deleteMutation.mutateAsync(id);
      },
      [deleteMutation]
   );

   return {
      templates,
      isLoading,
      isAdding: addMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      error,
      refetch,
      addTemplate,
      deleteTemplate,
   };
}

export default useMessageTemplates;
