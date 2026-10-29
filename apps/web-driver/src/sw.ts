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

// Nothing else is cached here: Firestore keeps its own copy in IndexedDB.

// "Reload" on the "A new version is ready" toast.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
