import { create } from "zustand";

interface IProduct {
  setFilteredProducts: (payload: any) => void;
  filteredProducts: any;
}

export const useStore = create<IProduct>()((set, get) => ({
  filteredProducts: [],
  countdown: "",
  setFilteredProducts: async (products) => {
    try {
      set({ filteredProducts: products });
    } catch (error: any) {
      console.error(error);
    }
  },
}));
