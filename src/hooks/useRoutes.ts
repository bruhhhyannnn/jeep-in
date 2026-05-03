import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@/api";

export const useRoutes = () => {
  return useQuery({
    queryKey: ["routes"],
    queryFn: getRoutes,
  });
};
