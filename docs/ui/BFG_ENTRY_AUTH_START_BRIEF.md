# Entry / Auth Start Screen — Implementation Brief

An implementation brief for the unauthenticated first-contact screen. This is a **brief**, not a decision registry: the load-bearing decisions live in [`BFG_PRODUCT_DECISIONS.md`](../BFG_PRODUCT_DECISIONS.md) — **Decision 074** (Entry / Auth Start Screen) and **Decision 075** (Adaptive Cinematic Canvas Responsive Model). Where this brief and a decision disagree, the decision wins and this brief must be corrected.

> Source of truth: D074, D075, [`BFG_UI_RULES.md`](../BFG_UI_RULES.md) §1–§2 / §21, [`ui/BFG_SCREEN_WIREFRAMES.md`](./BFG_SCREEN_WIREFRAMES.md) §0. (Onboarding-S1 boundary: D079, `BFG_UI_RULES.md §23`, wireframes §0.2.)
> Copy in this brief is **placeholder only** — D074 approves structure, interaction rules, and copy principles, not final copy.

---

## 1. Goal & scope

The unauthenticated first-contact screen. Calm, dark, cinematic — not a raw login form, not a marketing landing page. One job: **lead into Sign Up**, with a quiet Log In path for returning users.

- **In scope:** the Entry screen UI, its responsive behavior, the Seed Form treatment, the decorative tap-hint, the single primary CTA + Log In link.
- **Out of scope:** the Sign Up form internals, onboarding (the onboarding Seed Form role is governed by **D079** and `BFG_UI_RULES.md §23` / `BFG_SCREEN_WIREFRAMES.md §0.2` — this brief covers Entry only), any trial/pricing UI, avatar customization.
- **"Done" looks like:** the screen renders per the composition and responsive tiers below, passes the acceptance criteria (§9), uses placeholder copy only, and contains nothing on the forbidden list (§8).

---

## 2. Composition (top → bottom)

1. Minimal brand mark (`BFG.`), small, top.
2. **Seed Form (First Presence Form)** — optical center, primary visual accent.
3. Headline (placeholder) + optional one-line subtitle (placeholder).
4. **Single primary CTA** → Sign Up.
5. Quiet, low-emphasis secondary **Log In** link.
6. Dark cinematic canvas / ambient glow behind all of it.

```
┌─────────────────────────────┐
│  BFG.                        │  Minimal brand mark (small, top)
│                             │
│          ╭───────╮          │  SEED FORM (First Presence Form) — optical center
│          │ ◌ ◌ ◌ │          │   • alive but minimal: breathing + subtle glow
│          │ first │          │   • neutral · unfinished · not gendered · not customized
│          │ form  │          │   • NOT a default/final avatar · NEVER Stage 10 (D010)
│          ╰───────╯          │   • Voice-silent · tap-reactive DECORATIVELY only
│   [headline — placeholder]  │  calm, sentence case (no all-caps, no «победы»)
│   [subtitle — placeholder]  │  optional one-line subtitle
│                             │
│   ┌─────────────────────┐   │
│   │   [Primary CTA]      │   │  the ONLY primary action → Sign Up
│   └─────────────────────┘   │
│         [Log in]            │  quiet secondary link → Log In
│                             │
└─────────────────────────────┘
   Mobile-first 360–430px · dark/calm · NO SCROLL · fits initial viewport
```

---

## 3. Responsive model — Adaptive Cinematic Canvas (Decision 075)

BFG is **mobile-first, not mobile-only**. The 360–430px phone layout is the **source of truth**. Tablet use is valid and must look **intentional** — an expanded cinematic canvas, never a desktop dashboard, never a separate tablet product, never extra content. Principle across all tiers: **atmosphere expands, readable content stays capped.**

| Tier | Width | Behavior |
|---|---|---|
| **1 · Phone (source of truth)** | 360–430px | Baseline layout. **No scroll** (mandatory). |
| **2 · Large phone / small tablet** | 431–600px | Same layout, slightly expanded spacing. |
| **3 · Tablet** | 600–900px | **Expanded cinematic canvas** — Seed Form/atmosphere scale up moderately; central readable content preserved and centered. |
| **4 · Desktop Chrome** | 900px+ | Centered app / cinematic canvas; **no desktop dashboard**, no added panels/content. |

**Expands on wider screens (atmospheric only):** background glow, rings, ambient space, side fields, the visual stage, and the Seed Form (moderate scale-up on tablet).

**Stays capped (readable / interactive — never scales endlessly):**
- **CTA width:** ~**320–420px** cap, centered.
- **Headline / subtitle:** capped line length, centered.
- **Form controls / Log In link:** capped, centered.

