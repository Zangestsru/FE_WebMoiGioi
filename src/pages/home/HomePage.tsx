import { useState } from 'react';

import { Modal } from '../../components/ui/Modal';
import { RegisterModal } from '../../components/auth/RegisterModal';
import { LoginModal } from '../../components/auth/LoginModal';
import { VerifyOtpModal } from '../../components/auth/VerifyOtpModal';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ListingGrid } from '../../components/listing/ListingGrid';
import { StatusModal } from '../../components/ui/StatusModal';

/**
 * HomePage — Premium real estate landing page
 * Redesigned to match the luxury property portfolio mockup.
 */
export default function HomePage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      {/* ===== HERO SECTION ===== */}
      <section
        id="hero-section"
        className="relative w-full h-[520px] md:h-[580px] lg:h-[620px] mt-[72px] overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.png"
            alt="Luxury villa"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="font-primary text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/80 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-700">
            Danh mục tuyển chọn toàn cầu
          </p>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Không gian sống đẳng cấp
          </h1>

          <p className="font-heading text-3xl md:text-4xl lg:text-5xl italic text-[#d4af37] mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Chuẩn mực đỉnh cao
          </p>


        </div>
      </section>



      {/* ===== FEATURED RESIDENCES ===== */}
      <main className="flex-1">
        <ListingGrid />
      </main>

      {/* ===== CTA SECTION ===== */}
      <section id="cta-section" className="relative w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/images/cta-bg.png"
            alt="Luxury interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-[800px] mx-auto text-center px-6 py-20 md:py-28">
          <p className="font-primary text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-[#d4af37] mb-5">
            Tư vấn độc quyền
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            Sẵn sàng tìm kiếm di sản của bạn?
          </h2>
          <p className="font-primary text-gray-300 text-sm md:text-base leading-relaxed max-w-[560px] mx-auto mb-10">
            Tư vấn riêng với đội ngũ tinh hoa của chúng tôi về tour tham quan bất kỳ bất động sản nào, hoặc định giá bảo mật tài sản hiện tại của bạn. Chúng tôi xử lý những giao dịch quan trọng nhất thế giới.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3.5 bg-white text-[#0a1632] font-primary text-sm font-bold uppercase tracking-wider rounded-none hover:bg-gray-100 transition-colors border-2 border-white">
              Liên hệ riêng tư
            </button>
            <button className="px-8 py-3.5 bg-transparent text-white font-primary text-sm font-bold uppercase tracking-wider rounded-none hover:bg-white/10 transition-colors border-2 border-white">
              Xem toàn bộ danh mục
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />

      {/* Register Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <RegisterModal
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={handleRegisterSuccess}
        />
      </Modal>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginModal
          onSwitchToRegister={handleSwitchToRegister}
          onSuccess={handleLoginSuccess}
        />
      </Modal>

      {/* Verify OTP Modal */}
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

      {/* GLOBAL NOTIFICATIONS */}
      <StatusModal />
    </div>
  );
}
