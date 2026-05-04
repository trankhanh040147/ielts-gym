# Platform Strategy Design: Web + App

Date: 2026-05-01

## Decision

Release on both Web and iOS/Android App using a single Next.js 16 codebase with Capacitor.

Platform rollout:
- **Week 1:** Web only (Vercel). App infrastructure prepared but not shipped.
- **Week 2+:** Capacitor app submitted to App Store / Google Play.
- **After Week 1:** Migrate to monorepo with separate backend (Option B) when traffic or platform requirements demand it.

## Week 1 Architecture (Option A — Next.js Dual-Mode)

One codebase, two build outputs:

**Web build** (Vercel):
- `next build` with API routes active
- Deployed to Vercel; API routes run as serverless functions
- Gemini API key stays server-side

**App build** (Capacitor):
- `next build` with `output: 'export'` → static HTML/JS bundle
- `npx cap sync` → Xcode / Android Studio
- API calls point to `NEXT_PUBLIC_API_URL` (the Vercel deployment URL)
- All Gemini calls still go through the Vercel-hosted API routes

```
┌─────────────────────────────────────────┐
│           Next.js 16 Codebase           │
│                                         │
│  /app/page.tsx (client)                 │
│  /app/api/**  (server — Vercel only)    │
│  /components/                           │
│  /lib/                                  │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
  next build       next build
  (standard)    (output: export)
     │                │
  Vercel         cap sync
  (Web)          │
                 ├── Xcode → App Store
                 └── Android Studio → Play Store
```

## Stack Changes From Day 2 Spec

| Item | Change |
|---|---|
| `NEXT_PUBLIC_API_URL` env var | Added — empty string for web, Vercel URL for app build |
| API fetch calls | Use `${process.env.NEXT_PUBLIC_API_URL}/api/...` instead of `/api/...` |
| `next.config.ts` | Add `output: 'export'` conditional on `BUILD_TARGET=app` env var |
| Capacitor packages | `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android` |

No UI changes. shadcn/ui and Tailwind work identically in Capacitor WebView.

## Week 2+ Migration Path (Option B)

When migrating to a separate backend:
1. Extract `/app/api/**` into a standalone Hono or Express service
2. Deploy backend to Railway / Render / Fly.io
3. Update `NEXT_PUBLIC_API_URL` to point to new backend
4. Frontend code requires zero changes

The `NEXT_PUBLIC_API_URL` abstraction in Week 1 makes this migration a one-line env var change on the frontend.

## Out of Scope for Week 1

- Capacitor native plugins (camera, push notifications, biometrics)
- App Store submission and review process
- Deep linking, splash screens, app icons
- Offline mode

## Success Criteria

- Web app deploys and runs on Vercel
- Capacitor project initialised and syncs without errors
- Static export builds successfully with `BUILD_TARGET=app`
- API calls in app build resolve to Vercel URL correctly
