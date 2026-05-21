'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { conversationsApi } from '@/api/chat';
import {
   generateRequestKey,
   useFetch,
   useMutation,
} from '@/hooks/admin/shared';
import { useWebSocket } from '@/hooks/use-websocket';
import type { ChatConfig, ChatMessage, UseChatReturn } from '@/types/chat';

export function useChat({
   conversationId,
   currentUserRole,
   wsUrl,
   send,
}: ChatConfig): UseChatReturn {
   const isActive = conversationId > 0;

   // Stable fetcher — conversationId only changes when a conversation is created
   const fetcher = useCallback(
      () =>
         conversationsApi.getMessages(conversationId).then((r) => r.messages),
      [conversationId]
   );

   const {
      data,
      isLoading: isLoadingMessages,
      error,
      setData,
      refetch,
   } = useFetch<ChatMessage[]>(
      fetcher,
      generateRequestKey('chat-messages', conversationId),
      { enabled: false, errorMessage: 'تعذر تحميل الرسائل' }
   );

   // Manually trigger fetch whenever conversationId becomes valid,
   // because useFetch freezes the enabled flag at mount time.
   useEffect(() => {
      if (isActive) refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [conversationId]);

   const sendFn = useCallback(
      (templateId: number) => send(conversationId, templateId),
      [send, conversationId]
   );

   const { mutate, isLoading: isSending } = useMutation<ChatMessage, number>(
      sendFn,
      {
         errorMessage: 'تعذر إرسال الرسالة',
         onSuccess: (msg) => {
            setData((prev) => [...(prev ?? []), msg]);
         },
      }
   );

   // Append incoming WebSocket message to the list
   const onWsMessage = useCallback(
      (event: MessageEvent) => {
         try {
            const frame = JSON.parse(event.data as string) as {
               event: string;
               data: ChatMessage;
            };
            if (frame.event === 'new_message') {
               // Ignore echoes of own messages (already appended optimistically by mutation)
               if (frame.data.sender_role !== currentUserRole) {
                  setData((prev) => [...(prev ?? []), frame.data]);
               }
            }
         } catch {
            // Ignore malformed frames
         }
      },
      [currentUserRole, setData]
   );

   useWebSocket(
      useMemo(
         () => ({
            url: wsUrl ?? '',
            enabled: isActive && !!wsUrl,
            onMessage: onWsMessage,
         }),
         [wsUrl, isActive, onWsMessage]
      )
   );

   // Reset messages when conversation changes
   useEffect(() => {
      if (!isActive) setData(null);
   }, [isActive, setData]);

   const sendMessage = useCallback(
      async (templateId: number) => {
         await mutate(templateId);
      },
      [mutate]
   );

   return {
      messages: data ?? [],
      isLoadingMessages,
      isSending,
      sendMessage,
      error,
   };
}
