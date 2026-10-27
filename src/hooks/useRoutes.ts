import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@/api";
import { useOfflineCache } from "@/store";

export const useRoutes = () => {
  const cached = useOfflineCache.getState();
  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const routes = await getRoutes();
      useOfflineCache.getState().saveRoutes(routes);
      return routes;
    },
    initialData: cached.routes ?? undefined,
    initialDataUpdatedAt: cached.syncedAt ?? undefined,
  });
};
