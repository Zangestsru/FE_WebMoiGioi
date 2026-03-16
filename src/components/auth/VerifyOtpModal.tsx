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
    successMessage,
    handleChange,
    handleSubmit,
    handleResend,
  } = useVerifyOtpForm(email);

  return (
    <div className="flex h-full w-full flex-col sm:flex-row bg-white">
      {/* LEFT: Image panel */}
      <div
        className="relative w-full sm:w-[320px] shrink-0 bg-cover bg-center bg-no-repeat rounded-t-xl sm:rounded-none sm:rounded-l-xl overflow-hidden bg-[#2b3543] flex items-end p-6 h-[120px] sm:h-full"
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
      <div className="flex-1 w-full min-w-0 flex flex-col justify-center p-6 sm:px-10 sm:py-8 relative">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <h2 className="font-primary text-[28px] font-bold text-gray-900 m-0 leading-tight">Nhập mã xác thực</h2>
            <p className="font-primary text-sm text-gray-500">
              Mã OTP đã được gửi đến email <span className="font-bold text-gray-900">{email}</span>
            </p>
          </div>

          {/* Success */}
          {successMessage && (
            <div className="px-4 py-2 rounded-md text-sm font-medium font-primary bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]" role="status">
              {successMessage}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="px-4 py-2 rounded-md text-sm font-medium font-primary bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={async (e) => {
            await handleSubmit(e);
            if (!errors.general && successMessage) {
              onSuccess?.();
            }
          }} noValidate className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <label className="font-primary text-[13px] font-semibold text-gray-900 tracking-[0.01em]" htmlFor="modal-otp-input">
                Mã xác nhận (6 chữ số)
              </label>
              <input
                id="modal-otp-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                className={`w-full tracking-[0.8em] text-center text-3xl font-bold px-3 py-4 bg-[#f3f4f6] border-[1.5px] rounded-lg font-primary text-gray-900 outline-none transition-all duration-200 box-border placeholder:tracking-normal placeholder:font-normal placeholder:text-base placeholder-gray-400
                  ${errors.general ? 'border-red-600 focus:shadow-[0_0_0_2px_rgba(220,38,38,0.18)]' : 'border-gray-200 focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.18)]'}`}
                value={formState.otp}
                onChange={(e) => handleChange(e.target.value)}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            <FormButton type="submit" fullWidth isLoading={isLoading} disabled={formState.otp.length !== 6}>
              Xác nhận & Đăng nhập
            </FormButton>
          </form>

          <div className="flex flex-col items-center gap-4 mt-2">
            <p className="font-primary text-[13px] text-gray-500 m-0">
              Bạn chưa nhận được mã?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isLoading}
              className="text-blue-500 font-bold text-sm bg-transparent border-none p-0 cursor-pointer hover:underline disabled:opacity-50"
            >
              {isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
            </button>
            
            <button
              type="button"
              className="text-gray-400 font-medium text-xs bg-transparent border-none p-0 cursor-pointer hover:text-gray-600 hover:underline mt-2"
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
