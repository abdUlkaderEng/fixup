'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { aiChatApi } from '@/api/chat';
import { generateRequestKey, useFetch } from '@/hooks/admin/shared';
import type { AiChatUiMessage } from '@/types/chat';
import {
   AI_WELCOME_TEXT,
   createLocalAiMessage,
   mapAiHistoryMessage,
} from './ai-message';

export interface UseAiChatHistoryReturn {
   messages: AiChatUiMessage[];
   setMessages: React.Dispatch<React.SetStateAction<AiChatUiMessage[]>>;
   isLoading: boolean;
   error: Error | null;
   reload: () => void;
}

/**
 * Loads AI chat history once the user is authenticated. Seeds the list with
 * a welcome message when the server returns no prior messages.
 */
export function useAiChatHistory(): UseAiChatHistoryReturn {
   const { status } = useSession();
   const [messages, setMessages] = useState<AiChatUiMessage[]>([]);

   const fetcher = useCallback(
      () =>
         aiChatApi
            .getMessages()
            .then((response) => response.messages.map(mapAiHistoryMessage)),
      []
   );

   const handleSuccess = useCallback((data: AiChatUiMessage[]) => {
      setMessages(
         data.length > 0
            ? data
            : [createLocalAiMessage('assistant', AI_WELCOME_TEXT)]
      );
   }, []);

   const { refetch, isLoading, error } = useFetch<AiChatUiMessage[]>(
      fetcher,
      generateRequestKey('ai-chat-history'),
      {
         enabled: false,
         errorMessage: 'تعذر تحميل سجل المحادثة',
         onSuccess: handleSuccess,
      }
   );

   useEffect(() => {
      if (status === 'authenticated') refetch();
   }, [refetch, status]);

   return { messages, setMessages, isLoading, error, reload: refetch };
}
