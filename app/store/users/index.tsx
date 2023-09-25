import { create } from "zustand";

interface IUsers {
  setUser: (payload: any) => void;
  user: any;
}

export const useStore = create<IUsers>()((set, get) => ({
  user: null,
 
  setUser: async (payload) => {
    try {
      set({ user: payload });
    } catch (error: any) {
      console.error(error);
    }
  },
 
}));
