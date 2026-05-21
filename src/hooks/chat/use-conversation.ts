'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { conversationsApi } from '@/api/chat';
import { useMutation } from '@/hooks/admin/shared';
import {
   PRICE_TOPIC_TEMPLATES,
   type Conversation,
   type UseConversationReturn,
} from '@/types/chat';
import { useChat } from './use-chat';

export function useConversation(
   workerId: number,
   conversationId?: number
): UseConversationReturn {
   const { data: session } = useSession();
   const [localConversation, setLocalConversation] =
      useState<Conversation | null>(null);

   // Prefer the externally-tracked id (already created this session) over local state
   const resolvedId = conversationId ?? localConversation?.id;

   const { mutate: startConversation, isLoading: isStarting } = useMutation(
      () =>
         conversationsApi.start({
            worker_id: workerId,
            topic: 'السعر',
            // order_id: orderId, // add later when wired to the API
         }),
      {
         errorMessage: 'تعذر بدء المحادثة',
         onSuccess: (res) => setLocalConversation(res.conversation),
      }
   );

   const token = session?.user?.accessToken ?? '';

   const wsUrl = useMemo(
      () =>
         resolvedId
            ? `${process.env.NEXT_PUBLIC_WS_URL}/conversations/${resolvedId}/ws?token=${token}`
            : null,
      [resolvedId, token]
   );

   const conversation = useMemo<Conversation | null>(
      () =>
         resolvedId ? ({ id: resolvedId } as Conversation) : localConversation,
      [resolvedId, localConversation]
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
      () => PRICE_TOPIC_TEMPLATES.filter((t) => t.forRole === 'customer'),
      []
   );

   const chat = useChat({
      conversationId: resolvedId ?? 0,
      currentUserRole: 'customer',
      wsUrl,
      send,
      templates,
   });

   return {
      conversation,
      isStarting,
      chatReady: !!conversation,
      startConversation,
      chat,
      templates,
   };
}
