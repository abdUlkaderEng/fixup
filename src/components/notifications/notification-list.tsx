'use client';

import { BellOff, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { WorkerNotification } from '@/types/entities/notification';
import type { NotificationThemeTokens } from './notification-theme';
import { NotificationItem } from './notification-item';

interface NotificationListProps {
   notifications: WorkerNotification[];
   isLoading: boolean;
   resolveHref: (notification: WorkerNotification) => string;
   tokens: NotificationThemeTokens;
   maxHeight?: string;
   onNavigate?: () => void;
   onMarkRead?: (id: number) => void;
}

export function NotificationList({
   notifications,
   isLoading,
   resolveHref,
   tokens,
   maxHeight = 'max-h-80',
   onNavigate,
   onMarkRead,
}: NotificationListProps) {
   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center gap-2 py-10">
            <Loader2 className={cn('h-5 w-5 animate-spin', tokens.itemBody)} />
            <p className={cn('text-xs', tokens.empty)}>جارٍ التحميل…</p>
         </div>
      );
   }

   if (notifications.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center gap-2 py-10">
            <BellOff className={cn('h-6 w-6 opacity-40', tokens.empty)} />
            <p className={cn('text-xs font-medium', tokens.empty)}>
               لا توجد إشعارات
            </p>
         </div>
      );
   }

   return (
      <ScrollArea className={cn('w-full', maxHeight)}>
         <div
            className={cn(
               'flex flex-col gap-0.5 py-1.5 divide-y',
               tokens.divider
            )}
         >
            {notifications.map((notification) => (
               <NotificationItem
                  key={notification.id}
                  notification={notification}
                  resolveHref={resolveHref}
                  tokens={tokens}
                  onNavigate={onNavigate}
                  onMarkRead={onMarkRead}
               />
            ))}
         </div>
      </ScrollArea>
   );
}
