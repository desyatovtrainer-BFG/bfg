# MVP_STATUS

Completion estimate by system as of 2026-06-12.
Used to assess release readiness and prioritize remaining M1 work.

Acceptance criteria for M1 are in `BFG_ROADMAP.md §2.2`.

---

## Overall estimate: ~65% complete

---

## System breakdown

### Architecture — ~85%

| Item | Status |
|------|--------|
| Next.js 16 App Router, Server Components | Done |
| Feature-oriented folder layout (`lib/<feature>/`) | Done |
| Supabase clients (server, browser, proxy) | Done |
| Trust boundary (no service-role in app code) | Done |
| Server Actions pattern (`lib/<feature>/actions.ts`) | Done |
| Error model (`{ data, error }` returns) | Done |
| TanStack Query integration | Not started — add when first optimistic UI needed |
| Zustand integration | Not started — add when first cross-component UI state needed |
| Edge Functions | Not started — not required for M1 (no AI, no payments) |

---

### Database — ~90%

| Item | Status |
|------|--------|
| `profiles` table + RLS | Done |
| `avatars` table + RLS | Done |
| `daily_quest_completions` + idempotency | Done |
| `workouts` catalog + RLS | Done |
| `workout_exercises` + RLS | Done |
| `workout_completions` idempotency table | Done (migration 0006) |
| `xp_before` recovery column | Done (migration 0009) |
| Superset column on exercises | Done (migration 0007) |
| Display order on workouts | Done (migration 0008) |
| `xp_events` audit log | Not started — M2, not M1 |
| `companion_messages` log | Not started — post-MVP |
| `subscription_payments` log | Not started — M3 |
| `BFG_DATABASE.md` in sync with migrations | Done (synced) |

---

### Auth and Profile — ~95%

| Item | Status |
|------|--------|
| Email/password sign-up + sign-in | Done |
| Session refresh via proxy.ts | Done |
| `ensureBfgProfile` bootstrap on first login | Done |
| `getUser()` server-side identity | Done |
| Profile screen with subscription state | Done |
| Column-level RLS protection on `profiles.update` | Needs verification per `BFG_DATABASE.md §3.2` note |

---

### Workouts — ~80%

| Item | Status |
|------|--------|
| Workout catalog screen | Done |
| Session screen with exercise slides | Done |
| Kinescope video embed per exercise | Done |
| Superset group rendering | Done |
| Idempotent `completeWorkoutAction` | Done |
| XP recovery on non-atomic failure | Done |
| Companion feedback after completion | Done |
| Calm completion screen (design polish) | Partial — needs UX review |
| Real workout content (≥3 workouts with Kinescope IDs) | Blocked — content not yet added |

---

### Progression (XP / Level / Streak) — ~85%

| Item | Status |
|------|--------|
| `awardXp` single write path | Done |
| `calculateLevel` / `getLevelProgress` | Done |
| `touchStreak` idempotent | Done |
| XP reward sources defined | Done — `WORKOUT_COMPLETE` = 10; quest XP catalog-driven (3–5, temporary uniform 4); dead constants removed |
| Streak XP bonus | Removed by product decision (2026-06-09) — streak milestones trigger presence feedback only, never XP |
| Level curve implemented | Done — flat 50 XP per level, capped at level 100 (D012/D013) |
| Progression screen (XP bar, streak panel) | Done |
| XP economy validated (velocity target per stage) | Done — Phase 3 design + P0A/P0B implementation; per-difficulty quest values pending approval |
| Progression audit (end-to-end correctness) | NOT done — Phase 2 of Master Roadmap |

---

### Avatar Evolution — ~70%

| Item | Status |
|------|--------|
| 10-stage evolution ladder (square thresholds 1/4/9/…/100) | Done — D010/D011; stage names/labels temporary pending approval |
| `hasEvolved` + avatar write in `awardXp` | Done |
| Stage-colored avatar on dashboard | Done — stages 6–10 currently reuse stage-5 colors (clamped), distinct visuals pending |
| Avatar page (`/avatar`) | Done |
| Evolution moment animation on stage change | NOT done — M1 must-ship |
| 10 stages visually distinct (beyond color) | Partial — SVG silhouette only, no distinct forms yet |

---

### Daily Quests — ~90%

