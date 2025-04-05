import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { initializeUser } = useUserStore();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(isLargeScreen);

  useEffect(() => {
    // Initialize user data
    initializeUser();
  }, [initializeUser]);

  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
