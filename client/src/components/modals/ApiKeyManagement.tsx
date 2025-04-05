import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Eye, EyeOff, Plus, Trash } from "lucide-react";
import { ApiKey } from "@/types/api";

interface ApiKeyManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyManagement({ isOpen, onClose }: ApiKeyManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  
  // Sample API keys - would come from API in real implementation
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "key_1", name: "Development Key", value: "sk-dev-12345", created: "2023-10-20", lastUsed: "2023-11-14" },
    { id: "key_2", name: "Production Key", value: "sk-prod-67890", created: "2023-09-15", lastUsed: "2023-11-12" }
  ]);

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const createNewKey = () => {
    if (newKeyName.trim()) {
      // In a real app, this would call the API to create a new key
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyName,
        value: `sk-${Math.random().toString(36).substring(2, 10)}`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: "Never"
      };
      
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName("");
      setShowCreateForm(false);
      // Automatically show the newly created key
      setVisibleKeys(prev => ({
        ...prev,
        [newKey.id]: true
      }));
    }
  };

  const deleteKey = (keyId: string) => {
    // In a real app, this would call the API to revoke the key
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>API Key Management</DialogTitle>
          <DialogDescription>
            Manage your API keys for accessing NPCSH services.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Your API Keys</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>
          
          {showCreateForm && (
            <div className="mb-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-3">Create New API Key</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Development, Production, Testing"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={createNewKey}
                    disabled={!newKeyName.trim()}
                  >
                    Create Key
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {apiKeys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">
                          {visibleKeys[key.id] ? key.value : "••••••••••••••••"}
                        </span>
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
                    </TableCell>
                    <TableCell>{key.created}</TableCell>
                    <TableCell>{key.lastUsed}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteKey(key.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-slate-500">
              No API keys found. Create your first key to get started.
            </div>
          )}
          
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>⚠️ API keys provide complete access to your NPCSH account. Keep them secure!</p>
            <p className="mt-1">For production use, we recommend implementing proper key rotation policies.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
