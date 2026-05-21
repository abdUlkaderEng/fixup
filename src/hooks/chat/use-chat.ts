'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { conversationsApi } from '@/api/chat';
import {
   generateRequestKey,
   useFetch,
   useMutation,
} from '@/hooks/admin/shared';
import { useWebSocket } from '@/hooks/use-websocket';
import type { ChatConfig, ChatMessage, UseChatReturn } from '@/types/chat';

// Client-only optimistic message. Lives alongside server messages in the UI list.
// Negative ids guarantee no collision with backend ids.
interface PendingMessage {
   tempId: number;
   templateId: number;
   text: string;
   senderRole: ChatConfig['currentUserRole'];
   senderId: number;
   conversationId: number;
   createdAt: string;
   failed: boolean;
}

function pendingToChatMessage(p: PendingMessage): ChatMessage {
   return {
      id: p.tempId,
      conversation_id: p.conversationId,
      sender_id: p.senderId,
      sender_role: p.senderRole,
      template_id: p.templateId,
      message: p.text,
      created_at: p.createdAt,
   };
}

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

   // Optimistic outgoing messages awaiting server confirmation.
   const [pending, setPending] = useState<PendingMessage[]>([]);
   const tempIdRef = useRef(-1);

   const sendFn = useCallback(
      (templateId: number) => send(conversationId, templateId),
      [send, conversationId]
   );

   // We don't use the auto-toast here — we surface failure inline via `failed` flag.
   const { mutate, isLoading: isSending } = useMutation<ChatMessage, number>(
      sendFn,
      { errorMessage: 'تعذر إرسال الرسالة' }
   );

   const sendMessage = useCallback(
      async (templateId: number) => {
         if (!isActive) return;
         const template = templates.find((t) => t.id === templateId);
         const tempId = tempIdRef.current--;
         const optimistic: PendingMessage = {
            tempId,
            templateId,
            text: template?.text ?? '',
            senderRole: currentUserRole,
            senderId: currentUserId,
            conversationId,
            createdAt: new Date().toISOString(),
            failed: false,
         };
         setPending((prev) => [...prev, optimistic]);

         const result = await mutate(templateId);

         if (result) {
            // Server confirmed — drop the optimistic and append the real one if not already present.
            setPending((prev) => prev.filter((p) => p.tempId !== tempId));
            setData((prev) => {
               const list = prev ?? [];
               if (list.some((m) => m.id === result.id)) return list;
               return [...list, result];
            });
         } else {
            // Mark optimistic as failed so the UI can offer retry.
            setPending((prev) =>
               prev.map((p) =>
                  p.tempId === tempId ? { ...p, failed: true } : p
               )
            );
         }
      },
      [
         isActive,
         templates,
         currentUserRole,
         currentUserId,
         conversationId,
         mutate,
         setData,
      ]
   );

   // Append incoming WebSocket message — dedup by id, not by role.
   const onWsMessage = useCallback(
      (event: MessageEvent) => {
         try {
            const frame = JSON.parse(event.data as string) as {
               event: string;
               data: ChatMessage;
            };
            if (frame.event !== 'new_message' || !frame.data?.id) return;
            // Drop stale frames from a previous conversation.
            if (
               frame.data.conversation_id &&
               frame.data.conversation_id !== conversationId
            )
               return;
            setData((prev) => {
               const list = prev ?? [];
               if (list.some((m) => m.id === frame.data.id)) return list;
               return [...list, frame.data];
            });
            // If the echo matches a still-pending optimistic message, drop the optimistic.
            // Match by template_id + role (case-insensitive — backend may return 'Worker').
            const frameRole =
               typeof frame.data.sender_role === 'string'
                  ? frame.data.sender_role.toLowerCase()
                  : '';
            setPending((prev) =>
               prev.filter(
                  (p) =>
                     !(
                        p.senderRole.toLowerCase() === frameRole &&
                        p.templateId === frame.data.template_id
                     )
               )
            );
         } catch {
            // Ignore malformed frames
         }
      },
      [conversationId, setData]
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

   // Reset messages + pending when conversation changes / closes
   useEffect(() => {
      if (!isActive) {
         setData(null);
         setPending([]);
      }
   }, [isActive, setData]);

   // Merge server messages with pending optimistic ones, sorted by created_at.
   const messages = useMemo(() => {
      const server = data ?? [];
      if (pending.length === 0) return server;
      const merged: ChatMessage[] = [
         ...server,
         ...pending.map(pendingToChatMessage),
      ];
      merged.sort((a, b) => a.created_at.localeCompare(b.created_at));
      return merged;
   }, [data, pending]);

   const pendingIds = useMemo(
      () => new Set(pending.filter((p) => !p.failed).map((p) => p.tempId)),
      [pending]
   );
   const failedIds = useMemo(
      () => new Set(pending.filter((p) => p.failed).map((p) => p.tempId)),
      [pending]
   );

   return {
      messages,
      isLoadingMessages,
      isSending,
      sendMessage,
      error,
      pendingIds,
      failedIds,
   };
}
