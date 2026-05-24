'use client';

import { useCallback, useMemo } from 'react';
import { useWebSocket } from '@/hooks/shared';
import type { ChatMessage } from '@/types/chat';
import type { PendingMessage } from './use-pending-messages';

interface UseChatWsListenerOptions {
   wsUrl: string | null;
   conversationId: number;
   appendMessage: (message: ChatMessage) => void;
   dropMatchingPending: (predicate: (p: PendingMessage) => boolean) => void;
}

interface WsFrame {
   event: string;
   data: ChatMessage;
}

/**
 * Subscribes to the conversation's WebSocket feed and pipes `new_message`
 * frames into the message list, deduping by id and reconciling with optimistic
 * outgoing messages (match by template_id + role, case-insensitive — the
 * backend may capitalize 'Worker').
 */
export function useChatWsListener({
   wsUrl,
   conversationId,
   appendMessage,
   dropMatchingPending,
}: UseChatWsListenerOptions): void {
   const isActive = conversationId > 0;

   const onMessage = useCallback(
      (event: MessageEvent) => {
         try {
            const frame = JSON.parse(event.data as string) as WsFrame;
            if (frame.event !== 'new_message' || !frame.data?.id) return;

            // Drop stale frames from a previous conversation.
            if (
               frame.data.conversation_id &&
               frame.data.conversation_id !== conversationId
            ) {
               return;
            }

            appendMessage(frame.data);

            const frameRole =
               typeof frame.data.sender_role === 'string'
                  ? frame.data.sender_role.toLowerCase()
                  : '';

            dropMatchingPending(
               (p) =>
                  p.senderRole.toLowerCase() === frameRole &&
                  p.templateId === frame.data.template_id
            );
         } catch {
            // Ignore malformed frames
         }
      },
      [conversationId, appendMessage, dropMatchingPending]
   );

   useWebSocket(
      useMemo(
         () => ({
            url: wsUrl ?? '',
            enabled: isActive && !!wsUrl,
            onMessage,
         }),
         [wsUrl, isActive, onMessage]
      )
   );
}
