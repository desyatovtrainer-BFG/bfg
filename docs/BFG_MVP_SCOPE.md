# BFG MVP Scope

The MVP scope is the **smallest BFG that is worth playing**. Anything outside this scope is rejected at PR time unless explicitly promoted by [`BFG_ROADMAP.md`](./BFG_ROADMAP.md).

> Companion documents:
> [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) ·
> [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) ·
> [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md)

---

## 1. MVP definition

The MVP is "shippable" when a real user in Russia, on a mid-range Android phone, without VPN, can:

1. **Sign up** with email + password, **verify the email with a one-time code**, then complete onboarding. The MVP auth/onboarding path is **Sign Up → Verify Email → Onboarding → Home** (Decisions 074, 076, 077). Onboarding (Decisions 078–081) is a **Presence-led dialogue** of four screens — **S1 Seed Form → S2 Goal + Hero/Heroine → S3 Experience + Training Format + Conditional Weekly Frequency → S4 Default Avatar + Naming Ceremony** — with a silent, deterministic Program Assignment (Hero/Heroine × Experience × Training Format × Weekly Frequency, D061/D081) between S3 and S4. Email verification is a **required, hard-blocking** pre-onboarding OTP gate (D077); the Naming Ceremony is **required** (D078/D079). MVP collects **Goal, Hero/Heroine, Experience, Training Format, Weekly Frequency, and Avatar Name**, all **editable later in Profile** with no progression reset (D080). Goal does **not** drive MVP Program Assignment. Screen copy and answer taxonomies are accepted (D079); **final avatar art direction and Goal-driven avatar starting-form variation are Post-MVP**.
2. **See their dashboard** with their presence (avatar body + companion voice), level, XP, streak.
3. **Complete a daily quest** and receive XP, with the change visible.
4. **Open a workout**, watch a Kinescope video for each exercise, mark the workout as completed.
5. **Receive XP, see the level / streak / avatar update**, hear the presence speak.
6. **Return tomorrow** and see streak continuity (or a soft restart if a day was missed).
7. **Be on a 30-day free trial** without payment required, and not lose progress when the trial ends.

That's the loop. Everything else is out of MVP.

---

## 2. In scope

