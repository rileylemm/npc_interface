import { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  apiConnected: boolean;
}

export default function MessageInput({ onSendMessage, apiConnected }: MessageInputProps) {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-4">
            <div className="flex-1 min-h-[80px]">
              <Textarea
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                placeholder="Type your message here..."
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2">
              <Button
                type="submit"
                size="icon"
                className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </form>
        <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Type <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1">/help</span> to see available commands
          </div>
          <div className={apiConnected ? "flex items-center" : "hidden"}>
            <span className="h-2 w-2 rounded-full bg-success mr-1"></span>
            API Connected
          </div>
        </div>
      </div>
    </div>
  );
}
