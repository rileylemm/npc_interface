import ApiClient from './apiClient';
import { SystemStatusResponse, SystemConfigUpdateResponse } from '@/types/api';

class SystemApi {
  private client: ApiClient;
  
  constructor(client: ApiClient) {
    this.client = client;
  }
  
  /**
   * Check NPCSH service status
   */
  async getSystemStatus(): Promise<SystemStatusResponse> {
    return this.client.get<SystemStatusResponse>('/api/system/status');
  }
  
  /**
   * Update system configuration
   */
  async updateConfig(
    config: {
      default_model?: string;
      timeout_ms?: number;
      max_retries?: number;
      [key: string]: any;
    }
  ): Promise<SystemConfigUpdateResponse> {
    return this.client.post<SystemConfigUpdateResponse>('/api/system/config', config);
  }
  
  /**
   * Get API usage statistics
   */
  async getUsageStats(): Promise<{
    apiCalls: { current: number; limit: number; percent: number };
    imageGeneration: { current: number; limit: number; percent: number };
    textTokens: { current: number; limit: number; unit: string; percent: number };
    resetTime: string;
  }> {
    return this.client.get('/api/system/usage');
  }
}

export default SystemApi;
