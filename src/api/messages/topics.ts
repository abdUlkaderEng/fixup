import { apiClient } from '@/lib/axios';
import { handleApiError, unwrapList } from '@/api/shared';
import type {
   GetMessageTopicsResponse,
   MessageTopic,
} from '@/types/admin/messages';
import { MESSAGE_ENDPOINTS } from './endpoints';

export const messageTopicsApi = {
   async getAll(): Promise<MessageTopic[]> {
      try {
         const res = await apiClient.get<GetMessageTopicsResponse>(
            MESSAGE_ENDPOINTS.TOPICS
         );
         return unwrapList<MessageTopic>(res.data);
      } catch (error) {
         return handleApiError(error);
      }
   },
} as const;
