import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { listingApi } from '../api/listing.api';

interface FavoriteState {
  favoriteIds: string[];
  isLoading: boolean;
  
  // Actions
  addFavoriteId: (id: string) => void;
  removeFavoriteId: (id: string) => void;
  syncFavorites: () => Promise<void>;
  reset: () => void;
}

/**
 * useFavoriteStore - Global favorite state management.
 * Persists to localStorage to avoid flickering on refresh.
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      isLoading: false,

      addFavoriteId: (id) => {
        const { favoriteIds } = get();
        if (!favoriteIds.includes(id)) {
          set({ favoriteIds: [...favoriteIds, id] });
        }
      },

      removeFavoriteId: (id) => {
        const { favoriteIds } = get();
        set({ favoriteIds: favoriteIds.filter(fid => fid !== id) });
      },

      syncFavorites: async () => {
        try {
          set({ isLoading: true });
          const res = await listingApi.getMyFavorites();
          if (res.success && res.data) {
            const ids = res.data.map(listing => listing.id.toString());
            set({ favoriteIds: ids });
          }
        } catch (error) {
          console.error('Failed to sync favorites:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'favorite-storage', // name of the item in storage (must be unique)
    }
  )
);
