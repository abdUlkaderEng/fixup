'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { workerNotificationsApi } from '@/api/worker';
import { useFetch, generateRequestKey } from '@/hooks/admin/shared';
import { onFcmMessage } from '@/lib/notification-events';
import type { WorkerNotification } from '@/types/entities/notification';

export interface UseWorkerNotificationsReturn {
   notifications: WorkerNotification[];
   unreadCount: number;
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   markRead: (id: number) => Promise<void>;
}

export interface UseWorkerNotificationsOptions {
   autoFetch?: boolean;
}

export function useWorkerNotifications(
   options: UseWorkerNotificationsOptions = {}
): UseWorkerNotificationsReturn {
   const { autoFetch = true } = options;

   // IDs seen on the initial load — only toast notifications that arrive after that
   const seenIds = useRef<Set<number> | null>(null);
   // When FCM triggers the refetch, useFCM already toasted — skip the duplicate
   const fcmTriggeredRef = useRef(false);

   const handleSuccess = useCallback((incoming: WorkerNotification[]) => {
      // First fetch: seed the set, no toasts
      if (seenIds.current === null) {
         seenIds.current = new Set(incoming.map((n) => n.id));
         return;
      }

      // FCM already showed a toast for this message — skip duplicate
      const skipToast = fcmTriggeredRef.current;
      fcmTriggeredRef.current = false;

      // Subsequent fetches: toast only genuinely new unread notifications
      incoming.forEach((notification) => {
         if (!seenIds.current!.has(notification.id) && !notification.is_read) {
            if (!skipToast)
               toast(notification.title, { description: notification.body });
            seenIds.current!.add(notification.id);
         }
      });
   }, []);

   const fetcher = useCallback(() => workerNotificationsApi.getAll(), []);

   const { data, isLoading, error, refetch, setData } = useFetch<
      WorkerNotification[]
   >(fetcher, generateRequestKey('worker-notifications-list'), {
      autoFetch,
      onSuccess: handleSuccess,
      errorMessage: 'حدث خطأ أثناء جلب الإشعارات',
   });

   // Re-fetch whenever Firebase delivers a foreground message
   useEffect(
      () =>
         onFcmMessage(() => {
            fcmTriggeredRef.current = true;
            refetch();
         }),
      [refetch]
   );

   // Re-fetch when the tab becomes visible — catches notifications received while backgrounded
   useEffect(() => {
      const handleVisibility = () => {
         if (document.visibilityState === 'visible') refetch();
      };
      document.addEventListener('visibilitychange', handleVisibility);
      return () =>
         document.removeEventListener('visibilitychange', handleVisibility);
   }, [refetch]);

   const markRead = useCallback(
      async (id: number) => {
         // Optimistic update — flip is_read immediately
         setData(
            (prev) =>
               prev?.map((n) => (n.id === id ? { ...n, is_read: true } : n)) ??
               null
         );
         try {
            await workerNotificationsApi.markRead(id);
         } catch {
            // Rollback on failure
            refetch();
         }
      },
      [setData, refetch]
   );

   const notifications = data ?? [];
   const unreadCount = notifications.filter((n) => !n.is_read).length;

   return {
      notifications,
      unreadCount,
      isLoading,
      error,
      refetch,
      markRead,
   };
}
