import { io, Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/types/socket.types";
import { getCookie } from "@/utils/GetCookie";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
  private socket: AppSocket | null = null;
  connect(): AppSocket {
    if (this.socket) return this.socket;

    const token = getCookie("accessToken");

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: { token },
    });

    this.socket.on("connect", () => {
      console.log("[Socket] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return this.socket;
  }

  /**
   * Kết nối lại với token mới (dùng sau khi refresh token).
   * Ngắt kết nối cũ, đọc lại token từ cookie, rồi connect lại.
   */
  reconnect(): AppSocket {
    this.disconnect();
    return this.connect();
  }

  /** Ngắt kết nối socket */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /** Lấy instance socket hiện tại (có thể null nếu chưa connect) */
  getSocket(): AppSocket | null {
    return this.socket;
  }

  /** Tham gia phòng chat */
  joinRoom(roomId: string): void {
    this.socket?.emit("join_room", roomId);
  }

  /** Rời phòng chat */
  leaveRoom(roomId: string): void {
    this.socket?.emit("leave_room", roomId);
  }

  /** Gửi tin nhắn tới phòng */
  sendMessage(data: {
    roomId: string;
    message: string;
    senderId: string;
    conversationId: string;
  }): void {
    this.socket?.emit("send_message", data);
  }

  /** Lắng nghe tin nhắn mới */
  onReceiveMessage(
    callback: (data: {
      senderId: string;
      message: string;
      timestamp: Date;
      conversationId?: string;
    }) => void,
  ): void {
    this.socket?.off("receive_message");
    this.socket?.on("receive_message", callback);
  }

  /** Huỷ lắng nghe tin nhắn */
  offReceiveMessage(): void {
    this.socket?.off("receive_message");
  }

  /** Lắng nghe thông báo mới */
  onNewNotification(callback: (message: string) => void): void {
    this.socket?.off("new_notification");
    this.socket?.on("new_notification", callback);
  }

  /** Huỷ lắng nghe thông báo */
  offNewNotification(): void {
    this.socket?.off("new_notification");
  }
}

// Singleton export
const socketService = new SocketService();
export default socketService;
