import { create } from "zustand";
import { listenToAuth, type AuthUser } from "@/services/firebase/auth";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  init: () => {
    listenToAuth((u) => {
      set({ user: u, loading: false });
    });
  },
}));
