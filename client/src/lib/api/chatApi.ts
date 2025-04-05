import ApiClient from './apiClient';
import { ChatMessage, ChatHistory, ChatResponse } from '@/types/api';

class ChatApi {
  private client: ApiClient;
  
  constructor(client: ApiClient) {
    this.client = client;
  }
  
  /**
   * Send a user message to the AI and receive a response
   */
  async sendMessage(
    message: string, 
    contextId?: string, 
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<ChatResponse> {
    const payload = {
      message,
      context_id: contextId,
      options: options
    };
    
    return this.client.post<ChatResponse>('/api/chat/message', payload);
  }
  
  /**
   * Retrieve conversation history
   */
  async getHistory(): Promise<ChatHistory> {
    return this.client.get<ChatHistory>('/api/chat/history');
  }
  
  /**
   * Clear conversation history
   */
  async clearHistory(): Promise<{ success: boolean; message: string }> {
    return this.client.delete('/api/chat/history');
  }
}

export default ChatApi;
