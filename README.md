# JEEP-IN

Live jeepney tracking for Ilocos Norte: commuters see jeeps, stops and fares; drivers share their location; operators manage the fleet. Every JEEP-IN app lives in this one repo so they share one data model, one design system and the same tooling.

## Apps

| Folder                 | Package                    | What                                                   | Stack                 |
| ---------------------- | -------------------------- | ------------------------------------------------------ | --------------------- |
| `apps/mobile-commuter` | `@jeep-in/mobile-commuter` | Commuter app (Android / iOS)                           | Expo 54, React Native |
| `apps/web-commuter`    | `@jeep-in/web-commuter`    | Commuter app as an installable web app (PWA)           | Vite, React           |
| `apps/admin`           | `@jeep-in/admin`           | Admin and super admin dashboard (UI changes with role) | Next.js 16            |
| `apps/landing`         | `@jeep-in/landing`         | Public landing page                                    | Next.js 16            |

Planned: `apps/mobile-driver` (driver app) and `apps/web-driver` (driver PWA for testing).

## Packages

Planned, in this order:

- `packages/tokens` — colours, type roles, radii and shadows: a Tailwind preset plus JS values.
- `packages/core` — the Firestore data model (zod schemas and types), the readers that normalize documents, and the fare, arrival, geo, format and search logic.
- `packages/config` — shared TypeScript, ESLint and Prettier settings.

## Getting started

Node 22.13 or later, npm 11.

```bash
npm install          # once, at the repo root — installs every app
npm run dev -w @jeep-in/web-commuter
npm run dev -w @jeep-in/admin
npm run start -w @jeep-in/mobile-commuter   # Expo
```

Each app keeps its own env file (never committed); see its `.env.example` / `.env.local.example`:

| App               | File                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `mobile-commuter` | `apps/mobile-commuter/.env.local` (`EXPO_PUBLIC_*`)                     |
| `web-commuter`    | `apps/web-commuter/.env.local` (`VITE_*`)                               |
| `admin`           | `apps/admin/.env.local` and `apps/admin/scripts/serviceAccountKey.json` |
| `landing`         | none yet                                                                |

## Checks

Turborepo runs the same task in every app that has it:

```bash
npm run typecheck
npm run lint
npm run build
```

The pre-commit hook type-checks the apps a commit touches.

## Conventions

- React is pinned to the version Expo needs (19.1.0) in every app: two copies of React break React Native.
- Commits: `type(scope): Sentence-case summary`, e.g. `feat(fare): Add the stop picker`.
- Each app's history before the move is kept: `git log` inside an app's folder shows it.
