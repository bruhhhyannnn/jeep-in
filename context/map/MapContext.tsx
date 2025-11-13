import { createContext, useContext, useRef } from "react";
import type { MapboxMapRef } from "@/types";

type MapContextType = {
  map: React.RefObject<MapboxMapRef>;
};

const MapContext = createContext<MapContextType | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const map = useRef<MapboxMapRef>({
    flyTo: () => {},
    fitBounds: () => {},
  });

  return <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>;
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used inside a <MapProvider>");
  return ctx.map;
}
