import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EllipsisVertical,
  FileText,
  Image,
  Paperclip,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocketStore } from "@/store/useSocketStore";
import {
  getMyConversations,
  sendChatFile,
  type Conversation,
  type ConversationMessage,
  type ConversationParticipant,
} from "@/api/chat.api";

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  type?: string; // "TEXT" | "IMAGE" | file URL
}

const isImageUrl = (url: string) =>
  /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?.*)?$/i.test(url) ||
  url.includes("res.cloudinary.com");

const isFileUrl = (url: string) => url.startsWith("http") && !isImageUrl(url);

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { messages, joinRoom, leaveRoom, sendMessage, clearMessages } =
    useSocketStore();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [historicalMessages, setHistoricalMessages] = useState<ChatMessage[]>(
    [],
  );
  const [draftMessage, setDraftMessage] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentRoomRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historicalMessages, messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const data = await getMyConversations();
        setConversations(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hội thoại:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };
    void fetchConversations();
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    if (currentRoomRef.current && currentRoomRef.current !== conversation.id) {
      leaveRoom(currentRoomRef.current);
    }
    currentRoomRef.current = conversation.id;
    setActiveConversation(conversation);
    clearMessages();
    setStagedFile(null);

    const mapped: ChatMessage[] = (conversation.messages ?? []).map(
      (msg: ConversationMessage) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt,
        type: msg.type,
      }),
    );
    setHistoricalMessages(mapped);
    joinRoom(conversation.id);
  };

  useEffect(() => {
    return () => {
      if (currentRoomRef.current) {
        leaveRoom(currentRoomRef.current);
      }
    };
  }, [leaveRoom]);

  const handleSubmitMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeConversation || !user) return;

    if (stagedFile) {
      void handleSendFile();
      return;
    }
    if (!draftMessage.trim()) return;

    sendMessage({
      roomId: activeConversation.id,
      message: draftMessage.trim(),
      senderId: String(user.id),
    });
    setDraftMessage("");
  };

  const handleSendFile = async () => {
    if (!stagedFile || !activeConversation) return;
    setIsUploading(true);
    try {
      await sendChatFile(activeConversation.id, stagedFile);
      setStagedFile(null);
    } catch (error) {
      console.error("Lỗi gửi file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStagedFile(file);
    }
    // reset input value to allow re-selecting same file
    event.target.value = "";
  };

  const getOtherParticipant = (conv: Conversation) => {
    if (!user) return null;
    return String(user.id) === String(conv.buyerId) ? conv.seller : conv.buyer;
  };

  const getOtherName = (conv: Conversation) => {
    const other = getOtherParticipant(conv);
    return (
      other?.profile?.displayName ||
      other?.email ||
      `Người dùng #${other?.id ?? "?"}`
    );
  };

  const renderParticipantAvatar = (
    participant: ConversationParticipant | null,
    size: number = 20,
  ) => {
    const avatarUrl = participant?.profile?.avatarUrl;
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="avatar"
          className="size-full rounded-full object-cover"
        />
      );
    }
    return <UserRound size={size} />;
  };

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatLastTime = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return formatTime(isoString);
    if (diffDays === 1) return "Hôm qua";
    return `${diffDays} ngày trước`;
  };

  const allMessages = [
    ...historicalMessages,
    ...messages.map((msg, index) => ({
      id: `socket-${index}`,
      senderId: msg.senderId,
      content: msg.message,
      createdAt: msg.timestamp.toISOString(),
      type: isImageUrl(msg.message) ? "IMAGE" : "TEXT",
    })),
  ];

  const renderMessageContent = (msg: ChatMessage) => {
    if (isImageUrl(msg.content)) {
      return (
        <a href={msg.content} target="_blank" rel="noreferrer">
          <img
            src={msg.content}
            alt="Ảnh"
            className="max-w-[280px] rounded-xl object-cover"
          />
        </a>
      );
    }
    if (isFileUrl(msg.content)) {
      const filename = decodeURIComponent(
        msg.content.split("/").pop() ?? "File",
      );
      return (
        <a
          href={msg.content}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 underline"
        >
          <FileText size={16} />
          {filename}
        </a>
      );
    }
    return <span>{msg.content}</span>;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onLoginClick={() => navigate("/")}
        onRegisterClick={() => navigate("/")}
      />

      <main className="mx-auto flex h-[calc(100vh-72px)] max-w-[1440px] pt-[72px]">
        {/* Sidebar: Conversation List */}
        <aside className="flex w-[320px] shrink-0 flex-col border-r border-chat-border bg-chat-surface">
          <div className="border-b border-chat-border p-6">
            <h1 className="text-[28px] leading-[1.2] font-medium text-chat-heading">
              Tin nhắn
            </h1>
            <input
              type="text"
              placeholder="Tìm kiếm tin nhắn..."
              className="mt-4 w-full rounded-[10px] border border-chat-input-border bg-white px-4 py-2.5 text-sm text-chat-text outline-none transition focus:border-chat-gold"
            />
          </div>

          <div className="hide-scrollbar flex-1 overflow-y-auto p-4">
            {isLoadingConversations ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-18 animate-pulse rounded-[10px] bg-chat-border/40"
                  />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <p className="mt-8 text-center text-sm text-chat-subtext">
                Bạn chưa có cuộc trò chuyện nào.
              </p>
            ) : (
              <div className="space-y-3">
                {conversations.map((conversation) => {
                  const isActive = activeConversation?.id === conversation.id;
                  const name = getOtherName(conversation);
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full rounded-[10px] border p-3 text-left transition ${
                        isActive
                          ? "border-chat-gold/30 bg-chat-gold/10"
                          : "border-transparent hover:border-chat-border hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-12 items-center justify-center rounded-full bg-chat-gold text-white shrink-0">
                          {renderParticipantAvatar(getOtherParticipant(conversation), 20)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-chat-heading">
                            {name}
                          </p>
                          <p className="truncate text-xs text-chat-text">
                            {conversation.lastMessage ??
                              "Bắt đầu trò chuyện..."}
                          </p>
                        </div>
                        <span className="text-[11px] text-chat-subtext shrink-0">
                          {formatLastTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="flex min-w-0 flex-1 flex-col bg-chat-body">
          {activeConversation ? (
            <>
              <header className="flex items-center justify-between border-b border-chat-gold/60 bg-white px-8 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-chat-gold text-white">
                    {renderParticipantAvatar(getOtherParticipant(activeConversation), 18)}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-chat-heading">
                      {getOtherName(activeConversation)}
                    </h2>
                    <p className="text-xs text-chat-text">
                      Bài đăng #{activeConversation.listingId}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-chat-subtext transition hover:bg-chat-surface"
                  aria-label="Tùy chọn cuộc trò chuyện"
                >
                  <EllipsisVertical size={20} />
                </button>
              </header>

              <div className="hide-scrollbar flex-1 overflow-y-auto px-8 py-4">
                <div className="space-y-4">
                  {allMessages.map((message) => {
                    const isMyMessage =
                      String(message.senderId) === String(user?.id);
                    return (
                      <div
                        key={message.id}
                        className={`flex w-full items-end gap-3 ${
                          isMyMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isMyMessage && (
                          <div className="flex size-8 items-center justify-center rounded-full bg-chat-gold text-white shrink-0">
                            {renderParticipantAvatar(getOtherParticipant(activeConversation), 16)}
                          </div>
                        )}
                        <div
                          className={isMyMessage ? "items-end" : "items-start"}
                        >
                          <div
                            className={`max-w-[480px] rounded-2xl px-4 py-3 text-sm ${
                              isMyMessage
                                ? "bg-chat-gold text-white"
                                : "border border-chat-border bg-white text-chat-heading shadow-sm"
                            }`}
                          >
                            {renderMessageContent(message)}
                          </div>
                          <p className="mt-1 px-2 text-[11px] text-chat-subtext">
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                        {isMyMessage && (
                          <div className="flex size-8 items-center justify-center rounded-full bg-chat-avatar text-chat-subtext shrink-0">
                            {activeConversation &&
                              renderParticipantAvatar(
                                String(user?.id) ===
                                  String(activeConversation.buyerId)
                                  ? activeConversation.buyer
                                  : activeConversation.seller,
                                16,
                              )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <footer className="border-t border-chat-border bg-white px-8 py-4">
                {/* Staged file preview */}
                {stagedFile && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl border border-chat-input-border bg-chat-surface p-3">
                    {stagedFile.type.startsWith("image/") ? (
                      <Image size={16} className="shrink-0 text-chat-gold" />
                    ) : (
                      <FileText size={16} className="shrink-0 text-chat-gold" />
                    )}
                    <span className="flex-1 truncate text-sm text-chat-heading">
                      {stagedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStagedFile(null)}
                      className="text-chat-subtext hover:text-chat-heading"
                      aria-label="Xoá file đính kèm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <form
                  className="flex items-end gap-3"
                  onSubmit={handleSubmitMessage}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex size-12 items-center justify-center rounded-full border border-chat-input-border bg-chat-surface text-chat-subtext transition hover:bg-chat-border/30"
                    aria-label="Đính kèm tệp"
                  >
                    <Paperclip size={20} />
                  </button>

                  {!stagedFile && (
                    <textarea
                      rows={1}
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitMessage(e);
                        }
                      }}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-chat-input-border px-4 py-3 text-[15px] text-chat-heading outline-none transition focus:border-chat-gold"
                    />
                  )}
                  {stagedFile && (
                    <div className="flex-1 rounded-2xl border border-chat-input-border px-4 py-3 text-[15px] text-chat-subtext">
                      Nhấn gửi để gửi file đính kèm...
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isUploading ||
                      (!stagedFile && draftMessage.trim().length === 0)
                    }
                    className="flex size-12 items-center justify-center rounded-full bg-chat-gold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Gửi tin nhắn"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-chat-subtext">
              <UserRound size={64} className="opacity-20" />
              <p className="text-lg font-medium">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
