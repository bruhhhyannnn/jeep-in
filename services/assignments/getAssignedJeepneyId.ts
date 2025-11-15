import { auth } from "@/services/firebase/config";
import { db } from "@/services/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export const getAssignedJeepneyId = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const driverId = user.uid;

  try {
    const q = query(collection(db, "jeepneys"), where("driver_profile_id", "==", driverId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ Driver has NO assigned jeepney.");
      return null;
    }

    const doc = snapshot.docs[0];
    return doc.id;
  } catch (err) {
    console.error("Error fetching assigned jeepney:", err);
    return null;
  }
};
