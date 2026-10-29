# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JEEP-IN Admin Dashboard** — a Next.js 16 web admin portal for managing a jeepney fleet tracking system. Admins and super admins manage routes, organizations, jeepneys, drivers, stop points and fare guides, and read the reports drivers send (Alerts). Real-time GPS tracking of drivers is displayed on a MapLibre map. It lives in the `jeep-in` monorepo as `apps/admin`, next to the commuter apps (`apps/mobile-commuter`, `apps/web-commuter`) and the landing page.

## Commands

Run from the monorepo root:

```bash
npm run dev -w @jeep-in/admin         # Start dev server (Turbopack)
npm run build -w @jeep-in/admin       # Production build
npm run lint -w @jeep-in/admin        # ESLint on src/ and scripts/
npm run typecheck -w @jeep-in/admin   # next typegen + tsc
npm test                              # Tests for the shared logic in packages/core
```

Data scripts live in `scripts/` (run with `npx tsx scripts/<name>.ts` from `apps/admin`). Back up with `backup-collections.ts` before any script that writes.

## Architecture

### Stack

- **Next.js 15 App Router** with TypeScript, Tailwind CSS v4, Shadcn UI (Radix primitives)
- **Firebase**: client SDK (`src/lib/firebase.ts`) for auth + realtime; Admin SDK (`src/lib/firebase-admin.ts`) for server-side Firestore writes — never import admin in client components
- **TanStack Query v5** for all server state; **Zustand v5** for client-only state (auth, sidebar, theme)
- **React Hook Form + Zod** for all forms and validation
- **MapLibre GL** for the real-time driver GPS map

### Auth Flow

1. Client signs in via Firebase Auth (email/password)
2. ID token is sent to `POST /api/auth/session` → verified by Admin SDK → sets `jeep-in-session` cookie (5-day, httpOnly)
3. Edge middleware at `src/proxy.ts` (not `middleware.ts`) redirects pages to sign-in when the cookie is missing. It only checks that the cookie exists; the server actions verify it (below)
4. Roles live as Firebase custom claims: `super_admin`, `admin`, `driver`, `commuter`
5. Only `admin` and `super_admin` can create sessions in this app

### Role Hierarchy

- **super_admin**: manages all organizations and routes; sees all data across orgs
- **admin**: scoped to their own organization; manages jeepneys, drivers, fare guides
- **driver / commuter**: the commuter and driver apps only; cannot access this admin portal

### Data Layer Pattern

Every resource follows the same pattern:

- `src/actions/<resource>.ts` — `'use server'` functions calling Admin SDK directly. **Every action starts with a check from `src/lib/caller.ts`**: `requireSuperAdmin()` for organizations, routes and admin accounts; otherwise `requireCaller()` plus `assertOrg` / `assertOrgOf` / `assertRoute`, so an admin only reaches their own organization and its route. Anyone can post to a server action, and the Admin SDK skips the Firestore rules, so an action without a check is open to the internet
- `src/hooks/use-<resource>.ts` — TanStack Query wrappers (`useQuery` + `useMutation`) that call the server actions
- Pages import hooks only; pages never call server actions directly

### Firestore Collections

Routes, stops, fares, jeepneys, drivers and driver reports follow the data model every app shares, in `packages/core/src/model.ts`. Read documents through its readers (`normalizeRoute`, `normalizeStopPoint`, `normalizeDriverReport`, … in `@jeep-in/core/documents`) so older documents still load.

