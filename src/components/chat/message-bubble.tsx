import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { ChatMessage, MessageSenderRole } from '@/types/chat';

interface MessageBubbleProps {
   message: ChatMessage;
   currentUserRole: MessageSenderRole;
}

export function MessageBubble({
   message,
   currentUserRole,
}: MessageBubbleProps) {
   const isSent = message.sender_role === currentUserRole;

   return (
      <div
         className={cn('flex w-full', isSent ? 'justify-start' : 'justify-end')}
      >
         <div
            className={cn(
               'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
               isSent
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
            )}
         >
            <p>{message.message}</p>
            <p
               className={cn(
                  'mt-1 text-[10px]',
                  isSent
                     ? 'text-primary-foreground/60'
                     : 'text-muted-foreground'
               )}
            >
               {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                  locale: ar,
               })}
            </p>
         </div>
      </div>
   );
}
