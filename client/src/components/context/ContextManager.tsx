import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Edit, FilePlus, UploadCloud } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample context data - would come from API in real implementation
const sampleContexts = [
  { id: "ctx_1", name: "Project Discussion", description: "AI game development project context", fileCount: 3, tokenCount: 4350, lastUpdated: "2023-11-10" },
  { id: "ctx_2", name: "Research Papers", description: "ML research papers collection", fileCount: 7, tokenCount: 12800, lastUpdated: "2023-11-08" },
  { id: "ctx_3", name: "Story Planning", description: "Fantasy novel world-building notes", fileCount: 5, tokenCount: 8900, lastUpdated: "2023-11-05" },
];

export default function ContextManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contexts] = useState(sampleContexts);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Context Manager</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage conversation contexts to improve AI responses with relevant information.
            </p>
          </div>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Context
          </Button>
        </div>

        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Contexts</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorite">Favorites</TabsTrigger>
            </TabsList>
            <Input
              type="text"
              placeholder="Search contexts..."
              className="max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contexts.map((context) => (
                <Card key={context.id}>
                  <CardHeader className="pb-3">
                    <CardTitle>{context.name}</CardTitle>
                    <CardDescription>{context.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 text-sm gap-y-2">
                      <div className="text-slate-500 dark:text-slate-400">Files:</div>
                      <div>{context.fileCount}</div>
                      <div className="text-slate-500 dark:text-slate-400">Tokens:</div>
                      <div>{context.tokenCount.toLocaleString()}</div>
                      <div className="text-slate-500 dark:text-slate-400">Last Updated:</div>
                      <div>{context.lastUpdated}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <FilePlus className="h-4 w-4 mr-1" />
                      Add Files
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add Context Card */}
              <Card className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 bg-transparent transition-colors">
                <CardContent className="flex flex-col items-center justify-center h-full py-12">
                  <UploadCloud className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
                  <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
                    Create a new context by adding files or text
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Context
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
