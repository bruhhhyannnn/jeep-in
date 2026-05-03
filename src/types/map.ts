export type MapboxMapRef = {
  flyTo: (coords: [number, number], duration?: number) => void;

  fitBounds: (sw: [number, number], ne: [number, number], padding?: number) => void;

  zoomInAt?: (coords: [number, number], zoomIncrement?: number) => void;
};
