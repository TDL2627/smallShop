import { create } from "zustand";

interface IProduct {
  setFilteredProducts: (payload: any) => void;
  setProducts: (payload: any) => void;
  setCategories: (payload: any) => void;
  filteredProducts: any;
  categories: any;
  products: any;
}

export const useStore = create<IProduct>()((set, get) => ({
  filteredProducts: [],
  products: [],
  categories: [],
  countdown: "",
  setFilteredProducts: async (payload) => {
    try {
      set({ filteredProducts: payload });
    } catch (error: any) {
      console.error(error);
    }
  },
  setProducts: async (payload) => {
    try {
      set({ products: payload });
    } catch (error: any) {
      console.error(error);
    }
  },
  setCategories: async (payload) => {
    try {
      set({ categories: payload });
    } catch (error: any) {
      console.error(error);
    }
  },
}));
