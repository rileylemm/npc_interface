import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiStore } from "@/lib/store/apiStore";
import { ApiRequest, ApiResponse } from "@/types/api";
import { Play, Save, Trash, Code } from "lucide-react";
import RequestInspector from "@/components/modals/RequestInspector";

export default function ApiExplorerPage() {
  const { apiEndpoint, apiConnected } = useApiStore();
  
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/system/status");
  const [requestBody, setRequestBody] = useState("");
  const [headers, setHeaders] = useState("{\n  \"Content-Type\": \"application/json\"\n}");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestTime, setRequestTime] = useState<number | null>(null);
  
  const [savedRequests, setSavedRequests] = useState<Array<{ name: string; request: ApiRequest }>>([
    { 
      name: "Get System Status", 
      request: { 
        method: "GET", 
        url: "/api/system/status", 
        headers: { "Content-Type": "application/json" },
        body: null
      } 
    },
    { 
      name: "Send Chat Message", 
      request: { 
        method: "POST", 
        url: "/api/chat/message", 
        headers: { "Content-Type": "application/json" },
        body: { 
          message: "Hello, how are you today?",
          context_id: null,
          options: {
            temperature: 0.7,
            max_tokens: 1000
          }
        }
      } 
    }
  ]);
  
  const [showInspector, setShowInspector] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<ApiRequest | null>(null);
  const [currentResponse, setCurrentResponse] = useState<ApiResponse | null>(null);

  const handleSendRequest = async () => {
    if (!apiConnected) {
      setError("API is not connected. Please connect to the API first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(headers);
      } catch (e) {
        setError("Invalid headers JSON format");
        setLoading(false);
        return;
      }
      
      let parsedBody = null;
      if (requestBody.trim()) {
        try {
          parsedBody = JSON.parse(requestBody);
        } catch (e) {
          setError("Invalid request body JSON format");
          setLoading(false);
          return;
        }
      }
      
      const fullUrl = `${apiEndpoint}${endpoint}`;
      const requestObj: ApiRequest = {
        method,
        url: endpoint,
        headers: parsedHeaders,
        body: parsedBody
      };
      
      setCurrentRequest(requestObj);
      
      const startTime = performance.now();
      
      const response = await fetch(fullUrl, {
        method,
        headers: parsedHeaders,
        body: parsedBody ? JSON.stringify(parsedBody) : undefined
      });
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setRequestTime(duration);
      
      const responseData = await response.json();
      
      const responseObj: ApiResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data: responseData,
        time: duration
      };
      
      setCurrentResponse(responseObj);
      setResponse(responseData);
    } catch (err) {
      console.error("Request failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  const saveCurrentRequest = () => {
    const name = prompt("Enter a name for this request:");
    if (!name) return;
    
    let parsedBody = null;
    if (requestBody.trim()) {
      try {
        parsedBody = JSON.parse(requestBody);
      } catch (e) {
        setError("Invalid request body JSON format");
        return;
      }
    }
    
    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(headers);
    } catch (e) {
      setError("Invalid headers JSON format");
      return;
    }
    
    const newRequest = {
      name,
      request: {
        method,
        url: endpoint,
        headers: parsedHeaders,
        body: parsedBody
      }
    };
    
    setSavedRequests([...savedRequests, newRequest]);
  };
  
  const loadSavedRequest = (savedRequest: { name: string; request: ApiRequest }) => {
    setMethod(savedRequest.request.method);
    setEndpoint(savedRequest.request.url);
    setHeaders(JSON.stringify(savedRequest.request.headers, null, 2));
    setRequestBody(savedRequest.request.body ? JSON.stringify(savedRequest.request.body, null, 2) : "");
  };
  
  const deleteSavedRequest = (index: number) => {
    const newRequests = [...savedRequests];
    newRequests.splice(index, 1);
    setSavedRequests(newRequests);
  };
  
  const openRequestInspector = () => {
    if (currentRequest && currentResponse) {
      setShowInspector(true);
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">API Explorer</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Test and explore NPCSH API endpoints directly from your browser.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${apiConnected ? 'bg-success' : 'bg-error'}`}></div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {apiConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Saved Requests Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Saved Requests</CardTitle>
                <CardDescription>Your saved API requests</CardDescription>
              </CardHeader>
              <CardContent>
                {savedRequests.length > 0 ? (
                  <ul className="space-y-2">
                    {savedRequests.map((savedReq, index) => (
                      <li key={index} className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                        <button 
                          className="text-left flex-1 text-sm"
                          onClick={() => loadSavedRequest(savedReq)}
                        >
                          <span className="font-medium">{savedReq.name}</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            <span className={`
                              inline-block px-1.5 py-0.5 text-xs rounded
                              ${savedReq.request.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                savedReq.request.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                savedReq.request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }
                            `}>
                              {savedReq.request.method}
                            </span>
                            <span className="ml-1 font-mono">{savedReq.request.url}</span>
                          </div>
                        </button>
                        <button 
                          onClick={() => deleteSavedRequest(index)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    No saved requests yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Request Builder and Response */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="builder">
              <TabsList>
                <TabsTrigger value="builder">Request Builder</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
              
              <TabsContent value="builder" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Request</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <Label htmlFor="request-method">Method</Label>
                        <Select value={method} onValueChange={setMethod}>
                          <SelectTrigger id="request-method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1">
                        <Label htmlFor="request-endpoint">Endpoint</Label>
                        <Input 
                          id="request-endpoint" 
                          placeholder="/api/endpoint"
                          value={endpoint}
                          onChange={(e) => setEndpoint(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="request-headers">Headers</Label>
                      <Textarea 
                        id="request-headers"
                        placeholder="Enter request headers as JSON"
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                        className="font-mono text-sm"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="request-body">Request Body (JSON)</Label>
                      <Textarea 
                        id="request-body"
                        placeholder={`{\n  "key": "value"\n}`}
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="font-mono text-sm"
                        rows={8}
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={saveCurrentRequest}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Request
                      </Button>
                      
                      <Button 
                        onClick={handleSendRequest}
                        disabled={loading || !apiConnected}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {loading ? "Sending..." : "Send Request"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Response</CardTitle>
                    {response && (
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {requestTime !== null && `${requestTime}ms`}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={openRequestInspector}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Inspect
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md">
                        <p className="font-medium">Error</p>
                        <p className="text-sm mt-1">{error}</p>
                      </div>
                    ) : response ? (
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                        <pre className="font-mono text-sm overflow-auto max-h-[400px] whitespace-pre-wrap">
                          {JSON.stringify(response, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                        <p>No response yet. Send a request to see results.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {showInspector && currentRequest && currentResponse && (
        <RequestInspector
          isOpen={showInspector}
          onClose={() => setShowInspector(false)}
          requestData={currentRequest}
          responseData={currentResponse}
        />
      )}
    </div>
  );
}
