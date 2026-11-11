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
  stockMap: Record<string, number>;
  getProductStock: (productId: string, fallbackStock: number) => number;
  syncProductStockWithBackend: (productId: string, quantityDelta: number) => Promise<void>;
  addItem: (product: Watch, userId: string) => Promise<void>;
  changeQuantity: (productId: string, change: -1 | 1, userId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  fetchUserCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [], // Cada ítem: { productId, quantity, price }
      stockMap: {},

      getProductStock: (productId: string, fallbackStock: number) => {
        const stockMap = get().stockMap;
        const storedStock = stockMap[productId];
        return typeof storedStock === 'number' ? storedStock : fallbackStock;
      },

      syncProductStockWithBackend: async (productId: string, quantityDelta: number) => {
        await api.patch(`/watches/${productId}/stock`, { quantityDelta });
      },

      // 1. Agregar o incrementar ítem
      addItem: async (product: Watch, userId: string) => {
        try {
          const currentCart: CartItem[] = get().cart;
          const existingItem = currentCart.find((item) => item.productId === product._id);
          const remainingStock = get().getProductStock(product._id, product.stock);

          if (remainingStock <= 0) {
            toast.error('No hay más stock disponible para este reloj.');
            return;
          }

          let newCart;
          if (existingItem) {
            newCart = currentCart.map((item) =>
              item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            newCart = [...currentCart, { productId: product._id, quantity: 1, price: product.price }];
          }

          set((state) => ({
            cart: newCart,
            stockMap: {
              ...state.stockMap,
              [product._id]: Math.max(remainingStock - 1, 0),
            },
          }));

          toast.success('Reloj agregado al carrito.');

          if (userId) {
            await api.post('/watches/cart', { userId, items: newCart });
            await get().syncProductStockWithBackend(product._id, -1);
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

          const currentStock = get().getProductStock(productId, 0);

          if (change === 1 && currentStock <= 0) {
            toast.error('No hay más stock disponible para este reloj.');
            return;
          }

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

          set((state) => ({
            cart: newCart,
            stockMap: {
              ...state.stockMap,
              [productId]: Math.max(currentStock + (change === 1 ? -1 : 1), 0),
            },
          }));

          if (userId) {
            await api.post('/watches/cart', { userId, items: newCart });
            await get().syncProductStockWithBackend(productId, change === 1 ? -1 : 1);
          }
        } catch {
          toast.error('No se pudo actualizar la cantidad. Por favor, intenta nuevamente.');
        }
      },

      // 2. Limpiar carrito (al comprar o hacer logout)
      clearCart: async (userId: string) => {
        set({ cart: [], stockMap: {} });
        if (userId) {
          await api.delete(`/watches/cart/${userId}`);
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
