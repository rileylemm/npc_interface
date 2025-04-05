import { useRef, useEffect } from "react";
import { Message } from "@/types/api";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", {
                "justify-end": message.role === "user",
                "justify-start": message.role === "system",
              })}
            >
              <div
                className={cn("rounded-lg px-4 py-2 max-w-xs sm:max-w-md", {
                  "bg-primary-500 text-white": message.role === "user",
                  "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700": message.role === "system",
                })}
              >
                <div 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }}
                />
                <div className="mt-1 text-xs opacity-70 text-right">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
