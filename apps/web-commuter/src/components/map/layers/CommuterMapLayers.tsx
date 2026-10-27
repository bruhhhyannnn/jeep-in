import { useEffect, useMemo } from "react";
import type mapboxgl from "mapbox-gl";
import type { GeoJSONSource } from "mapbox-gl";
import { useShallow } from "zustand/react/shallow";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import type { LngLat } from "@/types";
import { ROUTES, STRINGS } from "@/constants";
import { useFleet, useTransit, useTrip } from "@/hooks";
import { measureOnPath, slicePath } from "@/lib/geo";
import { formatDistance } from "@/lib/format";
import { router } from "@/lib/router";
import { useLocationStore, useMapUi, usePreferences } from "@/store";
import { useTheme } from "@/theme";
import { ThemedText, View } from "@/components/ui";
import JeepMarker from "@/components/map/JeepMarker";
import LocationPuck from "@/components/map/LocationPuck";
import MapMarker from "@/components/map/MapMarker";
import StopCallout from "@/components/map/StopCallout";

const line = (coordinates: LngLat[]): Feature<LineString> => ({
  type: "Feature",
  properties: {},
  geometry: { type: "LineString", coordinates },
});

const EMPTY: FeatureCollection = { type: "FeatureCollection", features: [] };

/** Tap target around a stop dot, in px (rnmapbox ShapeSource hitbox 28 × 28). */
const STOP_HITBOX = 28;

const setData = (map: mapboxgl.Map, id: string, data: Feature | FeatureCollection) =>
  (map.getSource(id) as GeoJSONSource | undefined)?.setData(data);

type CommuterMapLayersProps = {
  map: mapboxgl.Map;
  /** Bumped when the map style reloads (Light ↔ Dark), so sources and layers are added again. */
  styleVersion: number;
};

/**
 * The commuter map shows four things: you, jeeps, stops and the route.
 * Only the chosen direction is drawn.
 */
