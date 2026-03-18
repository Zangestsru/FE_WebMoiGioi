import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuthStore } from '../store/useAuthStore';
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
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

    try {
      const result = await authService.verifyOtp(formState);
      
      if (result.errors) {
        setErrors(result.errors);
      } else if (result.response?.success) {
        setSuccessMessage('Xác thực tài khoản thành công!');
        
        // Update Auth Store
        setUser(result.response.data);
        
        // Redirect after a brief delay
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Verification failed. Please try again.' });
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
    setSuccessMessage('');

    try {
      const result = await authService.resendOtp(formState.email);
      if (result.success) {
        setSuccessMessage('A new OTP has been sent to your email.');
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to resend OTP.' });
    } finally {
      setIsResending(false);
    }
  };

  return {
    formState,
    errors,
    isLoading,
    isResending,
    successMessage,
    handleChange,
    handleSubmit,
    handleResend,
  };
}
