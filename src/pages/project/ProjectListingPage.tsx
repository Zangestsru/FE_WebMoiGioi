import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Modal } from "../../components/ui/Modal";
import { RegisterModal } from "../../components/auth/RegisterModal";
import { LoginModal } from "../../components/auth/LoginModal";
import { VerifyOtpModal } from "../../components/auth/VerifyOtpModal";
import { StatusModal } from "../../components/ui/StatusModal";
import { ChevronRight, Home, Image as ImageIcon } from "lucide-react";
import { projectApi, type ProjectSummary } from "../../api/project.api";
import { useToastStore } from "../../store/useToastStore";

export default function ProjectListingPage() {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await projectApi.getPublicProjects();
      setProjects(res.data || []);
    } catch (error) {
      useToastStore.getState().addToast("Lỗi tải danh sách dự án", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
          Đang cập nhật
        </span>
      );
    if (status === "Sắp mở bán")
      return (
        <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium">
          {status}
        </span>
      );
    if (status === "Đang mở bán")
      return (
        <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">
          {status}
        </span>
      );
    if (status === "Đã bàn giao")
      return (
        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
          {status}
        </span>
      );
    return (
      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      <div className="h-[72px]" />

      <div className="max-w-[1140px] mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <a
            href="/du-an"
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            Dự án
          </a>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-900 font-medium">
            Dự án BĐS Toàn Quốc
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none mb-4">
            Dự án toàn quốc
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-slate-600">
              Hiện đang có{" "}
              <span className="font-semibold">{projects.length}</span> dự án
            </p>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-slate-700 outline-none hover:border-slate-300 transition-colors cursor-pointer">
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
              </select>
              <ChevronRight
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-20 text-slate-500">
              Đang tải danh sách dự án...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm">
              Không có dự án nào đang được hiển thị.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/du-an/${project.slug || project.id}`)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row group cursor-pointer"
              >
                {/* Images Section */}
                <div className="w-full md:w-[260px] md:min-w-[260px] h-[200px] flex flex-col bg-slate-100 relative shrink-0 p-1 gap-1">
                  {project.media && project.media.length > 0 ? (
                    <>
                      {/* Main Image */}
                      <div
                        className={`w-full ${project.media.length > 1 ? "h-[65%]" : "h-full"} relative rounded-t-lg ${project.media.length === 1 ? "rounded-b-lg" : ""} overflow-hidden`}
                      >
                        <img
                          src={project.media[0].originalUrl}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Sub Images (if more than 1) */}
                      {project.media.length > 1 && (
                        <div className="w-full h-[35%] flex gap-1">
                          {project.media.slice(1, 3).map((m, idx) => (
                            <div
                              key={m.id}
                              className={`h-full relative overflow-hidden ${project.media!.length === 2 && idx === 0 ? "w-full rounded-b-lg" : "w-1/2"} ${idx === 0 && project.media!.length > 2 ? "rounded-bl-lg" : ""} ${idx === 1 ? "rounded-br-lg" : ""}`}
                            >
                              <img
                                src={m.originalUrl}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {idx === 1 && project.media!.length > 3 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium text-sm gap-1">
                                  <ImageIcon size={14} />+
                                  {project.media!.length - 3}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div>{getStatusBadge(project.status)}</div>

                  <h3 className="text-xl font-bold text-slate-900 mt-2 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700 mb-2">
                    {project.totalArea && (
                      <span>
                        {project.totalArea.toLocaleString("vi-VN")} m²
                      </span>
                    )}
                    {project.totalArea &&
                      project._count?.listings !== undefined && (
                        <span className="text-slate-300">·</span>
                      )}
                    {project._count?.listings !== undefined &&
                      project._count.listings > 0 && (
                        <span className="flex items-center gap-1.5">
                          {project._count.listings}{" "}
                          <Home size={16} className="text-slate-500" />
                        </span>
                      )}
                  </div>

                  <div className="text-[15px] text-slate-700 mb-3 line-clamp-1">
                    {project.wardName ? `${project.wardName}, ` : ""}
                    {project.districtName ? `${project.districtName}, ` : ""}
                    {project.provinceName || "Đang cập nhật vị trí"}
                  </div>

                  <div className="text-[15px] text-slate-500 leading-relaxed line-clamp-2 mt-auto">
                    {project.description ||
                      "Chưa có thông tin mô tả cho dự án này."}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />

      {/* Auth Modals */}
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
        <VerifyOtpModal
          email={pendingEmail}
          onSuccess={handleVerifySuccess}
          onBackToLogin={() => {
            setIsVerifyOtpOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </Modal>

      <StatusModal />
    </div>
  );
}
