import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/services/firebase/config";

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, logout };
};
