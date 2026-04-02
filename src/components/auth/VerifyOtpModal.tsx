import { useVerifyOtpForm } from '../../hooks/useVerifyOtpForm';
import { FormButton } from '../ui/FormButton';

/**
 * VerifyOtpModal - compact OTP form for use inside a Modal.
 */
interface VerifyOtpModalProps {
  email: string;
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function VerifyOtpModal({ email, onSuccess, onBackToLogin }: VerifyOtpModalProps) {
  const {
    formState,
    errors,
    isLoading,
    isResending,
    handleChange,
    handleSubmit,
    handleResend,
  } = useVerifyOtpForm(email);

  return (
    <div className="flex w-full flex-col sm:flex-row bg-white overflow-hidden">
      {/* LEFT: Image panel */}
      <div
        className="relative w-full sm:w-[320px] shrink-0 bg-cover bg-center bg-no-repeat rounded-t-xl sm:rounded-none sm:rounded-l-xl overflow-hidden bg-[#2b3543] flex items-end p-6 h-[140px] sm:h-auto"
        style={{
          backgroundImage: import.meta.env.VITE_REGISTER_BG_IMAGE
            ? `url('${import.meta.env.VITE_REGISTER_BG_IMAGE}')`
            : 'none',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1632cc] opacity-90" />
        <p className="relative z-10 font-primary text-base font-semibold text-white leading-[1.5] drop-shadow-md">
          Xác thực tài khoản
        </p>
      </div>

      {/* RIGHT: Form panel */}
      <div className="flex-1 w-full min-w-0 flex flex-col justify-center p-6 sm:px-8 sm:py-6 relative">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="font-primary text-[33px] font-bold text-gray-900 m-0 mb-1 leading-tight">Xác nhận mã OTP</h2>
          <p className="font-primary text-sm text-gray-500 leading-relaxed mb-4">
            Mã OTP đã được gửi đến email <span className="font-bold text-gray-900 border-b border-gray-300">{email}</span>
          </p>

          {/* General Error */}
          {errors.general && (
            <div className="px-4 py-2 rounded-md text-sm font-medium font-primary bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] mb-2" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={async (e) => {
            e.preventDefault();
            const success = await handleSubmit(e);
            if (success && onSuccess) {
              onSuccess();
            }
          }} noValidate className="flex flex-col gap-4 relative">
            <div className="flex flex-col gap-2">
              <label className="font-primary text-[14px] font-bold text-gray-700 tracking-[0.01em]" htmlFor="modal-otp-input">
                Nhập mã xác thực (6 chữ số)
              </label>
              <input
                id="modal-otp-input"
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
              <FormButton type="submit" fullWidth isLoading={isLoading} disabled={formState.otp.length !== 6}>
                Xác nhận & Đăng nhập
              </FormButton>
            </div>
          </form>

          <div className="flex flex-col items-center gap-4 mt-6 pt-6 border-t border-gray-100">
            <p className="font-primary text-sm text-gray-500 m-0">
              Bạn chưa nhận được mã?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isLoading}
              className="w-full py-2.5 rounded-xl border border-blue-500 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all duration-200 disabled:opacity-50"
            >
              {isResending ? 'Đang gửi...' : 'Gửi lại mã mới'}
            </button>
            
            <button
              type="button"
              className="text-gray-400 font-semibold text-sm bg-transparent border-none p-0 cursor-pointer hover:text-blue-500 hover:underline mt-1"
              onClick={onBackToLogin}
            >
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
