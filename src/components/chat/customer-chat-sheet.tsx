'use client';

import { Loader2, MessageCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
} from '@/components/ui/sheet';
import { useConversation } from '@/hooks/chat';
import { cn } from '@/lib/utils';
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
   const {
      chatReady,
      isStarting,
      startConversation,
      chat,
      templates,
      topicState,
   } = useConversation(workerId, conversationId);

   const hasTopics = topicState.topics.length > 0;
   const canStart = !!topicState.selectedTopicId && !isStarting;

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
                     error={chat.error}
                     pendingIds={chat.pendingIds}
                     failedIds={chat.failedIds}
                     topicState={topicState}
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
                           اختر موضوع المحادثة لبدء التواصل
                        </p>
                     </div>

                     <div className="w-full max-w-xs">
                        <div className="mb-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                           <Tag className="h-3 w-3" />
                           <span>المواضيع المتاحة</span>
                        </div>
                        {topicState.isLoading && !hasTopics ? (
                           <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              جاري تحميل المواضيع...
                           </div>
                        ) : !hasTopics ? (
                           <p className="py-3 text-center text-sm text-muted-foreground">
                              لا توجد مواضيع متاحة حالياً
                           </p>
                        ) : (
                           <div className="flex flex-wrap justify-center gap-2">
                              {topicState.topics.map((t) => {
                                 const isActive =
                                    t.id === topicState.selectedTopicId;
                                 return (
                                    <button
                                       key={t.id}
                                       type="button"
                                       onClick={() =>
                                          topicState.onChangeTopic(t.id)
                                       }
                                       disabled={isStarting}
                                       className={cn(
                                          'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                                          'disabled:cursor-not-allowed disabled:opacity-50',
                                          isActive
                                             ? 'border-primary bg-primary text-primary-foreground'
                                             : 'border-border bg-background text-foreground hover:bg-muted'
                                       )}
                                    >
                                       {t.topic}
                                    </button>
                                 );
                              })}
                           </div>
                        )}
                     </div>

                     <Button
                        onClick={async () => {
                           const res = await startConversation();
                           if (res?.conversation?.id) {
                              onConversationCreated?.(res.conversation.id);
                           }
                        }}
                        disabled={!canStart}
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
