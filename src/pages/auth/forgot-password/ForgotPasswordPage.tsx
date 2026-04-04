import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/auth.api';
import { FormInput } from '../../../components/ui/FormInput';
import { FormButton } from '../../../components/ui/FormButton';
import { useUIStore } from '../../../store/useUIStore';

/**
 * ForgotPasswordPage - Synchronized with Login/Register 2-column design.
 * Features a left image panel and right form panel.
 */
const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showStatus } = useUIStore();
  
  const [step, setStep] = useState<'EMAIL' | 'RESET'>('EMAIL');
  const [email, setEmail] = useState('');
  const [resetForm, setResetForm] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const result = await authApi.forgotPassword(email);
      if (result.success) {
        setStep('RESET');
        setOtpCooldown(60);
        showStatus('Đã gửi mã', 'Vui lòng kiểm tra Gmail để nhận mã khôi phục.', 'success');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Email không tồn tại trong hệ thống.';
      setErrors({ email: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.resetPassword({
        email,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword,
        confirmPassword: resetForm.confirmPassword,
      });

      if (result.success) {
        showStatus('Thành công', 'Mật khẩu đã được khôi phục. Vui lòng đăng nhập lại.', 'success');
        navigate('/');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Mã xác thực không chính xác.';
      setErrors({ otp: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#f8fafc]">
      <div className="flex w-full max-w-[940px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* LEFT: Image panel (Synchronized with Login/Register) */}
        <div
          className="relative hidden sm:flex w-[440px] shrink-0 bg-cover bg-center bg-no-repeat items-end p-8"
          style={{
            backgroundImage: `url('${import.meta.env.VITE_REGISTER_BG_IMAGE}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1632cc] opacity-90" />
          <p className="relative z-10 font-primary text-base font-semibold text-white leading-[1.5] drop-shadow-md">
            <span className="text-[22px] font-normal opacity-90">Công Ty Cổ Phần Trần Vũ Anh</span>
          </p>
        </div>

        {/* RIGHT: Form panel */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-center p-6 sm:px-10 sm:py-8 relative">
          <div className="flex flex-col gap-1 w-full">
            <h2 className="font-primary text-[33px] font-bold text-gray-900 m-0 mb-1 leading-tight">
              {step === 'EMAIL' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
            </h2>
            <p className="font-primary text-sm text-gray-500 leading-relaxed mb-6">
              {step === 'EMAIL' 
                ? 'Nhập địa chỉ email của bạn để nhận mã khôi phục mật khẩu.' 
                : `Mã OTP gồm 6 chữ số đã được gửi đến: ${email}`}
            </p>

            <form onSubmit={step === 'EMAIL' ? handleRequestOtp : handleResetSubmit} noValidate className="flex flex-col gap-4">
              {step === 'EMAIL' ? (
                <FormInput
                  id="forgot-email"
                  label="Số điện thoại hoặc Email"
                  type="text"
                  placeholder="Nhập số điện thoại hoặc email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  autoFocus
                />
              ) : (
                <>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <FormInput
                        id="reset-otp"
                        label="Mã xác thực OTP"
                        value={resetForm.otp}
                        onChange={(e) => setResetForm({ ...resetForm, otp: e.target.value })}
                        placeholder="Nhập 6 số"
                        error={errors.otp}
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={otpCooldown > 0 || isLoading}
                      className="h-[52px] px-5 text-sm font-bold border border-gray-200 bg-white rounded-lg text-blue-600 hover:bg-gray-50 transition-colors disabled:opacity-50 shrink-0"
                    >
                      {otpCooldown > 0 ? `${otpCooldown}s` : 'Gửi lại mã'}
                    </button>
                  </div>

                  <FormInput
                    id="reset-password"
                    label="Mật khẩu mới"
                    type="password"
                    value={resetForm.newPassword}
                    onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                    placeholder="Nhập mật khẩu mới"
                    error={errors.newPassword}
                  />

                  <FormInput
                    id="reset-confirm"
                    label="Xác nhận mật khẩu"
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                    placeholder="Xác nhận lại mật khẩu"
                    error={errors.confirmPassword}
                  />
                </>
              )}

              <div className="mt-2">
                <FormButton type="submit" fullWidth isLoading={isLoading}>
                  {step === 'EMAIL' ? 'Tiếp tục' : 'Cập nhật mật khẩu'}
                </FormButton>
              </div>
            </form>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-8 text-center font-primary text-sm font-semibold text-gray-400 hover:text-blue-500 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
