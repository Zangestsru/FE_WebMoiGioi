import { useLoginForm } from '../../../hooks/useLoginForm';
import { FormInput } from '../../../components/ui/FormInput';
import { FormButton } from '../../../components/ui/FormButton';

/**
 * LoginPage - UI Layer only using Tailwind.
 * Synchronized with RegisterPage.tsx as per user requirements.
 */
export default function LoginPage() {
  const {
    formState,
    errors,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <main className="flex min-h-screen overflow-hidden flex-col md:flex-row">
      {/* LEFT: Hero Image Panel (Synchronized with Register) */}
      <section
        className="relative flex-1 min-w-0 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-[#0a1632] min-h-[260px] md:min-h-[auto] p-8"
        style={{ backgroundImage: `url('${import.meta.env.VITE_REGISTER_BG_IMAGE}')` }}
        aria-label="Hình nền bất động sản"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a163273] via-[#0a163226] to-[#0a1632a6] z-0" />

        <p className="relative z-10 font-primary text-xl font-normal text-white tracking-[0.06em] text-center leading-[1.7] px-8 py-6 max-w-[400px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-xl text-base md:p-6 p-4">
          Welcome To Your House And Land
        </p>

        <h1 className="absolute md:bottom-12 md:left-12 bottom-4 left-4 z-10 font-primary md:text-lg text-base font-extrabold text-white italic tracking-[0.02em] text-shadow-[0_2px_12px_rgba(0,0,0,0.6)] m-0 border-b-2 border-white/40 pb-1">
          Công Ty Cổ Phần Trần Vũ Anh
        </h1>
      </section>

      {/* RIGHT: Form Panel */}
      <section className="w-full md:w-[460px] shrink-0 bg-white flex items-center justify-center py-12 px-8 overflow-y-auto" aria-label="Biểu mẫu đăng nhập">
        <div className="w-full max-w-[360px] flex flex-col gap-4">
          <h2 className="font-heading text-3xl font-bold text-gray-900 m-0 mb-1 tracking-[-0.01em]">Đăng nhập</h2>

          {/* Success Banner */}
          {successMessage && (
            <div className="px-4 py-2 rounded-lg font-primary text-sm font-medium bg-[#d1fae5] text-[#065f46] border border-[#6ee7b7]" role="status">
              {successMessage}
            </div>
          )}

          {/* General Error Banner */}
          {errors.general && (
            <div className="px-4 py-2 rounded-lg font-primary text-sm font-medium bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]" role="alert">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
              id="login-identifier"
              label="Số điện thoại hoặc Email"
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              value={formState.identifier}
              onChange={(e) => handleChange('identifier', e.target.value)}
              error={errors.email}
              autoComplete="username"
            />

            <FormInput
              id="login-password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              value={formState.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="login-rememberMe"
                role="checkbox"
                aria-checked={formState.rememberMe}
                className={`shrink-0 w-[18px] h-[18px] rounded border-[1.5px] cursor-pointer flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-150 p-0 ${formState.rememberMe ? 'border-blue-500 bg-blue-500' : 'border-gray-500 bg-transparent'}`}
                onClick={() => handleChange('rememberMe', !formState.rememberMe)}
              >
                {formState.rememberMe && <span>✓</span>}
              </button>
              <label htmlFor="login-rememberMe" className="font-primary text-[13px] text-gray-500 leading-[1.4] cursor-pointer select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="mt-2">
               <FormButton
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Đăng nhập
              </FormButton>
            </div>
          </form>

          <div className="flex flex-col gap-2 mt-2">
            <a href="/forgot-password" className="font-primary text-sm text-blue-500 font-semibold no-underline hover:underline text-center">
              Quên mật khẩu?
            </a>
            <p className="font-primary text-sm text-gray-500 text-center m-0">
              Bạn chưa có tài khoản?{' '}
              <a href="/register" className="text-blue-500 font-semibold no-underline hover:underline">
                Đăng ký
              </a>{' '}
              tại đây
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
