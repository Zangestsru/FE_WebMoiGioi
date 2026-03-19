import axiosClient from './axiosClient';
import type { RegisterRequestDTO, RegisterResponseDTO, LoginRequestDTO, LoginResponseDTO, VerifyOTPRequestDTO, ResendOTPRequestDTO, GoogleLoginRequestDTO, FacebookLoginRequestDTO } from '../types/auth.types';

/**
 * Auth API layer - only responsible for raw HTTP communication.
 * Using axiosClient for automatic token handling and baseURL.
 */
export const authApi = {
  register: async (data: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    const response = await axiosClient.post<RegisterResponseDTO>('/auth/register', data);
    return response.data;
  },
  login: async (data: LoginRequestDTO): Promise<LoginResponseDTO> => {
    const response = await axiosClient.post<LoginResponseDTO>('/auth/login', data);
    return response.data;
  },
  verifyOtp: async (data: VerifyOTPRequestDTO): Promise<LoginResponseDTO> => {
    const response = await axiosClient.post<LoginResponseDTO>('/auth/verify-otp', data);
    return response.data;
  },
  resendOtp: async (data: ResendOTPRequestDTO): Promise<{ success: boolean; message: string }> => {
    const response = await axiosClient.post<{ success: boolean; message: string }>('/auth/resend-otp', data);
    return response.data;
  },
  googleLogin: async (data: GoogleLoginRequestDTO): Promise<LoginResponseDTO> => {
    const response = await axiosClient.post<LoginResponseDTO>('/auth/google', data);
    return response.data;
  },
  facebookLogin: async (data: FacebookLoginRequestDTO): Promise<LoginResponseDTO> => {
    const response = await axiosClient.post<LoginResponseDTO>('/auth/facebook', data);
    return response.data;
  },
};
