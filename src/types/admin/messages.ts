/**
 * Admin Types - Message Topics & Templates
 *
 * Topics group canned chat reply templates. Templates belong to a topic and a
 * sender_type ("customer" or "worker"). Topics are shared across customer,
 * worker, and admin apps; only admin can mutate them.
 */

import type { MessageResponse } from './shared';

export type SenderType = 'customer' | 'worker';

export interface MessageTopic {
   id: number;
   topic: string;
   created_at?: string;
   updated_at?: string;
}

export interface MessageTemplate {
   id: number;
   text: string;
   sender_type: SenderType;
   topic_id: number | string;
   created_at?: string;
   updated_at?: string;
}

// ============================================
// Topics — Requests / Responses
// ============================================

export interface CreateMessageTopicRequest {
   topic: string;
}

export interface UpdateMessageTopicRequest {
   topic: string;
}

export interface MessageTopicMutationResponse {
   status: boolean;
   message: string;
   data: MessageTopic;
}

export interface GetMessageTopicsResponse {
   status?: boolean;
   data?: MessageTopic[];
}

export type DeleteMessageTopicResponse = MessageResponse;

// ============================================
// Templates — Requests / Responses
// ============================================

export interface CreateMessageTemplateRequest {
   text: string;
   sender_type: SenderType;
   topic_id: number;
}

export interface MessageTemplateFilters {
   /** Filter templates by topic id (the GET filter now uses id, not name). */
   topic_id: number;
   sender_type: SenderType;
}

/**
 * Backend wraps the created template payload twice:
 *   { status, message, data: { headers, original: { status, message, data: MessageTemplate }, exception } }
 * The API layer unwraps this so callers see a clean `{ status, message, data: MessageTemplate }`.
 */
export interface MessageTemplateMutationResponse {
   status: boolean;
   message: string;
   data: MessageTemplate;
}

export interface GetMessageTemplatesResponse {
   status?: boolean;
   data?: MessageTemplate[];
}

export type DeleteMessageTemplateResponse = MessageResponse;
