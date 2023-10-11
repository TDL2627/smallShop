import { create } from "zustand";

interface ISale {
  getAllSales: () => void;
  createSale: (payload: any) => void;
  sales: any;
}

export const useStore = create<ISale>()((set, get) => ({
  sales: [],
  getAllSales: async () => {
    try {
      // set({ filteredProducts: payload });
    } catch (error: any) {
      console.error(error);
    }
  },
  createSale: async (payload) => {
    try {
      // set({ products: payload });
    } catch (error: any) {
      console.error(error);
    }
  }
}));
