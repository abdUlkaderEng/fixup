'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMessageTopics } from '@/hooks/admin';
import type { MessageTopic } from '@/types/admin/messages';

export interface UseChatTopicsReturn {
   topics: MessageTopic[];
   selectedTopicId: number | null;
   selectedTopic: MessageTopic | null;
   setSelectedTopicId: (id: number) => void;
   isLoadingTopics: boolean;
}

/**
 * Loads message topics and tracks the user's current selection.
 * Defaults to the first topic once the list arrives.
 */
export function useChatTopics(): UseChatTopicsReturn {
   const { topics, isLoading: isLoadingTopics } = useMessageTopics();
   const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

   useEffect(() => {
      if (selectedTopicId === null && topics.length > 0) {
         setSelectedTopicId(topics[0].id);
      }
   }, [topics, selectedTopicId]);

   const selectedTopic = useMemo(
      () => topics.find((t) => t.id === selectedTopicId) ?? null,
      [topics, selectedTopicId]
   );

   return {
      topics,
      selectedTopicId,
      selectedTopic,
      setSelectedTopicId,
      isLoadingTopics,
   };
}
