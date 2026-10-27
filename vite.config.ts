import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({
      // Same as the native app's `experiments.reactCompiler`.
      babel: { plugins: ["babel-plugin-react-compiler"] },
    }),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      // The update toast asks before reloading (app/_layout.tsx).
      registerType: "prompt",
      injectRegister: false,
      manifest: {
        id: "/",
        name: "JEEP-IN",
        short_name: "JEEP-IN",
        description:
          "Live jeepneys, stops and fares on your route in Ilocos Norte. No account needed.",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        // Page colour from the tokens; background is the native splash colour.
        theme_color: "#eef4fb",
        background_color: "#edf9ff",
        categories: ["travel", "navigation"],
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,png,svg,otf,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // mapbox-gl alone is ~1.9 MB minified; it loads with the map screens.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, warn) {
        // zod's source comments mention @__PURE__ where Rollup can't use them; nothing to fix here.
        if (warning.code === "INVALID_ANNOTATION" && warning.id?.includes("/node_modules/zod/"))
          return;
        warn(warning);
      },
      output: {
        // Large libraries in their own files, so an app update doesn't re-download them.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("/mapbox-gl/")) return "mapbox";
          if (id.includes("/@firebase/") || id.includes("/firebase/")) return "firebase";
          if (id.includes("/@turf/")) return "turf";
          if (/\/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) return "react";
        },
      },
    },
  },
});
