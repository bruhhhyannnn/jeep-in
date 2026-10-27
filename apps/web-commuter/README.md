# JEEP-IN Web

The commuter side of [JEEP-IN](https://github.com/bruhhhyannnn/JEEP-IN-2.0) as an installable web app (PWA): live jeepneys for your direction, stops, fares from the posted LTFRB matrix, "Notify me at 3 min" alerts, offline fares and last-known positions, Light / Dark / Match phone and three text sizes.

It is a parity port of the native Expo app: same screens, copy, data and logic. The driver side is not part of it, and commuters have no account.

## Tech stack

- **Frontend:** React 19 + TypeScript + Vite, React Router
- **Styling:** Tailwind CSS (the native app's tokens and config)
- **Database:** Firebase Firestore (read-only, persistent offline cache)
- **Maps:** mapbox-gl JS
- **State:** Zustand, TanStack Query
- **PWA:** vite-plugin-pwa (Workbox)

## Setup

Node 22.13 or later (ESLint 10's minimum).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The `.env.local` values are the native app's `EXPO_PUBLIC_*` values under `VITE_*` names. Never commit `.env.local`.

| Script              | Does                                                       |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Dev server on http://localhost:5173                        |
| `npm run build`     | Type check, then build to `dist/` with the service worker  |
| `npm run preview`   | Serve `dist/` on http://localhost:4173 (test the PWA here) |
| `npm run lint`      | ESLint + Prettier                                          |
| `npm run typecheck` | App, config and service worker                             |

## Layout

Folders and file names follow the native app, so a change in one is easy to find in the other.

- `app/` holds the screens at the same paths as the native expo-router files (`app/(map)/(commuter)/home/index.tsx`, …). `app/routes.tsx` wires them into React Router; URLs match expo-router's (`/home`, `/stops`, `/jeepney/:id`, `/settings`, …).
- `src/api`, `src/lib`, `src/hooks`, `src/store`, `src/types`, `src/constants`, `src/theme`, `src/components/{commuter,map,ui,settings,onboarding}` hold the same modules. `src/lib` is copied unchanged.

Web-only pieces:

- `src/components/ui/View.tsx` and `Pressable.tsx`: React Native's View / Pressable (layout defaults, accessibility props mapped to ARIA), so ported markup reads the same.
- `src/lib/router.ts`: expo-router's `router.push / replace / back`, `usePathname`, `useLocalSearchParams`.
- `src/theme/document.ts`: applies Appearance (`dark` class on `<html>`, browser theme colour) and Text size (`--text-scale`).
- `src/components/ui/Sheet.tsx`: the map sheets (snap points, pinned footer; the map stays pannable).
- `src/sw.ts`: the service worker. `src/store/install.ts`: the install prompt.

## Development helpers

These exist in `npm run dev` only:

- `/dev/ui-kit`: every UI kit component, to check against the design in both themes and all text sizes.
- `localStorage.setItem("jeepin-dev-route", "<route id>")`: picks a route by id instead of the first active one, e.g. while a test route is active in Firestore.

## Deploy (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` rewrites every path to `index.html`, serves the page and `sw.js` with `no-cache`, and caches hashed assets for a year.

Before the first deploy, add the hosting domain (and `http://localhost:5173` for development) to the Mapbox public token's allowed URLs.

## Differences from the native app

- Arrival alerts fire only while the app is open (no push server), as natively. On iPhone they need the app on the Home Screen (iOS 16.4+).
- A blocked location or notification permission can't be re-asked by a browser; the app says to allow it in the site settings instead of opening phone settings.
- The location dot's direction comes from GPS while moving (no compass prompt).
- Stop documents' `latitude` / `longitude` fields are read as a fallback for `lat` / `long`.
