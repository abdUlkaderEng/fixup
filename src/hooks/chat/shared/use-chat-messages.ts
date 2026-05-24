'use client';

import { useCallback, useEffect } from 'react';
import { conversationsApi } from '@/api/chat';
import {
   generateRequestKey,
   useFetch,
   type UseFetchReturn,
} from '@/hooks/admin/shared';
import type { ChatMessage } from '@/types/chat';

export interface UseChatMessagesReturn extends Pick<
   UseFetchReturn<ChatMessage[]>,
   'isLoading' | 'error' | 'setData'
> {
   messages: ChatMessage[];
   refetch: () => void;
}

/**
 * Server-side message list for a conversation. Stays inert until the
 * conversationId is positive, then auto-fetches on every change.
 */
export function useChatMessages(conversationId: number): UseChatMessagesReturn {
   const isActive = conversationId > 0;

   const fetcher = useCallback(
      () =>
         conversationsApi.getMessages(conversationId).then((r) => r.messages),
      [conversationId]
   );

   const { data, isLoading, error, refetch, setData } = useFetch<ChatMessage[]>(
      fetcher,
      generateRequestKey('chat-messages', conversationId),
      { enabled: false, errorMessage: 'تعذر تحميل الرسائل' }
   );

   // useFetch freezes the `enabled` flag at mount, so trigger manually whenever
   // the conversation becomes valid.
   useEffect(() => {
      if (isActive) refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [conversationId]);

   // Clear when the conversation closes (id resets to 0).
   useEffect(() => {
      if (!isActive) setData(null);
   }, [isActive, setData]);

   return {
      messages: data ?? [],
      isLoading,
      error,
      refetch,
      setData,
   };
}
