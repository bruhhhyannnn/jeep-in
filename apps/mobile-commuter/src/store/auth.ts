import { create } from "zustand";
import { listenToAuth, type AuthUser } from "@/services/firebase/auth";
import * as SecureStore from "expo-secure-store";
import type { UserRole } from "@/types";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  role: UserRole | null;
  roleHydrated: boolean;
  init: () => void;
  hydrateRole: () => Promise<void>;
  setRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  role: null,
  roleHydrated: false,

  init: () => {
    listenToAuth((u) => set({ user: u, loading: false }));
  },

  hydrateRole: async () => {
    const saved = await SecureStore.getItemAsync("user_role");
    set({ role: saved ? (saved as UserRole) : null, roleHydrated: true });
  },

  setRole: async (role) => {
    await SecureStore.setItemAsync("user_role", role);
    set({ role });
  },

  clearRole: async () => {
    await SecureStore.deleteItemAsync("user_role");
    set({ role: null });
  },
}));
