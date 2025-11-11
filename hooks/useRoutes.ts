import { useQuery } from "@tanstack/react-query";
import { getCollection } from "@/services/firebase/firestore";
import { Route } from "@/types";

export const useRoutes = () =>
  useQuery({
    queryKey: ["routes"],
    queryFn: async () => getCollection<Route>("routes"),
  });
