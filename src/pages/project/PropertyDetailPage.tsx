import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Modal } from "../../components/ui/Modal";
import { RegisterModal } from "../../components/auth/RegisterModal";
import { LoginModal } from "../../components/auth/LoginModal";
import { VerifyOtpModal } from "../../components/auth/VerifyOtpModal";
import { BedDouble, Bath, MapPin } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { listingApi } from "../../api/listing.api";
import type { Listing } from "../../types/listing.types";
import { getOrCreateConversation } from "@/api/chat.api";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const res = await listingApi.getPublicListingById(id);
        if (res.success && res.data) {
          setListing(res.data);
        } else {
          setError("Không tìm thấy bất động sản.");
        }
      } catch (err: any) {
        console.error(err);
        setError("Không tìm thấy bất động sản.");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

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
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại.";
        alert(errorMessage);
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
          onClick={() => (window.location.href = "/bat-dong-san")}
          className="mt-4 px-6 py-2 bg-[#111] text-white rounded"
        >
          Trở về danh sách bất động sản
        </button>
      </div>
    );
  }

  const primaryMedia =
    listing.media?.find((m: any) => m.isPrimary) || listing.media?.[0];
  const propertyImg = primaryMedia
    ? primaryMedia.originalUrl
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200";
  const subImages =
    listing.media?.filter((m: any) => m.id !== primaryMedia?.id).slice(0, 4) ||
    [];
  const displaySubImages = [...subImages];
  while (displaySubImages.length < 4) {
    displaySubImages.push({ originalUrl: propertyImg } as any);
  }

  const formatPrice = (p: number) => {
    if (p >= 1000000000) return `${(p / 1000000000).toFixed(1)} tỷ`;
    if (p >= 1000000) return `${(p / 1000000).toFixed(0)} triệu`;
    return new Intl.NumberFormat("vi-VN").format(p);
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 mb-12">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
              <h1 className="font-heading text-3xl font-bold text-[#111] uppercase line-clamp-2">
                {listing.title}
              </h1>
            </div>
            <p className="text-gray-500 font-primary text-lg mb-6 flex items-start gap-2">
              <MapPin size={20} className="text-[#c4a946] mt-1 shrink-0" />
              {listing.addressDisplay}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex px-3 py-1 rounded-md bg-gray-100 text-[12px] font-bold text-gray-800 uppercase tracking-wide">
                {listing.propertyType?.name || "Bất động sản"}
              </span>
              {listing.project && (
                <span
                  className="inline-flex px-3 py-1 rounded-md bg-blue-50 text-[12px] font-bold text-blue-600 uppercase tracking-wide cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() =>
                    navigate(
                      `/du-an/${listing.project!.slug || listing.project!.id}`,
                    )
                  }
                  title="Thuộc dự án (Nhấn để xem dự án)"
                >
                  Dự án: {listing.project.name}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-100 mb-8">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Mức giá</p>
                <div className="mt-1">
                  <span className="font-heading text-2xl font-bold text-[#c4a946]">
                    {formatPrice(listing.price)}{" "}
                    {listing.priceUnit === "VND" ? "₫" : listing.priceUnit}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Diện tích
                </p>
                <p className="font-heading text-2xl font-bold text-[#111]">
                  {listing.areaGross
                    ? `${listing.areaGross.toLocaleString("vi-VN")} m²`
                    : "--"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Phòng ngủ
                </p>
                <p className="font-heading text-2xl font-bold text-[#111] flex items-center gap-2">
                  {listing.attributes?.beds || "-"}{" "}
                  <BedDouble size={20} className="text-slate-400" />
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">Số phòng</p>
                <p className="font-heading text-2xl font-bold text-[#111] flex items-center gap-2">
                  {listing.attributes?.rooms || "-"}{" "}
                  <Bath size={20} className="text-slate-400" />
                </p>
              </div>
            </div>

            <h2 className="font-heading text-xl font-bold text-[#111] border-l-4 border-[#c4a946] pl-4 mb-4 uppercase">
              Thông tin mô tả
            </h2>
            <div className="prose max-w-none text-gray-600 font-primary leading-relaxed whitespace-pre-line mb-10">
              {listing.attributes?.description ||
                "Chưa có mô tả chi tiết cho bất động sản này."}
            </div>
          </div>

          <aside>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-[100px]">
              <h3 className="font-heading text-lg font-bold text-[#111] mb-6">
                Liên hệ môi giới
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {listing.user?.profile?.avatarUrl ? (
                    <img
                      src={listing.user.profile.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 uppercase font-bold text-xl">
                      {listing.user?.profile?.displayName?.charAt(0) ||
                        listing.user?.email?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {listing.user?.profile?.displayName || "Môi giới dự án"}
                  </h4>
                  <p className="text-sm text-gray-500">{listing.user?.email}</p>
                </div>
              </div>
              <button
                className="w-full py-3 bg-[#111] text-white rounded-xl font-bold hover:bg-[#333] transition-colors"
                onClick={handleContact}
                disabled={isContacting}
              >
                {isContacting ? "Đang xử lý..." : "Liên hệ"}
              </button>
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
    </div>
  );
}
