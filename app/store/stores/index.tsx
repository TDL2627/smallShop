import { create } from "zustand";

interface IStore {
  getStore: () => void;
  storeID: any;
}

export const useStore = create<IStore>()((set, get) => ({
  storeID: "",
  getStore: async () => {
    try {
     
    } catch (error: any) {
      console.error(error);
    }
  },
 
}));
