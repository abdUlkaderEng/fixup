'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerChatSheet } from '@/components/chat';
import type { OrderOffer } from '@/types/entities/order';

export function ChatTrigger({ offer }: { offer: OrderOffer }) {
   const [open, setOpen] = useState(false);
   const [conversationId, setConversationId] = useState<number | undefined>(
      offer.conversation_id ?? undefined
   );
   return (
      <>
         <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
            className="gap-1.5"
         >
            <MessageCircle className="h-4 w-4" />
            تواصل
         </Button>
         <CustomerChatSheet
            open={open}
            onOpenChange={setOpen}
            workerId={offer.worker_id}
            conversationId={conversationId}
            onConversationCreated={setConversationId}
         />
      </>
   );
}
