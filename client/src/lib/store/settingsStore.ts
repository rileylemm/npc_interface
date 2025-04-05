import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Model selection
  textModel: string;
  setTextModel: (model: string) => void;
  
  imageModel: string;
  setImageModel: (model: string) => void;
  
  ttsModel: string;
  setTtsModel: (model: string) => void;
  
  sttModel: string;
  setSttModel: (model: string) => void;
  
  // UI preferences
  messageDisplayFormat: 'bubbles' | 'flat';
  setMessageDisplayFormat: (format: 'bubbles' | 'flat') => void;
  
  enableSounds: boolean;
  setEnableSounds: (enabled: boolean) => void;
  
  // Other settings
  autoSaveChats: boolean;
  setAutoSaveChats: (enabled: boolean) => void;
  
  defaultPromptTemplate: string;
  setDefaultPromptTemplate: (template: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default model selections
      textModel: 'gpt-4-turbo',
      setTextModel: (model) => set({ textModel: model }),
      
      imageModel: 'dall-e-3',
      setImageModel: (model) => set({ imageModel: model }),
      
      ttsModel: 'elevenlabs-multilingual-v2',
      setTtsModel: (model) => set({ ttsModel: model }),
      
      sttModel: 'whisper-large-v3',
      setSttModel: (model) => set({ sttModel: model }),
      
      // Default UI preferences
      messageDisplayFormat: 'bubbles',
      setMessageDisplayFormat: (format) => set({ messageDisplayFormat: format }),
      
      enableSounds: true,
      setEnableSounds: (enabled) => set({ enableSounds: enabled }),
      
      // Other default settings
      autoSaveChats: true,
      setAutoSaveChats: (enabled) => set({ autoSaveChats: enabled }),
      
      defaultPromptTemplate: 'You are NPCSH, a helpful assistant.',
      setDefaultPromptTemplate: (template) => set({ defaultPromptTemplate: template }),
    }),
    {
      name: 'npcsh-settings',
    }
  )
);
