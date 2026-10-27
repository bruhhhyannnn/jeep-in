import "mapbox-gl/dist/mapbox-gl.css";
import "@/services/mapbox/config";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { useMap } from "@/store";
import { useTheme } from "@/theme";
import type { CameraPadding, LngLat } from "@/types";
import { CommuterMapLayers } from "@/components/map/layers";

const DEFAULT_CENTER: LngLat = [120.548662, 18.059751];

// What rnmapbox's Mapbox.StyleURL.Light / Dark resolve to.
const STYLE_URL = {
  light: "mapbox://styles/mapbox/light-v10",
  dark: "mapbox://styles/mapbox/dark-v10",
};

const toPadding = (p: number | CameraPadding) =>
  typeof p === "number" ? { top: p, right: p, bottom: p, left: p } : p;

const MapboxMap = () => {
  const mapRef = useMap();
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [instance, setInstance] = useState<mapboxgl.Map | null>(null);
  /** Bumped on every style load, so the layers add their sources again. */
  const [styleVersion, setStyleVersion] = useState(0);
  const initialStyle = useRef(isDark ? STYLE_URL.dark : STYLE_URL.light);

  useEffect(() => {
    const m = new mapboxgl.Map({
      container: containerRef.current!,
      style: initialStyle.current,
      center: DEFAULT_CENTER,
      zoom: 13,
      // No pitch and no compass, as in the native app.
      pitchWithRotate: false,
      touchPitch: false,
      maxPitch: 0,
      attributionControl: false,
      // Kept clear of the bottom sheets (moved below the top controls in app/global.css).
      logoPosition: "top-left",
    });
    m.addControl(new mapboxgl.AttributionControl({ compact: true }), "top-left");
    m.on("style.load", () => setStyleVersion((v) => v + 1));
    m.on("error", (e) => console.warn("Map error:", e.error?.message ?? e));
    setInstance(m);

    return () => {
      setInstance(null);
      m.remove();
    };
  }, []);

  // Light and Dark use different Mapbox styles; the layers are added back on style.load.
  useEffect(() => {
    const url = isDark ? STYLE_URL.dark : STYLE_URL.light;
    if (!instance || initialStyle.current === url) return;
    initialStyle.current = url;
    instance.setStyle(url);
  }, [instance, isDark]);

  // Expose camera controls to screens through the map context.
  useEffect(() => {
    if (!instance) return;
    mapRef.current = {
      ...mapRef.current,
      flyTo: (coords, { duration = 1200, zoom = 16, bottomInset = 0 } = {}) => {
        // Shift the centre up by half the sheet, so the point lands in the visible map.
        instance.flyTo({ center: coords, zoom, duration, offset: [0, -bottomInset / 2] });
      },

      fitBounds: (sw, ne, padding = 48) => {
        instance.fitBounds([sw, ne], { padding: toPadding(padding), duration: 700 });
      },

      zoomInAt: (coords, zoomIncrement = 1.5) => {
        instance.easeTo({
          center: coords,
          zoom: instance.getZoom() + zoomIncrement,
          duration: 300,
        });
      },
    };
  }, [instance, mapRef]);

  // mapbox-gl.css makes its container position: relative, so it fills a positioned wrapper.
  return (
    <div className="absolute inset-0">
      <div ref={containerRef} className="jeepin-map h-full w-full">
        {instance && styleVersion > 0 && (
          <CommuterMapLayers map={instance} styleVersion={styleVersion} />
        )}
      </div>
    </div>
  );
};

export default MapboxMap;
