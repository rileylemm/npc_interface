// API Response Types
export interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  id: string;
  response: string;
  created_at: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface ChatHistory {
  messages: Message[];
}

export interface VoiceRecordingResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
}

export interface VoiceTranscriptionStatus {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  text?: string;
  confidence?: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  date: string;
}

export interface ImageGenerationResponse {
  id: string;
  url: string;
  created_at: string;
}

export interface GalleryResponse {
  images: GeneratedImage[];
  total: number;
  page: number;
  limit: number;
}

export interface ContextFile {
  name: string;
  content: string;
  type: string;
}

export interface ContextCreateResponse {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface ContextUpdateResponse {
  id: string;
  updated_at: string;
  file_count: number;
  token_count: number;
}

export interface Context {
  id: string;
  name: string;
  description?: string;
  file_count: number;
  token_count: number;
  updated_at: string;
}

export interface ContextListResponse {
  contexts: Context[];
  total: number;
  page: number;
  limit: number;
}

export interface SystemStatusResponse {
  status: 'operational' | 'degraded' | 'maintenance';
  version: string;
  uptime: string;
  api_rate_limit: {
    total: number;
    remaining: number;
    reset_at: string;
  };
}

export interface SystemConfigUpdateResponse {
  success: boolean;
  message: string;
}

export interface ApiKey {
  id: string;
  name: string;
  value: string;
  created: string;
  lastUsed: string;
}

// API Request Types
export interface ApiRequest {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timestamp?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  data?: any;
  time: number;
  timestamp?: string;
}

export interface ApiEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  requestBody: any | null;
  response: any;
}

export interface ApiLog {
  id: string;
  request: ApiRequest;
  response: ApiResponse;
  duration: number;
  timestamp: string;
  success: boolean;
}
