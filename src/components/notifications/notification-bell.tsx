'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { WorkerNotification } from '@/types/entities/notification';
import {
   notificationThemeTokens,
   type NotificationTheme,
} from './notification-theme';
import { NotificationList } from './notification-list';

export interface NotificationBellProps {
   notifications: WorkerNotification[];
   unreadCount: number;
   isLoading: boolean;
   theme: NotificationTheme;
   resolveHref?: (notification: WorkerNotification) => string;
   onRefresh?: () => void;
   onMarkRead?: (id: number) => void;
   className?: string;
}

const defaultResolveHref = (n: WorkerNotification): string => {
   const orderId = n.data?.order_id;
   switch (n.type) {
      case 'order':
         return orderId ? `/customer/orders/${orderId}` : '/customer/orders';
      default:
         return '/';
   }
};

export function NotificationBell({
   notifications,
   unreadCount,
   isLoading,
   theme,
   resolveHref = defaultResolveHref,
   onRefresh,
   onMarkRead,
   className,
}: NotificationBellProps) {
   const tokens = notificationThemeTokens[theme];
   const hasUnread = unreadCount > 0;

   return (
      <DropdownMenu onOpenChange={(open) => open && onRefresh?.()}>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               size="icon"
               aria-label={`الإشعارات${hasUnread ? ` (${unreadCount} غير مقروء)` : ''}`}
               className={cn(
                  'relative rounded-full transition-all duration-200',
                  hasUnread ? tokens.bellActive : tokens.bellIdle,
                  className
               )}
            >
               <Bell
                  className={cn(
                     'h-5 w-5',
                     hasUnread && 'animate-[wiggle_0.4s_ease-in-out]'
                  )}
               />
               {hasUnread && (
                  <Badge
                     className={cn(
                        'absolute -top-1 -left-1 h-4 min-w-4 px-1 text-[9px] font-bold rounded-full pointer-events-none',
                        tokens.badge
                     )}
                  >
                     {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
               )}
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent
            align="end"
            sideOffset={8}
            className={cn(
               'w-80 rounded-xl p-0 border overflow-hidden',
               tokens.panel
            )}
         >
            {/* Dropdown header */}
            <div
               className={cn(
                  'flex items-center justify-between px-4 py-3 border-b',
                  tokens.header
               )}
            >
               <div className="flex items-center gap-2">
                  <Bell className={cn('h-4 w-4', tokens.title)} />
                  <span className={cn('text-sm font-semibold', tokens.title)}>
                     الإشعارات
                  </span>
                  {hasUnread && (
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
            </div>

            {/* List */}
            <NotificationList
               notifications={notifications}
               isLoading={isLoading}
               resolveHref={resolveHref}
               tokens={tokens}
               maxHeight="max-h-80"
               onMarkRead={onMarkRead}
            />
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
