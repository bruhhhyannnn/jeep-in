import mapboxgl from "mapbox-gl";
import { env } from "@/services/env";

mapboxgl.accessToken = env.VITE_MAPBOX_PUBLIC_KEY;
