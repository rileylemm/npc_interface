import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Eye, EyeOff, RefreshCw, Trash, InfoIcon } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { ApiKey } from "@/types/api";
import ApiKeyManagement from "@/components/modals/ApiKeyManagement";
import { Badge } from "@/components/ui/Badge";

export default function ApiKeysPage() {
  const { userRole } = useUserStore();
  const [showKeyModal, setShowKeyModal] = useState(false);
  
  // Example API keys - would come from API in real implementation
  const [apiKeys] = useState<ApiKey[]>([
    { id: "key_1", name: "Development Key", value: "sk-dev-12345", created: "2023-10-20", lastUsed: "2023-11-14" },
    { id: "key_2", name: "Production Key", value: "sk-prod-67890", created: "2023-09-15", lastUsed: "2023-11-12" }
  ]);
  
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  
  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  
  // Check if user has access to this page
  if (userRole !== 'developer') {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <InfoIcon className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Developer Access Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You need developer privileges to access the API keys management page.
            </p>
            <Button variant="outline">Request Access</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">API Keys</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your API keys for accessing NPCSH services.
            </p>
          </div>
          <Button onClick={() => setShowKeyModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Key
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>
                  API keys provide full access to your NPCSH account. Keep them secure!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Key</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Created</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Last Used</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiKeys.map((key) => (
                        <tr key={key.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="py-4 px-4 font-medium">{key.name}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                                {visibleKeys[key.id] ? key.value : "••••••••••••••••"}
                              </code>
                              <button
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                              >
                                {visibleKeys[key.id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(key.value)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400">{key.created}</td>
                          <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400">{key.lastUsed}</td>
                          <td className="py-4 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <p className="flex items-center">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Keep your API keys secure and don't share them in public areas
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Current period statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Requests Today</span>
                    <span className="text-sm">247 / 1000</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '24.7%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rate Limits by Endpoint</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <div>
                        <Badge variant="info" className="mr-2">GET</Badge>
                        <span className="font-mono text-xs">/api/system/status</span>
                      </div>
                      <span>100/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <Badge variant="success" className="mr-2">POST</Badge>
                        <span className="font-mono text-xs">/api/chat/message</span>
                      </div>
                      <span>60/min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <Badge variant="success" className="mr-2">POST</Badge>
                        <span className="font-mono text-xs">/api/generate/image</span>
                      </div>
                      <span>10/min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-200 dark:border-slate-700 px-6 py-4">
                <a href="#" className="text-sm text-primary hover:underline">
                  View detailed usage statistics
                </a>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-1 rounded mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Use environment variables to store API keys in your applications
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-1 rounded mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Implement proper key rotation policies (every 90 days)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-1 rounded mr-2 mt-0.5">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Never commit API keys to source control
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <ApiKeyManagement
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
      />
    </div>
  );
}
