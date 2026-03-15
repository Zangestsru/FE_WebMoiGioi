import { authApi } from '../api/auth.api';
import { AuthValidator } from '../utils/AuthValidator';
import type { RegisterFormState, FormErrors, RegisterResponseDTO } from '../types/auth.types';

/**
 * AuthService - Business Logic Layer.
 * Orchestrates validation + API calls.
 * UI components should NEVER call authApi directly.
 */
export class AuthService {
  /**
   * Validates the form locally, then calls the API.
   * Returns errors object if validation fails, or throws on API error.
   */
  async register(formState: RegisterFormState): Promise<{
    errors?: FormErrors;
    response?: RegisterResponseDTO;
  }> {
    // 1. Client-side validation (fast feedback before network call)
    const errors = AuthValidator.validateRegisterForm(formState);
    if (!AuthValidator.isFormValid(errors)) {
      return { errors };
    }

    // 2. Call API  (confirmPassword and agreeToTerms not sent to BE)
    const { agreeToTerms: _agreeToTerms, confirmPassword, ...apiPayload } = formState;
    const response = await authApi.register({ ...apiPayload, confirmPassword });

    return { response };
  }
}

// Singleton instance
export const authService = new AuthService();
