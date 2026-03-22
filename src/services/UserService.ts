import { userApi } from '../api/user.api';
import { UserValidator } from '../utils/UserValidator';
import type { 
  UpdateProfileRequestDTO, 
  ChangePasswordRequestDTO, 
  SetPasswordRequestDTO, 
  User, 
  UserProfile, 
  ApiResponse 
} from '../types/user.types';

/**
 * UserService - Business Logic and UI Orchestration.
 * Components use this instead of userApi directly.
 */
export class UserService {
  /**
   * Fetch user profile data
   */
  async getProfile(): Promise<ApiResponse<User & { profile: UserProfile | null; hasPassword: boolean }>> {
    return await userApi.getProfile();
  }

  /**
   * Update profile information
   */
  async updateProfile(data: UpdateProfileRequestDTO): Promise<{
    errors?: Record<string, string>;
    response?: ApiResponse<UserProfile>;
  }> {
    // Local validation
    const errors = UserValidator.validateProfileUpdate(data);
    if (!UserValidator.isFormValid(errors)) {
      return { errors };
    }

    // Call API
    const response = await userApi.updateProfile(data);
    return { response };
  }

  /**
   * Upload and set new avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string; profile: UserProfile }>> {
    // Multer will check on server, we can check client-side too if needed
    if (!file.type.startsWith('image/')) {
        throw new Error('Hồ sơ: Chỉ chấp nhận tệp hình ảnh.');
    }
    
    return await userApi.uploadAvatar(file);
  }

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordRequestDTO): Promise<{
    errors?: Record<string, string>;
    response?: ApiResponse<void>;
  }> {
    // Local validation
    const errors = UserValidator.validatePasswordChange(data);
    if (!UserValidator.isFormValid(errors)) {
      return { errors };
    }

    // Call API
    const response = await userApi.changePassword(data);
    return { response };
  }

  /**
   * Initiate setting new password
   */
  async initiateSetPassword(): Promise<ApiResponse<void>> {
    return await userApi.initiateSetPassword();
  }

  /**
   * Actually set the password with OTP
   */
  async setPassword(data: SetPasswordRequestDTO): Promise<{
    errors?: Record<string, string>;
    response?: ApiResponse<void>;
  }> {
    // Local validation
    const errors = UserValidator.validateSetPassword(data);
    if (!UserValidator.isFormValid(errors)) {
      return { errors };
    }

    // Call API
    const response = await userApi.setPassword(data);
    return { response };
  }
}


// Singleton for easy usage across the app
export const userService = new UserService();
