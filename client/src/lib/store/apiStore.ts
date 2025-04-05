import { create } from 'zustand';
import ApiClient from '../api/apiClient';
import ChatApi from '../api/chatApi';
import VoiceApi from '../api/voiceApi';
import ImageApi from '../api/imageApi';
import ContextApi from '../api/contextApi';
import SystemApi from '../api/systemApi';

interface ApiStore {
  // Connection config
  apiEndpoint: string;
  setApiEndpoint: (endpoint: string) => void;
  
  authType: string;
  setAuthType: (type: string) => void;
  
  apiKey: string;
  setApiKey: (key: string) => void;
  
  requestTimeout: number;
  setRequestTimeout: (timeout: number) => void;
  
  maxRetries: number;
  setMaxRetries: (retries: number) => void;
  
  apiVersion: string;
  setApiVersion: (version: string) => void;
  
  // Connection status
  apiConnected: boolean;
  apiStatus: 'connected' | 'connecting' | 'disconnected';
  connectApi: () => void;
  disconnectApi: () => void;
  
  // API clients
  apiClient: ApiClient | null;
  chatApi: ChatApi | null;
  voiceApi: VoiceApi | null;
  imageApi: ImageApi | null;
  contextApi: ContextApi | null;
  systemApi: SystemApi | null;
  
  // Request/response logs
  requestLogs: any[];
  addRequestLog: (log: any) => void;
  clearRequestLogs: () => void;
}

export const useApiStore = create<ApiStore>((set, get) => ({
  // Default connection config
  apiEndpoint: 'https://api.npcsh.example.com/v1',
  setApiEndpoint: (endpoint) => set({ apiEndpoint: endpoint }),
  
  authType: 'apiKey',
  setAuthType: (type) => set({ authType: type }),
  
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
  
  requestTimeout: 30000,
  setRequestTimeout: (timeout) => set({ requestTimeout: timeout }),
  
  maxRetries: 3,
  setMaxRetries: (retries) => set({ maxRetries: retries }),
  
  apiVersion: '1',
  setApiVersion: (version) => set({ apiVersion: version }),
  
  // Default connection status
  apiConnected: false,
  apiStatus: 'disconnected',
  
  connectApi: () => {
    set({ apiStatus: 'connecting' });
    
    // Create a new API client with the current settings
    const { apiEndpoint, requestTimeout, maxRetries, apiKey } = get();
    
    const apiClient = new ApiClient({
      baseURL: apiEndpoint,
      timeout: requestTimeout,
      maxRetries: maxRetries
    });
    
    // Set auth token if using Bearer token
    if (get().authType === 'bearerToken') {
      apiClient.setAuthToken(apiKey);
    }
    
    // Initialize API service clients
    const chatApi = new ChatApi(apiClient);
    const voiceApi = new VoiceApi(apiClient);
    const imageApi = new ImageApi(apiClient);
    const contextApi = new ContextApi(apiClient);
    const systemApi = new SystemApi(apiClient);
    
    // Simulate API connection (in a real app, we'd validate the connection)
    setTimeout(() => {
      set({
        apiClient,
        chatApi,
        voiceApi,
        imageApi,
        contextApi,
        systemApi,
        apiConnected: true,
        apiStatus: 'connected'
      });
    }, 1000);
  },
  
  disconnectApi: () => {
    set({
      apiConnected: false,
      apiStatus: 'disconnected',
      apiClient: null,
      chatApi: null,
      voiceApi: null,
      imageApi: null,
      contextApi: null,
      systemApi: null
    });
  },
  
  // API clients
  apiClient: null,
  chatApi: null,
  voiceApi: null,
  imageApi: null,
  contextApi: null,
  systemApi: null,
  
  // Request logs
  requestLogs: [],
  addRequestLog: (log) => set((state) => ({
    requestLogs: [log, ...state.requestLogs].slice(0, 100) // Keep only the last 100 logs
  })),
  clearRequestLogs: () => set({ requestLogs: [] })
}));
