'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { aiChatApi } from '@/api/chat';
import {
   generateRequestKey,
   useFetch,
   useMutation,
} from '@/hooks/admin/shared';
import type { AiChatHistoryMessage, AiChatUiMessage } from '@/types/chat';

const WELCOME_TEXT =
   'مرحباً بك في فيكس. أنا مساعدك الذكي للمساعدة في الخدمات والطلبات داخل التطبيق.';

function createLocalMessage(
   role: 'user' | 'assistant',
   text: string
): AiChatUiMessage {
   return {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role,
      text,
      createdAt: new Date().toISOString(),
   };
}

function mapHistoryMessage(message: AiChatHistoryMessage): AiChatUiMessage {
   return {
      id: String(message.id),
      role: message.role,
      text: message.message,
      createdAt: message.created_at,
   };
}

export function useAiChat() {
   const { status } = useSession();
   const [messages, setMessages] = useState<AiChatUiMessage[]>([]);

   const fetcher = useCallback(
      () =>
         aiChatApi
            .getMessages()
            .then((response) => response.messages.map(mapHistoryMessage)),
      []
   );

   const handleSuccess = useCallback((data: AiChatUiMessage[]) => {
      setMessages(
         data.length > 0
            ? data
            : [createLocalMessage('assistant', WELCOME_TEXT)]
      );
   }, []);

   const history = useFetch<AiChatUiMessage[]>(
      fetcher,
      generateRequestKey('ai-chat-history'),
      {
         enabled: false,
         errorMessage: 'تعذر تحميل سجل المحادثة',
         onSuccess: handleSuccess,
      }
   );
   const {
      refetch,
      isLoading: isLoadingHistory,
      error: historyError,
   } = history;

   useEffect(() => {
      if (status === 'authenticated') {
         refetch();
      }
   }, [refetch, status]);

   const sendMutation = useMutation(
      useCallback(
         async (message: string) => aiChatApi.sendMessage({ message }),
         []
      ),
      {
         errorMessage: 'تعذر إرسال الرسالة',
         skipAuthCheck: false,
      }
   );

   const sendMessage = async (text: string) => {
      const content = text.trim();
      if (!content || sendMutation.isLoading) return;

      const userMessage = createLocalMessage('user', content);
      setMessages((prev) => [...prev, userMessage]);

      const result = await sendMutation.mutate(content);

      if (!result?.success) {
         // Remove the optimistic message and sync with server to avoid stale state on re-open
         setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
         refetch();
         return;
      }

      setMessages((prev) => [
         ...prev,
         createLocalMessage('assistant', result.reply || 'تم استلام رسالتك.'),
      ]);
   };

   const reloadHistory = () => {
      refetch();
   };

   return {
      messages,
      isLoadingHistory,
      isSending: sendMutation.isLoading,
      error: historyError ?? sendMutation.error,
      sendMessage,
      reloadHistory,
   };
}
