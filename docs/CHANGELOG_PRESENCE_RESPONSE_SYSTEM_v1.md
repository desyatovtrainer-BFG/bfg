# Changelog — Presence Response System v1

Date: 2026-06-16
Scope: Companion / Presence architecture. Documentation only — no code, schema, or UI changes.

---

## Summary

Persisted the approved **Presence Response System v1** as a standalone specification and wired its load-bearing conclusions into the registry, the companion engineering contract, and the companion doctrine. The system formalizes that the Presence responds through **Body, Voice, or both**, separates **eligibility from frequency**, and binds response **cadence to relationship tenure — never to Level or Evolution Stage**.

---

## Files added

- **`docs/BFG_PRESENCE_RESPONSE_SYSTEM.md`** (new) — full v1 specification: core principle, response philosophy, response categories (Body Only / Voice Only / Body+Voice), event eligibility table, priority ranking, frequency governor, motion system (MVP vs post-MVP), decision flow, MVP rules, hard prohibitions, risk ledger, and open questions.

## Files changed

- **`docs/BFG_PRODUCT_DECISIONS.md`**
  - Added **Decision 036** — Presence Response System (Body, Voice, or both; eligibility ≠ frequency; one Voice per moment; Voice always embodied). Status: Partially Implemented.
  - Added **Decision 037** — Response frequency is an output, never tied to Level or Evolution Stage (governed by tenure / session count / response history / event depletion / return history). Status: Partially Implemented.
  - Added **Decision 038** — The no-ledger principle binds the Body as well as the Voice (no channel expresses disappointment at inactivity; no channel marks a streak break). Status: Partially Implemented.
  - Updated Implementation Summary: Partially Implemented 6 → 9; Total decisions 35 → 38; added a dated note for the 036–038 acceptance.

- **`docs/BFG_AI_COMPANION.md`**
  - §1: added a pointer framing the companion as the **Voice** channel of the Presence Response System.
  - Added **§12 — Presence Response System (the Voice is one channel)**: eligibility ≠ frequency; Voice always embodied; one Voice per moment; MVP voice trigger set (5); state reconciliation (`soft_return` → Body-only in MVP, `warm_return` stays Voice, `in_streak` Body-only, streak breaks silent); Home is not a chat surface; no-ledger binds the Body. Existing security / Russia / deterministic-fallback contracts explicitly unchanged.

- **`docs/companion/BFG_Companion_Doctrine.md`**
  - Intro: added a pointer to the derived operational system (`BFG_PRESENCE_RESPONSE_SYSTEM.md`).
  - §VI (Cadence): added "Frequency is an output, never a lever tied to rank" — tenure/return/depletion govern cadence; Body and Voice keep different cadences.
  - §X (Secure-Base): added "The no-ledger principle binds the Body, not only the Voice" — the Body never looks disappointed by absence.
  - §XIV (Restraint canon): appended principles 13–15 (Body primary / Voice never disembodied; cadence by relationship age not rank; no-ledger binds the Body).

---

## Notable design decisions captured

- **Frequency is decoupled from progression.** Per the prior council review, tying cadence to Evolution Stage/Level is rejected; the accepted taper emerges from tenure + event depletion instead (Decision 037).
- **The Body becomes the primary communication layer.** Voice is the rare, always-embodied figure against the Body's continuous presence (Decision 036).
- **No-ledger extended to motion.** The Body must never express reproach at inactivity — closing the gap where a dimming/“hurt” avatar could reintroduce the ledger the Voice is forbidden from keeping (Decision 038).
- **MVP refinement:** soft return (2–6 days) moves from a Voice trigger to **Body-only**, removing the small-gap ledger risk.

---

## Follow-ups (out of scope for this change set)

These were intentionally not edited to stay within the requested file set; flagged here so they are not lost:

1. **`docs/BFG_PRODUCT_GAPS.md`** — its summary mirrors the registry counts (Total 35, Partially Implemented 6) and now lags. It should be resynced to 38 / 9 and gain gap entries for D036–D038 (the living Body, the frequency governor, and the Body's no-ledger behavior are all Not/Partially built).
2. **`docs/PROJECT_INDEX.md` / `docs/SOURCE_OF_TRUTH.md`** — consider adding `BFG_PRESENCE_RESPONSE_SYSTEM.md` to the documentation index.
3. **Home per-load phrase** — `BFG_AI_COMPANION.md` §11 still requires a server-rendered companion phrase on every dashboard load, which the Body-primary Home model repositions. Tracked as Open Question 7 in the new spec; needs a reconciliation decision before the navigation/Home work (D003–D007) lands.
