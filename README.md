# SiteFlip

Find local businesses without websites, generate a premium site for them in about 90 seconds, and close the client.

SiteFlip is built for operators: freelancers and agencies who sell websites to local businesses.

## Quick start

```bash
npm install
cp .env.example .env.local   # all keys are optional in development
npm run dev
```

Open http://localhost:3000. With no keys set, the whole flow still works:

- **Business search** uses realistic, deterministic mock data. Set `GOOGLE_PLACES_API_KEY` to use the Google Places API (New).
- **Copy generation** uses a built-in offline copywriter that assembles copy from the business's real data. Set `ANTHROPIC_API_KEY` to have Claude write it. The default model is `claude-opus-5`; override it with `ANTHROPIC_MODEL`.
- **Billing** is a clearly labelled stub (see below).

`SESSION_SECRET` is required in production.

## The three flows

1. **First site:** landing → sign up → empty dashboard → find (niche + city) → results → generate (choose Legacy, Modern Service or Bold) → loading state → preview. Free-plan previews are watermarked and private.
2. **Upgrade:** preview → "Generate another site" → limit modal → pricing → checkout → dashboard with a Pro badge and no limit.
3. **Closing a client (Pro):** preview → export (download a static ZIP, or copy the live link) → draft outreach message → copy → dashboard → mark the lead as Contacted or Closed.

## Architecture

```
src/
  app/
    (main)/            App and marketing pages, with their own root layout and design tokens
      (auth)/          Login and signup
      (app)/           Signed-in pages: dashboard, find, generate, checkout
      preview/         Full-screen preview toolbar and iframe
    (site)/sites/      The generated sites: a separate root layout, so no app CSS leaks in
    api/sites/         Generate (POST), export ZIP, outreach draft
  actions/             Server actions: auth, lead status, billing
  lib/
    ai/                Claude prompts, structured outputs, error mapping, offline fallback
    places/            PlacesProvider interface with mock and Google implementations
    entitlements.ts    The single source of truth for plan gating
    db.ts              JSON-file store behind a small repository API
  templates/           Site templates and their registry
  proxy.ts             Optimistic auth redirects (Next 16's replacement for middleware)
```

### Tier gating

`User.plan` is the real flag. `entitlementsFor(user)` derives everything from it: generation limits, watermark, export, outreach. The server enforces it in route handlers. For example, a free user's export request gets a 403, and their site preview returns a 404 to anyone but them. The UI only reflects those answers.

A usage slot is reserved atomically before calling the AI and released if generation fails, so a failed attempt never costs the free generation.

### Templates

Each template is a server-compatible React component plus a `styles.css` scoped under its own class prefix. Motion comes in as a **motion kit**:

- On the live site, Framer Motion reveals and parallax (respecting `prefers-reduced-motion`).
- In exported code, dependency-free `data-*` hooks and about 30 lines of vanilla JS.

The same component therefore renders both the live preview and the downloadable static site.

To add a template, create `src/templates/<id>/`, register it in `src/templates/index.ts`, and import its stylesheet in `src/app/(site)/layout.tsx`.

### Swapping infrastructure

| Piece | Where to change it |
| --- | --- |
| Database | Reimplement the functions in `src/lib/db.ts` (Postgres, SQLite and so on) |
| Business data | Add a provider in `src/lib/places/` |
| Payments | Follow the Stripe steps in the comment at the top of `src/lib/billing.ts` |

## Scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build (includes type checking).
- `npm run lint` runs ESLint.
