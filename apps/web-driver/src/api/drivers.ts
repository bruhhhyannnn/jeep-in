import type { Driver } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { normalizeDriver } from "@jeep-in/core/documents";
import { str } from "@jeep-in/core/normalize";

/** Driver record from `drivers`, falling back to the `users` profile for the name. */
export const getDriver = async (uid: string): Promise<Driver> => {
  const [driverSnap, userSnap] = await Promise.all([
    getDoc(doc(db, "drivers", uid)),
    getDoc(doc(db, "users", uid)),
  ]);
  const name = userSnap.exists() ? str(userSnap.data().displayName, "Driver") : "Driver";
  return normalizeDriver(uid, driverSnap.exists() ? driverSnap.data() : {}, name);
};
