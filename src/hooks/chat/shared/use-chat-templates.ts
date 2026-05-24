'use client';

import { useMemo } from 'react';
import { useMessageTemplates } from '@/hooks/admin';
import type {
   MessageSenderRole,
   MessageTemplate as ChatMessageTemplate,
} from '@/types/chat';

interface UseChatTemplatesOptions {
   topicId: number | undefined;
   topicName: string | undefined;
   role: MessageSenderRole;
}

export interface UseChatTemplatesReturn {
   templates: ChatMessageTemplate[];
   isLoadingTemplates: boolean;
}

/**
 * Fetches templates filtered server-side by (topic, sender role) and
 * normalizes the admin payload into the chat-facing shape.
 */
export function useChatTemplates({
   topicId,
   topicName,
   role,
}: UseChatTemplatesOptions): UseChatTemplatesReturn {
   const { templates: adminTemplates, isLoading: isLoadingTemplates } =
      useMessageTemplates({
         topicId,
         topicName,
         senderType: role,
      });

   const templates = useMemo<ChatMessageTemplate[]>(
      () =>
         adminTemplates.map((t) => ({
            id: t.id,
            text: t.text,
            topic: topicName ?? '',
            forRole: role,
         })),
      [adminTemplates, topicName, role]
   );

   return { templates, isLoadingTemplates };
}
