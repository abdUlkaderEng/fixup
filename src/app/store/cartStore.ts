import { create } from 'zustand';
import { Service } from '../types/service';

interface CartItem extends Service {
   qty: number;
}

interface CartState {
   items: CartItem[];
   addItem: (service: Service) => void;
   removeItem: (id: number) => void;
   clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
   items: [],

   addItem: (service) =>
      set((state) => {
         const exists = state.items.find((i) => i.id === service.id);
         if (exists) {
            return {
               items: state.items.map((i) =>
                  i.id === service.id ? { ...i, qty: i.qty + 1 } : i
               ),
            };
         }
         return { items: [...state.items, { ...service, qty: 1 }] };
      }),

   removeItem: (id) =>
      set((state) => ({
         items: state.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
      })),

   clearCart: () => set({ items: [] }),
}));
