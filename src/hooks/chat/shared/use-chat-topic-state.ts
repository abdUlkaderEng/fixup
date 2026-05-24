'use client';

import { useMemo } from 'react';
import type { ChatTopicState } from '@/types/chat';

interface UseChatTopicStateOptions {
   topics: { id: number; topic: string }[];
   selectedTopicId: number | null;
   setSelectedTopicId: (id: number) => void;
   isLoading: boolean;
}

/**
 * Adapts internal topic state into the ChatTopicState the ChatWindow expects.
 */
export function useChatTopicState({
   topics,
   selectedTopicId,
   setSelectedTopicId,
   isLoading,
}: UseChatTopicStateOptions): ChatTopicState {
   return useMemo(
      () => ({
         topics: topics.map((t) => ({ id: t.id, topic: t.topic })),
         selectedTopicId,
         onChangeTopic: setSelectedTopicId,
         isLoading,
      }),
      [topics, selectedTopicId, setSelectedTopicId, isLoading]
   );
}
