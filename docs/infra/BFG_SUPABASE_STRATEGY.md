# BFG Supabase Infrastructure Strategy

The official infrastructure strategy for how BFG runs its backend. This is the **source of truth** for the relationship between BFG and Supabase. When another doc touches hosting, backend portability, or Russia-availability of the backend, it must defer to this document.

This is **infrastructure** documentation, not a product decision and not a product feature. It does **not** change the user-facing MVP scope. See [`../BFG_MVP_SCOPE.md`](../BFG_MVP_SCOPE.md).

> Companion documents:
> [`../BFG_ARCHITECTURE.md`](../BFG_ARCHITECTURE.md) ·
> [`../BFG_ENGINEERING_RULES.md`](../BFG_ENGINEERING_RULES.md) ·
> [`../BFG_SECURITY.md`](../BFG_SECURITY.md) ·
> [`../BFG_DATABASE.md`](../BFG_DATABASE.md) ·
> [`../BFG_ROADMAP.md`](../BFG_ROADMAP.md)

---

# INFRA-001

Title:
BFG uses Supabase the technology, not Supabase Cloud the dependency

Category:
Infrastructure

Status:
Accepted

---

## 1. Accepted principle

> **BFG uses the Supabase technology, not Supabase Cloud as a mandatory dependency.**

Supabase is an open-source platform (Postgres + Auth + Storage + RLS + Edge runtime). BFG commits to the Supabase **architecture and SDK** (`supabase-js`, RLS, Server Actions over the SSR client), not to Supabase Cloud as the place that architecture must run. Supabase Cloud is a convenience for one phase, not a permanent foundation.

---

## 2. Three-phase strategy

| Phase | Backend host | Why |
| --- | --- | --- |
| **1. Active development** | Supabase Cloud | Move fast, avoid server administration, no ops overhead while the loop is still changing. |
| **2. Before closed beta** | Official Self-Hosted Supabase on a Russian VPS | Remove the foreign-cloud dependency before real RU users arrive. |
| **3. Production** | Self-Hosted Supabase on Russian servers | Run BFG entirely on infrastructure we control, inside Russia. |

The general backend architecture is identical across all three phases. Only the **host** changes. `supabase-js`, RLS policies, Server Actions, and Edge Functions stay the same.

---

## 3. Reason

Supabase is open-source and can be self-hosted. Committing to the technology rather than the cloud lets BFG:

- keep the same general backend architecture (Postgres + Auth + Storage + RLS) across every phase;
- continue using `supabase-js` and the existing Server Action / RLS patterns unchanged;
- reduce dependency on Supabase Cloud, on foreign payment methods, and on possible access restrictions from outside Russia;
- guarantee end users in Russia can use BFG without a mandatory VPN, because production runs on Russian servers.

---

## 4. Constraints this strategy must preserve

These are binding on every new architecture, storage, auth, and backend decision:

- **MVP stays a mobile-first web app.** Self-hosting does not change the product surface.
- **End users use BFG from Russia without a mandatory VPN.** Production runs on Russian servers; this is non-negotiable.
- **One database.** No second database is introduced to make migration easier or for any other reason.
- **No microservices.** The modular monolith stands. See [`../BFG_ARCHITECTURE.md`](../BFG_ARCHITECTURE.md) §1.
- **No GraphQL / REST infrastructure** beyond Supabase + Server Actions.
- **Env-based configuration only.** Supabase URL and keys come from env vars. See [`../BFG_SECURITY.md`](../BFG_SECURITY.md) §6.
- **No hardcoded Supabase project URLs and no Cloud-only assumptions.** Code must not assume the backend is `*.supabase.co`.
- **Every new backend / storage / auth decision must preserve a realistic migration path to Self-Hosted Supabase.** If a choice only works on Supabase Cloud, it is rejected or gated until a self-hostable equivalent exists.

---

## 5. Self-hosted migration checklist

Run this before the Phase 1 → Phase 2 cutover (i.e. before closed beta). Each item must pass.

- [ ] **VPS provisioned** in Russia, sized for the official Self-Hosted Supabase stack.
- [ ] **Official Self-Hosted Supabase deployed** (Postgres + Auth + Storage + Studio + API gateway) from the official distribution.
- [ ] **All migrations applied** from `supabase/migrations/` in order, against the self-hosted Postgres. Rehearsed on a throwaway instance first.
- [ ] **RLS verified** — every `public.*` table has its policies and they behave identically to Cloud. See [`../BFG_SECURITY.md`](../BFG_SECURITY.md) §5.
- [ ] **Auth verified** — email/password sign-up, sign-in, session refresh via `proxy.ts`, password reset, email verification all work against the self-hosted instance.
- [ ] **Storage verified** — buckets, bucket policies, and any signed-URL flows behave identically.
- [ ] **Edge Functions verified** (when present) — service-role secrets present only in the self-hosted function environment, never elsewhere.
- [ ] **Env switch only** — pointing BFG at the self-hosted instance is a change of env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, server-only keys), with **no code changes**. If code changes are required, that is a Cloud-only assumption to fix first.
- [ ] **SSL / domain configured** — the self-hosted instance is served over HTTPS on a stable domain reachable from Russia without VPN.
- [ ] **Backup and restore tested** — a backup is taken and a full restore is rehearsed on a separate instance before cutover. See [`../BFG_DATABASE.md`](../BFG_DATABASE.md) §9.
- [ ] **Data migration rehearsed** — a dry-run copy of Cloud data into self-hosted, validated, before the real cutover.
- [ ] **Rollback plan documented** — how to point back at the previous host if the cutover fails.

---

## 6. Relationship to other docs

- [`../BFG_ARCHITECTURE.md`](../BFG_ARCHITECTURE.md) — records that development uses Cloud and pre-beta/production target Self-Hosted; this doc holds the full strategy.
- [`../BFG_ENGINEERING_RULES.md`](../BFG_ENGINEERING_RULES.md) — the per-PR rules (no hardcoded Cloud URLs, env-only, self-hosted-compatibility check) that enforce this strategy.
- [`../BFG_SECURITY.md`](../BFG_SECURITY.md) — the self-hosted deployment checklist run before closed beta.
- [`../BFG_MVP_SCOPE.md`](../BFG_MVP_SCOPE.md) / [`../BFG_ROADMAP.md`](../BFG_ROADMAP.md) — record that Cloud is accepted for dev speed and Self-Hosted migration is required before beta/production, without changing user-facing scope.
