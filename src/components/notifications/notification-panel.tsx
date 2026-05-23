'use client';

import { Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { WorkerNotification } from '@/types/entities/notification';
import {
   notificationThemeTokens,
   type NotificationTheme,
} from './notification-theme';
import { NotificationList } from './notification-list';

export interface NotificationPanelProps {
   notifications: WorkerNotification[];
   unreadCount: number;
   isLoading: boolean;
   theme: NotificationTheme;
   resolveHref?: (notification: WorkerNotification) => string;
   onNavigate?: () => void;
   onRefresh?: () => void;
   onMarkRead?: (id: number) => void;
   className?: string;
}

const defaultResolveHref = (n: WorkerNotification): string => {
   switch (n.type) {
      case 'order':
         return '/worker/dashboard';
      default:
         return '/worker/dashboard';
   }
};

export function NotificationPanel({
   notifications,
   unreadCount,
   isLoading,
   theme,
   resolveHref = defaultResolveHref,
   onNavigate,
   onRefresh,
   onMarkRead,
   className,
}: NotificationPanelProps) {
   const tokens = notificationThemeTokens[theme];

   return (
      <div
         className={cn(
            'flex flex-col rounded-xl border overflow-hidden',
            tokens.panel,
            className
         )}
      >
         {/* Header */}
         <div
            className={cn(
               'flex items-center justify-between px-4 py-3',
               tokens.header
            )}
         >
            <div className="flex items-center gap-2">
               <Bell className={cn('h-4 w-4 shrink-0', tokens.title)} />
               <span className={cn('text-sm font-semibold', tokens.title)}>
                  الإشعارات
               </span>
               {unreadCount > 0 && (
                  <Badge
                     className={cn(
                        'h-5 min-w-5 px-1.5 text-[10px] font-bold rounded-full',
                        tokens.badge
                     )}
                  >
                     {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
               )}
            </div>

            {onRefresh && (
               <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={onRefresh}
                  disabled={isLoading}
                  aria-label="تحديث الإشعارات"
                  className={cn(
                     'rounded-lg opacity-60 hover:opacity-100',
                     tokens.itemHover
                  )}
               >
                  <RefreshCw
                     className={cn(
                        'h-3.5 w-3.5',
                        tokens.itemBody,
                        isLoading && 'animate-spin'
                     )}
                  />
               </Button>
            )}
         </div>

         {/* List */}
         <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            resolveHref={resolveHref}
            tokens={tokens}
            maxHeight="max-h-72"
            onNavigate={onNavigate}
            onMarkRead={onMarkRead}
         />
      </div>
   );
}
