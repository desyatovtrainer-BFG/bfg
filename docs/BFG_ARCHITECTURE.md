# BFG Architecture

Practical architecture for a feature-oriented modular monolith built on Next.js 16 (App Router) + Supabase. Optimised for an MVP that must stay lightweight and scale gradually without rewrites.

> Companion documents:
> [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) ·
> [`BFG_DATABASE.md`](./BFG_DATABASE.md) ·
> [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) ·
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_UI_RULES.md`](./BFG_UI_RULES.md)

---

## 1. Architectural principles

- **Modular monolith.** One Next.js app. Many features. No microservices, no message buses.
- **Feature-oriented.** Each feature owns its types, queries, actions, UI. Cross-feature contracts only through public `index.ts`.
- **Thin backend (MVP).** Supabase is the database + auth + RLS. We only escape to Edge Functions when logic must not run on the client.
- **Server Components by default.** Client Components are an opt-in for interactivity, animation, and stores.
- **Server state ≠ client state.** TanStack Query owns server state. Zustand owns ephemeral client state. They never share a store.
- **Security as architecture.** RLS is the primary security boundary. The frontend is never trusted with progression. See [`BFG_SECURITY.md`](./BFG_SECURITY.md).
- **Avoid layers.** No "service layer", "repository layer", "DTO layer". Features map directly: SQL row → typed function → component prop.

---

## 2. Stack

| Concern              | Choice                                  | Reason                                          |
| -------------------- | --------------------------------------- | ----------------------------------------------- |
| Framework            | Next.js 16 (App Router)                 | Server Components, Server Actions, Edge runtime |
| Language             | TypeScript (strict)                     | Type safety, AI-readability                     |
| Styling              | Tailwind CSS v4                         | Utility-first, no CSS-in-JS                     |
| Animation            | Framer Motion                           | Mobile-friendly, declarative                    |
| Server state         | TanStack Query (to be added when needed)| Caching, mutations, optimistic UI               |
| Client state         | Zustand (to be added when needed)       | Tiny, ergonomic, no boilerplate                 |
| Auth + DB            | Supabase (Postgres + Auth + RLS)        | Single backend, fast iteration                  |
| Sensitive compute    | Supabase Edge Functions                 | Service-role secrets stay out of the client     |
| Video                | Kinescope                               | Works in Russia without VPN                     |
| Hosting              | Vercel                                  | First-class Next.js                             |

> TanStack Query and Zustand are not yet in `package.json`. They are the **mandated tools** when those needs arise; do not introduce alternatives.

---

## 3. Folder structure

Authoritative layout. New folders need a documented reason in [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md).

```
app/
  layout.tsx                     # Root layout (fonts, html shell)
  page.tsx                       # Public landing / redirect
  globals.css                    # Tailwind entry. Only global CSS allowed.
  login/, signup/                # Auth routes (public)
  (app)/                         # Authenticated app shell (route group)
    layout.tsx                   # Bottom nav, session guard
    dashboard/page.tsx
    workouts/page.tsx
    workouts/[id]/page.tsx
    quests/page.tsx
    companion/page.tsx         # voice-role of the unified presence
    progress/page.tsx
    avatar/page.tsx            # body-role of the unified presence
    profile/page.tsx
  components/<feature>/          # Feature-scoped React components
    <feature>-screen.tsx
    <feature>-card.tsx
    index.ts                     # Public surface of the component group
  components/ui/                 # Cross-feature, design-system primitives
    game-button.tsx, game-card.tsx, ...

lib/
  <feature>/                     # Domain logic per feature
    index.ts                     # Re-exports only the public surface
    types.ts                     # Cross-component types of this feature
    queries.ts                   # Read paths (RSC fetchers / TanStack Query)
    actions.ts                   # Server Actions ('use server')
    store.ts                     # Zustand store, only if necessary
    <pure>.ts                    # Pure domain helpers (calculateLevel, ...)
  supabase/                      # Server / browser / proxy Supabase clients
  auth/                          # getUser, server actions for auth
  shared/                        # Cross-feature non-domain helpers (rare)

supabase/
  migrations/NNNN_*.sql          # SQL, numbered, append-only
  functions/<name>/              # Edge Functions (when introduced)

