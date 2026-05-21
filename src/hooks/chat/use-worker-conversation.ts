'use client';

import { useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { conversationsApi } from '@/api/chat';
import {
   PRICE_TOPIC_TEMPLATES,
   type UseWorkerConversationReturn,
} from '@/types/chat';
import { useChat } from './use-chat';

export function useWorkerConversation(
   conversationId: number
): UseWorkerConversationReturn {
   const { data: session } = useSession();
   const token = session?.user?.accessToken ?? '';

   const wsUrl = useMemo(
      () =>
         conversationId > 0
            ? `${process.env.NEXT_PUBLIC_WS_URL}/conversations/${conversationId}/ws?token=${token}`
            : null,
      [conversationId, token]
   );

   const send = useCallback(
      (conversationId: number, templateId: number) =>
         conversationsApi
            .sendMessage({
               conversation_id: conversationId,
               template_id: templateId,
            })
            .then((r) => r.message),
      []
   );

   const templates = useMemo(
      () => PRICE_TOPIC_TEMPLATES.filter((t) => t.forRole === 'worker'),
      []
   );

   const chat = useChat({
      conversationId,
      currentUserRole: 'worker',
      wsUrl,
      send,
      templates,
   });

   return { chat, templates };
}
