import { get } from '@/api/admin/shared';
import type { WorkerOrder, WorkerOrdersResponse } from '@/types/entities/order';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

export const workerPendingOrdersApi = {
   async getAll(): Promise<WorkerOrder[]> {
      const response = await get<WorkerOrdersResponse>(
         WORKER_ENDPOINTS.PENDING_ORDERS
      );
      return response.data;
   },
} as const;
