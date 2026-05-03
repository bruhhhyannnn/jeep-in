import { useEffect, useState } from "react";
import { subscribeToDriverLocation } from "@/api";
import type { DriverLocation } from "@/types";

export function useDriverLocation(driverId: string) {
  const [location, setLocation] = useState<DriverLocation | null>(null);

  useEffect(() => {
    if (!driverId) return;
    return subscribeToDriverLocation(driverId, setLocation);
  }, [driverId]);

  return location;
}
