'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChatMessage, MessageSenderRole } from '@/types/chat';

// Client-only optimistic message. Lives alongside server messages in the UI list.
// Negative ids guarantee no collision with backend ids.
export interface PendingMessage {
   tempId: number;
   templateId: number;
   text: string;
   senderRole: MessageSenderRole;
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

export interface UsePendingMessagesReturn {
   pendingMessages: ChatMessage[];
   pendingIds: Set<number>;
   failedIds: Set<number>;
   addPending: (input: Omit<PendingMessage, 'tempId' | 'failed'>) => number;
   markConfirmed: (tempId: number) => void;
   markFailed: (tempId: number) => void;
   dropMatching: (predicate: (p: PendingMessage) => boolean) => void;
   clear: () => void;
}

/**
 * Tracks optimistic outgoing messages awaiting server confirmation.
 * Hands back ChatMessage-shaped projections plus lookup sets for the UI.
 */
export function usePendingMessages(): UsePendingMessagesReturn {
   const [pending, setPending] = useState<PendingMessage[]>([]);
   const tempIdRef = useRef(-1);

   const addPending = useCallback(
      (input: Omit<PendingMessage, 'tempId' | 'failed'>) => {
         const tempId = tempIdRef.current--;
         setPending((prev) => [...prev, { ...input, tempId, failed: false }]);
         return tempId;
      },
      []
   );

   const markConfirmed = useCallback((tempId: number) => {
      setPending((prev) => prev.filter((p) => p.tempId !== tempId));
   }, []);

   const markFailed = useCallback((tempId: number) => {
      setPending((prev) =>
         prev.map((p) => (p.tempId === tempId ? { ...p, failed: true } : p))
      );
   }, []);

   const dropMatching = useCallback(
      (predicate: (p: PendingMessage) => boolean) => {
         setPending((prev) => prev.filter((p) => !predicate(p)));
      },
      []
   );

   const clear = useCallback(() => setPending([]), []);

   const pendingMessages = useMemo(
      () => pending.map(pendingToChatMessage),
      [pending]
   );

   const pendingIds = useMemo(
      () => new Set(pending.filter((p) => !p.failed).map((p) => p.tempId)),
      [pending]
   );

   const failedIds = useMemo(
      () => new Set(pending.filter((p) => p.failed).map((p) => p.tempId)),
      [pending]
   );

   return {
      pendingMessages,
      pendingIds,
      failedIds,
      addPending,
      markConfirmed,
      markFailed,
      dropMatching,
      clear,
   };
}
