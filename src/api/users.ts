import type { User } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getUser = async (uid: string): Promise<User | null> => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as User) : null;
};

export const updateUser = async (uid: string, data: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, "users", uid), data);
};