### 2.1 Product
- **Entry / Auth Start screen (Decision 074)** — the unauthenticated first-contact screen that precedes Sign Up: a neutral Seed Form (never Stage 10 / never a default-final avatar), a single primary CTA → Sign Up, a quiet Log In path, no scroll, no trial/pricing. See `BFG_UI_RULES.md §21` / `ui/BFG_SCREEN_WIREFRAMES.md §0`. Final copy is not yet locked (D074 fixes structure and interaction rules only).
- **Auth surface (Decisions 076, 077)** — one Auth surface with three states (Sign Up · Verify Email · Log In), reached from Entry. The MVP path is **Sign Up → Verify Email → Onboarding → Home**, with a **required, hard-blocking pre-onboarding 6-digit OTP** verification gate (D077, OTP not magic link; resend/change-email fallbacks). No verification/legal/payment field ever appears on the Naming Ceremony or any onboarding screen. See `BFG_UI_RULES.md §22` / `ui/BFG_SCREEN_WIREFRAMES.md §0.1`. The blocking gate requires a RU-reachable transactional email provider (infra) as a launch prerequisite. **Payments/subscriptions remain post-MVP (§3.1), but the verified email is prepared now** so no surprise verification gate appears at payment time. Final copy is not locked.
- Email/password authentication via Supabase.
- **Onboarding flow (Decisions 078–081)** — a **Presence-led dialogue** (the Presence is on every screen and owns the question framing; options are the user's structured replies — not a form wizard), four screens: **S1 Seed Form → S2 Goal + Hero/Heroine → S3 Experience + Training Format + Conditional Weekly Frequency → S4 Default Avatar + Naming Ceremony**, then Home. Collects **Goal (multi-select, framing-only — not assignment-driving), Hero/Heroine (`male`/`female`), Experience (`beginner`/`intermediate`/`advanced`), Training Format (`home`/`gym`), Weekly Frequency (`two`/`three`/`four_per_week`, shown conditionally only after Experience + Format — D081), and Avatar Name (required)**. The Stage-1 default avatar first appears on S4 (never Stage 10 — D010), direction from Hero/Heroine. **Program Assignment is silent and deterministic** (Hero/Heroine × Experience × Training Format × Weekly Frequency + the Home/Gym Program Family/Variant model, D061/D081; no screen). All six inputs are **editable later in Profile with no progression reset (D080)**. No verification/legal/payment field on any onboarding screen (D077). Screen copy and taxonomies are accepted (D079). See `BFG_UI_RULES.md §23` / `ui/BFG_SCREEN_WIREFRAMES.md §0.2`. **First Home after onboarding (D082):** after S4 the user lands on the **full Home, not Workout 1** — no auto-launch of the first workout and no first-run highlight on the "Continue Journey" CTA. The **Avatar Name appears on Home** (first identity line of the Stage Block), and **avatar customization may be entered from the Home Living Presence before the first workout** (D073); the user starts the first workout only when they choose to (for a brand-new user, Continue Journey resolves to Workout 1 — D059/D043). **Post-MVP / future:** final avatar art direction and Goal-driven avatar starting-form variation.
- BFG profile bootstrap on first login.
- Dashboard screen with their presence (avatar body + companion voice), level, streak.
- Daily quests screen with idempotent claim.
- Workouts catalog screen.
- Workout session screen with per-exercise Kinescope video.
- Profile screen with subscription state.
- Avatar screen with current stage description. *(Body-role of the unified presence.)*
- Companion screen (read-only reflective phrase). *(Voice-role of the unified presence.)*
- Progression screen (XP bar, streak panel, evolution block).

> **Progress & avatar identity (Decisions 072, 073).** The Progress surface (the merged Avatar + Progress + Profile destination, D005) is structured per D072: a **static, non-interactive identity portrait** (Primary) → Level / XP / Streak / Stage position (Secondary) → History / Statistics / Achievements as entry points (Additional). Avatar customization is entered **only from the Home Living Presence** (tap → Avatar Customization, D073); Progress never opens customization. **MVP correctness:** there is **one shared avatar visual state**, and the Home live Presence and the Progress static portrait must always render the **same** customized avatar — Home↔Progress visual parity is a correctness property (D001 at the rendering layer), not deferrable polish. **Not forced into MVP by these decisions:** the customization **catalog depth** (clothing/cosmetics catalogs, currency-linked cosmetics, rich editor) — the *entry model* and *shared state* are MVP; *catalog depth* is scoped separately and may be MVP or Post-MVP (cosmetics remain catalog-only at MVP per §3.2, and never affect gameplay — D029/D034).

### 2.2 Systems
- XP grants from workouts and daily quests. (Daily login XP removed from MVP. Streak milestones trigger emotional presence feedback only — no XP. `MILESTONE` is reserved for future progression work. See [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) §2.2.)
- Level derivation from total XP (`calculateLevel`).
- Avatar evolution by level threshold (10-stage ladder, square thresholds — registry D010/D011).
- Streak: idempotent per day, soft restart on break, no shaming.
- 30-day trial subscription state, no payment yet.
- Companion: deterministic Russian phrases by state. *(Avatar evolution = body-role; companion phrases = voice-role of the same presence.)*

### 2.3 Engineering
- Next.js 16 App Router, Server Components by default.
- Supabase with RLS on every `public.*` table.
- Mobile-first dark UI, Tailwind v4, Framer Motion.
- Kinescope video integration.
- `proxy.ts` for Supabase session refresh.
- Server Actions for all writes.

> **Backend host (infrastructure, not user-facing scope).** Supabase Cloud is accepted during development for speed. Migration to official Self-Hosted Supabase on a Russian VPS is required before closed beta / production. This is an infrastructure decision — it does **not** change the user-facing MVP scope or the loop above. Strategy: [`infra/BFG_SUPABASE_STRATEGY.md`](./infra/BFG_SUPABASE_STRATEGY.md).

---

## 3. Out of scope (MVP)

These are explicitly **not built** during MVP. Don't be helpful here. Don't "just sketch it". Don't add empty scaffolding.

### 3.1 Product features out of scope
- Payments / paywall / real subscriptions.
- Push notifications (browser or native).
- Social: friends, groups, sharing.
- Leaderboards, PvP, competition.
- Marketplace / user-generated workouts.
- Multiple languages (RU only).
- iOS / Android native shells.
- Admin UI for workout content (use Supabase Table Editor — see `WORKOUT_CONTENT_GUIDE.md`).
- Free-form chat with the companion.
- Personalised workout recommendations.
- Calorie / weight / BMI tracking.
- Exercise pose detection.

### 3.2 Systems out of scope
- LLM-augmented companion (deterministic only on MVP).
- Cosmetic ownership table (catalog-only on MVP).
- `xp_events` log (added at soft launch, not MVP).
- `workout_completions` log (added at soft launch).
- Streak freeze / break protection.
- Quest chains, multi-day arcs.
- Multiple presences (each = one avatar body + one companion voice, inseparable).
- Memory of past phrases.

### 3.3 Engineering out of scope
- GraphQL or REST API layer (Supabase + Server Actions is enough).
- DDD / hexagonal / clean architecture scaffolding.
- Microservices.
- A second auth provider.
- A second database.
- A heavy state management library beyond Zustand.
- A form library beyond `<form>` + Server Actions.
- A schema validation library globally enforced (add per need).
- CI-driven migrations (manual SQL Editor stays on MVP).
- E2E test suite (manual smoke checklist instead).
- A custom design system / token pipeline.
- Storybook.
- Internationalisation framework.

If a PR introduces anything in §3.x, the PR must first promote that item in [`BFG_ROADMAP.md`](./BFG_ROADMAP.md).

---

## 4. Quantitative MVP constraints

- **Bundle**: ≤ 150KB gzipped JS per route (excluding fonts).
- **First contentful paint** on a mid Android 4G: < 2.0s.
- **Time to interactive** on dashboard: < 2.5s.
- **Lighthouse mobile**: ≥ 85 Performance, ≥ 95 Accessibility on dashboard, workouts list, workout session.
- **Cold start of Next on Vercel**: not a release blocker, but no route over 1s server time.

---

## 5. Quality bar for MVP

### 5.1 Must be true on every screen
- Renders on 360px width without horizontal scroll.
- Has a server-rendered initial paint (no client-only screen).
- Loading state, empty state, error state all exist.
- Russian-only copy.
- Calm motion only, < 600ms per moment.
- No `console.log` left behind.

### 5.2 Must be true everywhere
- All progression writes are server-side. Frontend submits intent, not values.
- All `public.*` tables have RLS policies for every operation we permit.
- No service-role key outside Edge Functions.
- All env vars referenced are either documented in `.env.example` or explicitly server-only.

### 5.3 Smoke checklist (manual, before every release)
See `BFG_SECURITY.md` §release checklist for the full list. Includes:

- Sign up → verify email (one-time code) → onboarding → Home/dashboard (D076, D077).
- Complete a daily quest → XP increases, streak updates.
- Complete a workout → XP/level/avatar update, the presence speaks.
- Reload after each action → state persists.
- Try double-claim of the same quest → blocked.
- Try POST to a Server Action with someone else's user id → blocked by RLS.
- Inspect Network tab → no service-role key visible.
- Open from a Russian IP without VPN → all videos, fonts, API calls succeed.

---

## 6. MVP completeness checklist

When this whole list passes, M1 is done (see [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) §2).

- [ ] All 9 documents in `docs/` are up to date with reality.
- [ ] At least 3 workouts with real Kinescope videos.
- [x] At least 5 daily quests in the catalog (daily surface = 3 by design, registry D017).
- [ ] 10-stage avatar evolution visually distinct.
- [ ] Trial state visible in profile.
- [ ] All §5.2 invariants verified manually.
- [ ] `BFG_SECURITY.md` release checklist passed.
- [ ] Lighthouse mobile target met on the four primary screens.

---

## 7. Anti-scope-creep rules

- "While we're at it" features are rejected. They are added to [`BFG_ROADMAP.md`](./BFG_ROADMAP.md) §future or §M4/M5.
- "It's just 30 lines" is not a reason to add an out-of-scope system. Lines are not the cost — context and maintenance are.
- "We'll need it later" is not a reason to add abstraction. Abstract when there is a second concrete use case.
- "Let me add a test framework / linter / formatter while I'm here" — separate PR, separate decision.

---

## 8. When to expand scope

We expand MVP scope only when:

1. The current loop is shippable and validated with internal users.
2. We have a measurable problem (retention, security, latency).
3. The expansion fits an existing milestone in [`BFG_ROADMAP.md`](./BFG_ROADMAP.md), or that roadmap is updated first.
