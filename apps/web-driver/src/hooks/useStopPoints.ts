import { useQuery } from "@tanstack/react-query";
import { getStopPoints } from "@/api";

export const useStopPoints = () => useQuery({ queryKey: ["stop-points"], queryFn: getStopPoints });
