import { apiClient } from '@/lib/axios';
import { handleApiError, patch } from '@/api/admin/shared';
import { unwrapList } from '@/api/shared';
import type { WorkerNotification } from '@/types/entities/notification';

const ENDPOINT = '/notifications_price-offers' as const;

export const customerNotificationsApi = {
   async getAll(): Promise<WorkerNotification[]> {
      try {
         const response = await apiClient.get<unknown>(ENDPOINT);
         // Backend wraps the list as `{ data: [...] }`; tolerate a bare array too.
         return unwrapList<WorkerNotification>(response.data);
      } catch (error) {
         return handleApiError(error);
      }
   },

   async markRead(id: number): Promise<void> {
      return patch<void>(`/notifications/${id}/mark-read`);
   },
};
