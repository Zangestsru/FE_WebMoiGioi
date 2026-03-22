/**
 * User and Profile related types for Frontend
 */

export type AccountType = 'MEMBER' | 'AGENT' | 'AGENCY' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'LOCKED' | 'BANNED';


export interface UserProfile {
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  address?: string | null;
  taxCode?: string | null;
  identityCardNumber?: string | null;
  brokerLicenseNumber?: string | null;
  websiteUrl?: string | null;
  socialLinks?: Record<string, string> | null;
  zaloContactPhone?: string | null;
}

export interface User {
  id: string;
  publicId: string;
  phoneNumber?: string | null;
  email?: string | null;
  accountType: AccountType;
  status: UserStatus;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  kycLevel: number;
  createdAt: string;
  hasPassword?: boolean; // New field
}

export interface GetProfileResponseDTO {
  success: boolean;
  data: User & { profile: UserProfile | null; hasPassword: boolean };
}

export interface UpdateProfileRequestDTO {
  displayName?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  address?: string;
  taxCode?: string;
  identityCardNumber?: string;
  brokerLicenseNumber?: string;
  websiteUrl?: string;
  socialLinks?: Record<string, string> | null;
  zaloContactPhone?: string;
}


export interface ChangePasswordRequestDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SetPasswordRequestDTO {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: string;
}

