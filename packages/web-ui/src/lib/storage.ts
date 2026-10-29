import type { StateStorage } from "zustand/middleware";

/**
 * localStorage that never throws, for the persisted stores (AsyncStorage in the
 * native app). Private mode, blocked site data or a full quota just stop saving.
 */
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (err) {
      console.warn(`Couldn't save ${name}:`, err);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Nothing saved to remove.
    }
  },
};
