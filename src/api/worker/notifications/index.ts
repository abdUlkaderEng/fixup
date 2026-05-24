import { get, patch } from '@/api/admin/shared';
import type { WorkerNotification } from '@/types/entities/notification';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

export const workerNotificationsApi = {
   async getAll(): Promise<WorkerNotification[]> {
      return get<WorkerNotification[]>(WORKER_ENDPOINTS.NOTIFICATIONS);
   },

   async markRead(id: number): Promise<void> {
      return patch<void>(WORKER_ENDPOINTS.NOTIFICATION_MARK_READ(id));
   },
} as const;
