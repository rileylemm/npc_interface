import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ApiEndpoint } from "@/types/api";

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  isExpanded: boolean;
  onToggle: () => void;
}

const getMethodBadgeClass = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-500";
    case "POST":
      return "bg-green-500";
    case "PUT":
      return "bg-yellow-500";
    case "DELETE":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function EndpointCard({ endpoint, isExpanded, onToggle }: EndpointCardProps) {
  const [requestFormValues, setRequestFormValues] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setRequestFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-6">
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center">
          <span className={`px-2 py-1 text-xs font-medium rounded text-white ${getMethodBadgeClass(endpoint.method)} mr-3`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
            {endpoint.path}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-500 transition-transform duration-200" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {endpoint.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpoint.requestBody && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Request Body
                </h3>
                <div className="mt-2 bg-slate-100 dark:bg-slate-700 rounded-md p-4">
                  <pre className="text-xs font-mono overflow-x-auto text-slate-800 dark:text-slate-200">
                    {JSON.stringify(endpoint.requestBody, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Response
              </h3>
              <div className="mt-2 bg-slate-100 dark:bg-slate-700 rounded-md p-4">
                <pre className="text-xs font-mono overflow-x-auto text-slate-800 dark:text-slate-200">
                  {JSON.stringify(endpoint.response, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {endpoint.requestBody && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Try It</h3>
              <div className="mt-2 bg-slate-100 dark:bg-slate-700 rounded-md p-4">
                <div className="space-y-4">
                  {endpoint.method === "POST" && endpoint.path === "/api/chat/message" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                          Message
                        </label>
                        <Textarea
                          className="mt-1"
                          rows={3}
                          placeholder="Type your message..."
                          onChange={(e) => handleInputChange("message", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                          Context ID (optional)
                        </label>
                        <Input
                          type="text"
                          className="mt-1"
                          onChange={(e) => handleInputChange("context_id", e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  
                  {endpoint.method === "POST" && endpoint.path === "/api/generate/image" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                        Prompt
                      </label>
                      <Textarea
                        className="mt-1"
                        rows={3}
                        placeholder="Describe the image you want to generate..."
                        onChange={(e) => handleInputChange("prompt", e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button>Send Request</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
