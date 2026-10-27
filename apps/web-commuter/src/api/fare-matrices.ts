import type { FareMatrix } from "@/types";
import { db } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { normalizeFareMatrix } from "@jeep-in/core/documents";

export { PLACEHOLDER_FARE_MATRIX } from "@jeep-in/core/documents";

export const getFareMatrices = async (): Promise<FareMatrix[]> => {
  const snap = await getDocs(collection(db, "fare_matrices"));
  return snap.docs.map((d) => normalizeFareMatrix(d.id, d.data()));
};
