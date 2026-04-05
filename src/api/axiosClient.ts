import axios from 'axios';

/**
 * Axios Client configuration.
 * Handles baseURL, interceptors for auth headers, and automatic token refreshing.
 */
const axiosClient = axios.create({
  // Mặc định gọi đường dẫn tương đối '/api/v1'. Nginx sẽ bắt tự động và đẩy về backend.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving cookies
});

// Utility to get cookie value
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

// Request Interceptor: Attach Access Token from Cookie
axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and Refresh Token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        // BE will use the refreshToken cookie automatically (withCredentials: true)
        const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
        await axios.post(`${apiBase}/auth/refresh-token`, {}, { withCredentials: true });

        // After refresh, the new accessToken is in the cookie.
        // Retry the original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g., refresh token expired)
        // Redirect to login or clear auth state
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
