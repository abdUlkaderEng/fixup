'use client';

import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from '@/components/ui/sheet';
import { useConversation } from '@/hooks/chat';
import { ChatWindow } from './chat-window';

interface CustomerChatSheetProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   workerId: number;
   workerName?: string;
   conversationId?: number;
   onConversationCreated?: (conversationId: number) => void;
}

export function CustomerChatSheet({
   open,
   onOpenChange,
   workerId,
   workerName,
   conversationId,
   onConversationCreated,
}: CustomerChatSheetProps) {
   const { chatReady, isStarting, startConversation, chat, templates } =
      useConversation(workerId, conversationId);

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent side="right" className="flex flex-col p-0 sm:max-w-md">
            <SheetHeader className="border-b px-4 py-3">
               <SheetTitle
                  className="flex items-center gap-2 text-base"
                  dir="rtl"
               >
                  <MessageCircle className="h-4 w-4" />
                  {workerName ? `التواصل مع ${workerName}` : 'التواصل مع الفني'}
               </SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col overflow-hidden">
               {chatReady ? (
                  <ChatWindow
                     messages={chat.messages}
                     templates={templates}
                     currentUserRole="customer"
                     isSending={chat.isSending}
                     isLoadingMessages={chat.isLoadingMessages}
                     onSend={chat.sendMessage}
                  />
               ) : (
                  <div
                     className="flex flex-1 flex-col items-center justify-center gap-4 p-6"
                     dir="rtl"
                  >
                     <MessageCircle className="h-12 w-12 text-muted-foreground" />
                     <div className="text-center">
                        <p className="font-medium text-foreground">
                           ابدأ محادثة مع الفني
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                           اضغط على الزر أدناه لبدء محادثة حول عرض السعر
                        </p>
                     </div>
                     <Button
                        onClick={async () => {
                           const res = await startConversation();

                           if (res?.conversation?.id) {
                              console.log(res);
                              onConversationCreated?.(res.conversation.id);
                              console.log(conversationId);
                           }
                        }}
                        disabled={isStarting}
                        className="mt-2"
                     >
                        {isStarting ? (
                           <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              جاري الإنشاء...
                           </>
                        ) : (
                           'ابدأ المحادثة'
                        )}
                     </Button>
                  </div>
               )}
            </div>
         </SheetContent>
      </Sheet>
   );
}
