import { useEffect } from "react";
import { useStopsStore } from "@/context";

export const useStopsList = () => {
  const { stops, ready, loadStops } = useStopsStore();

  useEffect(() => {
    if (!ready) loadStops();
  }, [ready]);

  return stops;
};
