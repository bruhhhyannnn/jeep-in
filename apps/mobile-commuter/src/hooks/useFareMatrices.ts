import { useQuery } from "@tanstack/react-query";
import { getFareMatrices } from "@/api";
import { useOfflineCache } from "@/store";

export const useFareMatrices = () => {
  const cached = useOfflineCache.getState();
  return useQuery({
    queryKey: ["fare-matrices"],
    queryFn: async () => {
      const matrices = await getFareMatrices();
      useOfflineCache.getState().saveFareMatrices(matrices);
      return matrices;
    },
    initialData: cached.fareMatrices ?? undefined,
    initialDataUpdatedAt: cached.syncedAt ?? undefined,
  });
};
