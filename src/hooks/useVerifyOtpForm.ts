import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import type { VerifyOtpFormState, FormErrors } from '../types/auth.types';

/**
 * useVerifyOtpForm - Custom hook to manage OTP verification logic.
 * Encapsulates form state, loading, and API interaction.
 */
export function useVerifyOtpForm(initialEmail: string = '') {
  const [formState, setFormState] = useState<VerifyOtpFormState>({
    email: initialEmail,
    otp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleChange = useCallback((value: string) => {
    // Only allow numbers for OTP
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setFormState((prev) => ({ ...prev, otp: cleanValue }));
    if (errors.general) setErrors({});
  }, [errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.verifyOtp(formState);
      
      if (result.errors) {
        setErrors(result.errors);
      } else if (result.response?.success) {
        addToast('Xác thực tài khoản thành công! Đang đăng nhập...', 'success');
        
        // Update Auth Store
        setUser(result.response.data);
        
        // Redirect after a brief delay
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error: any) {
      const msg = error.message || 'Xác thực không thành công. Vui lòng thử lại sau.';
      setErrors({ general: msg });
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!formState.email) {
      setErrors({ general: 'Email is missing. Cannot resend OTP.' });
      return;
    }

    setIsResending(true);
    setErrors({});

    try {
      const result = await authService.resendOtp(formState.email);
      if (result.success) {
        addToast('Mã OTP mới đã được gửi đến email của bạn.', 'success');
      }
    } catch (error: any) {
      const msg = error.message || 'Gửi lại mã OTP thất bại.';
      setErrors({ general: msg });
      addToast(msg, 'error');
    } finally {
      setIsResending(false);
    }
  };

  return {
    formState,
    errors,
    isLoading,
    isResending,
    handleChange,
    handleSubmit,
    handleResend,
  };
}
