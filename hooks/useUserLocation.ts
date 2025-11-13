// TODO: unused
import * as Location from "expo-location";
import { useState, useEffect } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Highest, timeInterval: 2000, distanceInterval: 20 },
      (loc) => {
        setLocation([loc.coords.longitude, loc.coords.latitude]);
      },
    );
  }, []);

  return location;
};
