'use client';

import { NotificationPanel } from '@/components/notifications';
import type { WorkerNotification } from './types';

interface NotificationFlyoutProps {
   open: boolean;
   onClose: () => void;
   onNavigate: () => void;
   notifications: WorkerNotification[];
   unreadCount: number;
   isLoading: boolean;
   refetch: () => void;
   markRead: (id: number) => Promise<void>;
}

export function NotificationFlyout({
   open,
   onClose,
   onNavigate,
   notifications,
   unreadCount,
   isLoading,
   refetch,
   markRead,
}: NotificationFlyoutProps) {
   if (!open) return null;

   const handleNavigate = () => {
      onNavigate();
      onClose();
   };

   return (
      <>
         <div
            className="fixed inset-0 z-80"
            onClick={onClose}
            aria-hidden="true"
         />
         <div
            className="fixed bottom-24 right-4 z-90 w-80 animate-in fade-in-0 slide-in-from-bottom-2 rounded-2xl border border-border/60 bg-card shadow-2xl duration-200"
            onClick={(e) => e.stopPropagation()}
         >
            <NotificationPanel
               notifications={notifications}
               unreadCount={unreadCount}
               isLoading={isLoading}
               theme="worker"
               onNavigate={handleNavigate}
               onRefresh={refetch}
               onMarkRead={markRead}
            />
         </div>
      </>
   );
}
