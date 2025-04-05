import { Switch, Route } from "wouter";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import GalleryPage from "@/pages/GalleryPage";
import ContextManagerPage from "@/pages/ContextManagerPage";
import ApiDocsPage from "@/pages/ApiDocsPage";
import ApiExplorerPage from "@/pages/ApiExplorerPage";
import RequestLogsPage from "@/pages/RequestLogsPage";
import ApiKeysPage from "@/pages/ApiKeysPage";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/context" component={ContextManagerPage} />
        <Route path="/api-docs" component={ApiDocsPage} />
        <Route path="/api-explorer" component={ApiExplorerPage} />
        <Route path="/logs" component={RequestLogsPage} />
        <Route path="/api-keys" component={ApiKeysPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default App;
