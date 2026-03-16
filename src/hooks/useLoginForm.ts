import { useState } from 'react';
import type React from 'react';
import { authService } from '../services/AuthService';
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
        // Ideally redirect here or handle context update
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
      });
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
  };
}
