import { create } from "zustand";
import { listenToAuth, type AuthUser } from "@/services/firebase/auth";

interface AuthState {
  user: AuthUser | null;
  /** True until Firebase says whether someone is signed in. */
  loading: boolean;
  init: () => void;
}

let started = false;

/** The signed-in driver. This app has no commuter side, so there is no role to choose. */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  init: () => {
    if (started) return;
    started = true;
    listenToAuth((u) => set({ user: u, loading: false }));
  },
}));
