'use client';

import { Bell } from 'lucide-react';
import { UnreadBadge } from './unread-badge';

interface MobileNotificationFABProps {
   unreadCount: number;
   onClick: () => void;
}

export function MobileNotificationFAB({
   unreadCount,
   onClick,
}: MobileNotificationFABProps) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-label="الإشعارات"
         className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-lg xl:hidden"
      >
         <Bell className="h-5 w-5 text-secondary" />
         <UnreadBadge count={unreadCount} inline={false} />
      </button>
   );
}
