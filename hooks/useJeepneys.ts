import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/services/firebase/firestore";
import { Jeepney } from "@/types";

export const useJeepneys = () =>
  useQuery({
    queryKey: ["jeepneys"],
    queryFn: async () => getCollection<Jeepney>("jeepneys"),
  });
