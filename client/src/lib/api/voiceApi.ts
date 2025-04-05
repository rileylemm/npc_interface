import ApiClient from './apiClient';
import { VoiceRecordingResponse, VoiceTranscriptionStatus } from '@/types/api';

class VoiceApi {
  private client: ApiClient;
  
  constructor(client: ApiClient) {
    this.client = client;
  }
  
  /**
   * Send audio data for transcription
   */
  async recordAudio(
    audioData: string, 
    format: string = 'wav', 
    language: string = 'en-US'
  ): Promise<VoiceRecordingResponse> {
    const payload = {
      audio_data: audioData,
      format,
      language
    };
    
    return this.client.post<VoiceRecordingResponse>('/api/voice/record', payload);
  }
  
  /**
   * Check transcription processing status
   */
  async getTranscriptionStatus(id: string): Promise<VoiceTranscriptionStatus> {
    return this.client.get<VoiceTranscriptionStatus>(`/api/voice/status?id=${id}`);
  }
  
  /**
   * Convert text to speech
   * Note: This is an additional method that might be useful but isn't specified in the original requirements
   */
  async textToSpeech(text: string, voice?: string): Promise<{ audioUrl: string }> {
    const payload = {
      text,
      voice
    };
    
    return this.client.post('/api/voice/synthesize', payload);
  }
}

export default VoiceApi;
