import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@/api";

// With no signal, Firestore answers from its IndexedDB copy.
export const useRoutes = () => useQuery({ queryKey: ["routes"], queryFn: getRoutes });
