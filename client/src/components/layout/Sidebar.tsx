import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUserStore } from "@/lib/store/userStore";
import {
  MessageSquare,
  Image,
  Files,
  FileText,
  Code,
  BarChart2,
  Settings,
  Key,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { userRole } = useUserStore();
  
  const getNavLinkClass = (path: string) => {
    const isActive = location === path;
    return `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
      isActive
        ? "bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
    }`;
  };

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0 overflow-y-auto z-10">
      <nav className="px-4 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Main
          </h3>
          <Link href="/" className={getNavLinkClass("/")}>
            <MessageSquare className="h-5 w-5 mr-3" />
            Chat
          </Link>
          <Link href="/gallery" className={getNavLinkClass("/gallery")}>
            <Image className="h-5 w-5 mr-3" />
            Media Gallery
          </Link>
          <Link href="/context" className={getNavLinkClass("/context")}>
            <Files className="h-5 w-5 mr-3" />
            Context Manager
          </Link>
        </div>

        {/* Developer Section */}
        {userRole === "developer" && (
          <div className="mt-8 space-y-1">
            <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Developer
            </h3>
            <Link href="/api-docs" className={getNavLinkClass("/api-docs")}>
              <FileText className="h-5 w-5 mr-3" />
              API Documentation
            </Link>
            <Link href="/api-explorer" className={getNavLinkClass("/api-explorer")}>
              <Code className="h-5 w-5 mr-3" />
              API Explorer
            </Link>
            <Link href="/logs" className={getNavLinkClass("/logs")}>
              <BarChart2 className="h-5 w-5 mr-3" />
              Request Logs
            </Link>
          </div>
        )}

        {/* Settings Section */}
        <div className="mt-8 space-y-1">
          <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Settings
          </h3>
          <Link href="/settings" className={getNavLinkClass("/settings")}>
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
          {userRole === "developer" && (
            <Link href="/api-keys" className={getNavLinkClass("/api-keys")}>
              <Key className="h-5 w-5 mr-3" />
              API Keys
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}
