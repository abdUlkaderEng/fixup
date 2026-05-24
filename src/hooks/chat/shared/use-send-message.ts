'use client';

import { useCallback } from 'react';
import { conversationsApi } from '@/api/chat';
import type { ChatMessage } from '@/types/chat';

export type SendMessageFn = (
   conversationId: number,
   templateId: number
) => Promise<ChatMessage>;

/**
 * Stable callback that POSTs a template message to a conversation and
 * resolves with the persisted ChatMessage.
 */
export function useSendMessage(): SendMessageFn {
   return useCallback(
      (cid, templateId) =>
         conversationsApi
            .sendMessage({ conversation_id: cid, template_id: templateId })
            .then((r) => r.message),
      []
   );
}
