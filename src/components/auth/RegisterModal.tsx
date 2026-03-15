import { useRegisterForm } from '../../hooks/useRegisterForm';
import { FormInput } from '../ui/FormInput';
import { FormButton } from '../ui/FormButton';

/**
 * RegisterModal - compact form version for use inside a Modal.
 * Reuses the same useRegisterForm hook (no duplicated logic).
 */
export function RegisterModal() {
  const {
    formState,
    errors,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className="flex h-full w-full flex-col sm:flex-row bg-white">
      {/* LEFT: Image panel */}
      <div
        className="relative w-full sm:w-[440px] shrink-0 bg-cover bg-center bg-no-repeat rounded-t-xl sm:rounded-none sm:rounded-l-xl overflow-hidden bg-[#2b3543] flex items-end p-6 h-[140px] sm:h-full"
        style={{
          backgroundImage: import.meta.env.VITE_REGISTER_BG_IMAGE
            ? `url('${import.meta.env.VITE_REGISTER_BG_IMAGE}')`
            : 'none',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1632cc] opacity-90" />
        <p className="relative z-10 font-primary text-base font-semibold text-white leading-[1.5] drop-shadow-md">
          <span className="text-[22px] font-normal opacity-90">Công Ty Cổ Phần Trần Vũ Anh</span>
        </p>
      </div>

      {/* RIGHT: Form panel */}
      <div className="flex-1 w-full min-w-0 flex flex-col justify-center p-6 sm:px-8 sm:py-6 relative">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="font-primary text-[33px] font-bold text-gray-900 m-0 mb-1 leading-tight">Đăng ký tài khoản mới</h2>

          {/* Success */}
          {successMessage && (
            <div className="px-4 py-2 rounded-md text-sm font-medium font-primary bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7] shrink-0" role="status">
              {successMessage}
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="px-4 py-2 rounded-md text-sm font-medium font-primary bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] shrink-0" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1.5 relative mt-1">
            <FormInput
              id="rm-fullName"
              label="Họ và tên"
              type="text"
              placeholder="Nhập họ và tên"
              value={formState.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={errors.fullName}
            />
            <FormInput
              id="rm-phone"
              label="Số điện thoại"
              type="tel"
              placeholder="VD: 0912345678"
              value={formState.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
            />
            <FormInput
              id="rm-email"
              label="Email"
              type="email"
              placeholder="Nhập email"
              value={formState.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />
            <FormInput
              id="rm-password"
              label="Mật khẩu"
              type="password"
              placeholder="Tối thiểu 8 ký tự, chữ hoa, số, ký tự đặc biệt"
              value={formState.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />
            <FormInput
              id="rm-confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formState.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
            />

            <div className="flex items-start gap-2 mt-1 shrink-0 relative z-10 group hover:z-50 focus-within:z-50">
              <button
                type="button"
                id="rm-agreeToTerms"
                role="checkbox"
                aria-checked={formState.agreeToTerms}
                className={`shrink-0 w-[18px] h-[18px] rounded border-[1.5px] cursor-pointer flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-150 mt-0.5 p-0 ${formState.agreeToTerms ? 'border-blue-500 bg-blue-500' : errors.agreeToTerms ? 'border-red-600 bg-transparent' : 'border-gray-500 bg-transparent'}`}
                onClick={() => handleChange('agreeToTerms', !formState.agreeToTerms)}
              >
                {formState.agreeToTerms && <span>✓</span>}
              </button>
              <label htmlFor="rm-agreeToTerms" className="font-primary text-[13px] text-gray-500 leading-[1.4] cursor-pointer select-none">
                Tôi đã đọc và đồng ý với{' '}
                <a href="/terms" className={`font-semibold no-underline hover:underline ${errors.agreeToTerms ? 'text-red-600' : 'text-blue-500'}`}>Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="/privacy" className={`font-semibold no-underline hover:underline ${errors.agreeToTerms ? 'text-red-600' : 'text-blue-500'}`}>Chính sách bảo mật</a>.
              </label>

              {errors.agreeToTerms && (
                <span
                  className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-red-600 text-red-600 px-2 py-1 rounded-md shadow-[0_4px_12px_rgba(220,38,38,0.2)] font-primary text-[11px] font-medium leading-[1.3] whitespace-nowrap animate-popup-fade-in opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                  role="alert"
                  aria-live="polite"
                >
                  <span className="absolute bottom-full left-4 w-0 h-0 border-[5px] border-solid border-transparent border-b-red-600" />
                  <span className="absolute bottom-full left-4 w-0 h-0 border-[5px] border-solid border-transparent border-b-white -mb-[1px]" />
                  {errors.agreeToTerms}
                </span>
              )}
            </div>

            <div className="shrink-0 mt-2">
              <FormButton type="submit" fullWidth isLoading={isLoading}>
                Đăng ký
              </FormButton>
            </div>
          </form>

          <p className="font-primary text-sm text-gray-500 text-center mt-3 shrink-0">
            Bạn đã có tài khoản?{' '}
            <a href="/login" className="text-blue-500 font-semibold no-underline hover:underline">Đăng nhập</a>{' '}
            tại đây
          </p>
        </div>
      </div>
    </div>
  );
}