docs/                            # This folder. Engineering source of truth.
proxy.ts                         # Next.js 16 "proxy" (replaces middleware)
next.config.ts
tsconfig.json
```

### Existing feature folders

- `lib/auth/` — session helpers, sign-in/sign-up actions
- `lib/supabase/` — server, browser, and proxy Supabase clients
- `lib/profile/` — BFG profile bootstrap (`ensureBfgProfile`)
- `lib/progression/` — XP, levels, streaks, avatar evolution, awardXp
- `lib/quests/` — daily quests, completion, today's progress
- `lib/workouts/` — workout catalog, exercises, completion, companion feedback
- `lib/companion/` — companion message builder, presentation logic
- `lib/subscription/` — trial + subscription state machine, access checks
- `lib/cosmetics/` — unlocked cosmetics, catalog

> `lib/progression/` owns the body state (avatar form, evolution stage). `lib/companion/` owns the voice. They govern two roles of one presence — `evolution_stage` in companion context is **self-knowledge**, not external data about a separate avatar.

---

## 4. Rendering and data flow

### 4.1 Default flow (server-first)

```
URL  →  Route Segment (Server Component)
        │
        ├── lib/<feature>/queries.ts  → Supabase (RLS) → typed rows
        │
        └── renders Server Components, passes typed props
              │
              └── Client Component (animation / interaction)
                    │
                    └── Server Action  → lib/<feature>/actions.ts
                                           → Supabase (RLS) → result
```

- Route segments are Server Components. They fetch with the server Supabase client.
- Client Components receive data as props or via TanStack Query (when we need cache + mutations).
- Mutations are **Server Actions** in `lib/<feature>/actions.ts`. Never call Supabase write APIs from the browser for sensitive writes.

### 4.2 When to use TanStack Query

Introduce TanStack Query when a screen needs:

- caching across navigations,
- optimistic updates (e.g. completing a quest),
- background refetch on focus.

Until then, server-render with `lib/<feature>/queries.ts` is enough. Don't add Query for static pages.

### 4.3 When to use Zustand

Introduce Zustand when:

- multiple unrelated components on the same screen share UI state (e.g. workout session timer + step index + modal),
- a state outlives a single component but is purely client-side.

Don't add Zustand to hold server data. That's TanStack Query's job.

---

## 5. Trust boundaries

```
┌────────────────────────────────────────────────────────────┐
│                  Browser (Client Components)               │
│  Trust: zero. Display only. No XP math. No auth decisions. │
└─────────────┬──────────────────────────────────────────────┘
              │ Server Action / RSC fetch
┌─────────────▼──────────────────────────────────────────────┐
│        Next.js Server (Node, edge for proxy.ts)            │
│  Trust: user-session-level. Reads `auth.uid()` via SSR     │
│  Supabase client. Calls awardXp, completeWorkout, etc.     │
└─────────────┬──────────────────────────────────────────────┘
              │ Supabase JS SDK (anon key + user JWT)
┌─────────────▼──────────────────────────────────────────────┐
│              Supabase (Postgres + RLS)                     │
│  Trust: enforces row-level policies. Source of truth.      │
└─────────────┬──────────────────────────────────────────────┘
              │ Edge Function call (only when needed)
┌─────────────▼──────────────────────────────────────────────┐
│  Supabase Edge Function (service role, server-only secrets)│
│  Trust: full DB access. Used for AI calls, payments,       │
│  webhook handlers, anti-cheat enforcement.                 │
└────────────────────────────────────────────────────────────┘
```

Rules:

- The anon key may live in the bundle. The service role key may not. See [`BFG_SECURITY.md`](./BFG_SECURITY.md).
- Server Components and Server Actions use the **user-bound SSR Supabase client**, not service-role.
- Edge Functions are the only place service-role keys may exist.

---

## 6. Authentication flow

- Supabase email/password (and OAuth providers later, RU-compatible only).
- `proxy.ts` (Next.js 16's `proxy`) refreshes the Supabase session cookie on every matching request. No authorization logic lives there — only cookie hygiene. See `proxy.ts`.
- Authorization is enforced where data lives: **RLS policies** + Server Actions that call `getUser()` before doing anything.
- `lib/auth/get-user.ts` is the single function to identify the current user on the server. Never re-implement.
- The `(app)` route group has a layout that asserts a session and redirects to `/login` otherwise.

---

## 7. Server Actions contract

Pattern, do not deviate:

```ts
'use server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { getUser } from '@/lib/auth';

