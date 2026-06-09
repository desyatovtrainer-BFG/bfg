# BFG Security

Security contract for the BFG platform. The frontend is **never** trusted. Progression is **never** computed on the client. RLS is the primary boundary. Service-role keys live only in Edge Functions.

This document is binding. A PR that violates these rules must be rejected.

> Companion documents:
> [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) ·
> [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) ·
> [`BFG_DATABASE.md`](./BFG_DATABASE.md) ·
> [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) ·
> [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md)

---

## 1. Threat model (short)

We design against:

- **Casual cheating**: users editing client state, replaying requests, double-clicking to double-claim.
- **Scripted cheating**: bots calling Server Actions or Supabase directly to inflate XP / level / streak.
- **Credential leakage**: secrets accidentally bundled in client code or committed.
- **Authorisation bugs**: one user reading or modifying another user's data.
- **AI-shaped attacks**: prompt injection, key extraction via prompts, off-brand or harmful output.
- **Geo-dependency failures**: features tied to providers blocked in Russia.

We do not (yet) design against: nation-state attackers, large-scale fraud rings, advanced persistent threats. When user volume justifies it, this section is revisited.

---

## 2. Trust boundaries

```
Browser  ─►  Next.js Server  ─►  Supabase (RLS)  ─►  Edge Function (service role)
 zero          user-session         row-level            full DB
 trust         trust                policy enforced      privilege
```

Rules:

- The **browser is zero-trust**. Anything from the browser is potentially forged. We accept **intent**, not **values**.
- The **Next.js server** has user-session trust. It calls Supabase under the user's JWT. It cannot do more than RLS allows.
- **Supabase RLS** is the enforcement boundary. Every policy is `auth.uid()`-correlated for user-owned data.
- **Edge Functions** are the only place service-role keys may exist. They are entered only when service-role privilege is genuinely required.

---

## 3. Authentication

