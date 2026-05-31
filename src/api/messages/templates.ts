import { apiClient } from '@/lib/axios';
import { handleApiError, unwrapList } from '@/api/shared';
import type {
   GetMessageTemplatesResponse,
   MessageTemplate,
   MessageTemplateFilters,
} from '@/types/admin/messages';
import { MESSAGE_ENDPOINTS } from './endpoints';

function buildTemplatesQuery(filters: MessageTemplateFilters): string {
   const params = new URLSearchParams({
      topic: String(filters.topic_id),
      sender_type: filters.sender_type,
   });
   return `?${params.toString()}`;
}

export const messageTemplatesApi = {
   async getAll(filters: MessageTemplateFilters): Promise<MessageTemplate[]> {
      try {
         const res = await apiClient.get<GetMessageTemplatesResponse>(
            `${MESSAGE_ENDPOINTS.TEMPLATES}${buildTemplatesQuery(filters)}`
         );
         return unwrapList<MessageTemplate>(res.data);
      } catch (error) {
         return handleApiError(error);
      }
   },
} as const;
