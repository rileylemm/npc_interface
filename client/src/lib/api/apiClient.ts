import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  maxRetries: number;
}

class ApiClient {
  private client: AxiosInstance;
  private maxRetries: number;
  private authToken: string | null = null;
  
  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
    });
    this.maxRetries = config.maxRetries;
    
    // Set up request interceptor
    this.client.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );
    
    // Set up response interceptor
    this.client.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );
  }
  
  setAuthToken(token: string) {
    this.authToken = token;
  }
  
  clearAuthToken() {
    this.authToken = null;
  }
  
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config).then(response => response.data);
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, data, config).then(response => response.data);
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, data, config).then(response => response.data);
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config).then(response => response.data);
  }
  
  private handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    // Log request
    console.log(`REQUEST [${config.method?.toUpperCase()}] ${config.url}`);
    
    // Add auth token if available
    if (this.authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${this.authToken}`;
    }
    
    // Add request ID for tracking
    config.headers = config.headers || {};
    config.headers['X-Request-ID'] = this.generateRequestId();
    
    return config;
  }
  
  private handleRequestError(error: any): Promise<never> {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
  
  private handleResponse(response: AxiosResponse): AxiosResponse {
    // Log response
    console.log(`RESPONSE [${response.status}] ${response.config.url}`);
    return response;
  }
  
  private async handleResponseError(error: AxiosError): Promise<any> {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };
    
    // Initialize retry count if not present
    if (config._retryCount === undefined) {
      config._retryCount = 0;
    }
    
    // Check if we should retry the request
    if (config._retryCount < this.maxRetries) {
      config._retryCount += 1;
      
      // Implement exponential backoff
      const delay = Math.pow(2, config._retryCount) * 100;
      console.log(`Retrying request (${config._retryCount}/${this.maxRetries}) after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.client(config);
    }
    
    // Log error details
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      responseData: error.response?.data
    });
    
    return Promise.reject(error);
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export default ApiClient;
