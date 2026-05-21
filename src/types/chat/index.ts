// ============================================
// Domain Entities
// ============================================

export type ConversationStatus = 'open' | 'closed';
export type MessageSenderRole = 'customer' | 'worker';

export interface Conversation {
   id: number;
   customer_id: number;
   worker_id: number;
   topic: string;
   status: ConversationStatus;
   // order_id: number; // add later when wired to the API
   created_at: string;
   updated_at: string;
}

export interface MessageTemplate {
   id: number;
   text: string;
   topic: string;
   forRole: MessageSenderRole;
}

export interface ChatMessage {
   id: number;
   conversation_id: number;
   sender_id: number;
   sender_role: MessageSenderRole;
   template_id: number;
   message: string;
   created_at: string;
}

// ============================================
// API Request / Response Shapes
// ============================================

export interface StartConversationRequest {
   worker_id: number;
   topic: string;
   // order_id: number; // add later when wired to the API
}

export interface StartConversationResponse {
   success: boolean;
   conversation: Conversation;
}

export interface SendMessageRequest {
   conversation_id: number;
   template_id: number;
}

export interface SendMessageResponse {
   success: boolean;
   message: ChatMessage;
}

export interface GetMessagesResponse {
   success: boolean;
   messages: ChatMessage[];
}

export interface AiChatRequest {
   message: string;
}

export interface AiChatResponse {
   success: boolean;
   reply: string;
}

export interface AiChatHistoryMessage {
   id: number;
   user_id: number;
   role: 'user' | 'assistant';
   message: string;
   created_at: string;
}

export interface AiChatHistoryResponse {
   success: boolean;
   messages: AiChatHistoryMessage[];
}

export interface AiChatUiMessage {
   id: string;
   role: 'user' | 'assistant';
   text: string;
   createdAt: string;
}

// ============================================
// Core Hook Config & Return Types
// ============================================

export interface ChatConfig {
   conversationId: number;
   currentUserRole: MessageSenderRole;
   wsUrl: string | null; // null = no WebSocket (chatbot mode)
   send: (conversationId: number, templateId: number) => Promise<ChatMessage>;
   templates: MessageTemplate[];
}

export interface UseChatReturn {
   messages: ChatMessage[];
   isLoadingMessages: boolean;
   isSending: boolean;
   sendMessage: (templateId: number) => Promise<void>;
   error: Error | null;
   /** Set of message ids that are optimistic and awaiting server confirmation. */
   pendingIds: Set<number>;
   /** Set of optimistic message ids whose send failed (UI can show retry). */
   failedIds: Set<number>;
}

export interface UseConversationReturn {
   conversation: Conversation | null;
   isStarting: boolean;
   chatReady: boolean;
   startConversation: () => Promise<StartConversationResponse | null>;
   chat: UseChatReturn;
   templates: MessageTemplate[];
}

export interface UseWorkerConversationReturn {
   chat: UseChatReturn;
   templates: MessageTemplate[];
}

// ============================================
// Hardcoded Templates — backend will replace later
// ============================================

export const PRICE_TOPIC_TEMPLATES: MessageTemplate[] = [
   {
      id: 1,
      text: 'هل يمكنك تخفيض السعر قليلاً؟',
      topic: 'السعر',
      forRole: 'customer',
   },
   {
      id: 2,
      text: 'هذا السعر مرتفع جداً بالنسبة لي',
      topic: 'السعر',
      forRole: 'customer',
   },
   {
      id: 3,
      text: 'ما هو أفضل سعر يمكنك تقديمه؟',
      topic: 'السعر',
      forRole: 'customer',
   },
   {
      id: 4,
      text: 'هل يوجد خصم لو تم التعاقد الآن؟',
      topic: 'السعر',
      forRole: 'customer',
   },
   {
      id: 5,
      text: 'السعر نهائي ولا يقبل التعديل',
      topic: 'السعر',
      forRole: 'worker',
   },
   {
      id: 6,
      text: 'يمكنني تخفيض السعر بمقدار بسيط',
      topic: 'السعر',
      forRole: 'worker',
   },
   {
      id: 7,
      text: 'السعر مناسب جداً مقارنة بالجودة',
      topic: 'السعر',
      forRole: 'worker',
   },
   {
      id: 8,
      text: 'سأراجع الأمر وأعود إليك',
      topic: 'السعر',
      forRole: 'worker',
   },
];
