import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { useApiStore } from "@/lib/store/apiStore";
import { ApiLog } from "@/types/api";
import { Search, Trash, RefreshCw, Eye } from "lucide-react";
import RequestInspector from "@/components/modals/RequestInspector";

// Example logs for demo purposes
const demoLogs: ApiLog[] = [
  {
    id: "log_1",
    request: {
      method: "GET",
      url: "/api/system/status",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ***"
      },
      timestamp: "2023-11-14T14:35:22Z"
    },
    response: {
      status: 200,
      statusText: "OK",
      data: {
        status: "operational",
        version: "1.2.3",
        uptime: "5d 12h 36m",
        api_rate_limit: {
          total: 1000,
          remaining: 753,
          reset_at: "2023-11-15T00:00:00Z"
        }
      },
      time: 123,
      timestamp: "2023-11-14T14:35:22Z"
    },
    duration: 123,
    timestamp: "2023-11-14T14:35:22Z",
    success: true
  },
  {
    id: "log_2",
    request: {
      method: "POST",
      url: "/api/chat/message",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ***"
      },
      body: {
        message: "Hello, how are you?",
        context_id: null,
        options: {
          temperature: 0.7
        }
      },
      timestamp: "2023-11-14T14:34:15Z"
    },
    response: {
      status: 200,
      statusText: "OK",
      data: {
        id: "msg_123456789",
        response: "I'm doing well, thank you for asking! How can I assist you today?",
        created_at: "2023-11-14T14:34:16Z",
        tokens: {
          prompt: 12,
          completion: 15,
          total: 27
        }
      },
      time: 842,
      timestamp: "2023-11-14T14:34:16Z"
    },
    duration: 842,
    timestamp: "2023-11-14T14:34:15Z",
    success: true
  },
  {
    id: "log_3",
    request: {
      method: "POST",
      url: "/api/generate/image",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ***"
      },
      body: {
        prompt: "a serene forest landscape with a small cabin",
        size: "1024x1024",
        quality: "standard"
      },
      timestamp: "2023-11-14T14:30:05Z"
    },
    response: {
      status: 200,
      statusText: "OK",
      data: {
        id: "img_123456789",
        url: "https://example.com/images/img_123456789.png",
        created_at: "2023-11-14T14:30:15Z"
      },
      time: 10234,
      timestamp: "2023-11-14T14:30:15Z"
    },
    duration: 10234,
    timestamp: "2023-11-14T14:30:05Z",
    success: true
  },
  {
    id: "log_4",
    request: {
      method: "GET",
      url: "/api/context/list",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ***"
      },
      timestamp: "2023-11-14T14:25:45Z"
    },
    response: {
      status: 404,
      statusText: "Not Found",
      data: {
        error: "Resource not found",
        message: "The requested endpoint does not exist"
      },
      time: 78,
      timestamp: "2023-11-14T14:25:45Z"
    },
    duration: 78,
    timestamp: "2023-11-14T14:25:45Z",
    success: false
  }
];

export default function RequestLogsPage() {
  const { requestLogs, clearRequestLogs } = useApiStore();
  const [logs] = useState<ApiLog[]>(demoLogs); // In real app, use requestLogs from the store
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const getStatusBadgeVariant = (status: number) => {
    if (status >= 200 && status < 300) return "success";
    if (status >= 400 && status < 500) return "warning";
    if (status >= 500) return "error";
    return "secondary";
  };
  
  const filteredLogs = logs.filter(log => {
    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      return (
        log.request.url.toLowerCase().includes(lowerQuery) ||
        log.request.method.toLowerCase().includes(lowerQuery) ||
        (log.request.body && JSON.stringify(log.request.body).toLowerCase().includes(lowerQuery)) ||
        (log.response.data && JSON.stringify(log.response.data).toLowerCase().includes(lowerQuery))
      );
    }
    
    // Filter by tab
    if (activeTab === "all") return true;
    if (activeTab === "success") return log.success;
    if (activeTab === "error") return !log.success;
    if (activeTab === "slow") return log.duration > 1000;
    
    return true;
  });
  
  const handleInspectLog = (log: ApiLog) => {
    setSelectedLogId(log.id);
    setShowInspector(true);
  };
  
  const selectedLog = logs.find(log => log.id === selectedLogId);
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Request Logs</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and inspect your recent API requests and responses.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => clearRequestLogs()}>
              <Trash className="h-4 w-4 mr-2" />
              Clear Logs
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>API Request Logs</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder="Search requests..."
                  className="pl-8 max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              Showing {filteredLogs.length} of {logs.length} requests
            </CardDescription>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="success">Success</TabsTrigger>
                <TabsTrigger value="error">Errors</TabsTrigger>
                <TabsTrigger value="slow">Slow (&gt;1s)</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Endpoint</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Duration</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-3 px-4 text-sm">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={
                              log.request.method === "GET" ? "info" : 
                              log.request.method === "POST" ? "success" :
                              log.request.method === "PUT" ? "warning" :
                              "error"
                            }
                          >
                            {log.request.method}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-mono">{log.request.url}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadgeVariant(log.response.status)}>
                            {log.response.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`
                            ${log.duration > 1000 ? 'text-warning' : 'text-slate-600 dark:text-slate-400'}
                          `}>
                            {log.duration}ms
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleInspectLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                        No matching request logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedLog && showInspector && (
        <RequestInspector
          isOpen={showInspector}
          onClose={() => setShowInspector(false)}
          requestData={selectedLog.request}
          responseData={selectedLog.response}
        />
      )}
    </div>
  );
}
