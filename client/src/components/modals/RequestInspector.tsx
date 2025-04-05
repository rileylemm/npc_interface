import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiRequest, ApiResponse } from "@/types/api";

interface RequestInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: ApiRequest | null;
  responseData: ApiResponse | null;
}

export default function RequestInspector({ isOpen, onClose, requestData, responseData }: RequestInspectorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Request Inspector</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="request" className="flex-1 overflow-hidden flex flex-col">
          <TabsList>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto mt-4">
            <TabsContent value="request" className="h-full">
              {requestData ? (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md h-full">
                  <div className="flex items-center mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded text-white bg-green-500 mr-2">
                      {requestData.method}
                    </span>
                    <span className="font-mono text-sm">{requestData.url}</span>
                  </div>
                  <div className="font-mono text-sm overflow-auto max-h-[calc(100%-40px)]">
                    <pre>{JSON.stringify(requestData.body, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No request data available
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="response" className="h-full">
              {responseData ? (
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md h-full">
                  <div className="flex items-center mb-4">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded text-white mr-2 ${
                        responseData.status >= 200 && responseData.status < 300
                          ? "bg-green-500"
                          : responseData.status >= 400
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {responseData.status}
                    </span>
                    <span className="text-sm">
                      {responseData.statusText} - {responseData.time}ms
                    </span>
                  </div>
                  <div className="font-mono text-sm overflow-auto max-h-[calc(100%-40px)]">
                    <pre>{JSON.stringify(responseData.data, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No response data available
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="headers" className="h-full">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md h-full">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Request Headers</h3>
                  {requestData?.headers ? (
                    <div className="font-mono text-sm">
                      <pre>{JSON.stringify(requestData.headers, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="text-slate-500">No request headers available</div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Response Headers</h3>
                  {responseData?.headers ? (
                    <div className="font-mono text-sm">
                      <pre>{JSON.stringify(responseData.headers, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="text-slate-500">No response headers available</div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="outline">Copy as cURL</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
