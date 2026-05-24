'use client';

import type { AiChatUiMessage } from '@/types/chat';
import { useAiChatHistory, useAiChatSender } from './ai';

export interface UseAiChatReturn {
   messages: AiChatUiMessage[];
   isLoadingHistory: boolean;
   isSending: boolean;
   error: Error | null;
   sendMessage: (text: string) => Promise<void>;
   reloadHistory: () => void;
}

export function useAiChat(): UseAiChatReturn {
   const {
      messages,
      setMessages,
      isLoading: isLoadingHistory,
      error: historyError,
      reload: reloadHistory,
   } = useAiChatHistory();

   const {
      sendMessage,
      isSending,
      error: sendError,
   } = useAiChatSender({ setMessages, onSendFailed: reloadHistory });

   return {
      messages,
      isLoadingHistory,
      isSending,
      sendMessage,
      reloadHistory,
      error: historyError ?? sendError,
   };
}
