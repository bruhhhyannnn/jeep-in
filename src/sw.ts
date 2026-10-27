/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

// The app shell, fonts and images, listed by vite-plugin-pwa at build time.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Every screen is the same page (single-page app), so it opens with no signal.
registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));

// Nothing else is cached here: Mapbox tiles and API responses only get the
// browser's own HTTP cache (Mapbox terms), and Firestore keeps its own copy.

// "Reload" on the "A new version is ready" toast.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// Tapping an arrival alert brings JEEP-IN back, reusing an open window.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (open) return open.focus();
      return self.clients.openWindow("/");
    })(),
  );
});
