// Mirror of backend socket.type.ts (ServerToClientEvents and ClientToServerEvents)

export interface ServerToClientEvents {
  receive_message: (data: {
    senderId: string;
    message: string;
    timestamp: Date;
  }) => void;
  new_notification: (message: string) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  send_message: (data: {
    roomId: string;
    message: string;
    senderId: string;
  }) => void;
}
