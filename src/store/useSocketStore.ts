import { create } from "zustand";
import socketService from "@/services/SocketService";

interface Message {
  senderId: string;
  message: string;
  timestamp: Date;
  conversationId: string;
}

interface SocketState {
  isConnected: boolean;
  messages: Message[];

  // Actions
  connect: () => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (data: {
    roomId: string;
    message: string;
    senderId: string;
    conversationId: string;
  }) => void;
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  isConnected: false,
  messages: [],

  connect: () => {
    if (get().isConnected) return;
    const socket = socketService.connect();

    socket.on("connect", () => set({ isConnected: true }));
    socket.on("disconnect", () => set({ isConnected: false }));

    socketService.onReceiveMessage(
      (data: {
        senderId: string;
        message: string;
        timestamp: Date;
        conversationId?: string;
      }) => {
        // Received new message
        get().addMessage({
          ...data,
          timestamp: new Date(data.timestamp),
          conversationId: data.conversationId || "",
        });
      },
    );
  },

  disconnect: () => {
    socketService.offReceiveMessage();
    socketService.offNewNotification();
    socketService.disconnect();
    set({ isConnected: false });
  },

  joinRoom: (roomId: string) => {
    socketService.joinRoom(roomId);
  },

  leaveRoom: (roomId: string) => {
    socketService.leaveRoom(roomId);
  },

  sendMessage: (data) => {
    socketService.sendMessage(data);
  },

  addMessage: (msg: Message) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  clearMessages: () => set({ messages: [] }),
}));
