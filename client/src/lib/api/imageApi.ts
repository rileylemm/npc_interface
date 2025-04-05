import ApiClient from './apiClient';
import { ImageGenerationResponse, GalleryResponse, GeneratedImage } from '@/types/api';

class ImageApi {
  private client: ApiClient;
  
  constructor(client: ApiClient) {
    this.client = client;
  }
  
  /**
   * Create image from text prompt
   */
  async generateImage(
    prompt: string, 
    options?: { 
      size?: string; 
      quality?: string;
      style?: string;
    }
  ): Promise<ImageGenerationResponse> {
    const payload = {
      prompt,
      ...options
    };
    
    return this.client.post<ImageGenerationResponse>('/api/generate/image', payload);
  }
  
  /**
   * List generated images
   */
  async getGalleryImages(
    page: number = 1, 
    limit: number = 20
  ): Promise<GalleryResponse> {
    return this.client.get<GalleryResponse>(`/api/gallery/images?page=${page}&limit=${limit}`);
  }
  
  /**
   * Get image details by ID
   */
  async getImageById(id: string): Promise<GeneratedImage> {
    return this.client.get<GeneratedImage>(`/api/gallery/images/${id}`);
  }
  
  /**
   * Delete generated image
   */
  async deleteImage(id: string): Promise<{ success: boolean }> {
    return this.client.delete<{ success: boolean }>(`/api/gallery/images/${id}`);
  }
}

export default ImageApi;
