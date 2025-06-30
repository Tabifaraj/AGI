import { useEffect, useCallback } from 'react';
import { wsManager } from '@/lib/websocket';

interface WSMessage {
  type: string;
  [key: string]: any;
}

export function useWebSocket() {
  useEffect(() => {
    wsManager.connect();
    
    return () => {
      wsManager.disconnect();
    };
  }, []);

  const subscribe = useCallback((type: string, handler: (message: WSMessage) => void) => {
    wsManager.on(type, handler);
    
    return () => {
      wsManager.off(type, handler);
    };
  }, []);

  const send = useCallback((message: WSMessage) => {
    wsManager.send(message);
  }, []);

  return { subscribe, send };
}
