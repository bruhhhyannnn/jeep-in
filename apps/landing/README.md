# JEEP-IN landing page

Landing page for JEEP-IN, live jeepney tracking on the Laoag – Batac – Paoay route in Ilocos Norte. Built from the
"JEEPIN Landing Page" design in the JEEP-IN Tracking Wireframes Claude Design project.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4. The page is fully static.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

| Path                                                        | What                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/lib/site.ts`                                           | Contact details, the Formspree endpoint, and the pilot settings below     |
| `src/app/globals.css`                                       | Design tokens (colors, shadows, animations) from the hi-fi design system  |
| `src/app/page.tsx`                                          | Section order                                                             |
| `src/components/`                                           | One file per section; `jeep-layer.tsx` runs the moving jeeps on both maps |
| `src/assets/`                                               | Logo icon and banner                                                      |
| `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` | Favicon, home-screen icon and link preview image                          |

### Pilot settings

In `src/lib/site.ts`:

- `pilot.status`: `"open"` or `"full"`. Full switches the buttons and sign-up copy to the waitlist.
- `pilot.partner`: the cooperative running the pilot. While it's `null`, the hero hides the "Piloting with …" line.
- `pilot.animateJeeps`: turn the moving jeeps off. Visitors who prefer reduced motion never see movement.

## Sign-ups

The "Join the pilot" form posts to Formspree (`site.formspreeEndpoint`), which emails each sign-up. The role and the
mobile number or email are sent; an email address is also set as the reply-to.

## Deploying

Pushes to `main` deploy to production on Vercel once the GitHub repo is imported there. No environment variables are
needed. Vercel's production URL is used for the link preview image; set `NEXT_PUBLIC_SITE_URL` to override it, for
example after adding a custom domain.
