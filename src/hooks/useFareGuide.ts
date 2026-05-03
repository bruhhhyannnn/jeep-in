import { useQuery } from "@tanstack/react-query";
import { getFareGuide } from "@/api";

export const useFareGuide = () => {
  return useQuery({
    queryKey: ["fare-guide"],
    queryFn: getFareGuide,
  });
};
