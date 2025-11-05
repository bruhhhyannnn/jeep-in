import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"; // your firestore config

const fetchJeepneys = async () => {
  const querySnapshot = await getDocs(collection(db, "jeepneys"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const useJeepneyData = () => {
  return useQuery({
    queryKey: ["jeepneys"],
    queryFn: fetchJeepneys,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    refetchInterval: 10000, // every 10 seconds
  });
};
