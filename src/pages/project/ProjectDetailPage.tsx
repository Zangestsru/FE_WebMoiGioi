import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Modal } from "../../components/ui/Modal";
import { RegisterModal } from "../../components/auth/RegisterModal";
import { LoginModal } from "../../components/auth/LoginModal";
import { VerifyOtpModal } from "../../components/auth/VerifyOtpModal";
import { useProjectDetail } from "../../hooks/useProjectDetail";
import { Flag, Home, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { ListingCard } from "../../components/listing/ListingCard";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { project, loading, error } = useProjectDetail(id);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Auth modal states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
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

  const getStatusBadge = (status: string | undefined) => {
    if (!status)
      return (
        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-sm font-medium">
          Đang cập nhật
        </span>
      );
    if (status === "Sắp mở bán")
      return (
        <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm font-medium">
          {status}
        </span>
      );
    if (status === "Đang mở bán")
      return (
        <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded text-sm font-medium">
          {status}
        </span>
      );
    if (status === "Đã bàn giao")
      return (
        <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-sm font-medium">
          {status}
        </span>
      );
    return (
      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-sm font-medium">
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#c4a946] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-primary text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="font-primary text-red-500 text-lg">
          {error || "Không tìm thấy dự án"}
        </p>
        <button
          onClick={() => (window.location.href = "/du-an")}
          className="mt-4 px-6 py-2 bg-[#111] text-white rounded"
        >
          Trở về danh sách dự án
        </button>
      </div>
    );
  }

  const primaryMedia =
    project.media?.find((m: any) => m.isPrimary) || project.media?.[0];
  const propertyImg = primaryMedia
    ? primaryMedia.originalUrl
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200";
  const subImages =
    project.media?.filter((m: any) => m.id !== primaryMedia?.id).slice(0, 4) ||
    [];
  const displaySubImages = [...subImages];
  while (displaySubImages.length < 4) {
    displaySubImages.push({ originalUrl: propertyImg } as any);
  }

  const addressDisplay = [
    project.addressText,
    project.wardName,
    project.districtName,
    project.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

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
                {project.name}
              </h1>
            </div>
            <p className="text-gray-500 font-primary text-lg mb-6">
              {addressDisplay}
            </p>

            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-100 mb-8">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Trạng thái
                </p>
                <div className="mt-1">{getStatusBadge(project.status)}</div>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Tổng diện tích
                </p>
                <p className="font-heading text-2xl font-bold text-[#111]">
                  {project.totalArea
                    ? `${project.totalArea.toLocaleString("vi-VN")} m²`
                    : "--"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Bất động sản
                </p>
                <p className="font-heading text-2xl font-bold text-[#111] flex items-center gap-2">
                  {project.listings?.length || 0}{" "}
                  <Home size={20} className="text-slate-400" />
                </p>
              </div>
            </div>

            <h2 className="font-heading text-xl font-bold text-[#111] border-l-4 border-[#c4a946] pl-4 mb-4 uppercase">
              Thông tin mô tả
            </h2>
            <div className="prose max-w-none text-gray-600 font-primary leading-relaxed whitespace-pre-line mb-10">
              {project.description || "Chưa có mô tả chi tiết cho dự án này."}
            </div>
          </div>
        </div>

        {/* Khối Danh sách Bất động sản */}
        <div className="mt-8 border-t border-gray-200 pt-10">
          <h2 className="font-heading text-2xl font-bold text-[#111] mb-6 border-l-4 border-[#c4a946] pl-4 uppercase">
            Danh sách Bất động sản thuộc dự án
          </h2>
          {project.listings && project.listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/bat-dong-san/${listing.id}`)}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-primary">
              Chưa có bất động sản nào đang mở bán hoặc cho thuê trong dự án
              này.
            </p>
          )}
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
