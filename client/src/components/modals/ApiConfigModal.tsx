import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApiStore } from "@/lib/store/apiStore";

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiConfigModal({ isOpen, onClose }: ApiConfigModalProps) {
  const { 
    apiEndpoint, 
    setApiEndpoint, 
    authType, 
    setAuthType, 
    apiKey, 
    setApiKey,
    requestTimeout,
    setRequestTimeout,
    maxRetries,
    setMaxRetries,
    connectApi
  } = useApiStore();

  const [formValues, setFormValues] = useState({
    apiEndpoint,
    authType,
    apiKey,
    requestTimeout,
    maxRetries
  });

  const handleSave = () => {
    setApiEndpoint(formValues.apiEndpoint);
    setAuthType(formValues.authType);
    setApiKey(formValues.apiKey);
    setRequestTimeout(formValues.requestTimeout);
    setMaxRetries(formValues.maxRetries);
    connectApi();
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              value={formValues.apiEndpoint}
              onChange={(e) => handleChange("apiEndpoint", e.target.value)}
              placeholder="https://api.npcsh.example.com/v1"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="auth-type">Authentication Type</Label>
            <Select 
              value={formValues.authType} 
              onValueChange={(value) => handleChange("authType", value)}
            >
              <SelectTrigger id="auth-type">
                <SelectValue placeholder="Select authentication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apiKey">API Key</SelectItem>
                <SelectItem value="bearerToken">Bearer Token</SelectItem>
                <SelectItem value="oauth2">OAuth 2.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={formValues.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="timeout">Request Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                value={formValues.requestTimeout}
                onChange={(e) => handleChange("requestTimeout", parseInt(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="retries">Max Retries</Label>
              <Input
                id="retries"
                type="number"
                value={formValues.maxRetries}
                onChange={(e) => handleChange("maxRetries", parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
