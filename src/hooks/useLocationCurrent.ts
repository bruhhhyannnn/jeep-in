import { useEffect, useState } from "react";
import * as Location from "expo-location";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

export function useLocationCurrent() {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);

      // 1. Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== "granted") {
        console.warn("Location permission denied");
        setLoading(false);
        return;
      }

      // 2. Get current location
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      setLoading(false);
    };

    fetchLocation();
  }, []);

  return {
    currentLocation,
    loading,
    permissionGranted: permissionStatus === "granted",
  };
}
