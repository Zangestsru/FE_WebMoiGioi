import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Modal } from "../../components/ui/Modal";
import { RegisterModal } from "../../components/auth/RegisterModal";
import { LoginModal } from "../../components/auth/LoginModal";
import { VerifyOtpModal } from "../../components/auth/VerifyOtpModal";
import { useProjectDetail } from "../../hooks/useProjectDetail";
import { getOrCreateConversation } from "../../api/chat.api";
import { Flag } from "lucide-react";
import { ReportModal } from "../../components/report/ReportModal";
import { useAuthStore } from "../../store/useAuthStore";

function formatPrice(price: number): string {
  if (!price) return "Thỏa thuận";
  if (price >= 1_000_000_000) {
    const ty = price / 1_000_000_000;
    return ty % 1 === 0 ? `${ty.toFixed(0)} tỷ` : `${Number(ty.toFixed(2))} tỷ`;
  }
  return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { listing, loading, error } = useProjectDetail(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Auth modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };
  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };
  const handleRegisterSuccess = (email: string) => {
    setPendingEmail(email);
    setIsRegisterOpen(false);
    setIsVerifyOtpOpen(true);
  };
  const handleVerifySuccess = () => {
    setIsVerifyOtpOpen(false);
    window.location.reload();
  };
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
  };

  const [isContacting, setIsContacting] = useState(false);

  const handleContact = async () => {
    if (!id) return;
    try {
      setIsContacting(true);
      const conversation = await getOrCreateConversation(id);
      if (conversation && conversation.id) {
        navigate(`/chat?conversationId=${conversation.id}`);
      }
    } catch (err: any) {
      console.error("Error creating conversation:", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setIsLoginOpen(true);
      } else {
        alert("Có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại.");
      }
    } finally {
      setIsContacting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c4a946] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-primary text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="font-primary text-red-500 text-lg">
          {error || "Không tìm thấy bất động sản"}
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-6 py-2 bg-[#111] text-white rounded"
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const primaryMedia = listing.media?.find((m: any) => m.isPrimary);
  const propertyImg = primaryMedia
    ? primaryMedia.originalUrl
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200";
  const subImages =
    listing.media?.filter((m: any) => !m.isPrimary).slice(0, 4) || [];
  const displaySubImages = [...subImages];
  while (displaySubImages.length < 4) {
    displaySubImages.push({ originalUrl: propertyImg } as any);
  }

  const userDisplayName =
    listing.user?.profile?.displayName ||
    listing.user?.email ||
    "Chuyên viên tư vấn";
  const userAvatar =
    listing.user?.profile?.avatarUrl ||
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200";

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />
      <div className="h-[72px]" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-10">
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-2 mb-10 w-full aspect-[2/1] md:aspect-[2.5/1]">
          <div className="relative overflow-hidden">
            <img
              src={propertyImg}
              alt="Main"
              className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg"
            />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {displaySubImages.map((img, i) => (
              <img
                key={i}
                src={img.originalUrl}
                className={`w-full h-full object-cover ${i === 1 ? "rounded-tr-lg" : ""} ${i === 3 ? "rounded-br-lg" : ""}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
              <h1 className="font-heading text-3xl font-bold text-[#111] uppercase line-clamp-2">
                {listing.title}
              </h1>
              <button 
                onClick={() => isAuthenticated ? setIsReportOpen(true) : setIsLoginOpen(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-primary transition-colors whitespace-nowrap bg-gray-50 px-3 py-1.5 rounded border border-gray-200 shadow-sm"
                title="Báo cáo bài viết không hợp lệ"
              >
                <Flag size={18} />
                <span className="text-sm rounded font-medium">Báo cáo</span>
              </button>
            </div>
            <p className="text-gray-500 font-primary text-lg mb-6">
              {listing.addressDisplay}
            </p>

            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-100 mb-8">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Mức giá</p>
                <p className="font-heading text-2xl font-bold text-[#c4a946]">
                  {formatPrice(listing.price)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Diện tích
                </p>
                <p className="font-heading text-2xl font-bold text-[#111]">
                  {listing.areaGross} m²
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Phòng ngủ
                </p>
                <p className="font-heading text-2xl font-bold text-[#111]">
                  {(listing.attributes as any)?.beds || "--"}
                </p>
              </div>
            </div>

            <h2 className="font-heading text-xl font-bold text-[#111] border-l-4 border-[#c4a946] pl-4 mb-4 uppercase">
              Thông tin mô tả
            </h2>
            <div className="prose max-w-none text-gray-600 font-primary leading-relaxed whitespace-pre-line mb-10">
              {(listing.attributes as any)?.description ||
                "Chưa có mô tả chi tiết cho bất động sản này."}
            </div>
          </div>

          <aside className="relative">
            <div className="sticky top-[100px] bg-[#1c1c1e] rounded-2xl p-8 shadow-xl text-white">
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={userAvatar}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 bg-white"
                />
                <div>
                  <h3 className="text-lg font-medium">{userDisplayName}</h3>
                  <p className="text-gray-400 text-sm">Chuyên viên tư vấn</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleContact}
                  disabled={isContacting}
                  className="w-full bg-[#c4a946] hover:bg-[#b0963a] py-4 rounded-lg text-[#111] font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContacting ? "Đang kết nối..." : "Liên hệ tư vấn"}
                </button>
                <button className="w-full bg-white hover:bg-gray-100 py-4 rounded-lg text-[#111] font-bold uppercase border border-gray-200">
                  Xem hồ sơ pháp lý
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <RegisterModal
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={handleRegisterSuccess}
        />
      </Modal>
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginModal
          onSwitchToRegister={handleSwitchToRegister}
          onSuccess={handleLoginSuccess}
        />
      </Modal>
      <Modal isOpen={isVerifyOtpOpen} onClose={() => setIsVerifyOtpOpen(false)}>
        <VerifyOtpModal email={pendingEmail} onSuccess={handleVerifySuccess} />
      </Modal>
      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} maxWidth="500px">
        <ReportModal listingId={listing.id} onClose={() => setIsReportOpen(false)} />
      </Modal>
    </div>
  );
}
