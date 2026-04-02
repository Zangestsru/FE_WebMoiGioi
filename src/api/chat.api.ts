import axiosClient from "./axiosClient";

export interface UserProfile {
  displayName: string;
  avatarUrl: string | null;
}

export interface ConversationParticipant {
  id: string;
  email: string;
  profile: UserProfile | null;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  readAt: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  messages: ConversationMessage[];
  buyer: ConversationParticipant;
  seller: ConversationParticipant;
}

/**
 * Create or get an existing conversation for a listing
 */
export const getOrCreateConversation = async (
  listingId: string,
): Promise<Conversation> => {
  const response = await axiosClient.post<{ data: Conversation }>(
    "/chat/conversation",
    { listingId },
  );
  return response.data.data;
};

/**
 * Get all conversations of the current user
 */
export const getMyConversations = async (): Promise<Conversation[]> => {
  const response = await axiosClient.get<{ data: Conversation[] }>(
    "/chat/conversations",
  );
  return response.data.data;
};

/**
 * Upload a file into a conversation room
 */
export const sendChatFile = async (
  conversationId: string,
  file: File,
): Promise<{ fileUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosClient.post<{ data: { fileUrl: string } }>(
    `/chat/conversations/${conversationId}/file`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};