export async function completeWorkoutAction(workoutId: string) {
  const user = await getUser();
  if (!user) return { data: null, error: 'unauthorized' };

  const supabase = await createSupabaseServerClient();
  // ...feature logic via lib/<feature>/...
  return { data, error: null };
}
```

Rules:

- One file per feature: `lib/<feature>/actions.ts`, with `'use server'` at the top.
- Always return `{ data, error }`. Never throw across the boundary unless we want a 500.
- Always re-check identity on the server. Never trust a userId from the client.
- Validate inputs with a small inline schema or hand-rolled checks. We do not mandate a schema lib at MVP; pick one (`zod`/`valibot`) when we need it across many actions.

---

## 8. Edge Functions (when to escape)

Use a Supabase Edge Function only when:

- the operation requires the **service role key** (privileged writes that RLS deliberately blocks),
- the operation calls a **third-party API with a secret** (AI provider, payment provider),
- the operation must **bypass user trust** entirely (e.g. anti-cheat correlation, recompute-from-history).

Not for:

- routine reads or writes that RLS already covers,
- "feels safer on the server" — Server Actions are already on the server.

Edge Function naming: `supabase/functions/<kebab-case>/index.ts`. One concern per function.

---

## 9. Caching and revalidation

- Server Component fetches are cached per request by default. Don't fight it.
- When a Server Action mutates user state, call `revalidatePath('/dashboard')` (or more targeted) instead of refetching by hand.
- Profile, XP, level: revalidate the screens that show them after any progression write.
- Workout catalog: cacheable across users (public read). Daily quests: per-user, per-day.

---

## 10. Error model

- All Server Actions and lib functions return `{ data, error }` (or `{ ok, value, error }`). No exceptions thrown across boundaries.
- UI shows a calm Russian message on `error`. Never expose Supabase error text raw.
- Log on server with the feature tag: `console.error('[awardXp] ...', error)`.
- Client never decides what's "fine to ignore". Server returns explicit `error: null` when intentional.

---

## 11. Internationalisation

- MVP is **Russian-only**. All UI copy is Russian. Companion phrases are Russian.
- We do not introduce an i18n library at MVP.
- When we add a second language, strings move into a flat dictionary per feature (`lib/<feature>/i18n.ts`). No external runtime libs unless necessary.

---

## 12. Performance budget

| Surface                            | Target                                |
| ---------------------------------- | ------------------------------------- |
| First contentful paint (4G, mid Android) | < 2.0s                          |
| Time to interactive on dashboard   | < 2.5s                                |
| JS shipped to client per route     | < 150KB gzipped (excluding fonts)     |
| Animation frame budget             | 16ms / 60fps on mid Android           |
| Image LCP element                  | Preloaded, correct `sizes`, no LCP > 2.5s |

Tools we will use when needed: Lighthouse mobile, `next build` analyzer, real device profiling. Premature optimization is forbidden, but we never ship visible jank.

---

## 13. Adding a new feature (recipe)

1. Define the database first. Add a migration in `supabase/migrations/NNNN_*.sql`. RLS from day one. See [`BFG_DATABASE.md`](./BFG_DATABASE.md).
2. Create `lib/<feature>/` with `types.ts`, `queries.ts` (if reads), `actions.ts` (if writes), `index.ts`.
3. Add Server Components in `app/(app)/<feature>/page.tsx` reading via `queries.ts`.
4. Add Client Components in `app/components/<feature>/` for interactive parts only.
5. Wire mutations through Server Actions, not browser-side Supabase writes.
6. If the logic is sensitive (progression, AI, payments) → move it behind an Edge Function.
7. Update relevant `docs/` files if the new feature changes architecture, security, or DB shape.

---

## 14. What we will not build (in MVP)

- No GraphQL layer. Supabase + typed functions is enough.
- No DDD / hexagonal layering. Direct mapping is enough.
- No event bus / pub-sub. We don't have cross-feature events that need it yet.
- No microservices. One Next app + Supabase covers the MVP and the next 6 months.
- No custom auth. Supabase Auth covers email + future OAuth.
- No client-side workers for progression. Server only.

When any of these stops being "not yet", it's a deliberate decision documented in [`BFG_ROADMAP.md`](./BFG_ROADMAP.md).
