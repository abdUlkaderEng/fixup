/**
 * Admin Messages API — Topics & Templates (mutations only)
 *
 * Topics: POST, PUT, DELETE
 * Templates: POST, DELETE (no update — recreate to change)
 * All routes require admin token (attached automatically by interceptor).
 */

import { post, put, del } from './shared';
import type {
   CreateMessageTopicRequest,
   UpdateMessageTopicRequest,
   MessageTopicMutationResponse,
   DeleteMessageTopicResponse,
   CreateMessageTemplateRequest,
   MessageTemplateMutationResponse,
   DeleteMessageTemplateResponse,
   MessageTemplate,
} from '@/types/admin/messages';

const ADMIN_ENDPOINTS = {
   TOPICS: '/admin/message-topics',
   TEMPLATES: '/admin/message-templates',
} as const;

// ============================================
// Topics
// ============================================

export const adminMessageTopicsApi = {
   async create(
      data: CreateMessageTopicRequest
   ): Promise<MessageTopicMutationResponse> {
      return await post<
         MessageTopicMutationResponse,
         CreateMessageTopicRequest
      >(ADMIN_ENDPOINTS.TOPICS, data);
   },

   async update(
      id: number,
      data: UpdateMessageTopicRequest
   ): Promise<MessageTopicMutationResponse> {
      return await put<MessageTopicMutationResponse, UpdateMessageTopicRequest>(
         `${ADMIN_ENDPOINTS.TOPICS}/${id}`,
         data
      );
   },

   async delete(id: number): Promise<DeleteMessageTopicResponse> {
      return await del<DeleteMessageTopicResponse>(
         `${ADMIN_ENDPOINTS.TOPICS}/${id}`
      );
   },
} as const;

// ============================================
// Templates
// ============================================

/**
 * Raw shape returned by `POST /admin/message-templates`. The actual template
 * lives at `data.original.data` — `createTemplate` unwraps this so callers
 * always receive a flat `MessageTemplateMutationResponse`.
 */
interface RawCreateTemplateResponse {
   status: boolean;
   message: string;
   data:
      | MessageTemplate
      | {
           headers?: Record<string, unknown>;
           original?: {
              status?: boolean;
              message?: string;
              data?: MessageTemplate;
           };
           exception?: unknown;
        };
}

export const adminMessageTemplatesApi = {
   async create(
      data: CreateMessageTemplateRequest
   ): Promise<MessageTemplateMutationResponse> {
      const raw = await post<
         RawCreateTemplateResponse,
         CreateMessageTemplateRequest
      >(ADMIN_ENDPOINTS.TEMPLATES, data);

      const wrapper = raw.data as {
         original?: { data?: MessageTemplate };
      };
      const template = wrapper?.original?.data ?? (raw.data as MessageTemplate);

      return {
         status: raw.status,
         message: raw.message,
         data: template,
      };
   },

   async delete(id: number): Promise<DeleteMessageTemplateResponse> {
      return await del<DeleteMessageTemplateResponse>(
         `${ADMIN_ENDPOINTS.TEMPLATES}/${id}`
      );
   },
} as const;