export default function CommuterMapLayers({ map, styleVersion }: CommuterMapLayersProps) {
  const { colors } = useTheme();
  const transit = useTransit();
  const trip = useTrip(transit);
  const { jeeps, offline } = useFleet(transit);
  const { selectedJeepId, selectedJeepBadge, focusedStopId } = useMapUi(
    useShallow((s) => ({
      selectedJeepId: s.selectedJeepId,
      selectedJeepBadge: s.selectedJeepBadge,
      focusedStopId: s.focusedStopId,
    })),
  );
  const coords = useLocationStore((s) => s.coords);
  const accuracyM = useLocationStore((s) => s.accuracyM);
  const heading = useLocationStore((s) => s.heading);
  const permission = useLocationStore((s) => s.permission);
  const useMyLocation = usePreferences((s) => s.useMyLocation);

  const { direction, paths, stops } = transit;
  const path = useMemo(() => (direction ? (paths[direction.id] ?? []) : []), [direction, paths]);
  const selected = jeeps.find((j) => j.id === selectedJeepId) ?? null;
  const visibleJeeps = jeeps.filter(
    (j) => j.id === selectedJeepId || j.directionId == null || j.directionId === direction?.id,
  );

  // Your jeep's way to your stop, drawn in yellow.
  const highlight = useMemo(() => {
    if (!selected || !trip.boarding || path.length < 2) return [];
    const from = measureOnPath(path, selected.position);
    const to = measureOnPath(path, [trip.boarding.long, trip.boarding.lat]);
    return from && to ? slicePath(path, from.alongKm, to.alongKm) : [];
  }, [selected, trip.boarding, path]);

  // Only walking is dotted.
  const walk: LngLat[] | null =
    coords && trip.boarding && trip.walkKm != null && trip.walkKm < 3
      ? [coords, [trip.boarding.long, trip.boarding.lat]]
      : null;
  const walkKey = walk ? walk.flat().join(",") : "";

  const stopShapes = useMemo(
    (): FeatureCollection<Point> => ({
      type: "FeatureCollection",
      features: stops.map((s) => ({
        type: "Feature",
        id: s.id,
        properties: {
          id: s.id,
          name: s.name,
          kind:
            s.id === trip.boarding?.id
              ? "boarding"
              : s.id === trip.alighting?.id
                ? "alighting"
                : s.id === focusedStopId
                  ? "focused"
                  : "stop",
        },
        geometry: { type: "Point", coordinates: [s.long, s.lat] },
      })),
    }),
    [stops, trip.boarding?.id, trip.alighting?.id, focusedStopId],
  );

  // Sources and layers, in drawing order: route, your jeep's way, walking, stops.
  useEffect(() => {
    for (const id of ["route", "jeep-to-stop", "walk", "stops"]) {
      if (!map.getSource(id)) map.addSource(id, { type: "geojson", data: EMPTY });
    }
    if (!map.getLayer("route-line")) {
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-cap": "round", "line-join": "round" },
      });
    }
    if (!map.getLayer("jeep-to-stop-line")) {
      map.addLayer({
        id: "jeep-to-stop-line",
        type: "line",
        source: "jeep-to-stop",
        layout: { "line-cap": "round", "line-join": "round" },
      });
    }
    if (!map.getLayer("walk-line")) {
      map.addLayer({
        id: "walk-line",
        type: "line",
        source: "walk",
        layout: { "line-cap": "round" },
      });
    }
    if (!map.getLayer("stop-dots")) {
      map.addLayer({ id: "stop-dots", type: "circle", source: "stops" });
    }
    if (!map.getLayer("stop-labels")) {
      map.addLayer({
        id: "stop-labels",
        type: "symbol",
        source: "stops",
        minzoom: 14,
        filter: ["==", ["get", "kind"], "stop"],
        layout: {
          "text-field": ["get", "name"],
          "text-size": 11,
          "text-anchor": "top",
          "text-offset": [0, 0.9],
          "text-optional": true,
        },
      });
    }

    // Paint comes from the theme tokens, so it is set again when the theme changes.
    map.setPaintProperty("route-line", "line-color", colors.mapRoute);
    map.setPaintProperty("route-line", "line-width", 5);
    map.setPaintProperty("route-line", "line-opacity", 0.85);
    map.setPaintProperty("jeep-to-stop-line", "line-color", colors.accent);
    map.setPaintProperty("jeep-to-stop-line", "line-width", 7);
    map.setPaintProperty("walk-line", "line-color", colors.action);
    map.setPaintProperty("walk-line", "line-width", 4);
    map.setPaintProperty("walk-line", "line-dasharray", [0, 2]);
    map.setPaintProperty("stop-dots", "circle-radius", ["match", ["get", "kind"], "stop", 5, 8]);
    map.setPaintProperty("stop-dots", "circle-color", [
      "match",
      ["get", "kind"],
      "focused",
      colors.mapRoute,
      colors.mapStopFill,
    ]);
    map.setPaintProperty("stop-dots", "circle-stroke-color", [
      "match",
      ["get", "kind"],
      "stop",
      colors.mapStopRing,
      "focused",
      colors.mapStopFill,
      colors.action,
    ]);
    map.setPaintProperty("stop-dots", "circle-stroke-width", [
      "match",
      ["get", "kind"],
      "stop",
      2.5,
      3.5,
    ]);
    map.setPaintProperty("stop-dots", "circle-pitch-alignment", "map");
    map.setPaintProperty("stop-labels", "text-color", colors.muted);
    map.setPaintProperty("stop-labels", "text-halo-color", colors.mapLabelHalo);
    map.setPaintProperty("stop-labels", "text-halo-width", 1.5);
  }, [map, styleVersion, colors]);

  useEffect(() => {
    setData(map, "route", path.length >= 2 ? line(path) : EMPTY);
  }, [map, styleVersion, path]);

  useEffect(() => {
    setData(map, "jeep-to-stop", highlight.length >= 2 ? line(highlight) : EMPTY);
  }, [map, styleVersion, highlight]);

  useEffect(() => {
    const points = walkKey ? walkKey.split(",").map(Number) : [];
    setData(
      map,
      "walk",
      points.length === 4
        ? line([
            [points[0], points[1]],
            [points[2], points[3]],
          ])
        : EMPTY,
    );
  }, [map, styleVersion, walkKey]);

  useEffect(() => {
    setData(map, "stops", stopShapes);
  }, [map, styleVersion, stopShapes]);

  // Tapping a stop opens it; the pointer shows which dots are tappable.
  useEffect(() => {
    const half = STOP_HITBOX / 2;
    const stopAt = (point: mapboxgl.Point) => {
      if (!map.getLayer("stop-dots")) return null;
      const box: [mapboxgl.PointLike, mapboxgl.PointLike] = [
        [point.x - half, point.y - half],
        [point.x + half, point.y + half],
      ];
      const id = map.queryRenderedFeatures(box, { layers: ["stop-dots"] })[0]?.properties?.id;
      return typeof id === "string" ? id : null;
    };
    const onClick = (e: mapboxgl.MapMouseEvent) => {
      const id = stopAt(e.point);
      if (id) router.push(ROUTES.commuter.stop(id));
    };
    const onMove = (e: mapboxgl.MapMouseEvent) => {
      map.getCanvas().style.cursor = stopAt(e.point) ? "pointer" : "";
    };
    map.on("click", onClick);
    map.on("mousemove", onMove);
    return () => {
      map.off("click", onClick);
      map.off("mousemove", onMove);
    };
  }, [map]);

  const focused =
    focusedStopId && focusedStopId !== trip.boarding?.id
      ? (stops.find((s) => s.id === focusedStopId) ?? null)
      : null;

  return (
    <>
      {useMyLocation && permission === "granted" && coords && (
        <LocationPuck
          map={map}
          coords={coords}
          accuracyM={accuracyM}
          heading={heading}
          styleVersion={styleVersion}
        />
      )}

      {trip.boarding && (
        <MapMarker map={map} coordinate={[trip.boarding.long, trip.boarding.lat]} anchor="bottom">
          <StopCallout
            variant={trip.boardingSource === "nearest" ? "suggested" : "chosen"}
            eyebrow={
              trip.boardingSource === "nearest" && trip.walkKm != null
                ? STRINGS.commuter.map.nearestStop(formatDistance(trip.walkKm))
                : STRINGS.commuter.map.yourStop
            }
            name={trip.boarding.name}
          />
        </MapMarker>
      )}

      {focused && (
        <MapMarker map={map} coordinate={[focused.long, focused.lat]} anchor="bottom">
          <StopCallout variant="chosen" eyebrow={STRINGS.commuter.map.stop} name={focused.name} />
        </MapMarker>
      )}

      {trip.alighting && (
        <MapMarker map={map} coordinate={[trip.alighting.long, trip.alighting.lat]}>
          <View className="h-4 w-4 rounded-[4px] border-[3px] border-action bg-card" />
        </MapMarker>
      )}

      {visibleJeeps.map((j) => (
        <MapMarker key={j.id} map={map} coordinate={j.position}>
          <JeepMarker
            unit={j.unit}
            state={j.stale || offline ? "stale" : j.directionId == null ? "unknown" : "live"}
            selected={j.id === selectedJeepId}
            onPress={() => router.push(ROUTES.commuter.jeepney(j.id))}
          />
        </MapMarker>
      ))}

      {selected && selectedJeepBadge && (
        <MapMarker map={map} coordinate={selected.position} anchor="left">
          <View className="ml-[34px] rounded-full bg-navy-900 px-2.5 py-1">
            <ThemedText variant="dataSm" tone="onInverse">
              {selectedJeepBadge}
            </ThemedText>
          </View>
        </MapMarker>
      )}
    </>
  );
}