**Scroll rule across tiers:** no horizontal scroll anywhere; **no vertical scroll is mandatory on the phone viewport** and should also hold on larger tiers. Do not force the whole screen into a narrow ~480px strip when a tablet viewport can support a richer stage; do not build a separate tablet/desktop layout with extra content.

---

## 4. Seed Form spec

- Neutral, unfinished **pre-presence** — **not** the user's avatar (the default avatar comes only after onboarding).
- **Not gendered, not customized; never a default/final avatar; never Stage 10 or any evolved form** (D010).
- **Alive but minimal:** breathing + subtle glow (the MVP Body floor — [`BFG_PRESENCE_RESPONSE_SYSTEM.md`](../BFG_PRESENCE_RESPONSE_SYSTEM.md) §7). No distinct reaction beats, no posture system.
- **Voice-silent:** no companion line here; the first-ever Presence Voice moment belongs to the first session after account creation (PRS §4).
- Scales up **moderately** on tablet (Tier 3); remains the optical center at every tier.

---

## 5. Interaction

- **Primary CTA → Sign Up** (email/password). The **only** path forward.
- **Seed Form tap = decorative path hint only** (context-scoped to this screen; **not** a navigation affordance, **not** a second CTA). The tap **must not** navigate, open auth/onboarding/customization, show Voice/companion text, or show any modal/tooltip/text hint. Permitted response: softly stir/pulse/brighten the Seed Form, and/or send a subtle glow/path toward the primary CTA, and/or softly highlight the CTA — **a short, calm moment within the existing motion budget (§5/§13 — up to ~600ms)**, degrading to a static emphasis under `prefers-reduced-motion`.
- **Secondary Log In link** → Log In (returning users), low-emphasis.

> Onboarding boundary (updated 2026-07-11): the onboarding Seed Form has its own functional role, governed by **D079** (`BFG_UI_RULES.md §23`, `BFG_SCREEN_WIREFRAMES.md §0.2`) — the onboarding **S1** Seed Form is functional and **advances directly to S2**, while the Entry Seed Form here remains **decorative and non-navigational**; S2–S4 Presence is non-interactive. This brief and D074 neither define nor override D079.

---

## 6. Copy (principles only — NOT final)

Placeholders only; D074 approves principles, not final text. Calm, **sentence case**; no all-caps headline; no exclamation marks; **no "победы"/win/competition framing** (D032, §11); no corporate fitness vocabulary; warm "ты"; no emoji; no descriptive paragraph / feature list. Headline + optional one-line subtitle + CTA label + Log In label are all finalized in a later copy pass.

---

## 7. Motion & accessibility

- Framer Motion only; animate `opacity`/`transform`; calm, ≤ ~600ms (§5).
- Breathing/glow idle loop is subtle and continuous; honors `prefers-reduced-motion` (reduce to static).
- CTA is a real button; Log In is a link/button; visible focus outlines; tap targets ≥ 44×44px; contrast per §9.
- Server-rendered initial paint; no client-only screen (MVP §5.1).

---

## 8. Forbidden (D074 / §21)

Stage 10 or any evolved/final avatar; a gendered/customized/finished avatar; the Seed Form as a navigation affordance or second CTA; a second primary CTA; any companion Voice line/chat/per-load phrase; trial/subscription/pricing (MVP); feature lists, marketing bullets, testimonials, social proof, descriptive paragraphs; "победы"/win/competition copy; hype; exclamation marks; all-caps motivational headline; casino-style/aggressive motion; any scroll; a separate tablet/desktop layout with extra content; endlessly scaling text/buttons; emoji.

---

## 9. Acceptance criteria

- Renders on **360px** with no horizontal scroll and **no vertical scroll** (whole screen in viewport).
- Tiers 1–4 behave per §3: atmosphere/Seed Form expand; CTA capped ~320–420px; headline/subtitle/controls capped and centered; no dashboard, no extra content.
- Seed Form is alive, neutral, never Stage 10/default avatar, Voice-silent.
- Seed Form tap produces only the decorative hint; no navigation/modal/voice; reduced-motion fallback verified.
- Exactly one primary CTA → Sign Up; quiet Log In present.
- No trial/pricing; no forbidden copy; copy is clearly placeholder.
- `prefers-reduced-motion` respected; Lighthouse a11y ≥ 95 (MVP §4).

---

## 10. Open items

- **Copy pass** (headline/subtitle/CTA/Log In) — separate approval (candidates drafted; none locked).
- **Seed Form art direction** — what a neutral, unfinished pre-presence looks like, and its tablet scale ceiling — needs a visual pass.
- **D075 cross-screen verification** — the adaptive cinematic canvas model is Partially Implemented; verify it across every screen, not just Entry.
