import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message } from "@/types/api";
import { useApiStore } from "@/lib/store/apiStore";

export default function ChatPage() {
  const { apiConnected } = useApiStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'system', content: 'Welcome to NPCSH! How can I assist you today?', timestamp: '12:01 PM' },
    { id: '2', role: 'user', content: 'Can you tell me about yourself?', timestamp: '12:02 PM' },
    { id: '3', role: 'system', content: 'I am NPCSH (Non-Player Character Shell), a conversational AI assistant designed to help with various tasks. I can generate text responses, create images, manage conversation contexts, and more through API integrations. You can customize my behavior through the settings page or use special commands like /vixynt to generate images.', timestamp: '12:02 PM' },
    { id: '4', role: 'user', content: 'Show me an example of image generation', timestamp: '12:03 PM' },
    { id: '5', role: 'system', content: 'You can generate images using the /vixynt command followed by a description. For example:\n\n/vixynt a serene forest landscape with a small cabin, digital art style', timestamp: '12:04 PM' }
  ]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to the conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Simulate API response for now
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: `I received your message: "${content}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      // In real implementation, we would call the API
      // const response = await chatApi.sendMessage(content);
      // setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <div className="h-full flex flex-col">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} apiConnected={apiConnected} />
    </div>
  );
}
