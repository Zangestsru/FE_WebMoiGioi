import { create } from 'zustand';

interface UIState {
  statusPopup: {
    isOpen: boolean;
    type: 'success' | 'error' | null;
    title: string;
    message: string;
  };
  
  // Actions
  showStatus: (title: string, message: string, type: 'success' | 'error') => void;
  hideStatus: () => void;
}

/**
 * useUIStore - Global UI state management using Zustand.
 * Handles shared UI elements like status popups, notifications, etc.
 */
export const useUIStore = create<UIState>((set) => ({
  statusPopup: {
    isOpen: false,
    type: null,
    title: '',
    message: ''
  },

  showStatus: (title, message, type) => set({
    statusPopup: { isOpen: true, type, title, message }
  }),

  hideStatus: () => set((state) => ({
    statusPopup: { ...state.statusPopup, isOpen: false }
  }))
}));
