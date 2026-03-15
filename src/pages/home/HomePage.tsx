import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { RegisterModal } from '../../components/auth/RegisterModal';
import { FormButton } from '../../components/ui/FormButton';

/**
 * HomePage - simple white landing page for testing register modal.
 */
export default function HomePage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Navbar */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-[#f0f0f0] bg-white sticky top-0 z-50">
        <span className="font-primary text-xl font-extrabold text-gray-900 tracking-[-0.01em]">🏠 Cò Đất</span>
        <nav className="flex gap-2 items-center">
          <FormButton
            id="btn-open-register"
            variant="primary"
            onClick={() => setIsRegisterOpen(true)}
          >
            Đăng ký
          </FormButton>
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
        <RegisterModal />
      </Modal>
    </div>
  );
}
