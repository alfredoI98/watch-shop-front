import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Watch } from '../interfaces/watch';
import api from '../api';
import { toast } from 'react-toastify';

interface CartItem {
  productId: string;
  quantity: number;
  price: string;
}

interface CartStore {
  cart: CartItem[];
  addItem: (product: Watch, userId: string) => Promise<void>;
  changeQuantity: (productId: string, change: -1 | 1, userId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  fetchUserCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [], // Cada ítem: { productId, quantity, price }

      // 1. Agregar o incrementar ítem
      addItem: async (product: Watch, userId: string) => {
        try {
          const currentCart: CartItem[] = get().cart;
          const existingItem = currentCart.find((item) => item.productId === product._id);

          let newCart;
          if (existingItem) {
            newCart = currentCart.map((item) =>
              item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            newCart = [...currentCart, { productId: product._id, quantity: 1, price: product.price }];
          }

          set({ cart: newCart });

          toast.success('Reloj agregado al carrito.');

          // Sincronizar con el backend de NestJS si el usuario está logueado
          if (userId) {
            await api.post('/watches/cart', { userId, items: newCart });
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error('No se pudo agregar el reloj al carrito. Por favor, intenta nuevamente.');
        }
      },

      changeQuantity: async (productId, change, userId) => {
        try {
          const currentCart = get().cart;
          const item = currentCart.find((cartItem) => cartItem.productId === productId);
          if (!item) return;

          const newCart = change === 1
            ? currentCart.map((cartItem) =>
                cartItem.productId === productId
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              )
            : item.quantity <= 1
              ? currentCart.filter((cartItem) => cartItem.productId !== productId)
              : currentCart.map((cartItem) =>
                  cartItem.productId === productId
                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                    : cartItem
                );

          set({ cart: newCart });

          if (userId) {
            await api.post('/watches/cart', { userId, items: newCart });
          }
        } catch {
          toast.error('No se pudo actualizar la cantidad. Por favor, intenta nuevamente.');
        }
      },

      // 2. Limpiar carrito (al comprar o hacer logout)
      clearCart: async (userId: string) => {
        set({ cart: [] });
        if (userId) {
          await api.delete(`/cart/${userId}`);
        }
      },

      // 3. Cargar carrito desde NestJS (al iniciar sesión)
      fetchUserCart: async (userId: string) => {
        const response = await api.get(`/watches/cart/${userId}`);
        const data = response.data;
        if (data?.items) {
          set({ cart: data.items });
        }
      },
    }),
    {
      name: 'ecommerce-cart', // Llave en LocalStorage para usuarios invitados
    }
  )
);
