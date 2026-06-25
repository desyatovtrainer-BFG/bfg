# BFG Engineering Rules

Engineering contract for every contributor and every Cursor agent working in this repo.
These rules override personal preference. If a rule conflicts with "how I usually do it" — the rule wins.

> Companion documents:
> [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) ·
> [`BFG_DATABASE.md`](./BFG_DATABASE.md) ·
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_UI_RULES.md`](./BFG_UI_RULES.md) ·
> [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md)

---

## 1. Core philosophy

- **Ship the emotional loop, not infrastructure.** Every PR must serve the user-facing loop (workout → XP → avatar → companion → return).
- **Feature-oriented modular monolith.** One feature = one folder under `lib/<feature>` + `app/components/<feature>`.
- **Readability over cleverness.** If the reader needs 30s to understand a function, it is wrong.
- **AI-readability is a feature.** Files are read by Cursor agents far more often than by humans. Optimize naming, locality, and file size for context windows.
- **Avoid premature anything.** No premature abstractions, no premature optimization, no premature enterprise patterns.

---

## 2. Hard prohibitions

These are non-negotiable. A PR that violates any of them must be rejected or rewritten.

- ❌ No `any` in committed TypeScript. Use `unknown` + narrowing, or define a type.
- ❌ No `// @ts-ignore` / `// @ts-expect-error` without a one-line justification.
- ❌ No `useEffect` to fetch server data. Use Server Components or TanStack Query.
- ❌ No `useState` for data that came from the server. Use TanStack Query cache.
- ❌ No client-side calculation of XP, level, evolution stage, or streak. Server only. See [`BFG_SECURITY.md`](./BFG_SECURITY.md).
- ❌ No raw `fetch('/api/...')` from components when a Server Action or RSC fetch fits.
- ❌ No global CSS beyond `app/globals.css`. Tailwind utility classes only.
- ❌ No CSS-in-JS libraries (styled-components, emotion). Tailwind only.
- ❌ No new state libraries (Redux, Jotai, Recoil, MobX). Zustand + TanStack Query is the contract.
- ❌ No new HTTP client (axios, ky). `fetch` or Supabase SDK only.
- ❌ No `dangerouslySetInnerHTML` without an inline justification comment.
- ❌ No barrel files re-exporting more than one feature. `lib/<feature>/index.ts` may only re-export from that feature.
- ❌ No "utils" or "helpers" dump folders. A util belongs to a feature or to `lib/shared/<purpose>.ts`.
- ❌ No commits with `console.log` left for debugging. `console.error` / `console.warn` are allowed for real errors.
- ❌ No external SDKs that fail in Russia without VPN (Stripe-only flows, Google Analytics, YouTube embeds, Cloudflare Turnstile in certain regions). See §10.
- ❌ No service-role keys in client code, server components, or server actions. Edge Functions only. See [`BFG_SECURITY.md`](./BFG_SECURITY.md).

---

## 3. TypeScript rules

- `strict: true` always. Never weaken `tsconfig.json`.
- Prefer `type` over `interface` for data shapes. `interface` only for class contracts.
- Return types are required on exported functions in `lib/`.
- Discriminated unions for all polymorphic results (`{ ok: true; value } | { ok: false; error }` or `{ data, error }`).
- No enums. Use string literal unions: `type Difficulty = 'easy' | 'medium' | 'hard'`.
- No default exports for components or modules. Named exports only. Exception: a Next.js route file (`page.tsx`, `layout.tsx`, `proxy.ts`) — Next.js requires default.

---

## 4. React / Next.js rules

- **Server Components by default.** A file becomes a Client Component only when it needs state, effects, browser APIs, or animation hooks.
- `'use client'` must be at the **top of the smallest possible file**. Push it down the tree.
- No data fetching in client components. Pass data in from a server component or use TanStack Query.
- Suspense boundaries live in route segments (`loading.tsx`) or feature shells, not deep inside components.
- Server Actions go in `lib/<feature>/actions.ts`, marked `'use server'` at the top of the file.
- One component per file. File name = component name (kebab-case file, PascalCase symbol): `quest-card.tsx` exports `QuestCard`.
- Components above ~200 lines must be split. Hard ceiling: 300 lines.
- Co-locate component-only types in the same file. Cross-component types go to `lib/<feature>/types.ts`.

---

## 5. State management rules

| Kind of state                | Tool                      | Lives in                 |
| ---------------------------- | ------------------------- | ------------------------ |
| Server data (profile, XP, quests, workouts) | TanStack Query | `lib/<feature>/queries.ts` |
| Cross-screen UI state (modals, onboarding step, theme) | Zustand store | `lib/<feature>/store.ts` |
| One-screen local UI state    | `useState` / `useReducer` | inside the component     |
| URL state (filters, tab, id) | `searchParams` / route segment | the route itself     |
| Form input                   | uncontrolled `<form>` + Server Action | the form file |

