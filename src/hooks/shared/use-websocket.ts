'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseWebSocketOptions {
   url: string;
   enabled?: boolean;
   onMessage?: (event: MessageEvent) => void;
   onOpen?: () => void;
   onClose?: () => void;
   onError?: (event: Event) => void;
   reconnectIntervalMs?: number;
}

export interface UseWebSocketReturn {
   isConnected: boolean;
   send: (data: string) => void;
   disconnect: () => void;
}

export function useWebSocket({
   url,
   enabled = true,
   onMessage,
   onOpen,
   onClose,
   onError,
   reconnectIntervalMs = 3000,
}: UseWebSocketOptions): UseWebSocketReturn {
   const wsRef = useRef<WebSocket | null>(null);
   const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const enabledRef = useRef(enabled);
   const [isConnected, setIsConnected] = useState(false);

   // Keep enabledRef in sync so the close handler can check without stale closure
   useEffect(() => {
      enabledRef.current = enabled;
   }, [enabled]);

   const clearReconnectTimer = useCallback(() => {
      if (reconnectTimerRef.current !== null) {
         clearTimeout(reconnectTimerRef.current);
         reconnectTimerRef.current = null;
      }
   }, []);

   const connect = useCallback(() => {
      if (!url || wsRef.current?.readyState === WebSocket.OPEN) return;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
         setIsConnected(true);
         clearReconnectTimer();
         onOpen?.();
      };

      ws.onmessage = (event) => {
         onMessage?.(event);
      };

      ws.onerror = (event) => {
         onError?.(event);
      };

      ws.onclose = () => {
         setIsConnected(false);
         onClose?.();
         // Auto-reconnect only while still enabled
         if (enabledRef.current) {
            reconnectTimerRef.current = setTimeout(
               connect,
               reconnectIntervalMs
            );
         }
      };
      // onMessage/onOpen/onClose/onError intentionally omitted — read at call time via closure
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [url, reconnectIntervalMs, clearReconnectTimer]);

   const disconnect = useCallback(() => {
      clearReconnectTimer();
      wsRef.current?.close();
      wsRef.current = null;
   }, [clearReconnectTimer]);

   const send = useCallback((data: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
         wsRef.current.send(data);
      }
   }, []);

   useEffect(() => {
      if (!enabled || !url) {
         disconnect();
         return;
      }
      connect();
      return disconnect;
   }, [url, enabled, connect, disconnect]);

   return { isConnected, send, disconnect };
}
