import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/database.types";

// ---- Types ----

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface ShippingOption {
  id: number;
  name: string;
  price: number;
  deliveryDays: number;
  company: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Shipping state
  shippingCep: string;
  shippingOptions: ShippingOption[];
  selectedShipping: ShippingOption | null;

  // Actions
  addItem: (product: Product, quantity?: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Shipping actions
  setShippingCep: (cep: string) => void;
  setShippingOptions: (options: ShippingOption[]) => void;
  selectShipping: (option: ShippingOption) => void;
  clearShipping: () => void;

  // Refresh product data (sync stale cart with DB)
  refreshProducts: (freshProducts: Product[]) => void;

  // Selectors
  totalItems: () => number;
  subtotal: () => number;
  totalWithShipping: () => number;
  allItemsFreeShipping: () => boolean;
}

// Helper: composite key matching (productId + size)
const matchItem = (item: CartItem, productId: string, size?: string) =>
  item.product.id === productId && item.size === size;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      shippingCep: "",
      shippingOptions: [],
      selectedShipping: null,

      addItem: (product, quantity = 1, size) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) =>
            matchItem(item, product.id, size)
          );

          if (existingIndex !== -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity, size }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter((item) => !matchItem(item, productId, size)),
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            matchItem(item, productId, size) ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () =>
        set({ items: [], shippingCep: "", shippingOptions: [], selectedShipping: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Shipping
      setShippingCep: (cep) => set({ shippingCep: cep }),
      setShippingOptions: (options) => set({ shippingOptions: options }),
      selectShipping: (option) => set({ selectedShipping: option }),
      clearShipping: () =>
        set({ shippingOptions: [], selectedShipping: null, shippingCep: "" }),

      // Refresh: atualiza dados dos produtos no carrinho com dados frescos do DB
      refreshProducts: (freshProducts) => {
        const productMap = new Map(freshProducts.map((p) => [p.id, p]));
        set((state) => ({
          items: state.items.map((item) => {
            const fresh = productMap.get(item.product.id);
            return fresh ? { ...item, product: fresh } : item;
          }),
        }));
      },

      // Selectors
      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      totalWithShipping: () => {
        const sub = get().subtotal();
        if (get().allItemsFreeShipping()) return sub;
        const shipping = get().selectedShipping?.price ?? 0;
        return sub + shipping;
      },

      allItemsFreeShipping: () => {
        const { items } = get();
        if (items.length === 0) return false;
        return items.every((item) => {
          const meta = item.product.metadata as Record<string, unknown> | null;
          return meta?.free_shipping === true;
        });
      },
    }),
    {
      name: "raizes-cart",
      partialize: (state) => ({
        items: state.items,
        shippingCep: state.shippingCep,
        selectedShipping: state.selectedShipping,
      }),
    }
  )
);