Rules:

- **Server state and client state never mix in the same store.** No "user slice" with both XP and modal flags.
- Zustand stores are small, feature-scoped, and never imported across unrelated features.
- TanStack Query keys are typed and exported from `queries.ts`. No string keys scattered in components.

---

## 6. File and folder layout

Authoritative layout (see [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) for the full tree):

```
app/                # Routes, layouts, route-scoped server code
  (app)/            # Authenticated app shell
  components/<feat>/ # Feature-scoped components
lib/<feature>/      # Feature domain logic
  index.ts          # Public surface of the feature (thin)
  types.ts          # Shared types
  queries.ts        # TanStack Query keys + fetchers
  actions.ts        # Server Actions
  store.ts          # Zustand store (only if needed)
supabase/migrations/ # SQL migrations, numbered
docs/               # This folder. Engineering source of truth.
```

- A feature folder never imports from another feature's internal files. Only via that feature's `index.ts`.
- Cross-cutting code (Supabase clients, auth helpers) lives under `lib/supabase`, `lib/auth`. Treated as platform.
- New top-level folders need a documented reason in this file before merging.

---

## 7. Naming

- Files: `kebab-case.ts` / `kebab-case.tsx`. SQL migrations: `NNNN_short_snake_case.sql`.
- React components: `PascalCase`.
- Functions, variables: `camelCase`.
- Types: `PascalCase`. Type aliases for unions are still `PascalCase`.
- Booleans: `is*`, `has*`, `can*`, `should*`.
- Server Actions: verbs in the imperative — `awardXp`, `completeWorkout`, `claimDailyQuest`.
- Query keys: `['feature', 'entity', ...params]` — e.g. `['workouts', 'detail', id]`.

---

## 8. Comments and JSDoc

- Comments explain **why**, never **what**. The code already says what.
- Every exported function in `lib/` whose behaviour is non-trivial gets a short JSDoc block: invariants, side effects, RLS expectations.
- Mark each Server Action file with a top-of-file comment describing the trust boundary it sits on.
- Avoid "TODO" without an owner or a ticket. Use `// TODO(<feature>):` with a concrete next step.
- Russian or English in comments is fine — match the file's existing language. Do not rewrite Russian comments into English without a reason.

---

## 9. Performance rules

- Performance is a product feature, not a polish phase. A janky transition is a bug.
- Animations: target 60fps on a mid-range Android. Prefer `transform` / `opacity`, avoid layout-triggering properties.
- No layout shift on data load. Show skeletons sized to the final layout.
- Bundle: do not import whole icon libraries. Import individual icons.
- Server Components first → less JS shipped to the client.
- No `Image` from random CDNs without an entry in `next.config.ts` and a fallback. See [§10](#10-russia-and-network-constraints).

---

## 10. Russia and network constraints

BFG must work in Russia without a mandatory VPN. This is a product constraint, not a polish item.

- Video: **Kinescope only** on MVP. No YouTube, Vimeo, JWPlayer, or other providers without explicit approval and a regional fallback.
- Fonts: only providers reliably reachable in RU (Google Fonts via Next is acceptable today; if it changes, switch to self-hosted).
- Analytics: nothing that requires Google/Meta endpoints. Use Yandex Metrika or self-hosted when we add analytics.
- Payments: stack must be provider-agnostic (see [`BFG_DATABASE.md`](./BFG_DATABASE.md) §subscription). Integrate ЮKassa / Tinkoff / CloudPayments / ЮMoney when needed.
- AI: route AI calls through an Edge Function so we can swap providers (OpenAI ↔ proxy ↔ on-prem) without touching the client. See [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md).
- Any new third-party domain must be checked for RU accessibility before integration.

### 10.1 Supabase host portability

BFG uses Supabase the technology, not Supabase Cloud as a mandatory dependency. Development runs on Cloud; pre-beta and production target Self-Hosted Supabase on a Russian VPS. Full strategy: [`infra/BFG_SUPABASE_STRATEGY.md`](./infra/BFG_SUPABASE_STRATEGY.md).

- ❌ No hardcoded Supabase Cloud project URLs (`*.supabase.co`) anywhere in code, config, or docs. The host is an env var.
- All Supabase URLs and keys come from env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, server-only keys). See [`BFG_SECURITY.md`](./BFG_SECURITY.md) §6.
- Avoid Cloud-only assumptions wherever an equivalent exists. A choice that only works on Supabase Cloud is rejected or gated until a self-hostable path exists.
- Every new backend / storage / auth decision must be checked against two constraints: **(a)** works from Russia without a mandatory VPN, and **(b)** preserves a realistic migration path to Self-Hosted Supabase. Pointing BFG at a self-hosted instance must remain an env-var switch, not a code change.

