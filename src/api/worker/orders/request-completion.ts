import { post } from '@/api/admin/shared';
import type { RequestOrderCompletionResponse } from '@/types/entities';
import { WORKER_ENDPOINTS } from '../shared/endpoints';

export const workerRequestCompletionApi = {
   async request(orderId: number): Promise<RequestOrderCompletionResponse> {
      return post<RequestOrderCompletionResponse, Record<string, never>>(
         WORKER_ENDPOINTS.REQUEST_COMPLETION(orderId),
         {}
      );
   },
} as const;
