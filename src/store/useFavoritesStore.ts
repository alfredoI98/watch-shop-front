import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Watch } from '../interfaces/watch';
import api from '../api';
import { toast } from 'react-toastify';

interface FavoritesStore {
  favorites: Watch[];
  toggleFavorite: (watch: Watch, userId: string) => Promise<void>;
  fetchUserFavorites: (userId: string) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: async (watch, userId) => {
        if (!userId) {
          toast.error('Inicia sesión para guardar productos favoritos.');
          return;
        }

        const favorites = get().favorites;
        const isFavorite = favorites.some((favorite) => favorite._id === watch._id);
        const updatedFavorites = isFavorite
          ? favorites.filter((favorite) => favorite._id !== watch._id)
          : [...favorites, watch];

        set({ favorites: updatedFavorites });

        try {
          await api.post('/watches/favorites', {
            userId,
            items: updatedFavorites.map((favorite) => favorite._id),
          });
        } catch {
          set((state) => ({
            favorites: isFavorite
              ? [...state.favorites, watch]
              : state.favorites.filter((favorite) => favorite._id !== watch._id),
          }));
          toast.error('No se pudieron guardar tus favoritos. Intenta nuevamente.');
        }
      },
      fetchUserFavorites: async (userId) => {
        if (!userId) return;

        try {
          const response = await api.get(`/watches/favorites/${userId}`);
          const items = response.data?.items;
          if (!Array.isArray(items)) {
            throw new Error('La respuesta de favoritos no tiene un formato válido.');
          }
          set({ favorites: items });
        } catch {
          toast.error('No se pudieron cargar tus favoritos desde tu cuenta.');
        }
      },
    }),
    { name: 'ecommerce-favorites' }
  )
);
