# BFG Local Setup

Practical runbook for getting BFG running on a local machine.

---

## Prerequisites

- **Node.js** 20 or later
- **npm** (bundled with Node)
- A Supabase account with access to the BFG project
- No Supabase CLI required — the project uses the cloud Supabase instance only

---

## Install Dependencies

```sh
npm install
```

---

## Environment Variables

1. Copy the example file:
   ```sh
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in both values from **Supabase Dashboard → Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon / public key
3. Never commit `.env.local`.

---

## Supabase Notes

- The project is **cloud-only**. There is no local Supabase instance.
- The Supabase CLI is not installed locally and is not needed for development.
- All database changes go through the **SQL Editor** in the Supabase Dashboard.

---

## Run Dev Server

```sh
npm run dev
```

App is available at `http://localhost:3000`.

---

## TypeScript Check

```sh
npx tsc --noEmit
```

Read the output top-to-bottom. Fix the first error before looking at the rest — later errors are often caused by the first.

---

## Applying Migrations Manually

1. Open **Supabase Dashboard → SQL Editor**.
2. Paste the contents of the migration file from `supabase/migrations/`.
3. Apply files in order: `0001_…` before `0002_…`, and so on.
4. Never edit a migration file after it has been applied — add a new numbered file instead.
5. Never skip migration numbers.

---

## Daily Start Checklist

- [ ] `git status` — confirm working tree is clean before pulling
- [ ] `git pull origin master`
- [ ] `npm install` (only if `package.json` changed)
- [ ] `npm run dev`

---

## Daily Shutdown Checklist

- [ ] Stop the dev server (`Ctrl+C`)
- [ ] Commit or stash any work in progress
- [ ] Note any pending migrations in the PR description so they are not forgotten

---

## Common Troubleshooting

| Symptom | Fix |
|---|---|
| "Cannot find module" | Run `npm install` |
| Supabase 401 / 403 errors | Check `.env.local` values match the Dashboard |
| Type errors on `npm run dev` | Run `npx tsc --noEmit` and read from the top |
| Port 3000 already in use | `npm run dev -- -p 3001` |
| Stale build artifacts | Delete `.next/` and restart the dev server |
