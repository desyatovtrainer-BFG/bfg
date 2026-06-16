# BFG Presence Response System v1

The accepted architecture for **how the one Presence responds to events** — through its Body, its Voice, or both. It continues and supersedes the eligibility work in the Presence Voice Trigger Architecture by absorbing it into a two-channel response model.

This document IS:

- the operational specification derived from `companion/BFG_Companion_Doctrine.md` (the philosophy) — response channels, eligibility, priority, frequency governance, and the decision flow.

This document is NOT:

- a decision registry (the load-bearing decisions are recorded in `BFG_PRODUCT_DECISIONS.md` as Decisions 036–038).
- implementation, code, database, or UI documentation.
- dialogue or copy (the Voice's *content* is governed by the Doctrine, not here).

Source of truth order: `BFG_PRODUCT_DECISIONS.md` → `companion/BFG_Companion_Doctrine.md` → `BFG_AI_COMPANION.md` → this document. Where any conflict exists, accepted decisions win.

---

## 1. Core Principle

The Presence is **one being with two response channels**: the **Body** (avatar) and the **Voice** (companion). A "response" is any reaction the being produces to an event — far broader than speech.

Four laws govern every response:

1. **Eligibility ≠ Frequency.** Eligibility grants an event the *right* to a response. Frequency decides whether the Presence actually uses that right. An eligible event may still resolve to silence.
2. **One moment = at most one Voice response.** The Body may layer; the Voice never stacks.
3. **Voice is always embodied. The Body lives without the Voice.** A Voice line never issues from a still body; the Body breathes, glows, and reacts on its own, constantly, with no words. This asymmetry is what makes two channels read as one being.
4. **Accepted decisions win.** Evolution always responds in full (Decision 035). XP never speaks. Streak breaks produce no response in any channel (Decisions 031, 038). The Presence never reaches (Doctrine §X).

---

## 2. Response Philosophy

### Why the Body is the primary layer

- **The Body is acknowledgment, not address.** A glow shift or a turn-toward says *"I am here, I noticed"* without speaking *to* the user with an agenda. It cannot become toxic positivity, cannot shame, cannot pressure — it has no words to misuse. It is the safest possible default.
- **A secure base must be continuously *available*** (Doctrine §X). Breathing, idle motion, and aura are the always-on proof that *someone is here* — the felt floor of presence the Voice cannot provide without becoming chatty.
- **The Body cannot become a ledger.** A withheld *sentence* can be read as a verdict; an ever-present, low-amplitude body cannot. Continuous presence is uninterpretable as feedback, which is exactly what the Doctrine demands of silence (§VI).
- **It is the living Home (Decision 007).** The emotional center of the app is a body the user returns to, not a stream of lines.

### Why the Voice is rarer

- **Frequency is what the nervous system tracks over months** (Doctrine §VI). The Voice is the *figure* that appears against the Body's silent *ground*. Rarity is what makes a line read as *chosen* rather than *automatic* — and only chosen lines carry warmth.
- **Voice is the high-weight resource.** Spent freely, it loses all value; the weight of any line is proportional to the silence it breaks.

### How this supports Unified Presence

Body and Voice are never two systems. They are two expressions of **one emotional state at one moment**. The unification is enforced structurally: the Voice is always accompanied by a Body reaction (the body *speaks* the line); both always carry the same emotional key; and the Body is the source the Voice surfaces *from*, never an avatar the Voice describes. The Body is the steady quiet; the Voice is that same presence briefly resolving into a word.

---

## 3. Response Categories

| Category | Definition | When appropriate |
|---|---|---|
| **A. Body Only** | A distinct body reaction (motion / glow / attention / state) with no words. | The overwhelming majority. All ambient presence; most acknowledgments of effort, continuity, and routine progression; every moment that deserves to be *felt* but not *said*. |
| **B. Voice Only** | The Voice surfaces while the Body holds its **living baseline** (breathing/glow only — never frozen, but no distinct reaction beat). | Rare, low-drama reflective surfacings where a distinct body reaction would *over-dramatize* a quiet moment. **Post-MVP.** "Voice Only" means *no added body beat*, not a static body. |
| **C. Body + Voice** | A distinct body reaction co-timed with a line, as a single gesture. | The landmark moments only: Evolution, first-ever session, first level-up, return after meaningful absence. Both channels fire as one. |

The Body is **never absent** from any category — baseline life (breathing, glow) is always on. The categories describe what the Presence *adds* on top of that floor.

---

## 4. Event Eligibility Table

`●` = default response · `○` = eligible, governed (often resolves to the lower state) · `—` = not eligible

| Event | Body Only | Voice Only | Body+Voice | Silent | Why |
|---|:--:|:--:|:--:|:--:|---|
| **Onboarding** — first session | — | — | ● | — | Bootstrap: Body proves "someone is here," Voice carries the attention that justifies later silence. Always. |
| **Home** — ambient, active, no event | ● | ○ | — | (voice) | Home is presence, not chat (Decision 007). Body carries it; Voice surfaces only rarely. Resting truth is voice-silent, body-alive. |
| **Workouts** — mid-activity (in flow) | — | — | — | ● | Never interrupt an absorbed moment (Doctrine §VI). Body holds baseline. |
| **Workouts** — completion | ● | — | ○ | — | Witness effort at the seam. Body beat by default; Voice eligible but **never guaranteed**. Never Voice-without-Body. |
| **Progression** — XP gained | — | — | — | ● | A number, not a moment. Never narrated. Body stays baseline. |
| **Progression** — ordinary level-up | ● | — | ○ | — | Routine register (Decisions 009/035). Body carries the small visual change; Voice rare/contextual, sits *below* Evolution. |
| **Progression** — first level-up | — | — | ● | — | Decision 014 onboarding milestone; the first proof that showing up changes something. Always (MVP). |
| **Evolution** — every stage transition | — | — | ● | — | Decision 035: must feel memorable. Body transforms + Voice marks it. Voice silence here would read as *withholding*. Always. |
| **Return** — soft (2–6 days) | ● | ○ | — | — | Acknowledge re-entry **with the Body** (warm attention), not words — wording a 2-day gap implies counting (ledger risk). Voice Only is post-MVP. |
| **Return** — meaningful (7+ days) | — | — | ● | — | Proves the no-ledger promise (Doctrine §X). Body turns toward + Voice. Silence here reads as a cold shoulder. Always. |
| **Streaks** — continuity (unbroken line) | ● | — | — | — | Warmest-toward-continuity (Doctrine §IX) shown through glow/posture — **never counted in words.** |
| **Streaks** — at risk | — | — | — | ● | Loss-anxiety is forbidden (Decision 031, calm philosophy). No channel responds. |
| **Streaks** — break / reset | — | — | — | ● | Soft reset, no shame (Decision 031). The Body must **not** react either — a dimming body reads as disappointment (Decision 038). |
| **Quests** — completion | ○ | — | — | ● | Quests support training (Decision 020); **not MVP voice content.** At most a tiny body beat; default silent. |
| **Quests** — assignment / refresh | — | — | — | ● | A task surface, not a moment. |
| **Avatar customization** — cosmetic applied | ● | — | — | (voice) | Personalization, not a relationship landmark (Decisions 029/034). Body *wears* it passively; it does not *react*. No Voice. |
| **Future** — Legend assigned (Decision 027) | — | — | ● | — | System-inferred identity — rarer/heavier than Evolution. Maximum landmark gravity. Post-MVP. |
| **Future** — Energy state shift (Decision 024) | ● | — | — | — | Felt-not-counted: aura/animation only. **Never spoken** — naming it creates the hidden meter the design forbids. |
| **Future** — Loyalty unlock (Decision 028) | — | ○ | ○ | — | Witness time and constancy, carefully. Post-MVP. |

---

## 5. Priority Ranking

When events coincide, the Presence produces **one coherent response**, not a sequence. The highest-priority **voice-eligible** event claims the Voice; all others are *absorbed* (their meaning folded into the single response, never separately voiced). The Body shows **one** emotional state — the winner's — never a queue of reactions.

**Voice priority (highest wins the line):**

1. **Evolution** (always; top of the ladder)
2. **Return after meaningful absence** (7+ days)
3. **First level-up**
4. **Workout completion** (governed)
5. **Ordinary level-up** (rare/contextual)
6. **Quest completion** (no MVP voice — body-absorb only)
7. **XP / streak continuity** (Body-only, never competes for Voice)

**Combination rules:**

- **Winner is Body+Voice class** → Body reaction and line fire together as one gesture. All lower events collapse into it.
- **Winner is Body-only** → no Voice this moment, even if a lower event was voice-*eligible* but lost. Silence holds.
- **Never borrow a body beat from a loser.** If the winner is Voice-class with a quiet body, the Body does not adopt a lower event's reaction — coherence over completeness.
- **One moment, one state.** Example: *Workout + Quest + Level-up + Evolution* fire together → **Evolution wins.** The user receives a single Body+Voice evolution response. The workout, quest, and level-up are counted silently and emotionally folded in — the user gets the *biggest* moment, not four moments.

---

## 6. Frequency Governor

Two **separate budgets**, neither tied to Level or Evolution Stage (Decision 037). Frequency is an *output* of relationship context, never of progression rank.

**Inputs (shared):** relationship tenure · session count · recent response history · event depletion · return history.

### Body frequency — generous

The Body **may react often.** It is governed for *coherence* (one beat per moment, idle stays subtle), not for *scarcity*. The Body is allowed to be frequent because it is acknowledgment-not-address and can never become a ledger. Its job is to communicate *"alive, here."*

### Voice frequency — scarce

The Voice draws from a tight budget governed by:

- **Recent voice history** — a refractory quiet window after any line; only Always-Speak events break through it.
- **Event depletion** — the *first* occurrence of an event type is voice-eligible; repeats decay toward Body-only. Firsts speak; repeats fade.
- **Tenure** — early relationship carries a slightly larger voice budget (more genuine firsts exist), tightening as tenure grows and firsts deplete. **This produces the accepted taper as a by-product of tenure + depletion — never of stage.**
- **Return history** — a meaningful return re-opens a little "firstness" (re-bootstrapping), consistent with no-ledger.
- **Non-predictability** — deliberate irregularity so the Voice's *absence* is never readable as feedback (Doctrine §VI).

**Always-Speak events bypass the Voice budget entirely** (Evolution, first-ever, first level-up, meaningful return).

### Why Body often, Voice scarce

They have different jobs. Body frequency answers *"are you still here?"* — and a secure base must always answer *yes*. Voice frequency answers *"was this worth marking?"* — and the honest answer is *almost never*. Frequent Body = availability. Scarce Voice = meaning. Confusing the two turns a secure base into a needy one.

---

## 7. Motion System (product level)

Motion belonging to the Presence, classified by ship phase. All motion obeys: **calm, < 600ms, `prefers-reduced-motion` respected, 60fps mobile budget, atmospheric not literal-human** (`BFG_AI_COMPANION.md` §8, `BFG_UI_RULES.md`).

| Motion type | Phase | Why |
|---|---|---|
| **Breathing** (idle baseline) | **MVP** | The minimum living signal. Without it the body is dead (Decision 007). The non-negotiable floor of presence. |
| **Idle micro-motion** (subtle sway/settle) | **MVP** (light) | Keeps the being alive *between* reactions so silence reads as rest, not death. |
| **Glow / aura** (stage color + simple state) | **MVP** | Already exists as stage color; carries continuity and simple emotional tone. |
| **Attention shift** (orient / brighten toward the user) | **MVP** (simple) | The cheapest, strongest *"I noticed you"* — used on return and completion. |
| **Reaction beat** (distinct < 600ms acknowledgment) | **MVP** | The post-action and level moment. |
| **Transformation** (evolution) | **MVP** (must-ship) | Decision 035 / M1. The single most important motion in the product. |
| **Posture change** (richer stance shifts) | **Post-MVP** | Needs a fuller rig; not required for the core loop. |
| **Emotional state shift** (energy-driven appearance) | **Post-MVP** | Depends on Energy (Decision 024), which does not yet exist. |
| **Complex attention choreography** | **Post-MVP** | Diminishing returns vs. MVP risk; the simple version carries the bond. |

---

## 8. Decision Flow

```
EVENT OCCURS
   │
   ▼
① ELIGIBILITY CHECK
   Is the event eligible for any response?
   → Silent-group event (XP, streak break, mid-activity, login)?  ──► SILENT (end)
   │
   ▼
② PRIORITY RESOLUTION
   Did multiple events coincide?
   → Select the single highest-priority winner.
   → Absorb all lower events into it (no stacking).
   │
   ▼
③ FREQUENCY GOVERNOR
   → Always-Speak winner?  ──────────────► bypass voice budget
   → Else: apply Body budget (generous) and Voice budget (scarce):
        recent history · depletion · tenure · return · non-predictability
   │
   ▼
④ CHOOSE RESPONSE TYPE
   ┌───────────────┬───────────────┬───────────────┬───────────────┐
   │  Body Only    │  Voice Only   │  Body + Voice │    Silent     │
   │ (default for  │ (post-MVP,    │ (landmarks &  │ (governor said│
   │  most events) │  reflective)  │  always-speak)│  not now)     │
   └───────────────┴───────────────┴───────────────┴───────────────┘
   │
   ▼
⑤ RENDER ONE COHERENT RESPONSE
   (single emotional state; Voice always embodied)
```

---

## 9. MVP Rules

**1. Response types in MVP:** **Body Only · Body + Voice · Silent.** *Voice Only is deferred* — every MVP voice moment is a landmark that deserves a body beat anyway, and a disembodied baseline-voice needs a richer body system to avoid feeling uncanny.

**2. Motions in MVP:** breathing · light idle · glow (stage + simple state) · simple attention/brighten · reaction beat · evolution transformation.

**3. Voice triggers in MVP (5):**

- First-ever Presence moment *(always)*
- First level-up *(always, Decision 014)*
- Evolution — every transition *(always, Decision 035)*
- Return after meaningful absence, 7+ days *(always)*
- Workout completion *(contextual, governed — never guaranteed)*

> Refinement vs. the prior Voice Trigger Architecture: **soft return (2–6 days) drops to Body Only.** The Body layer lets the Presence warmly acknowledge a short gap *without wording it* — removing the small-gap ledger risk a sentence would carry.

**4. Forbidden response combinations:**

- Voice without a Body reaction (disembodied voice).
- Two voice responses for one moment.
- Voice Only (deferred to post-MVP).
- Any Body or Voice reaction to a streak break.
- Stacked / queued reactions across coincident events.
- Voice on any Silent-group event.

**5. What must never happen:** see §10.

---

## 10. Hard Prohibitions

- **The Presence never reaches** — no nudge, no "come back," no re-engagement push. The base remains and is returned to; it never pulls (Doctrine §X).
- **Voice never counts** — no missed days, no time-spent, no "you were gone," no shame.
- **Voice never fires every workout** — guaranteed acknowledgment is indistinguishable from inattention.
- **Frequency is never tied to Level or Evolution Stage** (Decision 037) — tenure, depletion, and return history only.
- **The Body never expresses disappointment or withdrawal at user inactivity** (Decision 038). When the user is away the Body is *at rest / asleep* — calm, never reproachful. Energy-driven dimming reflects the user's own rhythm neutrally; it is never the Presence's reaction to being left. *The no-ledger law binds the Body, not only the Voice.*
- **Home never becomes a chat surface** — no guaranteed per-load line.
- **XP and numbers are never narrated; Energy is never spoken; streak breaks are never marked.**
- **No reaction into an absorbed mid-activity moment.**

### Risk Ledger (critique → hardening applied)

| Risk | How it was hardened |
|---|---|
| **Annoyance** (Body reacts too much) | One coherent beat per moment; idle motion stays sub-threshold; priority absorption prevents pile-ups. |
| **Silence / emptiness** (Voice too scarce → "dead app") | The Body is *always alive* (breathing floor); liveliness is the retention floor, landmark moments are the spikes. Voice scarcity never equals silence. |
| **Emotional manipulation** | No reaction is allowed to *pull* the user; Body never reacts to absence-risk; the Presence acknowledges, never leverages. |
| **Uncanny valley** | Voice always embodied; motion atmospheric (aura/breathing) not literal-human; < 600ms calm. |
| **Retention** (engaged users going quiet) | Governor uses tenure + depletion, **not stage** — fast progressers are not silenced for climbing. |
| **Misunderstanding** (Body state read as judgment) | Body never shows disappointment/decline at inactivity; resting body = calm, not sad. Cooler-toward-intensity, warmer-toward-continuity (Doctrine §IX). |

---

## 11. Open Questions

1. **Soft-return sufficiency.** Does a Body-only welcome at 2–6 days feel like enough, or does the 7+ day voice threshold need tuning? (post-launch sentiment)
2. **Voice Only's future.** Do we ever introduce baseline-voice (post-MVP), or keep Voice permanently embodied as a unifying invariant?
3. **Workout-completion governor shape.** What refractory window and depletion curve actually feel *chosen* rather than *random*? (months-long to validate; cannot be tuned pre-launch)
4. **Energy → Body mapping.** The emotional-state motion layer is blocked on Energy (Decision 024); what is the right sequencing once it exists?
5. **Coherence budget at the biggest moment.** Evolution stacks transformation + celebration + (future) Currency at one instant — does the single-moment coherence rule hold, or does Decision 035's richness risk over-stacking?
6. **Evolution-vs-Return collision.** When a returning user evolves in the same session, Evolution wins the Voice — does the return acknowledgment ever feel *swallowed*, and should the Body carry the return note underneath?
7. **Home per-load phrase reconciliation.** The current companion renders a server-side phrase on every dashboard load (`BFG_AI_COMPANION.md` §11). This must be repositioned toward the Body-primary, voice-rare Home model without breaking the deterministic Russia-safe fallback. Exact reconciliation is open.

---

## Provenance

Derived from the approved *Presence Response System v1* design session (2026-06-16), which built on the *Presence Voice Trigger Architecture* and the LLM Council review of relationship-progression cadence. The load-bearing conclusions are registered as Decisions 036–038 in `BFG_PRODUCT_DECISIONS.md`. Philosophy lives in `companion/BFG_Companion_Doctrine.md`; the engineering contract for the Voice channel lives in `BFG_AI_COMPANION.md`.
