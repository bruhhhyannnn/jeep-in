import { useQuery } from "@tanstack/react-query";
import { getStopPoints } from "@/api";
import { useOfflineCache } from "@/store";

export const useStopPoints = () => {
  const cached = useOfflineCache.getState();
  return useQuery({
    queryKey: ["stop-points"],
    queryFn: async () => {
      const stops = await getStopPoints();
      useOfflineCache.getState().saveStops(stops);
      return stops;
    },
    initialData: cached.stops ?? undefined,
    initialDataUpdatedAt: cached.syncedAt ?? undefined,
  });
};
