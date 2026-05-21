# BFG Roadmap

A practical, ordered roadmap for BFG. Not a wishlist — each milestone has explicit acceptance criteria and a "won't do this milestone" list. Sequencing protects the MVP from architectural drift.

> Companion documents:
> [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) ·
> [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) ·
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_DATABASE.md`](./BFG_DATABASE.md)

---

## 0. Stage map (high level)

```
M0  Foundations           [DONE / IN PROGRESS]
M1  MVP Public Release    [ACTIVE]
M2  Soft Launch (RU)
M3  Monetisation
M4  Retention systems
M5  Scaling & quality
M6  Expansion features
```

Anything beyond M6 is "future ideas" — see §future-ideas. We do not build M3 work during M1.

---

## 1. M0 — Foundations [done / in progress]

What "foundations" must exist before MVP polish.

### 1.1 Done
- Next.js 16 app skeleton, Tailwind v4, Framer Motion.
- Supabase project, anon-key based access, SSR client + browser client + `proxy.ts` session refresh.
- Auth: email/password sign-up + sign-in, session bootstrap via `ensureBfgProfile`.
- `profiles` table with XP, level, streak, last_active_on, subscription columns.
- `avatars` table 1:1 with user, evolution columns.
- `daily_quest_completions` table with idempotency.
- `workouts` + `workout_exercises` tables, RLS on read-only catalog, Kinescope integration in code.
- Pure progression helpers (`levels.ts`, `xp-rewards.ts`, `avatar-evolution.ts`, `streak.ts`).
- `awardXp` server flow (XP + level + evolution in one path).
- Companion: deterministic rule-based message builder (`buildCompanionMessage`).
- Subscription state machine (`computeSubscriptionState`) with 30-day trial.
- Mobile-first UI primitives (`GameButton`, `GameCard`, bottom nav, progression panels).

### 1.2 In progress
- TanStack Query + Zustand wiring (added on demand, not preemptively).
- First Edge Function scaffolding for sensitive flows.
- `xp_events` append-only log table.

### 1.3 Acceptance for "M0 done"
- A new user can register, see the dashboard, complete a daily quest, complete a workout, and observe XP / level / streak / avatar updates correctly.
- No `service_role` key in any non-Edge code path.
- All `public.*` tables have explicit RLS policies.

### 1.4 Out of scope this stage
- Payments. AI calls. Push notifications. Cosmetics inventory writes. Admin UI.

---

## 2. M1 — MVP Public Release [active]

Goal: a closed-beta-quality build that we are willing to give to first real users in Russia.

### 2.1 Must ship
- **Workout session UX polish**: progress between exercises, calm completion screen, idempotent completion action.
- **Daily quests** screen with clear "claim" flow, all completion writes idempotent (`unique (user_id, quest_id, completed_on)`).
- **Streak surface** with no shaming copy for breaks.
- **Avatar evolution moment**: subtle visual when stage changes. One animation, < 600ms.
- **Companion** on every screen where it adds value (dashboard, post-workout, daily quests page).
- **Subscription gating** wired in but used only for non-core extras. Core loop stays free during trial and after expiry.
- **Operational basics**: an environment for staging, manual smoke checklist in `BFG_SECURITY.md`, a documented "apply migration" runbook.

### 2.2 Acceptance
- Smoke checklist passes on staging and prod.
- Lighthouse mobile ≥ 85 on dashboard, workouts list, workout session, profile.
- No "TODO security" left in `awardXp`, quest claim, workout complete.
- Reviewer signs off `BFG_SECURITY.md` release checklist.

### 2.3 Out of scope (M1)
- Payments. LLM-augmented companion. Push notifications. Social. Leaderboards.
- Auto-applied migrations CI. Stays manual for now.
- Localization beyond Russian.

---

## 3. M2 — Soft launch (RU)

Goal: open the doors to a small public audience in Russia, validate retention.

### 3.1 Must ship
- **Kinescope content**: at least N (target: 10) real workouts with real videos. Content management runbook holds.
- **Observability lite**: server-side logging hygiene, error surface (no toasts), a basic dashboard for "DAU / new signups / quests claimed". Tooling must be RU-friendly (no Datadog client in browser, no Google Analytics).
- **`xp_events` log + recomputation script** (run manually) — anti-cheat insurance before scaling.
- **`workout_completions` log table** to replace ad-hoc completion writes.
- **Push-style nudges OPT-IN only** through PWA install + native browser notifications. No forced prompts.
- **Onboarding** with calm welcome, 3-4 steps maximum.

### 3.2 Acceptance
- 7-day retention metric is wired and visible internally.
- We can answer "what XP did user X earn last week?" from the database.
- A migration accidentally re-applied does not corrupt data.

### 3.3 Out of scope (M2)
- Real payments. AI companion. Cosmetics monetisation. iOS native app.

---

## 4. M3 — Monetisation

Goal: turn the 30-day trial into a real subscription revenue line, using Russian providers.

### 4.1 Must ship
- **Payment provider integration**: pick one of ЮKassa / Tinkoff / CloudPayments / ЮMoney. The architecture stays provider-agnostic: providers only flip `subscription_status = 'active'` and set `subscription_expires_at`.
- **`subscription_payments` table** as a provider-specific log.
- **Edge Function webhook** for the provider with HMAC / signature verification.
- **Premium gating** on a small set of expansion features. Core emotional loop remains free.
- **Trial reminder** copy (calm, not pushy) shown when trial < 5 days.

### 4.2 Acceptance
- A real ruble subscription is bought and reflected in the database within seconds.
- A failed payment does not crash the trial state.
- Refunds and cancellations have a defined SOP, even if manual.

### 4.3 Out of scope (M3)
- Multi-tier subscriptions. Family plans. Gift codes.

---

## 5. M4 — Retention systems

Goal: deepen the loop without changing its emotional shape.

### 5.1 Possible work (prioritised on signal)
- **Companion v2**: LLM-augmented phrases via Edge Function, deterministic fallback always available. See [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md) §5.
- **Avatar customisation v1**: cosmetic inventory table, simple unlock UI. No P2W.
- **Quest chains** (long-running mini-arcs over 7 / 14 / 30 days).
- **Push notifications via PWA** for streak-at-risk (still emotionally calm).
- **Streak protection** ("freeze" tokens). Carefully — must not break the "no shame" promise.

### 5.2 Acceptance
- 14-day retention ≥ defined target.
- LLM costs are observable and capped by Edge Function quotas.
- No AI-introduced security or RU-availability regression.

---

## 6. M5 — Scaling & quality

Goal: make BFG resilient as the user base grows.

### 6.1 Possible work
- CI-driven migrations (replace manual SQL Editor).
- E2E test suite for core flows.
- Visual regression for UI primitives.
- Edge Functions for any operation that must not run with a user-bound Supabase client.
- Datacenter region review for Russia latency.
- Backups recovery rehearsal documented and run quarterly.

---

## 7. M6 — Expansion features

Features that change the surface area but reuse the same systems.

- Multi-language UI (English first).
- Multi-companion / companion progression.
- Friends / private groups (no leaderboards).
- Exercise detection (pose) — strictly server-validated.
- iOS / Android wrappers — Capacitor or React Native shell, depending on store availability.

---

## 8. Future ideas (parking lot)

We will not work on these without explicit roadmap promotion:

- Unity-based avatar rendering.
- AR / VR experiences.
- Real-time multiplayer workouts.
- Marketplace for user-generated workouts.

---

## 9. Roadmap rules

- A milestone is closed only when its acceptance criteria pass on production. Not "code merged".
- Each promotion to the next milestone requires a doc update: at least `BFG_ROADMAP.md` + the impacted system doc.
- New features cannot land if they violate [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) or [`BFG_SECURITY.md`](./BFG_SECURITY.md). Refactor first.
- "Just in case" infrastructure is forbidden. Add when needed.
