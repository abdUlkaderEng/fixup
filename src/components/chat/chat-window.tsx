'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingState, EmptyState } from '@/components/ui';
import { MessageCircle } from 'lucide-react';
import type {
   ChatMessage,
   MessageSenderRole,
   MessageTemplate,
} from '@/types/chat';
import { MessageBubble } from './message-bubble';
import { TemplateSelector } from './template-selector';

interface ChatWindowProps {
   messages: ChatMessage[];
   templates: MessageTemplate[];
   currentUserRole: MessageSenderRole;
   isSending: boolean;
   isLoadingMessages: boolean;
   onSend: (templateId: number) => void;
   header?: ReactNode;
}

export function ChatWindow({
   messages,
   templates,
   currentUserRole,
   isSending,
   isLoadingMessages,
   onSend,
   header,
}: ChatWindowProps) {
   const bottomRef = useRef<HTMLDivElement>(null);

   // Auto-scroll to newest message
   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div className="flex h-full flex-col" dir="rtl">
         {header && <div className="flex-none">{header}</div>}

         <ScrollArea className="flex-1 px-4 py-3">
            {isLoadingMessages ? (
               <LoadingState />
            ) : messages.length === 0 ? (
               <EmptyState
                  icon={<MessageCircle className="h-10 w-10" />}
                  title="لا توجد رسائل بعد"
                  description="اختر رسالة من الخيارات أدناه لبدء المحادثة"
               />
            ) : (
               <div className="space-y-3">
                  {messages.map((msg) => (
                     <MessageBubble
                        key={msg.id}
                        message={msg}
                        currentUserRole={currentUserRole}
                     />
                  ))}
               </div>
            )}
            <div ref={bottomRef} />
         </ScrollArea>

         <div className="flex-none">
            <Separator />
            <TemplateSelector
               templates={templates}
               onSelect={onSend}
               disabled={isSending}
            />
         </div>
      </div>
   );
}
