import { get } from '@/api/admin/shared';
import type { WorkerOrder, WorkerOrdersResponse } from '@/types/entities/order';

const ENDPOINT = '/worker/orders' as const;

export const workerOrdersApi = {
   async getAll(): Promise<WorkerOrder[]> {
      const response = await get<WorkerOrdersResponse>(ENDPOINT);
      return response.data;
   },
};
