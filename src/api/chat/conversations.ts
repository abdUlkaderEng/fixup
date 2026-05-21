import { get, post } from '@/api/admin/shared';
import type {
   GetMessagesResponse,
   SendMessageRequest,
   SendMessageResponse,
   StartConversationRequest,
   StartConversationResponse,
} from '@/types/chat';

export const conversationsApi = {
   start: (body: StartConversationRequest) =>
      post<StartConversationResponse, StartConversationRequest>(
         '/conversations',
         body
      ),

   getMessages: (conversationId: number) =>
      get<GetMessagesResponse>(`/chat/templates/${conversationId}`),

   sendMessage: (body: SendMessageRequest) =>
      post<SendMessageResponse, SendMessageRequest>('/chat/send', body),
};
