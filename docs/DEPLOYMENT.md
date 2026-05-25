# BFG Deployment Runbook

Operational reference for deploying BFG to production. Covers Vercel, Supabase, and Kinescope only — no containers, no CI/CD pipeline, no self-hosted infra.

> Companion documents:
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_DATABASE.md`](./BFG_DATABASE.md) ·
> [`LOCAL_SETUP.md`](./LOCAL_SETUP.md)

---

## 1. Architecture Overview

```
User browser
    │
    ▼
Vercel (Next.js 16, App Router)
    │  Server Components, Server Actions, proxy.ts cookie refresh
    │
    ├──► Supabase (Postgres + Auth + RLS)
    │       Primary backend — all auth, all data, all policies
    │
    └──► Kinescope (video embeds)
            Russia-accessible CDN, no secrets required
```

Supabase Edge Functions (when present) run inside Supabase's infrastructure — not on Vercel. They hold service-role secrets and are not reachable from the browser.

---

## 2. Environment Variables

### Required for the Next.js app (Vercel)

| Variable | Visibility | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser + server) | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (browser + server) | Supabase Dashboard → Project Settings → API → anon / public key |

Set both in **Vercel Dashboard → Project → Settings → Environment Variables** for the Production environment.

### What does NOT go in Vercel env for the Next.js app

`SUPABASE_SERVICE_ROLE_KEY` and all third-party API secrets (AI providers, payment providers, webhook signing secrets) must never appear in Vercel environment variables for the Next.js deployment. They belong only in Supabase Edge Function secrets, set via the Supabase Dashboard.

Every env var added must also have an entry in `.env.example` with a comment.

---

## 3. Vercel Deployment Flow

1. **Connect repo** — link the GitHub repository to a Vercel project. Framework preset: Next.js.
2. **Set env vars** — add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Production in Vercel settings.
3. **Production branch** — `master`. Every push to `master` triggers a production deploy.
4. **Build command** — `next build` (Vercel default, do not override).
5. **Output directory** — `.next` (Vercel default).
6. **Manual redeploy** — Vercel Dashboard → Deployments → select a deployment → Redeploy.

Preview deployments on non-master branches use the same env vars unless you configure separate Preview values in Vercel.

---

## 4. Supabase Production Notes

- The project uses the **cloud Supabase instance only**. No local Supabase, no CLI required.
- **RLS is always on.** Every table must have Row Level Security enabled and explicit policies before deployment. Tables without policies are blocked per [`BFG_SECURITY.md`](./BFG_SECURITY.md) §5.
- **Auth** — email/password only at MVP. Future OAuth providers must be reachable in Russia without VPN before enabling.
- **Backups** — Supabase Pro tier includes daily automated backups. Confirm the production project is on a paid plan before launch.
- **Connection pooling** — Supabase provides PgBouncer by default. The Next.js app uses the standard `@supabase/ssr` client; no additional pooler configuration is needed.

---

## 5. Migration Application Rules

Migrations are applied manually via the Supabase Dashboard. There is no automated migration runner.

**Process:**

1. Open **Supabase Dashboard → SQL Editor** (production project).
2. Identify every unapplied migration in `supabase/migrations/` — files are prefixed `NNNN_`.
3. Apply files in strict numerical order: `0001_…` before `0002_…`, never out of order.
4. Paste the full contents of one file, run it, confirm success before moving to the next.
5. Never skip a migration number.
6. Never edit an already-applied `.sql` file — if a correction is needed, write a new numbered migration.
7. Record which migration files were applied in the deployment notes or PR description.

**Before writing any migration:**
- Read the tail of `supabase/migrations/` to confirm the current schema state.
- Check `docs/BFG_DATABASE.md` for RLS and constraint expectations.
- Confirm the migration with the team before applying to production.

---

## 6. Kinescope Notes

- Kinescope is the video provider. It works in Russia without a VPN — this is a hard requirement.
- Video embed IDs are public values; no secrets are involved.
- No Kinescope API keys or credentials are required in the Next.js app or Vercel env.
- If a video fails to load, verify the embed ID is correct and the Kinescope project is active.

---

## 7. Pre-Deploy Checklist

Run through this before every production deploy.

- [ ] `npx tsc --noEmit` passes with zero errors.
- [ ] `git grep -r "service_role"` shows no references outside `supabase/functions/`.
- [ ] No real secrets committed — `.env.local` and `.env` are gitignored and absent from the repo.
- [ ] All pending migrations are identified and ready to apply in order.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel Production env.
- [ ] Every new table has RLS enabled and policies for every permitted operation.
- [ ] Every new Server Action calls `getUser()` first and validates inputs.
- [ ] New env vars (if any) are documented in `.env.example`.
- [ ] Full security checklist in [`BFG_SECURITY.md`](./BFG_SECURITY.md) §14 reviewed.

---

## 8. Post-Deploy Smoke Checklist

Verify on production after each deploy.

- [ ] `/login` loads and email/password sign-in succeeds.
- [ ] `/signup` creates a new account and redirects to the app.
- [ ] Dashboard loads with correct user XP, level, and streak.
- [ ] Workout list is visible; opening a workout shows exercises.
- [ ] Completing a workout records XP and updates the dashboard.
- [ ] Daily quests are visible and a quest can be completed.
- [ ] Companion feedback renders after workout completion.
- [ ] A Kinescope video embed plays.
- [ ] Vercel function logs show no 500 errors for the above flows.

---

## 9. Rollback

**Application (Vercel):**

Vercel retains all previous deployments. To roll back:
1. Vercel Dashboard → Deployments → find the last known-good deployment.
2. Click the three-dot menu → **Promote to Production**.

The rollback is instant and does not require a code push.

**Database (Supabase):**

Migrations are append-only and cannot be "un-applied" by reverting the Next.js code. If a migration introduced a problem:
- Write a **compensating migration** (`NNNN_revert_<description>.sql`) and apply it via the SQL Editor.
- Do not delete or edit the original migration file.
- If data corruption occurred, restore from a Supabase backup and re-apply only the valid migrations.

In a rollback scenario, keep the app deployment and the database state in sync — rolling back the app without reverting a breaking schema change will cause errors.

---

## 10. Security Reminders

- Service role key must never be exposed to the browser. Do not add it to `NEXT_PUBLIC_*` env vars. Only use it in explicitly server-only contexts when truly required.
- RLS policies are the primary security boundary. UI gating is never sufficient on its own.
- Rotate any key that may have been exposed immediately. Document the rotation in the PR.
- Do not log env var values, even in error handlers.
- Supabase anon key and URL are intentionally public — do not treat them as secrets, but also do not add anything sensitive to `NEXT_PUBLIC_*` variables.
- All providers (auth, video, analytics) must be reachable in Russia without a VPN.
