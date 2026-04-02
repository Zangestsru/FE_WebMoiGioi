import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";

/**
 * Hook để quản lý kết nối socket.
 * Tự động connect khi mount và disconnect khi unmount.
 *
 * @example
 * // Trong component cần socket:
 * const { isConnected, messages, joinRoom, sendMessage } = useSocket();
 */
export function useSocket(autoConnect = true) {
  const {
    isConnected,
    messages,
    connect,
    disconnect,
    joinRoom,
    sendMessage,
    clearMessages,
  } = useSocketStore();

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect]);

  return { isConnected, messages, joinRoom, sendMessage, clearMessages };
}
