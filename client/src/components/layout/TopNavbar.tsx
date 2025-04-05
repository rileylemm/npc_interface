import { useState } from "react";
import { useApiStore } from "@/lib/store/apiStore";
import { useUserStore } from "@/lib/store/userStore";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopNavbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { apiStatus, apiEndpoint, apiConnected, connectApi, disconnectApi } = useApiStore();
  const { user } = useUserStore();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {/* Mobile menu button - will be connected to sidebar visibility in AppLayout */}
          <button className="p-2 rounded-md lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center ml-2 lg:ml-0">
            <span className="text-xl font-semibold text-primary-600 dark:text-primary-500">
              NPCSH
            </span>
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 hidden md:inline-block">
              Non-Player Character Shell
            </span>
          </div>
        </div>

        {/* API Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {apiStatus === "connected" && (
              <span className="inline-block h-2 w-2 rounded-full bg-success mr-2"></span>
            )}
            {apiStatus === "disconnected" && (
              <span className="inline-block h-2 w-2 rounded-full bg-error mr-2"></span>
            )}
            {apiStatus === "connecting" && (
              <span className="inline-block h-2 w-2 rounded-full bg-warning mr-2 animate-pulse"></span>
            )}
            <span className="text-sm hidden md:inline-block">
              <span className="text-slate-600 dark:text-slate-400">{apiEndpoint}</span>
              <span className="mx-1">•</span>
              <span className="capitalize">{apiStatus}</span>
            </span>
            {!apiConnected ? (
              <Button
                variant="default"
                size="sm"
                className="ml-2 text-xs"
                onClick={connectApi}
              >
                Connect
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="ml-2 text-xs"
                onClick={disconnectApi}
              >
                Disconnect
              </Button>
            )}
          </div>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full"
              >
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user.role}
                </p>
              </div>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={toggleTheme}>
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
