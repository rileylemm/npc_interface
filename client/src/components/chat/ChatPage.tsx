import { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message, MessageOptions } from "@/types/api";
import { useApiStore } from "@/lib/store/apiStore";
import axios from "axios";

export default function ChatPage() {
  const { apiConnected } = useApiStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'system', content: 'Welcome to NPCSH! How can I assist you today?', timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const pollingIntervalRef = useRef<number | null>(null);
  const lastMessageIdRef = useRef<string>('1');
  
  // Default NPC options
  const [npcOptions, setNpcOptions] = useState<MessageOptions>({
    model: "",
    provider: "",
    npc: ""
  });

  // Check API connection on mount and start polling for history
  useEffect(() => {
    // Check API health
    const checkApiHealth = async () => {
      try {
        const apiUrl = window.location.host.includes(':') 
          ? `http://${window.location.hostname}:3000/api/health` 
          : '/api/health';
          
        console.log(`Checking API health at ${apiUrl}`);
        const response = await axios.get(apiUrl);
        console.log('API health response:', response.data);
        
        if (response.data.status === 'ok') {
          console.log('API connection established');
          useApiStore.getState().connectApi();
        }
      } catch (error) {
        console.error('API health check failed:', error);
        useApiStore.getState().disconnectApi();
      }
    };
    
    // Start with an API health check
    checkApiHealth();
    
    // Poll for API health every minute
    const healthInterval = window.setInterval(checkApiHealth, 60000);
    
    return () => {
      window.clearInterval(healthInterval);
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Helper function to update NPC options
  const updateNpcOptions = (options: Partial<MessageOptions>) => {
    setNpcOptions(prev => ({
      ...prev,
      ...options
    }));
  };

  const sendMessage = async (content: string, options?: Partial<MessageOptions>) => {
    if (!content.trim()) return;
    
    // Combine default options with any provided options
    const messageOptions = {
      ...npcOptions,
      ...(options || {})
    };
    
    // Add user message to the conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
    
    console.log('Adding user message to state:', userMessage);
    setMessages(prev => [...prev, userMessage]);
    lastMessageIdRef.current = userMessage.id;
    setIsLoading(true);
    
    try {
      // Send message via HTTP API
      const apiUrl = window.location.host.includes(':') 
        ? `http://${window.location.hostname}:3000/api/chat/message` 
        : '/api/chat/message';
      
      console.log(`Sending HTTP request to ${apiUrl}`);
      console.log('Request payload:', { 
        message: content,
        options: messageOptions 
      });
      
      const startTime = Date.now();
      const response = await axios.post(apiUrl, { 
        message: content,
        options: messageOptions
      });
      const endTime = Date.now();
      
      console.log(`HTTP response received in ${endTime - startTime}ms:`, response.data);
      
      // Process the HTTP response
      const aiResponse: Message = {
        id: response.data.id,
        role: 'system',
        content: response.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      
      console.log('Adding AI response to state:', aiResponse);
      setMessages(prev => [...prev, aiResponse]);
      lastMessageIdRef.current = aiResponse.id;
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      
      // Extract more specific error if available
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });
        
        if (error.response?.data?.message) {
          errorMessage = `Error: ${error.response.data.message}`;
        }
      }
      
      // Add error message to the conversation
      const errorResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      
      console.log('Adding error message to state:', errorResponseMessage);
      setMessages(prev => [...prev, errorResponseMessage]);
      lastMessageIdRef.current = errorResponseMessage.id;
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <MessageList messages={messages} />
      <MessageInput 
        onSendMessage={sendMessage} 
        apiConnected={apiConnected} 
        isLoading={isLoading}
        npcOptions={npcOptions}
        updateNpcOptions={updateNpcOptions}
      />
    </div>
  );
}
