/**
 * Shared Messages API — Topics & Templates (read-only)
 *
 * GET endpoints consumed by admin, customer, and worker apps alike.
 * Mutations live in `@/api/admin/messages` and are admin-only.
 * Token is attached automatically by the `apiClient` request interceptor.
 */

import { apiClient } from '@/lib/axios';
import { handleApiError } from '@/api/shared';
import type {
   GetMessageTopicsResponse,
   GetMessageTemplatesResponse,
   MessageTemplateFilters,
   MessageTopic,
   MessageTemplate,
} from '@/types/admin/messages';

const ENDPOINTS = {
   TOPICS: '/Topics',
   TEMPLATES: '/message-templates',
} as const;

/** Normalize either `{ data: [...] }` or a bare `[...]` payload into an array. */
function unwrapList<T>(payload: unknown): T[] {
   if (Array.isArray(payload)) return payload as T[];
   const wrapped = (payload as { data?: unknown })?.data;
   return Array.isArray(wrapped) ? (wrapped as T[]) : [];
}

export const messageTopicsApi = {
   async getAll(): Promise<MessageTopic[]> {
      try {
         const res = await apiClient.get<GetMessageTopicsResponse>(
            ENDPOINTS.TOPICS
         );
         return unwrapList<MessageTopic>(res.data);
      } catch (error) {
         return handleApiError(error);
      }
   },
} as const;

export const messageTemplatesApi = {
   async getAll(filters: MessageTemplateFilters): Promise<MessageTemplate[]> {
      const params = new URLSearchParams({
         topic: filters.topic,
         sender_type: filters.sender_type,
      });
      try {
         const res = await apiClient.get<GetMessageTemplatesResponse>(
            `${ENDPOINTS.TEMPLATES}?${params.toString()}`
         );
         return unwrapList<MessageTemplate>(res.data);
      } catch (error) {
         return handleApiError(error);
      }
   },
} as const;
