import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { RegisterModal } from '../../components/auth/RegisterModal';
import { LoginModal } from '../../components/auth/LoginModal';
import { VerifyOtpModal } from '../../components/auth/VerifyOtpModal';
import { FormButton } from '../../components/ui/FormButton';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * HomePage - simple white landing page for testing register modal.
 */
export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Navbar */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-[#f0f0f0] bg-white sticky top-0 z-50">
        <span className="font-primary text-xl font-extrabold text-gray-900 tracking-[-0.01em]">🏠 Trần Vũ Anh</span>
        
        <nav className="flex gap-4 items-center">
          {isAuthenticated && user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={18} />
                </div>
                <div className="flex flex-col items-start hidden sm:flex">
                  <span className="font-primary text-sm font-bold text-gray-900 leading-none mb-1">
                    {user.email?.split('@')[0]}
                  </span>
                  <span className="font-primary text-[10px] text-gray-400 font-medium">
                    {user.accountType}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="font-primary text-[11px] text-gray-400 font-bold uppercase tracking-wider">Tài khoản</p>
                    <p className="font-primary text-sm text-gray-900 truncate font-medium">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors font-primary text-sm font-semibold"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                id="btn-nav-login"
                className="font-primary text-base font-semibold text-gray-700 hover:text-blue-500 bg-transparent border-none cursor-pointer transition-colors"
                onClick={() => setIsLoginOpen(true)}
              >
                Đăng nhập
              </button>
              <FormButton
                id="btn-open-register"
                variant="primary"
                onClick={() => setIsRegisterOpen(true)}
              >
                Đăng ký
              </FormButton>
            </>
          )}
        </nav>
      </header>

      {/* Hero content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-12">
        <h1 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold text-gray-900 m-0 leading-[1.2]">
          Nền tảng bất động sản uy tín
        </h1>
        <p className="font-primary text-lg text-gray-500 m-0 max-w-[480px]">
          Tìm kiếm, mua bán và cho thuê bất động sản dễ dàng
        </p>
        <FormButton
          id="btn-hero-register"
          variant="primary"
          onClick={() => setIsRegisterOpen(true)}
        >
          Đăng ký ngay
        </FormButton>
      </main>

      {/* Register Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <RegisterModal 
          onSwitchToLogin={handleSwitchToLogin} 
          onSuccess={handleRegisterSuccess}
        />
      </Modal>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginModal onSwitchToRegister={handleSwitchToRegister} />
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
