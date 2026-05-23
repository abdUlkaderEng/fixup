'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { conversationsApi } from '@/api/chat';
import { useMutation } from '@/hooks/admin/shared';
import { useMessageTopics, useMessageTemplates } from '@/hooks/admin';
import type {
   ChatTopicState,
   Conversation,
   MessageTemplate as ChatMessageTemplate,
   UseConversationReturn,
} from '@/types/chat';
import { useChat } from './use-chat';

export function useConversation(
   workerId: number,
   conversationId?: number
): UseConversationReturn {
   const { data: session } = useSession();
   const [localConversation, setLocalConversation] =
      useState<Conversation | null>(null);

   const { topics, isLoading: isLoadingTopics } = useMessageTopics();

   const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

   // Default the picker to the first topic once the list arrives.
   useEffect(() => {
      if (selectedTopicId === null && topics.length > 0) {
         setSelectedTopicId(topics[0].id);
      }
   }, [topics, selectedTopicId]);

   const selectedTopic = useMemo(
      () => topics.find((t) => t.id === selectedTopicId) ?? null,
      [topics, selectedTopicId]
   );

   // Prefer the externally-tracked id (already created this session) over local state
   const resolvedId = conversationId ?? localConversation?.id;

   const { mutate: startConversationMutation, isLoading: isStarting } =
      useMutation(
         (topicId: number) =>
            conversationsApi.start({
               worker_id: workerId,
               topic_id: topicId,
            }),
         {
            errorMessage: 'تعذر بدء المحادثة',
            onSuccess: (res) => setLocalConversation(res.conversation),
         }
      );

   const startConversation = useCallback(async () => {
      if (!selectedTopic) return null;
      return await startConversationMutation(selectedTopic.id);
   }, [selectedTopic, startConversationMutation]);

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
      (cid: number, templateId: number) =>
         conversationsApi
            .sendMessage({
               conversation_id: cid,
               template_id: templateId,
            })
            .then((r) => r.message),
      []
   );

   // Templates are filtered server-side by (topic name, sender_type).
   const { templates: adminTemplates, isLoading: isLoadingTemplates } =
      useMessageTemplates({
         topicName: selectedTopic?.topic,
         topicId: selectedTopic?.id,
         senderType: 'customer',
      });

   const templates = useMemo<ChatMessageTemplate[]>(
      () =>
         adminTemplates.map((t) => ({
            id: t.id,
            text: t.text,
            topic: selectedTopic?.topic ?? '',
            forRole: 'customer',
         })),
      [adminTemplates, selectedTopic]
   );

   const chat = useChat({
      conversationId: resolvedId ?? 0,
      currentUserRole: 'customer',
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

   return {
      conversation,
      isStarting,
      chatReady: !!conversation,
      startConversation,
      chat,
      templates,
      topicState,
   };
}
