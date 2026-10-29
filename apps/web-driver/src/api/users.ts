import type { User } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const getUser = async (uid: string): Promise<User | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as User) : null;
};
