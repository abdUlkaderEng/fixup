import { apiClient } from '@/lib/axios';
import { handleApiError, patch } from '@/api/admin/shared';
import type { WorkerNotification } from '@/types/entities/notification';

const ENDPOINT = '/notifications_price-offers' as const;

interface CustomerNotificationsResponse {
   data: WorkerNotification[];
}

export const customerNotificationsApi = {
   async getAll(): Promise<WorkerNotification[]> {
      try {
         const response =
            await apiClient.get<CustomerNotificationsResponse>(ENDPOINT);
         return response.data.data;
      } catch (error) {
         return handleApiError(error);
      }
   },

   async markRead(id: number): Promise<void> {
      return patch<void>(`/notifications/${id}/mark-read`);
   },
};
