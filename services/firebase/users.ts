import { getDocument } from "@/services/firebase/firestore";
import type { User } from "@/types/entities";

export const getUserProfile = (uid: string) => {
  return getDocument<User>("users", uid);
};
