import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { useEffect, useState } from "react";

export function useDriverLocation(driverId: string) {
  const [driver, setDriver] = useState<any>(null);

  useEffect(() => {
    if (!driverId) return;

    const unsub = onSnapshot(doc(db, "jeepneys", driverId), (doc) => {
      if (doc.exists()) {
        setDriver(doc.data());
      }
    });

    return () => unsub();
  }, [driverId]);

  return driver;
}
