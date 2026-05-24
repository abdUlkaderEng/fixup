'use client';

import { useCallback } from 'react';
import { workerNotificationsApi } from '@/api/worker';
import {
   useFcmNotifications,
   type UseFcmNotificationsOptions,
   type UseFcmNotificationsReturn,
} from '@/hooks/notifications';

export type UseWorkerNotificationsOptions = UseFcmNotificationsOptions;
export type UseWorkerNotificationsReturn = UseFcmNotificationsReturn;

export function useWorkerNotifications(
   options: UseWorkerNotificationsOptions = {}
): UseWorkerNotificationsReturn {
   const fetcher = useCallback(() => workerNotificationsApi.getAll(), []);
   const markReadApi = useCallback(
      (id: number) => workerNotificationsApi.markRead(id),
      []
   );

   return useFcmNotifications(
      {
         cacheKey: 'worker-notifications-list',
         fetcher,
         markReadApi,
         errorMessage: 'حدث خطأ أثناء جلب الإشعارات',
      },
      options
   );
}
