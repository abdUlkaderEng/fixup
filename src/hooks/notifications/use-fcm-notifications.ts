'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
   generateRequestKey,
   useFetch,
   type UseFetchReturn,
} from '@/hooks/admin/shared';
import { onFcmMessage } from '@/lib/notification-events';
import type { WorkerNotification } from '@/types/entities/notification';

export interface UseFcmNotificationsOptions {
   /** Auto-fetch on mount (default: true) */
   autoFetch?: boolean;
}

export interface UseFcmNotificationsReturn {
   notifications: WorkerNotification[];
   unreadCount: number;
   isLoading: boolean;
   error: Error | null;
   refetch: () => void;
   markRead: (id: number) => Promise<void>;
}

interface UseFcmNotificationsConfig {
   /** Stable cache key for request deduplication. */
   cacheKey: string;
   /** Fetch the user's notifications. */
   fetcher: () => Promise<WorkerNotification[]>;
   /** Mark a single notification as read on the server. */
   markReadApi: (id: number) => Promise<unknown>;
   /** Toast message shown when the fetch fails. */
   errorMessage: string;
}

/**
 * Generic notification hook used by both worker and customer composers.
 *
 * Responsibilities:
 *   - Auto-fetch + expose the list.
 *   - Toast on genuinely new unread notifications (seen-set tracking).
 *   - Suppress the in-app toast when an FCM-triggered refetch is the cause —
 *     useFCM already toasted that message.
 *   - Refetch on FCM foreground messages and on tab-visibility changes
 *     (catches notifications received while the tab was backgrounded).
 *   - Optimistic markRead with refetch-on-failure rollback.
 */
export function useFcmNotifications(
   { cacheKey, fetcher, markReadApi, errorMessage }: UseFcmNotificationsConfig,
   options: UseFcmNotificationsOptions = {}
): UseFcmNotificationsReturn {
   const { autoFetch = true } = options;

   // IDs seen on the initial load — only toast notifications that arrive after that.
   const seenIds = useRef<Set<number> | null>(null);
   // When FCM triggers the refetch, useFCM already toasted — skip the duplicate.
   const fcmTriggeredRef = useRef(false);

   const handleSuccess = useCallback((incoming: WorkerNotification[]) => {
      // First fetch: seed the set, no toasts.
      if (seenIds.current === null) {
         seenIds.current = new Set(incoming.map((n) => n.id));
         return;
      }

      const skipToast = fcmTriggeredRef.current;
      fcmTriggeredRef.current = false;

      incoming.forEach((notification) => {
         if (seenIds.current!.has(notification.id) || notification.is_read) {
            return;
         }
         if (!skipToast) {
            toast(notification.title, { description: notification.body });
         }
         seenIds.current!.add(notification.id);
      });
   }, []);

   const {
      data,
      isLoading,
      error,
      refetch,
      setData,
   }: UseFetchReturn<WorkerNotification[]> = useFetch<WorkerNotification[]>(
      fetcher,
      generateRequestKey(cacheKey),
      { autoFetch, onSuccess: handleSuccess, errorMessage }
   );

   useEffect(
      () =>
         onFcmMessage(() => {
            fcmTriggeredRef.current = true;
            refetch();
         }),
      [refetch]
   );

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
         setData(
            (prev) =>
               prev?.map((n) => (n.id === id ? { ...n, is_read: true } : n)) ??
               null
         );
         try {
            await markReadApi(id);
         } catch {
            // Rollback on failure
            refetch();
         }
      },
      [setData, refetch, markReadApi]
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
