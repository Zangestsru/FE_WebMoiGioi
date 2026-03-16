import { useLoginForm } from '../../hooks/useLoginForm';
import { FormInput } from '../ui/FormInput';
import { FormButton } from '../ui/FormButton';

/**
 * LoginModal - compact form version for use inside a Modal.
 * Synchronized with the login design requirements.
 */
interface LoginModalProps {
  onSwitchToRegister?: () => void;
}

export function LoginModal({ onSwitchToRegister }: LoginModalProps) {
  const {
    formState,
    errors,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="flex h-full w-full flex-col sm:flex-row bg-white">
      {/* LEFT: Image panel (Synchronized) */}
      <div
        className="relative w-full sm:w-[440px] shrink-0 bg-cover bg-center bg-no-repeat rounded-t-xl sm:rounded-none sm:rounded-l-xl overflow-hidden bg-[#0a1632] flex items-end p-6 h-[140px] sm:h-full"
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
          <h2 className="font-primary text-[33px] font-bold text-gray-900 m-0 mb-1 leading-tight">Đăng nhập</h2>

          {/* Success / Error Banners */}
          {successMessage && (
            <div className="px-3 py-1.5 rounded-md text-sm font-medium font-primary bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]" role="status">
              {successMessage}
            </div>
          )}
          {errors.general && (
            <div className="px-3 py-1.5 rounded-md text-sm font-medium font-primary bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1.5 relative mt-1">
            <FormInput
              id="m-login-identifier"
              label="Số điện thoại hoặc Email"
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              value={formState.identifier}
              onChange={(e) => handleChange('identifier', e.target.value)}
              error={errors.email}
            />

            <FormInput
              id="m-login-password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              value={formState.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
            />

            <div className="flex items-start gap-2 mt-1 shrink-0 relative z-10 group hover:z-50 focus-within:z-50">
              <button
                type="button"
                id="m-login-rememberMe"
                role="checkbox"
                aria-checked={formState.rememberMe}
                className={`shrink-0 w-[18px] h-[18px] rounded border-[1.5px] cursor-pointer flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-150 mt-0.5 p-0 ${formState.rememberMe ? 'border-blue-500 bg-blue-500' : 'border-gray-500 bg-transparent'}`}
                onClick={() => handleChange('rememberMe', !formState.rememberMe)}
              >
                {formState.rememberMe && <span>✓</span>}
              </button>
              <label htmlFor="m-login-rememberMe" className="font-primary text-[13px] text-gray-500 leading-[1.4] cursor-pointer select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="shrink-0 mt-2">
              <FormButton type="submit" fullWidth isLoading={isLoading}>
                Đăng nhập
              </FormButton>
            </div>
          </form>

          <div className="flex flex-col gap-2 mt-3 shrink-0">
             <a href="/forgot-password" className="text-blue-500 font-semibold no-underline hover:underline text-sm font-primary text-center">
              Quên mật khẩu?
            </a>
            <p className="font-primary text-sm text-gray-500 text-center m-0">
              Bạn chưa có tài khoản?{' '}
              <button
                type="button"
                className="text-blue-500 font-semibold no-underline hover:underline bg-transparent border-none p-0 cursor-pointer"
                onClick={onSwitchToRegister}
              >
                Đăng ký
              </button>{' '}
              tại đây
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
