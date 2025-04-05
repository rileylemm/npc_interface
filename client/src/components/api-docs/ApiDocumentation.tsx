import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EndpointCard from "./EndpointCard";
import { ApiEndpoint } from "@/types/api";

// Sample API endpoints data
const apiEndpoints: Record<string, ApiEndpoint[]> = {
  chat: [
    {
      id: "chat-message",
      method: "POST",
      path: "/api/chat/message",
      description: "Send a user message to the AI and receive a response.",
      requestBody: {
        message: "Hello, can you help me?",
        context_id: "optional-context-id",
        options: {
          temperature: 0.7,
          max_tokens: 1000
        }
      },
      response: {
        id: "msg_123456789",
        response: "Hello! I'd be happy to help you. What do you need assistance with?",
        created_at: "2023-11-14T12:34:56Z",
        tokens: {
          prompt: 10,
          completion: 15,
          total: 25
        }
      }
    },
    {
      id: "chat-history",
      method: "GET",
      path: "/api/chat/history",
      description: "Retrieve conversation history.",
      requestBody: null,
      response: {
        messages: [
          {
            id: "msg_123456789",
            role: "user",
            content: "Hello, can you help me?",
            created_at: "2023-11-14T12:34:56Z"
          },
          {
            id: "msg_987654321",
            role: "system",
            content: "Hello! I'd be happy to help you. What do you need assistance with?",
            created_at: "2023-11-14T12:34:59Z"
          }
        ]
      }
    },
    {
      id: "chat-clear",
      method: "DELETE",
      path: "/api/chat/history",
      description: "Clear conversation history.",
      requestBody: null,
      response: {
        success: true,
        message: "Conversation history cleared successfully."
      }
    }
  ],
  voice: [
    {
      id: "voice-record",
      method: "POST",
      path: "/api/voice/record",
      description: "Send audio data for transcription.",
      requestBody: {
        audio_data: "base64_encoded_audio_data",
        format: "wav", 
        language: "en-US"
      },
      response: {
        id: "trans_123456789",
        status: "processing" 
      }
    },
    {
      id: "voice-status",
      method: "GET",
      path: "/api/voice/status",
      description: "Check transcription processing status.",
      requestBody: null,
      response: {
        id: "trans_123456789",
        status: "completed",
        text: "This is the transcribed text from the audio.",
        confidence: 0.92
      }
    }
  ],
  image: [
    {
      id: "generate-image",
      method: "POST",
      path: "/api/generate/image",
      description: "Create image from text prompt.",
      requestBody: {
        prompt: "a serene forest landscape with a small cabin, digital art style",
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      },
      response: {
        id: "img_123456789",
        url: "https://example.com/images/img_123456789.png",
        created_at: "2023-11-14T12:34:56Z"
      }
    },
    {
      id: "gallery-images",
      method: "GET",
      path: "/api/gallery/images",
      description: "List generated images.",
      requestBody: null,
      response: {
        images: [
          {
            id: "img_123456789",
            prompt: "a serene forest landscape with a small cabin, digital art style",
            url: "https://example.com/images/img_123456789.png",
            created_at: "2023-11-14T12:34:56Z"
          }
        ]
      }
    }
  ],
  context: [
    {
      id: "context-create",
      method: "POST",
      path: "/api/context/create",
      description: "Create a new conversation context.",
      requestBody: {
        name: "Project Discussion",
        description: "AI game development project context"
      },
      response: {
        id: "ctx_123456789",
        name: "Project Discussion",
        description: "AI game development project context",
        created_at: "2023-11-14T12:34:56Z"
      }
    },
    {
      id: "context-update",
      method: "PUT",
      path: "/api/context/update",
      description: "Add files/content to context.",
      requestBody: {
        context_id: "ctx_123456789",
        files: [
          {
            name: "project_specs.pdf",
            content: "base64_encoded_content",
            type: "application/pdf"
          }
        ]
      },
      response: {
        id: "ctx_123456789",
        updated_at: "2023-11-14T12:45:30Z",
        file_count: 3,
        token_count: 4350
      }
    },
    {
      id: "context-list",
      method: "GET",
      path: "/api/context/list",
      description: "List available contexts.",
      requestBody: null,
      response: {
        contexts: [
          {
            id: "ctx_123456789",
            name: "Project Discussion",
            description: "AI game development project context",
            file_count: 3,
            token_count: 4350,
            updated_at: "2023-11-14T12:45:30Z"
          }
        ]
      }
    }
  ],
  system: [
    {
      id: "system-status",
      method: "GET",
      path: "/api/system/status",
      description: "Check NPCSH service status.",
      requestBody: null,
      response: {
        status: "operational",
        version: "1.2.3",
        uptime: "5d 12h 36m",
        api_rate_limit: {
          total: 1000,
          remaining: 753,
          reset_at: "2023-11-15T00:00:00Z"
        }
      }
    },
    {
      id: "system-config",
      method: "POST",
      path: "/api/system/config",
      description: "Update system configuration.",
      requestBody: {
        default_model: "gpt-4-turbo",
        timeout_ms: 30000,
        max_retries: 3
      },
      response: {
        success: true,
        message: "Configuration updated successfully."
      }
    }
  ]
};

export default function ApiDocumentation() {
  const [activeSection, setActiveSection] = useState("chat");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const toggleEndpointExpansion = (id: string) => {
    setExpandedEndpoint(expandedEndpoint === id ? null : id);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">API Documentation</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Complete reference for the NPCSH API endpoints.
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* API Categories */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden p-4 lg:col-span-1">
            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">API Categories</h2>
            <nav className="space-y-1">
              {Object.keys(apiEndpoints).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveSection(category)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${
                    activeSection === category
                      ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} API
                </button>
              ))}
            </nav>

            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Resources</h3>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                >
                  Authentication Guide
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                >
                  Error Codes
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                >
                  Rate Limits
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
                >
                  Webhook Events
                </a>
              </nav>
            </div>
          </div>

          {/* API Endpoint Details */}
          <div className="bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden lg:col-span-3">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsContent value={activeSection} className="m-0">
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} API
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {activeSection === "chat" && "Endpoints for sending messages and managing conversation history."}
                      {activeSection === "voice" && "Endpoints for voice recording and transcription."}
                      {activeSection === "image" && "Endpoints for generating and managing images."}
                      {activeSection === "context" && "Endpoints for managing conversation contexts."}
                      {activeSection === "system" && "Endpoints for system status and configuration."}
                    </p>
                  </div>

                  {apiEndpoints[activeSection].map((endpoint) => (
                    <EndpointCard
                      key={endpoint.id}
                      endpoint={endpoint}
                      isExpanded={expandedEndpoint === endpoint.id}
                      onToggle={() => toggleEndpointExpansion(endpoint.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