| Collection         | Key fields                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `routes`           | name, description, vehicleClass, averageSpeedKph, directions[] `{ id, label, via[], path? }`, isActive, workingHours {start, end}                                                          |
| `organizations`    | name, shortName (used as doc ID), routeId, isActive                                                                                                                                        |
| `admins`           | uid (doc ID), organizationId, firstName, lastName, isActive                                                                                                                                |
| `drivers`          | uid (doc ID), organizationId, routeId, firstName, lastName, employeeId, role (main / reliever), phone, licenseNo, licenseExpiry, assignedJeepneyId, mustChangePassword, lastLocationUpdate |
| `jeepneys`         | plateNumber, jeepneyNumber, seats, organizationId, routeId, assignedDriverId, isActive                                                                                                     |
| `stop_points`      | name, address, landmark, description, amenities[], routeId, directionId, order (1-based per direction), lat, long, isActive                                                                |
| `fare_matrices`    | routeId, vehicleClass, orderNo, issuedBy, effectiveDate, baseFare, baseKm, perKm, discountRate, roundTo, discountRoundTo, table[] `{ km, landmark, regular, discounted }`                  |
| `driver_reports`   | driverId, jeepneyId, unit, reason, note, lat, long, directionId, status (sent / withdrawn), createdAt. Written by the driver app; no organizationId, so the admin finds them by jeepneyId  |
| `audit_logs`       | actorId, actorRole, action, targetType, targetId, organizationId                                                                                                                           |
| `users`            | uid, email, role, displayName, isActive (mirror of auth claims)                                                                                                                            |
| `driver_locations` | driverId, lat, long, heading, speed, directionId, isSharing, updatedAt                                                                                                                     |

`fare_guide` is retired: the posted fares are the `table` of the route's fare matrix (the admin's Fare guide page edits it).

`organizations` uses `shortName.toUpperCase()` as the Firestore document ID (not an auto-ID).
`admins` and `drivers` use their Firebase Auth UID as the document ID.

### Cascade Deletion Rules

- **deleteOrganization**: deletes jeepneys, audit_logs, admins (+users docs), drivers (+users docs), then the org doc; Firebase Auth accounts deleted after batch
- **deleteRoute**: deletes stop_points, fare matrices (and any leftover fare_guide entries), drivers (+users docs), route doc; organizations referencing the route get `routeId: null` (unassigned, not deleted); Firebase Auth accounts deleted after batch

### Key Utilities (`src/lib/utils.ts`)

- `serializeDoc<T>()` — strips Firestore Timestamp `.toJSON` methods before passing data across the server→client boundary; always use this in server actions
- `toDate(value)` — safely converts Timestamp, plain `{seconds, nanoseconds}`, or `Date` to a JS `Date`
- `cn()` — clsx + tailwind-merge for conditional class names

### Path Alias

`@/*` maps to `src/*` — use this for all internal imports.

## Environment Variables

Copy `.env.local.example` to `.env.local`. Required vars:

```
# Firebase Client (public — safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (server only — never expose to client)
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY   # escape newlines as \\n in the .env file
```

### Firestore Rules

The browser side (this app's sign-in, the commuter and driver apps) is limited by `firestore.rules` at the monorepo root: public reads of routes, stops, fares, units and positions; drivers write only their own position and reports; everything else goes through the server actions. Check changes with `npm run test:rules` (monorepo root, Firestore emulator) and deploy with `npx tsx scripts/deploy-firestore-rules.ts --deploy`.

## Important Conventions

- All Firestore writes in server actions use `FieldValue.serverTimestamp()` for `updatedAt` and `Timestamp.now()` for `createdAt`
- Firestore batch writes cap at 500 ops; Firebase Auth deletions must happen **outside** the batch (separate API)
- TanStack Query keys follow the pattern `['resource']` for lists and `['resource', id]` for single items. Mutation `onSuccess` must invalidate all query keys affected by cascade side effects.
- A route's `directions` drive the stop point direction options. Show a direction by its `label` (`directionLabel()` in `src/lib/utils.ts`); stops point to it through `directionId`. Mid-sentence, use `inSentence()` from `@jeep-in/core/format` so place names keep their capitals.
- Saving or deleting a stop renumbers the rest of its direction so `order` stays 1, 2, 3…; the Reorder panel on Stop points saves a whole direction's order at once.
- `src/proxy.ts` is the Edge middleware file (Next.js config points to it); do not create `middleware.ts`
