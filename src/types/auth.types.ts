/**
 * Auth types - mirror the BE DTOs exactly.
 * Source: BE_WebMoiGioi/src/dtos/auth/
 */

// --- Request DTOs ---
export interface RegisterRequestDTO {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

// --- Response DTOs ---
export type AccountType = 'MEMBER' | 'AGENT' | 'AGENCY' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'LOCKED' | 'BANNED';

export interface AuthUserDTO {
  id: string;
  email: string | null;
  phone: string | null;
  accountType: AccountType;
  status: UserStatus;
}

export interface RegisterResponseDTO {
  success: boolean;
  message: string;
}

export interface LoginResponseDTO {
  success: boolean;
  data: AuthUserDTO;
}

// --- Form state ---
export interface RegisterFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}
