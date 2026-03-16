import type { RegisterRequestDTO, RegisterResponseDTO, LoginRequestDTO, LoginResponseDTO } from '../types/auth.types';

/**
 * Auth API layer - only responsible for raw HTTP communication.
 * No business logic here.
 */
export const authApi = {
  register: async (data: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || 'Registration failed');
    }

    return json as RegisterResponseDTO;
  },
  login: async (data: LoginRequestDTO): Promise<LoginResponseDTO> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || 'Login failed');
    }

    return json as LoginResponseDTO;
  },
};
