import { useState, useEffect, useCallback } from 'react';
import { useApiStore } from '@/lib/store/apiStore';
import { SystemStatusResponse } from '@/types/api';

export function useApiConnection() {
  const { 
    apiStatus, 
    apiConnected, 
    connectApi, 
    disconnectApi,
    systemApi
  } = useApiStore();
  
  const [isPolling, setIsPolling] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);

  // Function to check system status
  const checkStatus = useCallback(async () => {
    if (!apiConnected || !systemApi) return;
    
    try {
      const status = await systemApi.getSystemStatus();
      setSystemStatus(status);
      setLastChecked(new Date());
      return status;
    } catch (error) {
      console.error('Failed to check API status:', error);
      // If we can't reach the API anymore, set disconnected
      if (apiConnected) {
        disconnectApi();
      }
      return null;
    }
  }, [apiConnected, systemApi, disconnectApi]);

  // Start/stop polling for system status
  useEffect(() => {
    if (!apiConnected || !isPolling) return;

    const intervalId = setInterval(() => {
      checkStatus();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [apiConnected, isPolling, checkStatus]);

  // Start polling when API connects
  useEffect(() => {
    if (apiConnected && !isPolling) {
      setIsPolling(true);
      checkStatus();
    } else if (!apiConnected && isPolling) {
      setIsPolling(false);
      setSystemStatus(null);
    }
  }, [apiConnected, isPolling, checkStatus]);

  return {
    apiStatus,
    apiConnected,
    connectApi,
    disconnectApi,
    systemStatus,
    lastChecked,
    checkStatus
  };
}
