import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/services/firebase/firestore";
import { PickupPoint } from "@/types";

export const usePickupPoints = () =>
  useQuery({
    queryKey: ["pickup_points"],
    queryFn: async () => getCollection<PickupPoint>("pickup_points"),
  });
