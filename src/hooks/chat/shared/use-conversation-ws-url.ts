'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Builds the authenticated WebSocket URL for a conversation, or null when
 * the conversation isn't ready (id <= 0).
 */
export function useConversationWsUrl(conversationId: number): string | null {
   const { data: session } = useSession();
   const token = session?.user?.accessToken ?? '';

   return useMemo(
      () =>
         conversationId > 0
            ? `${process.env.NEXT_PUBLIC_WS_URL}/conversations/${conversationId}/ws?token=${token}`
            : null,
      [conversationId, token]
   );
}
