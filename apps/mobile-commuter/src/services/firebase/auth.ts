import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { db, getAuthInstance } from "@/services/firebase/config";
import type { User as AppUser } from "@/types";
import { doc, getDoc } from "firebase/firestore";

const auth = getAuthInstance();

export type AuthUser = {
  uid: string;
  email: string | null;
  role: AppUser["role"] | null;
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => signOut(auth);

export const listenToAuth = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    const snap = await getDoc(doc(db, "users", firebaseUser.uid));
    const userDoc = snap.exists() ? (snap.data() as AppUser) : null;

    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: userDoc?.role ?? null,
    });
  });
};
