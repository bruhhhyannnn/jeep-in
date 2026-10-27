import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";
import type { LngLat } from "@/types";

type MapMarkerProps = {
  map: mapboxgl.Map;
  coordinate: LngLat;
  /** Which point of the content sits on the coordinate (rnmapbox's `anchor`). */
  anchor?: mapboxgl.MarkerOptions["anchor"];
  children: React.ReactNode;
};

/** rnmapbox's MarkerView: React content pinned to a coordinate, above the map layers. */
export default function MapMarker({
  map,
  coordinate,
  anchor = "center",
  children,
}: MapMarkerProps) {
  const [element] = useState(() => document.createElement("div"));
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [lng, lat] = coordinate;

  useEffect(() => {
    const m = new mapboxgl.Marker({ element, anchor }).setLngLat([lng, lat]).addTo(map);
    marker.current = m;
    return () => {
      m.remove();
      marker.current = null;
    };
    // Position updates go through setLngLat below instead of a new marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, element, anchor]);

  useEffect(() => {
    marker.current?.setLngLat([lng, lat]);
  }, [lng, lat]);

  return createPortal(children, element);
}
