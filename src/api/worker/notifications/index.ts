import { get, patch } from '@/api/admin/shared';
import { unwrapList } from '@/api/shared';
import type { WorkerNotification } from '@/types/entities/notification';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

export const workerNotificationsApi = {
   async getAll(): Promise<WorkerNotification[]> {
      // Backend wraps the list as `{ data: [...] }`; tolerate a bare array too.
      const payload = await get<unknown>(WORKER_ENDPOINTS.NOTIFICATIONS);
      return unwrapList<WorkerNotification>(payload);
   },

   async markRead(id: number): Promise<void> {
      return patch<void>(WORKER_ENDPOINTS.NOTIFICATION_MARK_READ(id));
   },
} as const;
