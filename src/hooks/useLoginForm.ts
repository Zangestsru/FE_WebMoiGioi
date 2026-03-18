import { useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
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
export function useLoginForm(onSuccess?: () => void) {
  const [formState, setFormState] = useState<LoginFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

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

    try {
      const result = await authService.login(formState);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.response?.success) {
        addToast('Đăng nhập thành công!', 'success');
        
        // Update Auth Store
        setUser(result.response.data);
        
        // Call success callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to Home if no callback
          navigate('/');
        }
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
        addToast('Đăng nhập Google thành công!', 'success');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Đăng nhập Google thất bại' });
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
        addToast('Đăng nhập Facebook thành công!', 'success');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Đăng nhập Facebook thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formState,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    handleGoogleSuccess,
    handleFacebookLogin,
  };
}
