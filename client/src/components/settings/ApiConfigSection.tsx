import { useState } from "react";
import { useApiStore } from "@/lib/store/apiStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ApiConfigSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { 
    apiEndpoint, 
    setApiEndpoint, 
    connectApi, 
    authType, 
    setAuthType, 
    apiKey, 
    setApiKey,
    requestTimeout,
    setRequestTimeout,
    maxRetries,
    setMaxRetries,
    apiVersion,
    setApiVersion
  } = useApiStore();

  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">API Configuration</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          {!isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="api-base-url">API Base URL</Label>
            <Input
              id="api-base-url"
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="auth-type">Authentication Type</Label>
              <Select value={authType} onValueChange={setAuthType}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apiKey">API Key</SelectItem>
                  <SelectItem value="bearerToken">Bearer Token</SelectItem>
                  <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="request-timeout">Request Timeout (ms)</Label>
              <Input
                id="request-timeout"
                type="number"
                value={requestTimeout}
                onChange={(e) => setRequestTimeout(parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="max-retries">Max Retries</Label>
              <Input
                id="max-retries"
                type="number"
                value={maxRetries}
                onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="api-version">API Version</Label>
            <div className="mt-1 flex items-center">
              <span className="px-3 py-2 bg-slate-100 dark:bg-slate-600 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-md text-slate-500 dark:text-slate-400">
                v
              </span>
              <Input
                id="api-version"
                type="text"
                value={apiVersion}
                onChange={(e) => setApiVersion(e.target.value)}
                className="w-20 rounded-l-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button onClick={connectApi}>Test Connection</Button>
          </div>
        </div>
      )}
    </div>
  );
}
