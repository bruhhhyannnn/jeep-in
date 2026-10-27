/** [longitude, latitude], the order Mapbox and GeoJSON use. */
export type LngLat = [number, number];

export type CameraPadding = { top: number; right: number; bottom: number; left: number };

export type FlyToOptions = {
  duration?: number;
  zoom?: number;
  /** Height covered by a sheet, so the point lands in the visible part of the map. */
  bottomInset?: number;
};

export type MapboxMapRef = {
  flyTo: (coords: LngLat, options?: FlyToOptions) => void;

  fitBounds: (sw: LngLat, ne: LngLat, padding?: number | CameraPadding) => void;

  zoomInAt?: (coords: LngLat, zoomIncrement?: number) => void;
};
