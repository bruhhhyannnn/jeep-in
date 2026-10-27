// LngLat is exported with the data model (types/entities).
import type { LngLat } from "@jeep-in/core/model";

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
