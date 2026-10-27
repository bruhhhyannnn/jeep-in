import { useMemo } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import {
  CircleLayer,
  LineLayer,
  LocationPuck,
  MarkerView,
  ShapeSource,
  SymbolLayer,
} from "@rnmapbox/maps";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import type { LngLat } from "@/types";
import { ROUTES, STRINGS } from "@/constants";
import { useFleet, useTransit, useTrip } from "@/hooks";
import { measureOnPath, slicePath } from "@/lib/geo";
import { formatDistance } from "@/lib/format";
import { useLocationStore, useMapUi, usePreferences } from "@/store";
import { useTheme } from "@/theme";
import { ThemedText } from "@/components/ui";
import JeepMarker from "@/components/map/JeepMarker";
import StopCallout from "@/components/map/StopCallout";

const line = (coordinates: LngLat[]): Feature<LineString> => ({
  type: "Feature",
  properties: {},
  geometry: { type: "LineString", coordinates },
});

/**
 * The commuter map shows four things: you, jeeps, stops and the route.
 * Only the chosen direction is drawn.
 */
export default function CommuterMapLayers() {
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
  const permission = useLocationStore((s) => s.permission);
  const useMyLocation = usePreferences((s) => s.useMyLocation);

  const { direction, paths, stops } = transit;
  const path = direction ? (paths[direction.id] ?? []) : [];
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

  const focused =
    focusedStopId && focusedStopId !== trip.boarding?.id
      ? (stops.find((s) => s.id === focusedStopId) ?? null)
      : null;

  return (
    <>
      {path.length >= 2 && (
        <ShapeSource id="route" shape={line(path)}>
          <LineLayer
            id="route-line"
            style={{
              lineColor: colors.mapRoute,
              lineWidth: 5,
              lineOpacity: 0.85,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        </ShapeSource>
      )}

      {highlight.length >= 2 && (
        <ShapeSource id="jeep-to-stop" shape={line(highlight)}>
          <LineLayer
            id="jeep-to-stop-line"
            aboveLayerID="route-line"
            style={{ lineColor: colors.accent, lineWidth: 7, lineCap: "round", lineJoin: "round" }}
          />
        </ShapeSource>
      )}

      {walk && (
        <ShapeSource id="walk" shape={line(walk)}>
          <LineLayer
            id="walk-line"
            style={{
              lineColor: colors.action,
              lineWidth: 4,
              lineCap: "round",
              lineDasharray: [0, 2],
            }}
          />
        </ShapeSource>
      )}

      <ShapeSource
        id="stops"
        shape={stopShapes}
        hitbox={{ width: 28, height: 28 }}
        onPress={(e) => {
          const id = e.features[0]?.properties?.id;
          if (typeof id === "string") router.push(ROUTES.commuter.stop(id));
        }}
      >
        <CircleLayer
          id="stop-dots"
          style={{
            circleRadius: ["match", ["get", "kind"], "stop", 5, 8],
            circleColor: ["match", ["get", "kind"], "focused", colors.mapRoute, colors.mapStopFill],
            circleStrokeColor: [
              "match",
              ["get", "kind"],
              "stop",
              colors.mapStopRing,
              "focused",
              colors.mapStopFill,
              colors.action,
            ],
            circleStrokeWidth: ["match", ["get", "kind"], "stop", 2.5, 3.5],
            circlePitchAlignment: "map",
          }}
        />
        <SymbolLayer
          id="stop-labels"
          minZoomLevel={14}
          filter={["==", ["get", "kind"], "stop"]}
          style={{
            textField: ["get", "name"],
            textSize: 11,
            textColor: colors.muted,
            textHaloColor: colors.mapLabelHalo,
            textHaloWidth: 1.5,
            textAnchor: "top",
            textOffset: [0, 0.9],
            textOptional: true,
          }}
        />
      </ShapeSource>

      {trip.boarding && (
        <MarkerView
          coordinate={[trip.boarding.long, trip.boarding.lat]}
          anchor={{ x: 0.5, y: 1 }}
          allowOverlap
        >
          <StopCallout
            variant={trip.boardingSource === "nearest" ? "suggested" : "chosen"}
            eyebrow={
              trip.boardingSource === "nearest" && trip.walkKm != null
                ? STRINGS.commuter.map.nearestStop(formatDistance(trip.walkKm))
                : STRINGS.commuter.map.yourStop
            }
            name={trip.boarding.name}
          />
        </MarkerView>
      )}

      {focused && (
        <MarkerView coordinate={[focused.long, focused.lat]} anchor={{ x: 0.5, y: 1 }} allowOverlap>
          <StopCallout variant="chosen" eyebrow={STRINGS.commuter.map.stop} name={focused.name} />
        </MarkerView>
      )}

      {trip.alighting && (
        <MarkerView
          coordinate={[trip.alighting.long, trip.alighting.lat]}
          anchor={{ x: 0.5, y: 0.5 }}
          allowOverlap
        >
          <View className="h-4 w-4 rounded-[4px] border-[3px] border-action bg-card" />
        </MarkerView>
      )}

      {visibleJeeps.map((j) => (
        <MarkerView key={j.id} coordinate={j.position} anchor={{ x: 0.5, y: 0.5 }} allowOverlap>
          <JeepMarker
            unit={j.unit}
            state={j.stale || offline ? "stale" : j.directionId == null ? "unknown" : "live"}
            selected={j.id === selectedJeepId}
            onPress={() => router.push(ROUTES.commuter.jeepney(j.id))}
          />
        </MarkerView>
      ))}

      {selected && selectedJeepBadge && (
        <MarkerView coordinate={selected.position} anchor={{ x: 0, y: 0.5 }} allowOverlap>
          <View className="ml-[34px] rounded-full bg-navy-900 px-2.5 py-1">
            <ThemedText variant="dataSm" tone="onInverse">
              {selectedJeepBadge}
            </ThemedText>
          </View>
        </MarkerView>
      )}

      {useMyLocation && permission === "granted" && (
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true, color: colors.action, radius: "accuracy" }}
        />
      )}
    </>
  );
}
