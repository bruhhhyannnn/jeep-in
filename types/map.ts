export type MapboxMapRef = {
  recenter: (coords: [number, number], zoomLevel?: number) => void;
};

export type MapRef = React.RefObject<MapboxMapRef> | { current: MapboxMapRef | null };
