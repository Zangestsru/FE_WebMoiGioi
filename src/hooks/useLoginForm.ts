import { useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginFormState, FormErrors } from '../types/auth.types';

const INITIAL_FORM_STATE: LoginFormState = {
  identifier: '',
  password: '',
  rememberMe: false,
};

/**
 * useLoginForm - Glue between UI and AuthService.
 * Manages login form state.
 */
export function useLoginForm() {
  const [formState, setFormState] = useState<LoginFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleChange = (field: keyof LoginFormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));

    // Clear error on change
    if (errors[field as keyof FormErrors] || (field === 'identifier' && errors.email)) {
      setErrors((prev) => ({ 
        ...prev, 
        [field === 'identifier' ? 'email' : field]: undefined 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      const result = await authService.login(formState);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.response?.success) {
        setSuccessMessage('Đăng nhập thành công!');
        
        // Update Auth Store
        setUser(result.response.data);
        
        // Redirect to Home
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error: any) {
      setErrors({
        general: error.message || 'Đã xảy ra lỗi không xác định',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await authService.loginWithGoogle(idToken);
      if (response.success) {
        setUser(response.data);
        setSuccessMessage('Đăng nhập Google thành công!');
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Google login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async (accessToken: string) => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await authService.loginWithFacebook(accessToken);
      if (response.success) {
        setUser(response.data);
        setSuccessMessage('Đăng nhập Facebook thành công!');
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Facebook login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    errors,
    isLoading,
    successMessage,
    handleChange,
    handleSubmit,
    handleGoogleSuccess,
    handleFacebookLogin,
  };
}
