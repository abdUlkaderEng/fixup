import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, MessageSenderRole } from '@/types/chat';

interface MessageBubbleProps {
   message: ChatMessage;
   currentUserRole: MessageSenderRole;
   currentUserId: number;
   pending?: boolean;
   failed?: boolean;
}

export function MessageBubble({
   message,
   currentUserRole,
   currentUserId,
   pending = false,
   failed = false,
}: MessageBubbleProps) {
   // Ownership is determined by sender_id matching the logged-in user.
   // sender_role is unreliable across the optimistic → confirmed transition
   // (backend may return a differently-cased / differently-shaped role value).
   const isSent =
      currentUserId > 0 && Number(message.sender_id) === currentUserId;

   // Own-bubble color is themed by the viewer's role:
   // worker → amber/yellow, customer → sky/blue.
   const ownBubble =
      currentUserRole === 'worker'
         ? 'bg-amber-500 text-white dark:bg-amber-500/90'
         : 'bg-sky-500 text-white dark:bg-sky-500/90';
   const ownMetaText =
      currentUserRole === 'worker' ? 'text-amber-50/80' : 'text-sky-50/80';

   return (
      <div
         className={cn('flex w-full', isSent ? 'justify-end' : 'justify-start')}
      >
         <div
            className={cn(
               'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed transition-opacity',
               isSent ? ownBubble : 'bg-muted text-foreground',
               pending && 'opacity-60',
               failed &&
                  'border border-destructive/60 bg-destructive/10 text-destructive'
            )}
         >
            <p>{message.message}</p>
            <p
               className={cn(
                  'mt-1 flex items-center gap-1 text-[10px]',
                  failed
                     ? 'text-destructive'
                     : isSent
                       ? ownMetaText
                       : 'text-muted-foreground'
               )}
            >
               {pending && <Clock className="h-3 w-3" />}
               {failed && <AlertCircle className="h-3 w-3" />}
               <span>
                  {failed
                     ? 'تعذر الإرسال'
                     : pending
                       ? 'جاري الإرسال…'
                       : formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: ar,
                         })}
               </span>
            </p>
         </div>
      </div>
   );
}
