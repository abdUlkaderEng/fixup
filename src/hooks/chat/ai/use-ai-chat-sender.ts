'use client';

import { useCallback } from 'react';
import { aiChatApi } from '@/api/chat';
import { useMutation } from '@/hooks/admin/shared';
import type { AiChatUiMessage } from '@/types/chat';
import { createLocalAiMessage } from './ai-message';

interface UseAiChatSenderOptions {
   setMessages: React.Dispatch<React.SetStateAction<AiChatUiMessage[]>>;
   onSendFailed: () => void;
}

export interface UseAiChatSenderReturn {
   sendMessage: (text: string) => Promise<void>;
   isSending: boolean;
   error: Error | null;
}

const FALLBACK_REPLY = 'تم استلام رسالتك.';

/**
 * Sends a user message to the AI endpoint with optimistic UI:
 * - appends the user bubble immediately,
 * - on success: appends the assistant reply,
 * - on failure: rolls back the optimistic bubble and triggers a history reload
 *   (via `onSendFailed`) so the UI re-syncs with the server.
 */
export function useAiChatSender({
   setMessages,
   onSendFailed,
}: UseAiChatSenderOptions): UseAiChatSenderReturn {
   const mutation = useMutation(
      useCallback(
         async (message: string) => aiChatApi.sendMessage({ message }),
         []
      ),
      {
         errorMessage: 'تعذر إرسال الرسالة',
         skipAuthCheck: false,
      }
   );

   const sendMessage = useCallback(
      async (text: string) => {
         const content = text.trim();
         if (!content || mutation.isLoading) return;

         const userMessage = createLocalAiMessage('user', content);
         setMessages((prev) => [...prev, userMessage]);

         const result = await mutation.mutate(content);

         if (!result?.success) {
            setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
            onSendFailed();
            return;
         }

         setMessages((prev) => [
            ...prev,
            createLocalAiMessage('assistant', result.reply || FALLBACK_REPLY),
         ]);
      },
      [mutation, setMessages, onSendFailed]
   );

   return {
      sendMessage,
      isSending: mutation.isLoading,
      error: mutation.error,
   };
}
