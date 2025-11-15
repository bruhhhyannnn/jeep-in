import { auth } from "@/services/firebase/config";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getDocument } from "@/services/firebase/firestore";
import type { User as AppUser } from "@/types";

export type AuthUser = {
  uid: string;
  email: string | null;
  role: AppUser["role"] | null;
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => signOut(auth);

// Listen for auth changes + load role from /users collection
export const listenToAuth = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    // Load role from Firestore users collection
    const userDoc = await getDocument<AppUser>("users", firebaseUser.uid);

    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: userDoc?.role ?? null,
    });
  });
};
