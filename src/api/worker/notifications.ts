import { get, patch } from '@/api/admin/shared';
import type { WorkerNotification } from '@/types/entities/notification';

const ENDPOINT = '/notifications_orders' as const;

export const workerNotificationsApi = {
   async getAll(): Promise<WorkerNotification[]> {
      return get<WorkerNotification[]>(ENDPOINT);
   },

   async markRead(id: number): Promise<void> {
      return patch<void>(`/notifications/${id}/mark-read`);
   },
};
