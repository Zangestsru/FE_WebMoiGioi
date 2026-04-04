import axiosClient from './axiosClient';
import type { 
  UpdateProfileRequestDTO, 
  ChangePasswordRequestDTO, 
  SetPasswordRequestDTO,
  User, 
  UserProfile,
  ApiResponse
} from '../types/user.types';

/**
 * User API layer for Frontend.
 * Communicates with /api/v1/user endpoints.
 */
export const userApi = {
  /**
   * Fetch current user fully detailed profile
   */
  getProfile: async (): Promise<ApiResponse<User & { profile: UserProfile | null; hasPassword: boolean }>> => {
    const response = await axiosClient.get<ApiResponse<User & { profile: UserProfile | null; hasPassword: boolean }>>('/user/profile');
    return response.data;
  },

  /**
   * Update profile fields (JSON)
   */
  updateProfile: async (data: UpdateProfileRequestDTO): Promise<ApiResponse<UserProfile>> => {
    const response = await axiosClient.patch<ApiResponse<UserProfile>>('/user/profile', data);
    return response.data;
  },

  /**
   * Upload and update avatar (Multipart/form-data)
   */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string; profile: UserProfile }>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosClient.patch<ApiResponse<{ avatarUrl: string; profile: UserProfile }>>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Change account password
   */
  changePassword: async (data: ChangePasswordRequestDTO): Promise<ApiResponse<void>> => {
    const response = await axiosClient.patch<ApiResponse<void>>('/user/change-password', data);
    return response.data;
  },

  /**
   * Initiate set password (for social users)
   */
  initiateSetPassword: async (): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/user/initiate-set-password');
    return response.data;
  },

  /**
   * Set password with OTP
   */
  setPassword: async (data: SetPasswordRequestDTO): Promise<ApiResponse<void>> => {
    const response = await axiosClient.post<ApiResponse<void>>('/user/set-password', data);
    return response.data;
  },

  /**
   * Admin: Get user count (non-admin users) with monthly comparison
   */
  getAdminUserCount: async (): Promise<ApiResponse<{
    total: number;
    thisMonth: number;
    lastMonth: number;
    changePercent: number;
  }>> => {
    const response = await axiosClient.get('/user/admin/user-count');
    return response.data;
  },

  /**
   * Admin: Get all users
   */
  getAllUsers: async (params?: any): Promise<ApiResponse<(User & { profile: UserProfile | null })[]>> => {
    const response = await axiosClient.get('/user/admin/users', { params });
    return response.data;
  },

  /**
   * Admin: Update user status or role
   */
  updateUser: async (id: string | number, data: { status?: string; accountType?: string }): Promise<ApiResponse<User>> => {
    const response = await axiosClient.patch(`/user/admin/users/${id}`, data);
    return response.data;
  },
};