---

## 11. Git, PRs, and reviews

- Branch names: `feat/<short-slug>`, `fix/<short-slug>`, `chore/<short-slug>`.
- One PR = one concern. If the diff stops fitting in your head, split it.
- PR description must answer: *what changed, why, what was deliberately left out*.
- A PR must not change unrelated formatting. No drive-by reformatting.
- Migrations are append-only. Never edit a merged SQL file. Add a new numbered migration. See [`BFG_DATABASE.md`](./BFG_DATABASE.md).

---

## 12. Errors and logging

- Server Actions return `{ data, error }` discriminated results. They never throw across the network boundary unless we want a 500.
- User-visible error text is short, calm, in Russian, and never blames the user. ("Сейчас не получилось. Попробуй ещё раз.")
- `console.error` only for things a developer must see. Tag logs with the feature: `console.error('[awardXp] update profile', err)`.
- Do not swallow errors silently. If an error is acceptable, comment why.

---

## 13. Testing philosophy (MVP)

- We do not block MVP on a test suite. We do block on:
  - manual smoke checklist before each release (see [`BFG_SECURITY.md`](./BFG_SECURITY.md) release checklist),
  - typed APIs,
  - server-side validation of every progression mutation.
- When a bug recurs, write a unit test for the pure logic (`lib/progression/*`, `lib/subscription/state.ts`).
- E2E tests come after the MVP loop stabilises. They are not a prerequisite.

---

## 14. Working with Cursor / LLM agents

- Keep files small and self-describing. An agent should be able to reason about a file from its first 40 lines.
- The first comment of each non-trivial file is a short "what this is, what it is not" block. Pattern: see `lib/progression/award-xp.ts`.
- Public surfaces of a feature are documented in one place (`docs/` or `lib/<feature>/index.ts` docstring).
- Avoid clever metaprogramming. Agents handle direct code far better than generated types.
- When a file grows over ~250 lines, split it. Long files poison context windows.
- One feature = one Cursor chat where possible. Don't pile unrelated work into a single conversation.

---

## 15. AI Cost Optimization Rules

- **Sonnet is the default model.** Use it for all routine tasks: code, fixes, refactors, reviews.
- **Opus only for** architecture decisions, security audits, or cross-cutting refactors requiring sustained multi-step reasoning.
- Keep diffs small and focused whenever possible.
- ❌ Do not read the entire `docs/` folder unless the task explicitly spans multiple documents. Read only the relevant companion doc.
- ❌ Do not attach full files when a targeted snippet (with `offset`/`limit`) suffices.
- ❌ Do not regenerate large boilerplate blocks when a surgical edit will do.

---

## 16. Agent Session Rules

- **One logical task per agent session.** Start a new chat when the phase changes (e.g., "design schema" → new chat → "wire server action").
- ❌ Do not pile unrelated work into a single conversation. Accumulated stale context increases cost and error rate.
- When a session exceeds ~30 turns or the accumulated diff is hard to follow, start a fresh agent.
- `docs/` is persistent project memory. Write decisions there instead of repeating context across sessions.
- ❌ Do not carry forward a session that contains superseded, contradicted, or irrelevant context.

---

## 17. Prompt Engineering Rules

- **Approval before edit.** For non-trivial changes: describe the plan, wait for confirmation, then execute. Never rewrite unrelated code silently.
- One clear goal per prompt. Avoid prompts that combine planning, implementation, and verification in a single shot.
- Provide explicit constraints upfront (which files may be touched, which rules apply) rather than correcting after the fact.
- Reference specific docs or file paths instead of vague descriptions (`docs/BFG_SECURITY.md §3` beats "follow the security rules").
- When correcting the agent, provide a minimal counter-example — not a paragraph of explanation.
- ❌ Avoid giant context-dump prompts. If the background exceeds ~200 words, it probably belongs in a `docs/` file.

---

## 18. Context Management Rules

- Pin only files directly relevant to the current task. Irrelevant open files consume context and introduce noise.
- ❌ Do not include unrelated open editors in the agent context window.
- Write decisions, constraints, and non-obvious rationale into `docs/` so any future session can recover them with a single targeted read.
- Prefer dense structured docs (bullet lists, tables) over prose — agents parse density better than paragraphs.
- Assume every new session starts cold. Provide one authoritative reference per topic; do not rely on conversational memory carrying over.
- When a doc grows beyond ~300 lines, split it by concern. Long docs poison context as much as long files do.

---

## 19. When in doubt

1. Re-read [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md). Is this in scope?
2. Re-read [`BFG_SECURITY.md`](./BFG_SECURITY.md). Does this trust the frontend with anything it shouldn't?
3. Pick the simplest option that works today and survives the next two features. Not more.
