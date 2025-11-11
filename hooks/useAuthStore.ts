// TODO: unused
import { create } from "zustand";

type AuthState = {
  user: null | { name: string; role: string };
  setUser: (user: { name: string; role: string }) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
