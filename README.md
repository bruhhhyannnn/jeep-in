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

| Folder            | Package           | What                                                                                                                                    |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/config` | `@jeep-in/config` | Shared ESLint (`base`, `react`, `reactNative`), Prettier and TypeScript settings                                                        |
| `packages/tokens` | `@jeep-in/tokens` | The commuter design tokens (colours, type roles, radii, shadows, layout) as JS values, plus the generated Tailwind v3 preset            |
| `packages/core`   | `@jeep-in/core`   | The data model, the readers that turn Firestore documents into it, the fare, fleet, geo, format and search logic, and the commuter copy |

Packages ship TypeScript source; each app's bundler compiles it. The commuter apps still import through their own paths (`@/lib/fare`, `@/types`), which re-export the package.

### Shared logic

`packages/core` is plain TypeScript with no Firebase or React dependency, so every app (and the admin's server code) can use it. The readers in `documents.ts` take a document's fields, fill in defaults, and accept the older field names still in Firestore (`latitude`/`longitude`, `routeDirection`, directions stored as labels). Its tests run with `npm test`.

### Design tokens

`packages/tokens/src/index.ts` is the only place to change a colour, shadow, radius or font. After editing it, run:

```bash
npm run tokens
```

This rewrites `packages/tokens/tailwind-preset.cjs` and the generated block of CSS variables in each commuter app's `app/global.css` (NativeWind can't import CSS from a package, so each app keeps its own copy). `npm run lint` fails if any of them is out of date.

The admin and landing apps still use their own Tailwind v4 themes.

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
npm test
npm run build
```

The pre-commit hook type-checks the apps a commit touches.

## Conventions

- React is pinned to the version Expo needs (19.1.0) in every app: two copies of React break React Native.
- Commits: `type(scope): Sentence-case summary`, e.g. `feat(fare): Add the stop picker`.
- Each app's history before the move is kept: `git log` inside an app's folder shows it.
