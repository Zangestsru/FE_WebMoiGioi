import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUserDTO } from "../types/auth.types";

interface AuthState {
  user: AuthUserDTO | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUserDTO | null) => void;
  logout: () => void;
}

/**
 * Auth Store using Zustand.
 * Manages user state and persists it to localStorage.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        localStorage.removeItem("user-storage");
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
