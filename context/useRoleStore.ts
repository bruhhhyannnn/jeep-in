import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { UserRole } from "@/types";

interface RoleState {
  role: UserRole | null;
  hydrated: boolean;
  setRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: null,
  hydrated: false,

  setRole: async (role) => {
    await SecureStore.setItemAsync("user_role", role);
    set({ role });
  },

  hydrate: async () => {
    const saved = await SecureStore.getItemAsync("user_role");

    set({
      role: saved ? (saved as UserRole) : null,
      hydrated: true,
    });
  },

  clearRole: async () => {
    await SecureStore.deleteItemAsync("user_role");
    set({ role: null });
  },
}));
