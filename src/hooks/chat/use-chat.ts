'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useMutation } from '@/hooks/admin/shared';
import type { ChatConfig, ChatMessage, UseChatReturn } from '@/types/chat';
import {
   useChatMessages,
   useChatWsListener,
   usePendingMessages,
} from './shared';

export function useChat({
   conversationId,
   currentUserRole,
   wsUrl,
   send,
   templates,
}: ChatConfig): UseChatReturn {
   const isActive = conversationId > 0;
   const { data: session } = useSession();
   const currentUserId = Number(session?.user?.id ?? 0);

   const {
      messages: serverMessages,
      isLoading: isLoadingMessages,
      error,
      setData,
   } = useChatMessages(conversationId);

   const pending = usePendingMessages();

   // Clear pending whenever the conversation closes.
   useEffect(() => {
      if (!isActive) pending.clear();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isActive]);

   const sendFn = useCallback(
      (templateId: number) => send(conversationId, templateId),
      [send, conversationId]
   );

   // We don't use the auto-toast here — failure is surfaced inline via `failed` flag.
   const { mutate, isLoading: isSending } = useMutation<ChatMessage, number>(
      sendFn,
      { errorMessage: 'تعذر إرسال الرسالة' }
   );

   const appendServerMessage = useCallback(
      (message: ChatMessage) => {
         setData((prev) => {
            const list = prev ?? [];
            if (list.some((m) => m.id === message.id)) return list;
            return [...list, message];
         });
      },
      [setData]
   );

   const sendMessage = useCallback(
      async (templateId: number) => {
         if (!isActive) return;
         const template = templates.find((t) => t.id === templateId);
         const tempId = pending.addPending({
            templateId,
            text: template?.text ?? '',
            senderRole: currentUserRole,
            senderId: currentUserId,
            conversationId,
            createdAt: new Date().toISOString(),
         });

         const result = await mutate(templateId);

         if (result) {
            pending.markConfirmed(tempId);
            appendServerMessage(result);
         } else {
            pending.markFailed(tempId);
         }
      },
      [
         isActive,
         templates,
         currentUserRole,
         currentUserId,
         conversationId,
         mutate,
         pending,
         appendServerMessage,
      ]
   );

   useChatWsListener({
      wsUrl,
      conversationId,
      appendMessage: appendServerMessage,
      dropMatchingPending: pending.dropMatching,
   });

   // Merge server messages with pending optimistic ones, sorted by created_at.
   const messages = useMemo(() => {
      if (pending.pendingMessages.length === 0) return serverMessages;
      const merged: ChatMessage[] = [
         ...serverMessages,
         ...pending.pendingMessages,
      ];
      merged.sort((a, b) => a.created_at.localeCompare(b.created_at));
      return merged;
   }, [serverMessages, pending.pendingMessages]);

   return {
      messages,
      isLoadingMessages,
      isSending,
      sendMessage,
      error,
      pendingIds: pending.pendingIds,
      failedIds: pending.failedIds,
   };
}
