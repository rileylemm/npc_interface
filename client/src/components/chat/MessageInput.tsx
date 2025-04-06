import { useState } from "react";
import { Mic, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { MessageOptions } from "@/types/api";

interface MessageInputProps {
  onSendMessage: (message: string, options?: Partial<MessageOptions>) => void;
  apiConnected: boolean;
  isLoading?: boolean;
  npcOptions?: MessageOptions;
  updateNpcOptions?: (options: Partial<MessageOptions>) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  apiConnected, 
  isLoading = false,
  npcOptions = {},
  updateNpcOptions
}: MessageInputProps) {
  const [messageText, setMessageText] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && !isLoading) {
      onSendMessage(messageText, npcOptions);
      setMessageText("");
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNpcOptions?.({ model: e.target.value });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNpcOptions?.({ provider: e.target.value });
  };

  const handleNpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNpcOptions?.({ npc: e.target.value });
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      <div className="max-w-3xl mx-auto">
        {showOptions && (
          <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <h3 className="text-sm font-medium mb-2">NPCSH Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1">Model</label>
                <select 
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                  value={npcOptions.model || ''}
                  onChange={handleModelChange}
                >
                  <option value="">Default</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="llama-7b">Llama 7B</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Provider</label>
                <select 
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                  value={npcOptions.provider || ''}
                  onChange={handleProviderChange}
                >
                  <option value="">Default</option>
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="local">Local</option>
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">NPC Name</label>
                <input 
                  type="text"
                  placeholder="NPC name"
                  className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                  value={npcOptions.npc || ''}
                  onChange={handleNpcChange}
                />
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex items-end gap-4">
            <div className="flex-1 min-h-[80px]">
              <Textarea
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                placeholder="Type your message here..."
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2">
              <Button
                type="submit"
                size="icon"
                className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full"
                disabled={isLoading || !messageText.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-5 w-5" />
                )}
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full"
                disabled={isLoading}
                onClick={() => setShowOptions(!showOptions)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="p-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full"
                disabled={isLoading}
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
