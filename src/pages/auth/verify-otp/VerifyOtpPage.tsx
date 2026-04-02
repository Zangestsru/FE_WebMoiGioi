import { useVerifyOtpForm } from '../../../hooks/useVerifyOtpForm';
import { FormButton } from '../../../components/ui/FormButton';

/**
 * VerifyOtpPage - UI for OTP verification after registration.
 * Synchronized with Login and Register designs.
 */
export default function VerifyOtpPage() {
  const storedEmail = localStorage.getItem('pending_auth_email') || '';
  
  const {
    formState,
    errors,
    isLoading,
    isResending,
    handleChange,
    handleSubmit,
    handleResend,
  } = useVerifyOtpForm(storedEmail);

  return (
    <main className="flex min-h-screen overflow-hidden flex-col md:flex-row">
      {/* LEFT: Hero Image Panel (Synchronized) */}
      <section
        className="relative flex-1 min-w-0 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-[#0a1632] min-h-[260px] md:min-h-[auto] p-8"
        style={{ backgroundImage: `url('${import.meta.env.VITE_REGISTER_BG_IMAGE}')` }}
        aria-label="Security background"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a163273] via-[#0a163226] to-[#0a1632a6] z-0" />

        <p className="relative z-10 font-primary text-xl font-normal text-white tracking-[0.06em] text-center leading-[1.7] px-8 py-6 max-w-[400px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-xl text-base md:p-6 p-4">
          Xác thực tài khoản với mã OTP để bảo mật thông tin của bạn
        </p>

        <h1 className="absolute md:bottom-12 md:left-12 bottom-4 left-4 z-10 font-primary md:text-lg text-base font-extrabold text-white italic tracking-[0.02em] text-shadow-[0_2px_12px_rgba(0,0,0,0.6)] m-0 border-b-2 border-white/40 pb-1">
          Công Ty Cổ Phần Trần Vũ Anh
        </h1>
      </section>

      {/* RIGHT: Form Panel */}
      <section className="w-full md:w-[460px] shrink-0 bg-white flex items-center justify-center py-12 px-8 overflow-y-auto" aria-label="Biểu mẫu xác thực OTP">
        <div className="w-full max-w-[360px] flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-3xl font-bold text-gray-900 m-0 mb-1 tracking-[-0.01em]">Xác nhận mã OTP</h2>
            <p className="font-primary text-sm text-gray-500 leading-relaxed">
              Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email <span className="font-bold text-gray-900 border-b border-gray-300">{formState.email || 'của bạn'}</span>.
            </p>
          </div>

          {/* General Error Banner */}
          {errors.general && (
            <div className="px-4 py-2 rounded-lg font-primary text-sm font-medium bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-primary text-[14px] font-bold text-gray-700 tracking-[0.01em]" htmlFor="otp-input">
                Mã xác thực
              </label>
              <input
                id="otp-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className={`w-full tracking-[1em] text-center text-3xl font-bold px-3 py-4 bg-gray-50 border-[1.5px] rounded-xl font-primary text-gray-900 outline-none transition-all duration-200 box-border placeholder:tracking-normal placeholder:font-normal placeholder:text-lg placeholder-gray-400
                  ${errors.general ? 'border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-gray-200 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'}`}
                value={formState.otp}
                onChange={(e) => handleChange(e.target.value)}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <div className="mt-2">
              <FormButton
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={formState.otp.length !== 6}
              >
                Xác nhận & Đăng nhập
              </FormButton>
            </div>
          </form>

          <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
            <p className="font-primary text-sm text-gray-500 m-0">
              Bạn chưa nhận được mã?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isLoading}
              className="w-full py-2.5 rounded-xl border border-blue-500 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
            >
              {isResending ? 'Đang gửi lại...' : 'Gửi lại mã mới'}
            </button>
            
            <a href="/login" className="text-gray-400 font-semibold text-sm no-underline hover:text-blue-500 transition-colors mt-1">
              Quay lại Đăng nhập
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