- Supabase Auth (email + password). No custom auth. No client-side session storage beyond Supabase's own cookie handling.
- `proxy.ts` (Next 16's proxy) refreshes the session cookie on every matching request. No authorisation logic lives there.
- Server identity is established via `getUser()` (`lib/auth/get-user.ts`). Server Actions call it first thing.
- Future OAuth providers must be reachable from Russia without VPN. Google / Apple SSO can be added when the RU-availability check passes.
- Password reset and email verification go through Supabase's built-in flows.

### 3.1 Rules
- ❌ Never accept a `userId` from the client. Always use `auth.uid()` (server) or `getUser()` (Next server).
- ❌ Never set or read auth cookies manually in app code. Let Supabase SSR handle them.
- ❌ No "remember device" cookies of our own.
- ❌ No JWT manipulation outside Supabase SDK.

---

## 4. Authorisation model

### 4.1 Layers
1. **RLS** at the database — primary line of defence.
2. **Server Actions** — secondary checks: identity, idempotency, business rules.
3. **UI gating** — convenience only. Never sufficient on its own.

### 4.2 Pattern for user-owned tables

```sql
alter table public.<t> enable row level security;

create policy "select own <t>" on public.<t>
  for select using (auth.uid() = user_id);

create policy "insert own <t>" on public.<t>
  for insert with check (auth.uid() = user_id);

create policy "update own <t>" on public.<t>
  for update using (auth.uid() = user_id);

-- delete intentionally absent unless we need it
```

For 1:1 tables (`profiles`, `avatars`): use `auth.uid() = id` instead of `user_id`.

### 4.3 Pattern for shared read-only content
```sql
create policy "auth can read active X" on public.X
  for select to authenticated using (is_active = true);
-- no insert/update/delete policies → no client writes possible
```

### 4.4 Privileged operations
Operations that **must** bypass RLS (rare):

- Cross-user reconciliation (recompute XP from `xp_events`).
- Payment provider webhooks setting `subscription_status`.
- Anti-cheat bans / rollbacks.

These go in Edge Functions with the service-role key. They are not callable from the browser.

---

## 5. Supabase RLS strategy

- **Default deny.** Every new table is created with `enable row level security`. Policies are added explicitly per operation.
- **`auth.uid()` everywhere** for user-owned rows. No `where user_id = ?` policies that rely on app-passed values.
- **Column-level protection** for sensitive columns (planned): use Postgres `column_privileges` or a check function so `profiles.xp` / `profiles.level` / `profiles.streak` cannot be updated directly from the client even within the user's own row. Until then:
  - Server Actions are the only writers of progression columns.
  - We do not expose generic "update profile" actions; each action targets specific fields.
- **No `using (true)` policies** on user-owned data. Period.
- **PRs that add a table without policies are blocked** by the database checklist in [`BFG_DATABASE.md`](./BFG_DATABASE.md) §12.

---

## 6. Environment variables and secret management

### 6.1 Categories
| Category | Visible in client? | Where used |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Browser + server, by design |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Browser + server, by design |
| `SUPABASE_SERVICE_ROLE_KEY` | **NEVER** | Edge Functions only |
| AI provider API keys | **NEVER** | Edge Functions only |
| Payment provider secrets | **NEVER** | Edge Functions only |
| Webhook signing secrets | **NEVER** | Edge Functions only |

### 6.2 Rules
- ❌ Never reference a non-`NEXT_PUBLIC_*` env var from a Client Component.
- ❌ Never reference `SUPABASE_SERVICE_ROLE_KEY` from a Server Action or Server Component. Edge Function only.
- ❌ Never commit a real `.env*` file. Only `.env.example` is committed.
- ❌ Never log env values, even in errors.
- ✅ Each new env var must be documented in `.env.example` with a comment.
- ✅ Env validation lives in `lib/supabase/env.ts` (public) and the per-Edge-Function entrypoint (server).
- ✅ Rotate any key that may have leaked. Document the rotation in the PR.

---

## 7. API and Server Action security

### 7.1 Server Action rules
- Every Server Action starts with `getUser()`. No user → return `{ data: null, error: 'unauthorized' }`.
- Every Server Action validates inputs before any write. Inline checks or a small schema lib (pick zod/valibot when needed).
- Every Server Action uses the **SSR Supabase client**, never a service-role client.
- Every Server Action returns `{ data, error }`. Never throw across the network boundary unless we want a 500.
- Sensitive writes (XP, streak, evolution, subscription) re-derive values from the database. The client cannot dictate amounts.
- Where idempotency matters (quest claim, workout completion, daily login), enforce it with a `unique` constraint **and** a server-side existence check.

### 7.2 Forbidden in Server Actions
- ❌ Trusting a client-supplied `userId`.
- ❌ Trusting a client-supplied XP amount.
- ❌ Calling third-party APIs that require a secret (AI, payments). Go through an Edge Function.
- ❌ Issuing dynamic SQL from interpolation. Use the Supabase SDK's parameterised methods.
- ❌ Returning raw Supabase error text to the client. Log on server, return short Russian message.

### 7.3 Edge Function rules
- Created under `supabase/functions/<name>/index.ts`. One concern per function.
- Validate the JWT of the caller when the call is initiated from the app. For webhook calls, verify a provider HMAC / signature.
- Never trust the request body. Validate every field.
- Always log the operation with a feature tag and a correlation id.
- Apply rate limits per user (e.g. 60 req/min for AI calls).
- Fail closed: any unexpected error returns a generic error to the caller and is fully logged server-side.

---

## 8. Progression / XP protection rules

These map to [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) §12 anti-cheat philosophy.

- ❌ The client never sends an XP amount. Server Actions accept a typed `XpRewardSource` from a closed enum. Active sources: `WORKOUT_COMPLETE`, `DAILY_QUEST`. (`MILESTONE` is reserved for future progression work; `STREAK_BONUS` and `DAILY_LOGIN` are dead constants pending cleanup — streaks never grant XP and daily login XP is out of MVP, see [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) §2.2.)
- ❌ The client never sends a level. Level is re-derived in `awardXp` from `xp` via `calculateLevel`.
- ❌ The client never sends an evolution stage. Stage is re-derived from level via `getAvatarEvolutionForLevel`.
- ❌ The client never sends a streak value. Streak is re-derived from `last_active_on` in `touchStreak`.
- ✅ Idempotency on every grant:
  - `daily_quest_completions` has `unique (user_id, quest_id, completed_on)`.
  - Workout completions (post-MVP table) will be unique per `(user_id, workout_id, completed_on)` or backed by a session id.
- ✅ `xp_events` append-only log (M2) gives us a reconciliation path. After it lands, periodic recomputation jobs verify `profiles.xp` against the log sum.
- ✅ Suspicious patterns (e.g. > N quests claimed in 5 minutes) are throttled at the Edge Function once it owns those writes.

---

## 9. AI security rules

Detailed in [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md) §6. Hard rules:

- ❌ No AI provider SDK in client code or in the client bundle.
- ❌ No AI provider key in any non-Edge environment.
- ❌ No free-form user-to-LLM chat in MVP.
- ❌ No PII in AI prompts (email, real name, location). Allowed: `level`, `streak`, `daysSinceActive`, `evolution_stage`.
- ❌ No unrestricted output: every LLM response passes a length cap, a tone filter (short denylist), and falls back to deterministic phrases on failure.
- ✅ All AI calls go through an Edge Function. Per-user rate limit. Per-day cost cap.
- ✅ Treat user-supplied text (when we eventually add it) as untrusted. Never concatenate into a system prompt. Pass as a separate user message with clear isolation.

---

## 10. Storage security rules

- Supabase Storage buckets are **private by default**. Public buckets only for explicitly public assets (e.g. workout thumbnails when we move them from `text` URLs to Storage).
- Per-user content (avatar uploads, future) lives in a bucket policy keyed on `auth.uid()`:
  - `objects.owner = auth.uid()` for read/write of own content.
  - No anonymous reads.
- File size and MIME-type validation on upload (Server Action or Edge Function), not just on the bucket.
- Signed URLs for time-limited sharing, short TTLs (≤ 1 hour for sensitive content).
- ❌ No third-party storage / CDN that fails in Russia without VPN.

---

## 11. Frontend security limitations

The frontend can only do the following safely:

- **Display data** fetched by the server.
- **Submit intent** through Server Actions.
- **Cache server data** via TanStack Query (read-only with respect to authority).
- **Hold ephemeral UI state** via Zustand or `useState`.

The frontend **cannot**:

- Decide who the user is.
- Compute XP, level, streak, evolution.
- Decide subscription state (it can *display* it, derived server-side).
- Hold a service-role key, payment secret, or AI key.
- Mutate `profiles.xp` / `profiles.level` / `profiles.streak` / `avatars.*` directly.
- Bypass RLS. (Even if it tried, RLS would deny.)

---

## 12. Backend responsibility boundaries

Server Actions (thin):

- Authentication, authorisation re-check.
- Business validation.
- Calling `lib/<feature>/` for domain logic.
- Calling Supabase under the user's session.
- Returning `{ data, error }`.

Edge Functions (privileged):

- Operations requiring service role.
- Calls to third-party APIs with secrets.
- Webhook handlers (payments, AI providers).
- Rate-limited / anti-abuse logic.
- Cross-user reconciliation / recomputation.

Database (authoritative):

- RLS policies.
- CHECK constraints on value sets.
- Unique constraints for idempotency.
- All persisted state.

---

## 13. Logging and observability

- Log only what is needed to operate the system. No PII in logs.
- Errors are tagged with the feature (`[awardXp]`, `[completeWorkout]`, `[companion]`).
- Do not log Supabase error objects in full to the client. Log on server, return generic.
- Future analytics: nothing that ships a third-party tracker to a Russian user's browser without RU availability (no GA, no Mixpanel without RU check).

---

## 14. Release security checklist

Before each release, a reviewer must check all of the following. A failure blocks the release.

- [ ] No new env var without an entry in `.env.example`.
- [ ] No reference to `SUPABASE_SERVICE_ROLE_KEY` outside `supabase/functions/`.
- [ ] No `service_role` Supabase client constructed outside `supabase/functions/`.
- [ ] `git grep` shows no committed secrets (`.env`, real API keys, real provider IDs).
- [ ] Every new table has RLS enabled and policies for every operation we permit.
- [ ] Every new Server Action calls `getUser()` first and validates inputs.
- [ ] Every new XP / level / streak / evolution write path goes through `awardXp` / `touchStreak` and not raw SQL.
- [ ] Every new external request (AI, payments, video) is RU-reachable.
- [ ] Smoke checklist from [`BFG_MVP_SCOPE.md`](./BFG_MVP_SCOPE.md) §5.3 passes.
- [ ] Lighthouse mobile targets met on key screens.
- [ ] PR description names anything intentionally left out.

---

## 15. Anti-cheat philosophy

We accept that we cannot prevent all client-side manipulation. We make it expensive, observable, and reversible:

- **Server-only progression.** All values that matter are recomputed server-side. Client edits are cosmetic.
- **Idempotency.** Double-claiming is structurally impossible at the DB level.
- **Audit log (post-MVP).** `xp_events` and `workout_completions` make reconciliation possible.
- **Rate limits.** Edge Functions throttle suspicious sources.
- **Calm, no shame.** The product itself does not encourage competitive cheating — there are no leaderboards, no PvP, no public scoring. This reduces the incentive surface significantly.

We do **not**:

- Run client-side anti-tamper checks (waste of bytes, hostile to users).
- Block dev tools / right-click (cargo cult).
- Refuse to run in browsers we don't ship to.

---

## 16. Incident response (lightweight)

When something breaks security-relevant:

1. **Rotate** any potentially exposed secret immediately.
2. **Contain**: disable the affected feature (env flag or quick deploy).
3. **Recover**: if data was mutated maliciously, recompute from logs or restore from backup. See [`BFG_DATABASE.md`](./BFG_DATABASE.md) §9.
4. **Document**: write a short incident note in the PR or a `docs/incidents/` file (added on first incident).
5. **Improve**: add a rule in this document or a check in the release checklist to prevent recurrence.

---

## 17. Hard prohibitions (recap)

A single-line list to keep close at hand.

- ❌ Service-role key outside Edge Functions.
- ❌ Trusting any client-supplied identity, XP amount, level, or stage.
- ❌ AI provider key or SDK in client code.
- ❌ Free-form chat with the AI in MVP.
- ❌ Tables in `public` without RLS.
- ❌ Server Actions that don't call `getUser()` first.
- ❌ Logging PII, secrets, or full Supabase error payloads to the client.
- ❌ Payment / video / analytics providers that fail in Russia without VPN.
- ❌ Toasts as primary error feedback for security-relevant operations.
- ❌ "Just for now" workarounds that disable RLS or use service-role from the app.
