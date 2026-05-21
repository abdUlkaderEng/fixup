'use client';

import { MessageCircle } from 'lucide-react';
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from '@/components/ui/sheet';
import { useWorkerConversation } from '@/hooks/chat';
import { ChatWindow } from './chat-window';
import { OrderSummaryBanner } from './order-summary-banner';

interface WorkerChatSheetProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   conversationId: number;
   orderId: number;
}

export function WorkerChatSheet({
   open,
   onOpenChange,
   conversationId,
   orderId,
}: WorkerChatSheetProps) {
   const { chat, templates } = useWorkerConversation(conversationId);

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent side="right" className="flex flex-col p-0 sm:max-w-md">
            <SheetHeader className="border-b px-4 py-3">
               <SheetTitle
                  className="flex items-center gap-2 text-base"
                  dir="rtl"
               >
                  <MessageCircle className="h-4 w-4" />
                  محادثة العميل
               </SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col overflow-hidden">
               <ChatWindow
                  messages={chat.messages}
                  templates={templates}
                  currentUserRole="worker"
                  isSending={chat.isSending}
                  isLoadingMessages={chat.isLoadingMessages}
                  onSend={chat.sendMessage}
                  header={<OrderSummaryBanner orderId={orderId} />}
                  error={chat.error}
                  pendingIds={chat.pendingIds}
                  failedIds={chat.failedIds}
               />
            </div>
         </SheetContent>
      </Sheet>
   );
}
