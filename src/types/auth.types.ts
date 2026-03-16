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
  email: string; // Used for both phone number and email as per BE property name
  password: string;
}

export interface VerifyOTPRequestDTO {
  email: string;
  otp: string;
}

export interface ResendOTPRequestDTO {
  email: string;
}

export interface GoogleLoginRequestDTO {
  idToken: string;
}

export interface FacebookLoginRequestDTO {
  accessToken: string;
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
  message?: string;
  data: AuthUserDTO;
}

// --- Form states ---
export interface RegisterFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginFormState {
  identifier: string; // UI label: Phone Number Or Email
  password: string;
  rememberMe: boolean;
}

export interface VerifyOtpFormState {
  email: string;
  otp: string;
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
