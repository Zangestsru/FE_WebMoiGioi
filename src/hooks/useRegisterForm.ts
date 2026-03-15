import { useState } from 'react';
import type React from 'react';
import { authService } from '../services/AuthService';
import { AuthValidator } from '../utils/AuthValidator';
import type { RegisterFormState, FormErrors } from '../types/auth.types';

const INITIAL_FORM_STATE: RegisterFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
};

/**
 * useRegisterForm - Glue between UI and AuthService.
 * Manages form state, delegates validation + API to AuthService.
 */
export function useRegisterForm() {
  const [formState, setFormState] = useState<RegisterFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: keyof RegisterFormState, value: string | boolean) => {
    const newState = { ...formState, [field]: value };
    setFormState(newState);

    // Real-time validation for passwords while typing
    if (field === 'password' || field === 'confirmPassword') {
      const validationErrs = AuthValidator.validateRegisterForm(newState);
      setErrors((prev) => ({ 
        ...prev, 
        [field]: validationErrs[field as keyof FormErrors] 
      }));
    } else {
      // Clear error on change for other fields
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      const result = await authService.register(formState);

      if (result.errors) {
        setErrors(result.errors);
        return;
      }

      if (result.response?.success) {
        setSuccessMessage(result.response.message);
        setFormState(INITIAL_FORM_STATE);
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
