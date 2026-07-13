# Changelog — Slice 16 — Profile onboarding data wiring and safe editing

Date: 2026-07-13
Branch: `feat/approved-app-rebuild`
Scope: Profile becomes a real data surface with two safe edits. This changelog records the **documentation sync**; the Slice 16 source implementation was completed and manually verified separately on the same branch.

---

## Summary

Slice 16 wires the administrative Profile (D086) to real persisted data and enables the two **safe** onboarding edits (D084) — **Goal** and **Avatar Name** — while keeping every **program-changing** field read-only. It is an intentional partial of D080/D084/D086; it does **not** implement Program Assignment or Program Replacement and creates **no** migration.

What the slice does:

- **Real Profile data wiring.** Account email (session), onboarding values (goal, fitness level, training format, weekly frequency, training structure), avatar name/direction, and subscription state are read from the canonical schema (`public.profiles.*` + `public.avatars.name`, migration `0012`) via the existing `getOnboardingState` loader and `getCurrentSubscription` helper.
- **Accepted Russian label mappings.** Stored enum values render through a pure label layer (`lib/onboarding/labels.ts`); raw enum values are never shown.
- **Goal edit modal.** Multi-select, requires ≥1, immediate save, no confirmation modal (D084 safe field), calm inline success.
- **Avatar Name edit modal.** Trimmed, required, limited to the existing 40-character rule (shared with onboarding, not a new limit), immediate save, calm inline success.
- **Authenticated Server Actions.** `lib/profile/actions.ts` re-authenticates via `getCurrentUser()`; no client `user_id` is trusted; writes run under user-session RLS (no service role). Errors map to calm Russian text; no raw Supabase errors reach the client. Goal revalidates `/profile`; Avatar Name revalidates `/profile` and `/dashboard` (Home shows the name, D082).
- **Legacy null handling.** Null onboarding values remain supported — no redirect into onboarding, no default persisted; a genuinely missing value shows «Не указано».
- **Display-only effective Full Body.** For a null training structure, «Фулбоди» is shown when Training Format = home, Fitness Level = beginner, or Weekly Frequency = 2 — a read-side inference that performs **no** database write.
- **Subscription preservation.** The existing subscription/trial display is unchanged.
- **Logout preservation.** The existing `signOut` logout confirmation modal is unchanged.
- **Program-changing fields deferred.** Hero/Heroine direction, Fitness Level, Training Location, Weekly Frequency, and Training Structure remain read-only (no chevron, no modal, no tap) pending Program Assignment / Replacement (D061/D085) and the D084 confirmation flow.
- **No migration.**

---

## Documentation files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - **D080** → Implementation Status **Partially Implemented** (slice 16): Goal + Avatar Name editable; the program-changing inputs deferred; accepted D080 scope explicitly **not** reduced.
  - **D083** → status kept **Not Implemented** with a factual clarification that slice 16 only displays the active direction (read-only) and the global Avatar Name — no direction switching, visual slots, slot persistence, customization switching, or default-at-current-Stage fallback.
  - **D084** → Implementation Status **Partially Implemented** (slice 16): safe-field flow (single modal, immediate save, stay on Profile, inline success/error, no toast, authenticated Server Actions); confirmation flow, Program Replacement, active-workout deferral, and pending assignment still missing.
  - **D085** → status kept **Not Implemented**: only read-side labels + display-only effective Full Body inference; no reduced Program model, assignment, families, variants, or replacement.
  - **D086** → Implementation Status **Partially Implemented** (slice 16): final structure + real values + Goal/Name editing + single-modal flow + existing logout confirmation + read-only program-changing rows; the remaining edits and in-modal confirmation states still missing.
  - **Implementation summary table:** Implemented 17 → **18**, Partially Implemented 10 → **13**, Not Implemented 59 → **55** (18 + 13 + 55 = 86). Moves: D080/D084/D086 → Partially Implemented; **D079 → Implemented** to reconcile a pre-existing intra-file drift (its own entry already read *Implemented on `feat/approved-app-rebuild`* while the table still listed it under Not Implemented).

- **`docs/BFG_PRODUCT_GAPS.md`**
  - **D080** → Partially Implemented (slice 16); Current implementation / Missing work / Dependency-boundary separated; program-changing edit gaps kept open.
  - **D084** → Partially Implemented (slice 16); safe-field flow recorded; confirmation-flow gap kept open.
  - **D085** → kept **Not Implemented** with a "Profile read-side presentation only" clarification.
  - **D086** → Partially Implemented (slice 16); the full accepted target build preserved under Dependency / boundary.

- **`docs/CURRENT_STATE.md`**
  - Added a dated **`feat/approved-app-rebuild` — Slice 16** section recording the wiring, the two safe edits, the authenticated-Server-Action / no-client-`user_id` boundary, revalidation, legacy-null handling, display-only Full Body, read-only program-changing fields, preserved subscription/logout, and the main implementation files (no source pasted). Added a one-line note that the document body remains the 2026-06-12 pre-rebuild snapshot.

- **`docs/BFG_UI_RULES.md`**
  - **§24** — added a concise implementation-status note: slice 16 implements the structure and safe editing of Goal + Avatar Name; program-changing fields remain read-only pending Program Assignment / Replacement. The accepted final §24 specification is preserved.

- **`docs/ui/BFG_SCREEN_WIREFRAMES.md`**
  - **§10** — added a concise implementation-status note: slice 16 currently enables Цель + Имя only; the remaining D080 fields are read-only and deferred. The final wireframe and its edit affordances are preserved.

## Files added

- **`docs/CHANGELOG_SLICE16_PROFILE_DATA_WIRING.md`** (this file).

---

## Notes and boundaries

1. **No accepted product decision was changed** and **no new decision number** was created — only Implementation Status / notes / gap status / summary counts.
2. **D085 stays Not Implemented** — read-side presentation is not an assignment implementation.
3. **D083 is not overstated** — read-side display only; the persistence/switching model is unbuilt.
4. **Program-changing Profile edits remain deferred** until safe Program Assignment / Replacement support exists (D061/D085) with the D084 confirmation flow.
5. **Summary arithmetic reconciliation:** the registry table's pre-sync counts were 17 / 10 / 59; the D079 table entry lagged its own *Implemented* status, so D079 was moved into Implemented as part of preventing that contradiction, yielding the expected **18 / 13 / 55 = 86** after the slice-16 moves.
6. **No source code** was modified during this documentation sync; **no migration** was created; **no commit / push**.
