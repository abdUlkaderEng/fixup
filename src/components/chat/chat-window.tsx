'use client';

import { type ReactNode, useCallback, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingState, EmptyState } from '@/components/ui';
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
   error?: Error | null;
   pendingIds?: Set<number>;
   failedIds?: Set<number>;
}

// Threshold (px) within which we consider the user "at the bottom" and
// therefore safe to auto-scroll on new messages.
const STICK_TO_BOTTOM_PX = 80;

export function ChatWindow({
   messages,
   templates,
   currentUserRole,
   isSending,
   isLoadingMessages,
   onSend,
   header,
   error,
   pendingIds,
   failedIds,
}: ChatWindowProps) {
   const { data: session } = useSession();
   const currentUserId = Number(session?.user?.id ?? 0);
   const scrollWrapperRef = useRef<HTMLDivElement>(null);
   const bottomRef = useRef<HTMLDivElement>(null);
   const wasAtBottomRef = useRef(true);

   const findScroller = useCallback((): HTMLElement | null => {
      const root = scrollWrapperRef.current;
      if (!root) return null;
      return root.querySelector(
         '[data-radix-scroll-area-viewport],[data-slot="scroll-area-viewport"]'
      ) as HTMLElement | null;
   }, []);

   // Track whether the user is at the bottom BEFORE the next message render.
   const handleScroll = useCallback(() => {
      const el = findScroller();
      if (!el) return;
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      wasAtBottomRef.current = distance <= STICK_TO_BOTTOM_PX;
   }, [findScroller]);

   useEffect(() => {
      const el = findScroller();
      if (!el) return;
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
   }, [findScroller, handleScroll]);

   // Auto-scroll only if the user was already near the bottom.
   useEffect(() => {
      if (!wasAtBottomRef.current) return;
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages.length]);

   return (
      <div className="flex h-full flex-col" dir="rtl">
         {header && <div className="flex-none">{header}</div>}

         <div ref={scrollWrapperRef} className="flex flex-1 min-h-0">
            <ScrollArea className="flex-1 px-4 py-3">
               {isLoadingMessages ? (
                  <LoadingState />
               ) : error ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-destructive">
                     <AlertCircle className="h-8 w-8" />
                     <p>تعذر تحميل الرسائل</p>
                     <p className="text-xs text-muted-foreground">
                        تحقق من اتصالك بالإنترنت وحاول مرة أخرى
                     </p>
                  </div>
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
                           currentUserId={currentUserId}
                           pending={pendingIds?.has(msg.id) ?? false}
                           failed={failedIds?.has(msg.id) ?? false}
                        />
                     ))}
                  </div>
               )}
               <div ref={bottomRef} />
            </ScrollArea>
         </div>

         <div className="flex-none">
            <Separator />
            <TemplateSelector
               templates={templates}
               onSelect={onSend}
               disabled={isSending}
               isSending={isSending}
            />
         </div>
      </div>
   );
}
