'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { WorkerNotification } from '@/types/entities/notification';
import type { NotificationThemeTokens } from './notification-theme';

interface NotificationItemProps {
   notification: WorkerNotification;
   resolveHref: (notification: WorkerNotification) => string;
   tokens: NotificationThemeTokens;
   onNavigate?: () => void;
   onMarkRead?: (id: number) => void;
}

export function NotificationItem({
   notification,
   resolveHref,
   tokens,
   onNavigate,
   onMarkRead,
}: NotificationItemProps) {
   const href = resolveHref(notification);

   const relativeTime = formatDistanceToNow(new Date(notification.created_at), {
      addSuffix: true,
      locale: arSA,
   });

   const handleClick = () => {
      if (!notification.is_read) onMarkRead?.(notification.id);
      onNavigate?.();
   };

   return (
      <Link
         href={href}
         onClick={handleClick}
         className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-lg mx-1',
            notification.is_read ? tokens.itemRead : tokens.itemUnread,
            tokens.itemHover
         )}
      >
         {/* Unread indicator */}
         <div className="mt-1.5 shrink-0 w-2 h-2">
            {!notification.is_read && (
               <span
                  className={cn('block w-2 h-2 rounded-full', tokens.dot)}
                  aria-label="غير مقروء"
               />
            )}
         </div>

         {/* Content */}
         <div className="flex-1 min-w-0">
            <p
               className={cn(
                  'text-sm font-medium leading-snug truncate',
                  tokens.itemTitle,
                  !notification.is_read && 'font-semibold'
               )}
            >
               {notification.title}
            </p>
            {notification.body && (
               <p
                  className={cn(
                     'mt-0.5 text-xs leading-relaxed line-clamp-2',
                     tokens.itemBody
                  )}
               >
                  {notification.body}
               </p>
            )}
            <p className={cn('mt-1 text-[11px]', tokens.itemTime)}>
               {relativeTime}
            </p>
         </div>
      </Link>
   );
}
