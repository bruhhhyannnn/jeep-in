# JEEP-IN Driver (web)

The driver side of JEEP-IN as an installable web app (PWA). Drivers sign in with the email and password their manager made in the admin dashboard, then share their jeep's location with the commuters on their route.

Built from the high-fidelity driver screens in the JEEP-IN Claude Design project (`JEEPIN Driver App.dc.html`, 6b), on top of a port of the native app's driver screens (`apps/mobile-commuter/app/driver`). Phone only: drivers use their own phone in a mount.

## What it does

| Tab           | Screens                                                                                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GPS**       | The sharing switch and dial. Starting (a 4-step handshake that only says ON once the driver's own position comes back from the server), signal dropped, blocked by the browser, no unit yet, before shift, shift ended |
| **Direction** | "Which way now?": moves the jeep between the two directions' lists. Asks "Going back now?" at the last stop and switches by itself after leaving the terminal                                                          |
| **Report**    | Breakdown, road blocked, accident, heavy traffic or something else, with an optional note. Queued → Delivered → Seen, and "Take it back"                                                                               |
| **Profile**   | Today's assignment, the driver's record (read only), Display (Light, Dark, Match phone) and sign out                                                                                                                   |

Direction and Report lock while the jeep is moving ("Stop the jeep first"). Sharing starts by itself at the start of the route's working hours and stops at the end, with a one-tap 30 minutes of extra time.

## Setup

From the monorepo root (see the root README for Node and npm versions):

```bash
npm install
cp apps/web-driver/.env.example apps/web-driver/.env.local   # then fill in the values
npm run dev -w @jeep-in/web-driver                           # http://localhost:5174
```

The `.env.local` values are the same Firebase web config as `apps/web-commuter`. Never commit `.env.local`.

| Script (`-w @jeep-in/web-driver`) | Does                                                      |
| --------------------------------- | --------------------------------------------------------- |
| `npm run dev`                     | Dev server on http://localhost:5174                       |
| `npm run build`                   | Type check, then build to `dist/` with the service worker |
| `npm run preview`                 | Serve `dist/` on http://localhost:4174 (test the PWA)     |
| `npm run lint`                    | ESLint                                                    |
| `npm run typecheck`               | App, config and service worker                            |

## Layout

Folders follow `apps/web-commuter` and the native app, so a change in one is easy to find in the others.

- `app/` holds the screens at the native app's paths (`app/(auth)/login.tsx`, `app/driver/gps.tsx`, …). `app/routes.tsx` wires them into React Router: `/login`, `/driver/gps`, `/driver/direction`, `/driver/report`, `/driver/profile`, `/driver/display`.
- `src/components/ui` and `src/theme` re-export `@jeep-in/web-ui` (`packages/web-ui`), the UI kit shared with the commuter web app. The data model, readers, formatting and copy come from `@jeep-in/core`; `src/constants/strings.ts` overrides the copy that differs in a browser.
- `src/components/driver`: the dial, unit header, status strip, tab bar, end-of-route prompt and the "Stop the jeep first" card.
- `src/services/location/driverTracking.ts`: location sharing. `src/store/sharing.ts`: the handshake and motion state.
- `src/sw.ts`: the service worker.

## Data

| Collection         | The app                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `users`            | reads its own doc: only `role: "driver"` can sign in                                               |
| `drivers`          | reads its own doc; stamps `lastLocationUpdate`                                                     |
| `jeepneys`         | the unit where `assignedDriverId` is the driver                                                    |
| `routes`           | directions and working hours (the shift)                                                           |
| `stop_points`      | the stops of each direction (the end of the route, the place in "Commuters still see you at …")    |
| `driver_locations` | writes `lat`, `long`, `heading`, `speed`, `isSharing`, `updatedAt`, `directionId`, `overtimeUntil` |
| `driver_reports`   | creates reports; sets `status: "withdrawn"` on "Take it back"; reads its own report's `seenAt`     |

`firestore.rules` at the monorepo root allows exactly these; `npm run test:rules` checks them.

## Trying it without live data

With firebase-tools and Java installed, start the emulators from the monorepo root (`firebase emulators:start --only auth,firestore --project demo-jeep-in`, ports 9099 and 8080), add a driver to them, then run with `VITE_FIREBASE_EMULATORS=true` and `VITE_FIREBASE_PROJECT_ID=demo-jeep-in` in `.env.local`.

## Deploy (Vercel)

Import the `jeep-in` repo in Vercel with **Root Directory** `apps/web-driver` (framework: Vite). Vercel installs the whole workspace from the root lockfile. Add the six `VITE_FIREBASE_*` variables from `.env.example` under Settings → Environment Variables, then deploy. Without them the app stays on its loading screen. `vercel.json` sends every path to `index.html`, serves the page, `sw.js` and the manifest with `no-cache`, and caches hashed assets for a year.

## Differences from the native app and the hi-fi

- A browser only shares location while the page is on screen, so sharing keeps the screen awake and says so. A reload picks sharing back up.
- A blocked location permission can't be re-asked by a browser, so "Open phone settings" is "Try again" with the site-settings steps.
- Report tracks Queued → Delivered → Seen; the native driver screens don't yet.
- Not built yet: the voice note on Report (needs Firebase Storage and playback in the admin), and choosing a new password on first sign-in (`mustChangePassword`).
