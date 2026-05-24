'use client';

import { useCallback } from 'react';
import { customerNotificationsApi } from '@/api/customer';
import {
   useFcmNotifications,
   type UseFcmNotificationsOptions,
   type UseFcmNotificationsReturn,
} from '@/hooks/notifications';

export type UseCustomerNotificationsOptions = UseFcmNotificationsOptions;
export type UseCustomerNotificationsReturn = UseFcmNotificationsReturn;

export function useCustomerNotifications(
   options: UseCustomerNotificationsOptions = {}
): UseCustomerNotificationsReturn {
   const fetcher = useCallback(() => customerNotificationsApi.getAll(), []);
   const markReadApi = useCallback(
      (id: number) => customerNotificationsApi.markRead(id),
      []
   );

   return useFcmNotifications(
      {
         cacheKey: 'customer-notifications-list',
         fetcher,
         markReadApi,
         errorMessage: 'حدث خطأ أثناء جلب الإشعارات',
      },
      options
   );
}
