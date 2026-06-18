# Changelog — D039 Home Concept Candidate A (approved)

Date: 2026-06-18
Scope: Home screen architecture / product decision. Documentation only — no code, schema, or UI changes.

---

## Summary

Recorded **Decision 039 — Home Concept Candidate A** as Accepted (MVP). The approved Home composition: a **living Presence in the visual center** (primary focus), an **inner Level Progress ring** and **outer Weekly Progress ring** around it, a **Stage Block** (Stage Title + Stage Number, ref "SEEKER / STAGE 3") beneath it, and a single **"Continue Journey"** CTA. Home shows **simplified progress only**; detailed statistics remain on Progress (D008). Presence Voice placement on Home is deferred.

D039 **refines D007**: Home stays Presence-first, but an approved simplified progress layer (rings + Stage Block) is now part of the composition. This is an explicit supersession of any "no indicators on Home" reading of D007, not an unresolved contradiction.

---

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decision 039** (Accepted, UX, MVP) with the nine approved structure points, a scope note (Home content only; nav stays under D003–006; notifications out of scope), the D007-refinement clause, and the D031 tone guard.
  - Added a "refined by Decision 039" cross-reference to **Decision 007**.
  - Updated the contradictions note to record the D039→D007 refinement as an explicit supersession (0 unresolved).
  - Updated Implementation Summary: Not Implemented 12 → 13 (+039); Total 38 → 39.

- **`docs/BFG_UI_RULES.md`**
  - Added **§15 — Home composition (Candidate A)**: Presence center/primary, inner Level ring + outer Weekly ring as a supporting layer, Stage Block, single "Continue Journey" CTA, simplified-progress-only rule, deferred Voice placement, and the D031 no-shame tone guard. Reuses the existing calm-motion budget (§5, §13).

- **`docs/BFG_PRODUCT_GAPS.md`**
  - Updated summary counts to 39 / 17 / 9 / 13 and the P1 count to 11.
  - Added a **P1 gap entry for D039** (Home composition Not Implemented).
  - Noted that detailed gap entries for D036–D038 are pending the next gap sync.

## Files added

- **`docs/CHANGELOG_HOME_ARCHITECTURE_D039.md`** (this file).

---

## Documentation conflicts surfaced (not resolved here)

These were recorded but intentionally not changed, per scope:

1. **Reference image bottom navigation** shows `HOME · WORKOUTS · QUESTS · PROGRESS · LEGENDS` with Home left-most. This conflicts with **D003** (Workouts · Nutrition · Home(center) · Progress · Multimedia), **D004** (quests live inside Workouts, not a top-level tab), and treats Legends as a nav tab (it is a post-MVP identity system, D027). D039 explicitly does **not** approve the nav; nav remains governed by D003–006.
2. **Notification bell + dot** in the reference is not part of D039 and is not approved here; the Presence-first Home direction treats notifications cautiously.
3. **Stage Title "SEEKER"** uses Legend-archetype vocabulary (D027 reserves Warrior/Guardian/Wanderer/Sage for Legends), and a Legends surface exists — a naming collision to resolve in the naming pass (D039 approves the structure, not the words).
4. **Weekly Progress ring** must honor the no-shame rule (D031); presentation of an incomplete week must avoid deficit/failure framing.
5. **`BFG_AI_COMPANION.md` §12 / `BFG_PRESENCE_RESPONSE_SYSTEM.md` §11** describe a Body-led Home and an open question about the per-load phrase; these remain consistent with D039 (Voice placement deferred) but should be cross-referenced in the next companion-docs sync.

---

## Follow-ups (later documentation syncs)

1. Detailed `BFG_PRODUCT_GAPS.md` entries for **D036–D038** (Presence Response System).
2. Reconcile the **bottom navigation** shown in the Home reference with D003–006 before Home build.
3. **Stage Title naming pass** to avoid the Legend-vocabulary collision (D027).
4. Add `BFG_PRESENCE_RESPONSE_SYSTEM.md` and the Home composition to `docs/PROJECT_INDEX.md` / `docs/SOURCE_OF_TRUTH.md` if those indexes are maintained.
5. Define the **Weekly Progress** semantics (what the ring counts, reset behavior) in line with D031 before implementation.
