import { get, post } from '@/api/admin/shared';
import type {
   AiChatHistoryResponse,
   AiChatRequest,
   AiChatResponse,
} from '@/types/chat';

export const aiChatApi = {
   getMessages: () => get<AiChatHistoryResponse>('/ai-chat/messages'),
   sendMessage: (body: AiChatRequest) =>
      post<AiChatResponse, AiChatRequest>('/ai-chat', body),
};
