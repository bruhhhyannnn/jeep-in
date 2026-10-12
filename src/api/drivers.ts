import type { Driver } from "@/types";
import { db } from "@/services/firebase/config";
import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { optionalStr, str } from "@/api/normalize";

export const normalizeDriver = (id: string, d: DocumentData, fallbackName = "Driver"): Driver => ({
  id,
  name: str(d.name ?? d.displayName, fallbackName),
  employeeId: optionalStr(d.employeeId),
  role: d.role === "reliever" ? "reliever" : "main",
  phone: optionalStr(d.phone),
  licenseNo: optionalStr(d.licenseNo),
  licenseExpiry: optionalStr(d.licenseExpiry),
  photoUrl: optionalStr(d.photoUrl),
});

/** Driver record from `drivers`, falling back to the `users` profile for the name. */
export const getDriver = async (uid: string): Promise<Driver> => {
  const [driverSnap, userSnap] = await Promise.all([
    getDoc(doc(db, "drivers", uid)),
    getDoc(doc(db, "users", uid)),
  ]);
  const name = userSnap.exists() ? str(userSnap.data().displayName, "Driver") : "Driver";
  return normalizeDriver(uid, driverSnap.exists() ? driverSnap.data() : {}, name);
};
