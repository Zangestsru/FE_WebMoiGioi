import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { RegisterModal } from '../../components/auth/RegisterModal';
import { LoginModal } from '../../components/auth/LoginModal';
import { VerifyOtpModal } from '../../components/auth/VerifyOtpModal';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { FormButton } from '../../components/ui/FormButton';

/**
 * HomePage - Integrated with new Navbar and Footer.
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
    // Modal will close automatically via state
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar 
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      {/* Hero content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6 py-16 mt-[72px] bg-gradient-to-b from-gray-50/50 to-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          Được tin dùng bởi hơn 10,000 khách hàng
        </div>
        
        <h1 className="font-heading text-[clamp(2.5rem,8vw,4.5rem)] font-extrabold text-[#0a1632] m-0 leading-[1.1] tracking-tight max-w-[1000px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Kiến tạo Thịnh vượng thông qua Bất động sản <span className="text-blue-600 italic">Cao cấp</span>
        </h1>
        
        <p className="font-primary text-base md:text-lg text-gray-500 m-0 max-w-[600px] leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Truy cập các danh sách độc quyền, tư vấn từ chuyên gia và sự hiện diện toàn cầu tại các thị trường uy tín nhất.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <FormButton
            id="btn-hero-register"
            variant="primary"
            onClick={() => setIsRegisterOpen(true)}
            className="px-8 py-3.5 h-auto text-base shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all rounded-2xl"
          >
            Bắt đầu ngay
          </FormButton>
          <button className="px-8 py-3.5 font-primary font-bold text-[#0a1632] hover:bg-gray-50 rounded-2xl transition-all h-auto border border-gray-100">
            Xem báo cáo thị trường
          </button>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}
