export type MapboxMapRef = {
  flyTo: (coords: [number, number], duration?: number) => void;

  fitBounds: (sw: [number, number], ne: [number, number], padding?: number) => void;
};

export type MapRef = React.RefObject<MapboxMapRef> | { current: MapboxMapRef | null };
