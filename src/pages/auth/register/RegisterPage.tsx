import { useRegisterForm } from '../../../hooks/useRegisterForm';
import { FormInput } from '../../../components/ui/FormInput';
import { FormButton } from '../../../components/ui/FormButton';

/**
 * RegisterPage - UI Layer only using Tailwind.
 * No business logic here. All logic delegated to useRegisterForm hook → AuthService.
 */
export default function RegisterPage() {
  const {
    formState,
    errors,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  return (
    <main className="flex min-h-screen overflow-hidden flex-col md:flex-row">
      {/* LEFT: Hero Image Panel */}
      <section
        className="relative flex-1 min-w-0 bg-contain bg-center bg-no-repeat flex flex-col items-center justify-center bg-[#0a1632] min-h-[260px] md:min-h-[auto] p-8"
        style={{ backgroundImage: `url('${import.meta.env.VITE_REGISTER_BG_IMAGE}')` }}
        aria-label="Luxury real estate background"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a163273] via-[#0a163226] to-[#0a1632a6] z-0" />

        <p className="relative z-10 font-primary text-xl font-normal text-white tracking-[0.06em] text-center leading-[1.7] px-8 py-6 max-w-[400px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] text-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-xl text-base md:p-6 p-4">
          Welcome To Your House And Land
        </p>

        <h1 className="absolute md:bottom-12 md:left-12 bottom-4 left-4 z-10 font-primary md:text-lg text-base font-extrabold text-white italic tracking-[0.02em] text-shadow-[0_2px_12px_rgba(0,0,0,0.6)] m-0 border-b-2 border-white/40 pb-1">
          Công Ty Cổ Phần Cò Đất
        </h1>
      </section>

      {/* RIGHT: Form Panel */}
      <section className="w-full md:w-[460px] shrink-0 bg-[#D6E4F7] flex items-center justify-center py-12 px-8 overflow-y-auto" aria-label="Registration form">
        <div className="w-full max-w-[360px] flex flex-col gap-4">
          <h2 className="font-heading text-3xl font-bold italic text-gray-900 m-0 mb-1 tracking-[-0.01em]">Create Account</h2>

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

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
            <FormInput
              id="register-fullName"
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formState.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={errors.fullName}
              autoComplete="name"
            />

            <FormInput
              id="register-phone"
              label="Phone Number"
              type="tel"
              placeholder="e.g. 0912345678"
              value={formState.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              autoComplete="tel"
            />

            <FormInput
              id="register-email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <FormInput
              id="register-password"
              label="Password"
              type="password"
              placeholder="Min. 8 chars, uppercase, number, symbol"
              value={formState.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />

            <FormInput
              id="register-confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={formState.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 mt-1">
              <button
                type="button"
                id="register-agreeToTerms"
                role="checkbox"
                aria-checked={formState.agreeToTerms}
                className={`shrink-0 w-5 h-5 rounded-full border-2 p-0 bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-200 mt-0.5 ${formState.agreeToTerms ? 'border-blue-500 bg-blue-500' : 'border-gray-500'}`}
                onClick={() => handleChange('agreeToTerms', !formState.agreeToTerms)}
              >
                {formState.agreeToTerms && <span className="text-white text-[12px] font-bold leading-none">✓</span>}
              </button>

              <label htmlFor="register-agreeToTerms" className="font-primary text-sm text-gray-900 leading-[1.5] cursor-pointer">
                I agree to the{' '}
                <a href="/terms" className="text-red-600 font-semibold no-underline hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-red-600 font-semibold no-underline hover:underline">
                  Privacy Policy
                </a>.
              </label>
            </div>

            {errors.agreeToTerms && (
              <span className="font-primary text-xs text-red-600 font-medium -mt-1" role="alert">
                {errors.agreeToTerms}
              </span>
            )}

            <FormButton
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              Sign Up
            </FormButton>
          </form>

          <p className="font-primary text-sm text-gray-500 text-center m-0 mt-1">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 font-semibold no-underline hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
