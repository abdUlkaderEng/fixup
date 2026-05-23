'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { conversationsApi } from '@/api/chat';
import { useMessageTopics, useMessageTemplates } from '@/hooks/admin';
import type {
   ChatTopicState,
   MessageTemplate as ChatMessageTemplate,
   UseWorkerConversationReturn,
} from '@/types/chat';
import { useChat } from './use-chat';

export function useWorkerConversation(
   conversationId: number
): UseWorkerConversationReturn {
   const { data: session } = useSession();
   const token = session?.user?.accessToken ?? '';

   const { topics, isLoading: isLoadingTopics } = useMessageTopics();
   const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

   // Default to the first topic once loaded; worker can switch freely.
   useEffect(() => {
      if (selectedTopicId === null && topics.length > 0) {
         setSelectedTopicId(topics[0].id);
      }
   }, [topics, selectedTopicId]);

   const selectedTopic = useMemo(
      () => topics.find((t) => t.id === selectedTopicId) ?? null,
      [topics, selectedTopicId]
   );

   const wsUrl = useMemo(
      () =>
         conversationId > 0
            ? `${process.env.NEXT_PUBLIC_WS_URL}/conversations/${conversationId}/ws?token=${token}`
            : null,
      [conversationId, token]
   );

   const send = useCallback(
      (cid: number, templateId: number) =>
         conversationsApi
            .sendMessage({
               conversation_id: cid,
               template_id: templateId,
            })
            .then((r) => r.message),
      []
   );

   const { templates: adminTemplates, isLoading: isLoadingTemplates } =
      useMessageTemplates({
         topicName: selectedTopic?.topic,
         topicId: selectedTopic?.id,
         senderType: 'worker',
      });

   const templates = useMemo<ChatMessageTemplate[]>(
      () =>
         adminTemplates.map((t) => ({
            id: t.id,
            text: t.text,
            topic: selectedTopic?.topic ?? '',
            forRole: 'worker',
         })),
      [adminTemplates, selectedTopic]
   );

   const chat = useChat({
      conversationId,
      currentUserRole: 'worker',
      wsUrl,
      send,
      templates,
   });

   const topicState: ChatTopicState = useMemo(
      () => ({
         topics: topics.map((t) => ({ id: t.id, topic: t.topic })),
         selectedTopicId,
         onChangeTopic: (id: number) => setSelectedTopicId(id),
         isLoading: isLoadingTopics || isLoadingTemplates,
      }),
      [topics, selectedTopicId, isLoadingTopics, isLoadingTemplates]
   );

   return { chat, templates, topicState };
}
