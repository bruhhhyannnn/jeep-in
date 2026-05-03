import { useQuery } from "@tanstack/react-query";
import { getStopPoints } from "@/api";

export const useStopPoints = () => {
  return useQuery({
    queryKey: ["stop-points"],
    queryFn: getStopPoints,
  });
};
