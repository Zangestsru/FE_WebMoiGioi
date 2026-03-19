import { create } from 'zustand';
import { userService } from '../services/UserService';
import type { UserProfile, User, ApiResponse } from '../types/user.types';

interface ProfileState {
  profile: UserProfile | null;
  hasPassword: boolean;
  email: string;
  phone: string;
  
  isFetching: boolean;
  isUpdating: boolean;
  isUpdatingPassword: boolean;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ success: boolean; errors?: Record<string, string>; message?: string }>;
  updateAvatar: (file: File) => Promise<{ success: boolean; avatarUrl?: string; message?: string }>;
  
  // Local state update (for immediate UI sync if needed)
  setProfile: (profile: UserProfile | null) => void;
  setHasPassword: (has: boolean) => void;
}

/**
 * useProfileStore - Specialized store for User Profile management.
 * Follows Rule 58 of centralizing shared state in Zustand.
 */
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  hasPassword: true,
  email: '',
  phone: '',
  
  isFetching: false,
  isUpdating: false,
  isUpdatingPassword: false,

  setProfile: (profile) => set({ profile }),
  setHasPassword: (hasPassword) => set({ hasPassword }),

  fetchProfile: async () => {
    set({ isFetching: true });
    try {
      const result = await userService.getProfile();
      if (result.success) {
        set({ 
          profile: result.data.profile,
          hasPassword: result.data.hasPassword,
          email: result.data.email || '',
          phone: result.data.phoneNumber || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      set({ isFetching: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdating: true });
    try {
      const { response, errors } = await userService.updateProfile(data);
      if (errors) {
        return { success: false, errors };
      }
      if (response?.success) {
        set({ profile: response.data });
        return { success: true };
      }
      return { success: false, message: 'Cập nhật không thành công' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Lỗi hệ thống' };
    } finally {
      set({ isUpdating: false });
    }
  },

  updateAvatar: async (file) => {
    set({ isUpdating: true });
    try {
      const response = await userService.uploadAvatar(file);
      if (response?.success) {
        const newProfile = { ...get().profile!, avatarUrl: response.data.avatarUrl };
        set({ profile: newProfile });
        return { success: true, avatarUrl: response.data.avatarUrl };
      }
      return { success: false, message: 'Upload ảnh thất bại' };
    } catch (error: any) {
      return { success: false, message: 'Lỗi khi tải ảnh lên Cloudinary' };
    } finally {
      set({ isUpdating: false });
    }
  }
}));