| Item | Status |
|------|--------|
| Quest catalog in code | Done — 5 supportive quests with behavior categories; workout/streak quests removed (D018/D019) |
| Daily selection: 3 quests/day, deterministic, category-deduplicated | Done — D017/D033, pure function, no DB state |
| Server-side selection validation in claim action | Done — non-selected ids rejected before any DB access |
| Idempotent `claimDailyQuestAction` | Done |
| Quests screen | Done — renders the selected 3 |
| Quest cards with claim state | Done |
| Companion feedback after claim | Done |
| Streak integration on quest claim | Done |
| ≥5 active quests in catalog | Done — 5 (catalog = pool; daily surface = 3) |
| Double-claim blocked in UI | Done (idempotency + server guard) |
| Per-difficulty quest XP values (3–5) | Partial — temporary uniform 4 XP pending approval |
| Final Russian copy for new quests | Partial — DRAFT copy pending content review |

---

### Companion — ~55%

| Item | Status |
|------|--------|
| `buildCompanionMessage` deterministic builder | Done |
| 5 companion states implemented | Done |
| Phrases stable within a day (seeded) | Done |
| Post-workout feedback (`buildCompanionFeedback`) | Done |
| Post-quest feedback | Done |
| Companion page (`/companion`) | Done |
| Companion on dashboard | Partial — avatar presence visible; companion phrase surfaced on dashboard screen |
| Companion on quests page | Needs verification |
| Server-rendered (no client API call) | Done |
| Phrase library reviewed for tone (no shame, no exclamations) | NOT done — Phase 4 of Master Roadmap |
| All 5 states manually tested | NOT done — required for M1 acceptance |

---

### Subscription — ~80%

| Item | Status |
|------|--------|
| `computeSubscriptionState` | Done |
| 30-day trial from `trial_started_at` | Done |
| `checkAccess` gating helper | Done |
| Trial state visible on profile screen | Done |
| Core loop never gated | Done |
| Subscription display copy (trial < 5 days warning) | NOT done — M3 item, not M1 |
| Payment provider | NOT done — M3, explicitly out of M1 scope |

---

### Onboarding — ~20%

| Item | Status |
|------|--------|
| Public landing screen at `/` | Done (static marketing screen) |
| Guided onboarding flow (3–4 steps) | NOT done — M2 item, not M1 |
| First-run experience after sign-up | NOT done |

---

### UI and UX Polish — ~65%

| Item | Status |
|------|--------|
| Mobile-first dark UI | Done |
| Bottom navigation | Done |
| `GameButton`, `GameCard` primitives | Done |
| Loading states on all screens | Needs verification |
| Empty states on all screens | Needs verification |
| Error states on all screens | Needs verification |
| 360px width without horizontal scroll | Needs Lighthouse verification |
| Avatar evolution animation | NOT done |
| Calm completion screen | Partial |
| No `console.log` left | Needs audit |

---

### Content — ~15%

| Item | Status |
|------|--------|
| ≥3 workouts with real Kinescope video IDs | NOT done |
| ≥5 active daily quests | Done — 5 in catalog (daily surface = 3 by design, D017) |
| All quest XP amounts reviewed | Partial — economy rework done (3–5 band); temporary uniform 4 XP, per-difficulty values pending approval |

---

### Infrastructure and Operations — ~40%

| Item | Status |
|------|--------|
| Vercel deployment | Done |
| Manual migration runbook | Done (`DEPLOYMENT.md`) |
| Staging environment | NOT done — M1 must-ship |
| Smoke checklist defined | Partial (`BFG_SECURITY.md`) |
| Smoke checklist last passed | NOT done |
| Lighthouse mobile ≥85 on 4 primary screens | NOT verified |
| No `service_role` key in app code | Done by architecture |
| All env vars documented in `.env.example` | Needs verification |

---

## Release readiness checklist (M1 gate)

All of these must pass before M1 closes. From `BFG_ROADMAP.md §2.2` and `BFG_MVP_SCOPE.md §6`.

- [ ] All docs in `docs/` up to date with reality (partially done — `BFG_DATABASE.md §10` needs update).
- [ ] ≥3 workouts with real Kinescope videos in DB.
- [x] ≥5 daily quests in catalog (daily surface = 3 by design, D017).
- [ ] 10-stage avatar evolution visually distinct.
- [ ] Avatar evolution animation on stage change (< 600ms).
- [ ] Trial state visible in profile.
- [ ] All `BFG_MVP_SCOPE.md §5.2` invariants verified manually.
- [ ] `BFG_SECURITY.md` release checklist passed.
- [ ] Lighthouse mobile ≥85 on dashboard, workouts list, workout session, profile.
- [ ] Staging environment running.
- [ ] Smoke checklist passed on staging.
- [ ] No `TODO security` left in `awardXp`, quest claim, workout complete.
- [ ] All 5 companion states manually verified.
