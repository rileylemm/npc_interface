import ApiClient from './apiClient';
import { 
  ContextCreateResponse, 
  ContextUpdateResponse, 
  ContextListResponse, 
  ContextFile 
} from '@/types/api';

class ContextApi {
  private client: ApiClient;
  
  constructor(client: ApiClient) {
    this.client = client;
  }
  
  /**
   * Create a new conversation context
   */
  async createContext(
    name: string, 
    description?: string
  ): Promise<ContextCreateResponse> {
    const payload = {
      name,
      description
    };
    
    return this.client.post<ContextCreateResponse>('/api/context/create', payload);
  }
  
  /**
   * Add files/content to an existing context
   */
  async updateContext(
    contextId: string, 
    files: ContextFile[]
  ): Promise<ContextUpdateResponse> {
    const payload = {
      context_id: contextId,
      files
    };
    
    return this.client.put<ContextUpdateResponse>('/api/context/update', payload);
  }
  
  /**
   * List available contexts
   */
  async listContexts(
    page: number = 1, 
    limit: number = 20
  ): Promise<ContextListResponse> {
    return this.client.get<ContextListResponse>(`/api/context/list?page=${page}&limit=${limit}`);
  }
  
  /**
   * Get details of a specific context
   */
  async getContext(contextId: string): Promise<ContextCreateResponse> {
    return this.client.get<ContextCreateResponse>(`/api/context/${contextId}`);
  }
  
  /**
   * Delete a context
   */
  async deleteContext(contextId: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/api/context/${contextId}`);
  }
}

export default ContextApi;
