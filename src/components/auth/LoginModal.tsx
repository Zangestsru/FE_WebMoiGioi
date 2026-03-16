import { useGoogleLogin } from '@react-oauth/google';
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
    handleGoogleSuccess,
    handleFacebookLogin,
  } = useLoginForm();

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleSuccess(codeResponse.access_token), // Note: react-oauth/google usually gives access_token unless using auth-code flow. BE needs to verify if it wants idToken or accessToken.
    onError: () => console.log('Login Failed'),
  });

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

            {/* Divider */}
            <div className="relative flex items-center gap-4 my-2">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="font-primary text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2">Hoặc đăng nhập với</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => googleLogin()}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border-[1.5px] border-gray-200 rounded-lg font-primary text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-5 h-5" />
                Google
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1877F2] border-[1.5px] border-[#1877F2] rounded-lg font-primary text-sm font-bold text-white hover:bg-[#166fe5] transition-all duration-200"
                onClick={() => {
                  // @ts-ignore
                  window.FB.login((response: any) => {
                    if (response.authResponse) {
                      handleFacebookLogin(response.authResponse.accessToken);
                    }
                  }, { scope: 'public_profile' });
                }}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p className="font-primary text-sm text-gray-500 text-center m-0 mt-2">
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
