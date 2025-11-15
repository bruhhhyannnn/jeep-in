import { auth, db } from "@/services/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export const fetchAssignedJeepneyId = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const q = query(collection(db, "jeepneys"), where("driver_profile_id", "==", user.uid));

    const snap = await getDocs(q);

    if (snap.empty) return null;

    return snap.docs[0].id;
  } catch (err) {
    console.error("Error fetching jeepney ID in background:", err);
    return null;
  }
};
