'use client';

import { useCallback, useMemo, useState } from 'react';
import { conversationsApi } from '@/api/chat';
import { useMutation } from '@/hooks/admin/shared';
import type { Conversation, UseConversationReturn } from '@/types/chat';
import { useChat } from './use-chat';
import {
   useChatTemplates,
   useChatTopicState,
   useChatTopics,
   useConversationWsUrl,
   useSendMessage,
} from './shared';

export function useConversation(
   workerId: number,
   conversationId?: number
): UseConversationReturn {
   const [localConversation, setLocalConversation] =
      useState<Conversation | null>(null);

   const {
      topics,
      selectedTopic,
      selectedTopicId,
      setSelectedTopicId,
      isLoadingTopics,
   } = useChatTopics();

   // Prefer the externally-tracked id (already created this session) over local state.
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

   const wsUrl = useConversationWsUrl(resolvedId ?? 0);
   const send = useSendMessage();

   const conversation = useMemo<Conversation | null>(
      () =>
         resolvedId ? ({ id: resolvedId } as Conversation) : localConversation,
      [resolvedId, localConversation]
   );

   const { templates, isLoadingTemplates } = useChatTemplates({
      topicId: selectedTopic?.id,
      topicName: selectedTopic?.topic,
      role: 'customer',
   });

   const chat = useChat({
      conversationId: resolvedId ?? 0,
      currentUserRole: 'customer',
      wsUrl,
      send,
      templates,
   });

   const topicState = useChatTopicState({
      topics,
      selectedTopicId,
      setSelectedTopicId,
      isLoading: isLoadingTopics || isLoadingTemplates,
   });

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
