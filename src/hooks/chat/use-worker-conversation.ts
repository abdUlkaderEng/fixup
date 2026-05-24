'use client';

import type { UseWorkerConversationReturn } from '@/types/chat';
import { useChat } from './use-chat';
import {
   useChatTemplates,
   useChatTopicState,
   useChatTopics,
   useConversationWsUrl,
   useSendMessage,
} from './shared';

export function useWorkerConversation(
   conversationId: number
): UseWorkerConversationReturn {
   const {
      topics,
      selectedTopic,
      selectedTopicId,
      setSelectedTopicId,
      isLoadingTopics,
   } = useChatTopics();

   const wsUrl = useConversationWsUrl(conversationId);
   const send = useSendMessage();

   const { templates, isLoadingTemplates } = useChatTemplates({
      topicId: selectedTopic?.id,
      topicName: selectedTopic?.topic,
      role: 'worker',
   });

   const chat = useChat({
      conversationId,
      currentUserRole: 'worker',
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

   return { chat, templates, topicState };
}
