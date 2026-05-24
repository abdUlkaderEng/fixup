import type { AiChatHistoryMessage, AiChatUiMessage } from '@/types/chat';

export const AI_WELCOME_TEXT =
   'مرحباً بك في فيكس. أنا مساعدك الذكي للمساعدة في الخدمات والطلبات داخل التطبيق.';

export function createLocalAiMessage(
   role: 'user' | 'assistant',
   text: string
): AiChatUiMessage {
   return {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role,
      text,
      createdAt: new Date().toISOString(),
   };
}

export function mapAiHistoryMessage(
   message: AiChatHistoryMessage
): AiChatUiMessage {
   return {
      id: String(message.id),
      role: message.role,
      text: message.message,
      createdAt: message.created_at,
   };
}
