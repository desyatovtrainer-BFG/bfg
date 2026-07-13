# BFG Screen Wireframes

First official **Wireframe Layer** for BFG. This document specifies screen *composition, hierarchy, state, and transitions* — not visual design. It is built strictly from accepted product decisions; it invents nothing.

> Source of truth: [`BFG_PRODUCT_DECISIONS.md`](../BFG_PRODUCT_DECISIONS.md) (decisions win on any conflict) and [`BFG_UI_RULES.md`](../BFG_UI_RULES.md) §15–§20. Where this document and a decision disagree, the decision wins and this document must be corrected.

Status: first slice. This pass covers **Entry / Auth Start, Auth Surface (Sign Up / Verify Email / Log In), Onboarding (S1–S4), Activity, Workout Start Screen, Single Exercise Step, Superset Step, Workout Finish Screen, Reward Modal, Evolution Flow, Home, Progress, Profile**. Per-variant detail and the Avatar Customization surface (D073) are deferred to a later wireframe pass.

Last updated: 2026-07-13 (Slice 16 Profile implementation boundary added to §10 — Goal and Avatar Name editable; program-changing fields read-only pending Program Assignment / Replacement; wireframe body unchanged). Prior: 2026-07-11 (D079 finalized S1 interaction — direct Seed Form tap → S2, inactivity reveal as fallback; D074/D079 Entry-vs-Onboarding Seed Form boundary clarified in §0). Prior: 2026-07-01 (Profile Screen Structure and Single-Modal Edit Flow D086 — Profile wireframe §10 added; Training Structure / reduced Program Family model D085 + Profile editability & confirmation D084 — S3 wireframe + onboarding scope updated; First Home After Onboarding D082 + Avatar Direction Slots D083 — Home/Progress/S4 annotations updated; Onboarding copy/taxonomies D079 + editable inputs D080 + conditional frequency / Program Family D081 — Onboarding S1–S4 wireframes finalized; MVP Onboarding Flow Structure D078 — Onboarding S1–S4 wireframes added; Auth Surface D076 + Required Email Verification D077 — Auth wireframes added; Entry / Auth Start Screen D074 — Entry wireframe added; Final Progress Product Structure D072 + Avatar Customization Entry D073 — Progress wireframe added, Home tap annotation added).

For every screen this document records, in order:

1. **Goal** of the screen
2. **Composition** top → bottom
3. **Primary visual accent**
4. **Secondary element**
5. **User action**
6. **Destination after the action**

---

## Conventions

- Mobile-first frame, 360–430px, dark/calm (BFG_UI_RULES §1). These wireframes are **mobile-first** and describe the 360–430px source-of-truth structure; on tablet the **cinematic canvas may expand** (atmosphere/glow/rings/side fields scale up) while readable/interactive content stays capped and centered — the app never becomes a desktop dashboard (Adaptive Cinematic Canvas, **Decision 075** / BFG_UI_RULES §2).
- Workout card content = **Workout Number · Workout Title · Exercise Count** only (D045, D055, D068).
- Card outline by state (D054): **Default** = blue · **Upcoming** = orange + marker · **In Progress** = green + marker. One state marker per card (D048); In Progress has list-wide priority over Upcoming (D057).
- "Continue Journey" (the global resume action) lives on **Home**, never on Activity (D043). Home is specified in §8.
- Session navigation is **swipe-only**, no Next/Previous buttons (D063).
- The **Entry / Auth Start** screen (§0) is the **unauthenticated** first contact; all other screens here are post-auth (D074). The **Auth Surface** (§0.1) and **Onboarding** (§0.2) sit between Entry and Home: **Entry → Auth Surface → Onboarding S1–S4 → Home** (D076, D077, D078).
- **Onboarding is Presence-led dialogue (D078):** the Presence is on every onboarding screen and owns the question framing; the options are the user's structured replies — never a form wizard.

---

# 0. Entry / Auth Start Screen

The **unauthenticated** first-contact screen (D074). Calm, dark, cinematic — not a raw login form, not a marketing landing page. Leads into Sign Up (email/password, MVP) → onboarding, with a quiet Log In path for returning users. **No scroll** — the whole screen fits the initial mobile viewport (BFG_UI_RULES §1, §21).

```
┌─────────────────────────────┐
│  BFG.                        │  Minimal brand mark (small, top)
│                             │
│          ╭───────╮          │  SEED FORM (First Presence Form) — optical center
│          │ ◌ ◌ ◌ │          │   • alive but minimal: breathing + subtle glow (MVP Body floor)
│          │ first │          │   • neutral · unfinished · not gendered · not customized
│          │ form  │          │   • NOT a default/final avatar · NEVER Stage 10 (D010)
│          ╰───────╯          │   • Voice-silent (first Voice moment = first session, PRS §4)
│                             │   • tap-reactive DECORATIVELY · NOT a navigation affordance
│   [headline — placeholder]  │  calm, sentence case (no all-caps, no «победы») — copy not final
│   [subtitle — placeholder]  │  optional one-line subtitle — copy not final
│                             │
│   ┌─────────────────────┐   │
│   │   [Primary CTA]      │   │  the ONLY primary action → Sign Up (copy not final)
│   └─────────────────────┘   │
│         [Log in]            │  quiet secondary link → Log In (copy not final)
│                             │
└─────────────────────────────┘
   Mobile-first 360–430px · dark/calm · NO SCROLL · fits initial viewport
```

**1. Goal:** make calm, premium first contact and offer the single way in (Sign Up), with a quiet Log In path — without showing the final avatar, without marketing, without a dry form.

**2. Composition top → bottom (D074):** Minimal brand mark → **Seed Form** (center) → calm headline (+ optional one-line subtitle) → **single primary CTA** (→ Sign Up) → quiet secondary **Log In** link.

**3. Primary visual accent:** the **Seed Form** — alive but minimal, neutral, non-final (never Stage 10 / never a default avatar, D010).

**4. Secondary element:** the headline/subtitle and the quiet Log In link. The **primary CTA** is the only primary action (the Seed Form is not a competing action).

**5. User action:** press the **primary CTA** → Sign Up. Optionally **tap the Seed Form** → a **decorative path hint only** (soft stir/glow toward the CTA, short and calm, within the §5 motion budget, `prefers-reduced-motion` respected) — it does **not** navigate, open auth/onboarding/customization, speak, or open any modal/tooltip/hint (D074). Tap the quiet link → Log In.

**6. Destination after the action:**
- Primary CTA → **Sign Up** (email/password) → **onboarding** (onboarding flow specified separately).
- Seed Form tap → **no destination** (decorative hint only; stays on the Entry screen).
- Log In link → **Log In** (returning users).

> **Scope (D074, boundary updated 2026-07-11):** §0 governs the Entry / Auth Start screen only. The **onboarding** Seed Form interaction is **outside D074 scope** and is governed by **D079 / §0.2**: the Entry tap remains a **decorative hint with no destination**, while the onboarding **S1** tap **advances to S2**; S2–S4 Presence remains non-interactive. **No final copy** is approved — headline / subtitle / CTA text above are placeholders; D074 approves structure, interaction rules, and copy principles only.
> **Forbidden here (D074):** Stage 10 / any evolved or final avatar; a gendered/customized/finished avatar; the Seed Form as a navigation affordance or a second CTA; a second primary CTA; a companion Voice line / chat; trial / subscription / pricing (MVP); feature lists / marketing bullets / testimonials / paragraphs; "победы" / win / competition copy; hype; exclamation marks; all-caps motivational headline; casino-style motion; any scroll; emoji.

---

# 0.1 Auth Surface — Sign Up / Verify Email / Log In

The Auth flow between Entry (§0) and Onboarding (D076, D077). **One Auth surface, three states — Sign Up · Verify Email · Log In — sharing one shell**, reached as a real navigation step from Entry (not a modal). Flow: **Entry → Auth Surface → Onboarding → Home.** Mobile-first 360–430px, **no scroll** with the keyboard closed; the reduced **Seed Form** continues as a non-interactive background glow/silhouette (Voice-silent, not tappable). Email verification is a **required, hard-blocking** pre-onboarding **OTP** gate (D077).

**State A — Sign Up**
```
┌─────────────────────────────┐
│ ‹ back            BFG.        │  minimal top bar: back → Entry (D074); brand mark
│                             │  (receded Seed Form glow behind, non-interactive)
│   [heading — placeholder]   │  one calm line, sentence case
│   Почта                     │  email (type=email, autocomplete=email)
│   [______________________]  │
│   Пароль                ◡   │  password + show/hide (autocomplete=new-password)
│   [______________________]  │
│   ┌─────────────────────┐   │
│   │   [Primary CTA]      │   │  single primary → create account (capped ~320–420)
│   └─────────────────────┘   │
│   Уже есть аккаунт? Войти    │  quiet switch → Log In
│   [legal/privacy line]      │  one quiet line (Terms/Privacy), links only, if required
└─────────────────────────────┘
   success → Verify Email (never straight to onboarding)
```

**State B — Verify Email (required gate, D077)**
```
┌─────────────────────────────┐
│ ‹ back            BFG.        │
│   [heading — placeholder]   │  calm, e.g. "подтверди почту"
│   Код отправлен на {email}  │  "code sent to {email}" line
│   [ _ _ _  _ _ _ ]          │  6-digit OTP field
│   ┌─────────────────────┐   │
│   │   [Verify CTA]       │   │  primary → verify
│   └─────────────────────┘   │
│   Отправить код ещё раз (30s)│  quiet resend with visible cooldown
│   Изменить почту            │  quiet change-email → back to Sign Up (email editable)
│   [inline error — calm]     │  generic, non-enumerating, never a toast
└─────────────────────────────┘
   correct OTP → ONBOARDING START
```

**State C — Log In**
```
┌─────────────────────────────┐
│ ‹ back            BFG.        │
│   [heading — placeholder]   │
│   Почта                     │  email (autocomplete=email)
│   [______________________]  │
│   Пароль                ◡   │  password + show/hide (autocomplete=current-password)
│   [______________________]  │
│   Забыли пароль?            │  quiet link → Supabase reset email (entry only; reset flow = future decision)
│   ┌─────────────────────┐   │
│   │   [Primary CTA]      │   │  single primary → войти
│   └─────────────────────┘   │
│   Нет аккаунта? Создать      │  quiet switch → Sign Up
└─────────────────────────────┘
```

**1. Goal:** create an account (with a verified email) or sign back in, in a calm shell continuous with Entry — then hand off to onboarding (Sign Up) or route an existing user home/onboarding (Log In).

**2. Composition top → bottom:** minimal top bar (back → Entry) → brand mark + receded Seed Form → state body (fields / OTP) → single primary CTA → quiet secondary action(s).

**3. Primary visual accent:** the single primary CTA of the active state. The Seed Form is atmosphere, never the accent here.

**4. Secondary element:** the quiet switch / resend / change-email / forgot-password links; the receded Seed Form glow.

**5. User action:** Sign Up (email + password) → Verify Email; enter the 6-digit OTP → onboarding; or Log In. Resend (cooldown) / change email are the Verify Email fallbacks. Errors are calm, inline, generic, non-enumerating (never a toast).

**6. Destination after the action:**
- Sign Up success → **Verify Email** (§0.1 State B).
- Verify Email correct OTP → **Onboarding start** (onboarding flow specified separately).
- Log In, verified + onboarding done → **Home** (§8).
- Log In, verified + onboarding unfinished → **resume onboarding**.
- Log In, unverified + correct credentials → **Verify Email**.
- Log In, wrong credentials → **generic invalid-credentials error** (stay on Log In).
- Already-authenticated visit → **redirect** (Home / resume onboarding / Verify Email); never the form.

**Tablet (D075):** same centered, capped form column; the Seed silhouette / glow / side fields expand as atmosphere around it. No extra panels, no dashboard.

> **Scope (D077):** verification lives **only** in the Verify Email auth state. **No verification, password-confirmation, legal-consent, payment, or subscription field appears on the Naming Ceremony or any onboarding screen** — the Naming Ceremony stays purely emotional. Home is reached only after verification, so there is **no standing Home/Profile verification banner on the happy path** (Profile surfaces verification only on failure / recovery). The blocking gate depends on a RU-reachable transactional email provider (infra/BFG_SUPABASE_STRATEGY §4); grace-degradation is an emergency contingency only, not the default.
> **Forbidden here (D076, D077):** trial / subscription / pricing; marketing paragraphs / feature lists / testimonials; companion Voice line / chat; onboarding questions; dashboard metrics; bottom navigation; the Seed Form as central / interactive / tappable; aggressive live red validation; toast as primary feedback; account-existence-leaking errors; hype; exclamation marks; all-caps headings; casino-style motion; emoji; horizontal scroll; default-state vertical scroll (keyboard closed); a separate tablet/desktop layout with extra content. **No final copy is locked** — all text above is placeholder.

---

# 0.2 Onboarding — S1–S4 (Presence-led dialogue)

Onboarding begins only after Verify Email succeeds (§0.1, D077) and ends at Home (§8). **Four screens + a silent program-assignment step** (D078). **Governing rule:** the **Presence is on every screen and owns the question framing** — it asks, the on-screen options are the user's **structured replies**. It must feel like *"the Presence is getting to know me,"* not a form wizard. Voice/text framing is restrained and rare (PRS §4, Companion Doctrine); **no chat panel, no free-form chat**. Mobile-first 360–430px (D075); calm motion (D075/§5). **Copy below is the accepted MVP copy (D079); taxonomies are D079; conditional frequency + Program Family/Variant are D081; post-onboarding editability is D080.**

```
Verify Email ✓ (§0.1) → S1 → S2 → S3 → [silent Program Assignment, no screen] → S4 → Home (§8)
```

**S1 — Seed Form / First Meeting (D079, finalized 2026-07-11)** — initial state has **no text and no CTA**; a **direct tap on the Seed Form advances straight to S2**; after **2–3 s of inactivity** the line + [Продолжить] appear as the calm fallback.
```
┌─────────────────────────────┐
│        ╭───────╮            │  PRESENCE ZONE — living Seed Form (first meeting)
│        │ ◌ Seed │           │  neutral/unformed · not default avatar · never Stage 10
│        ╰───────╯            │  TAP → S2 immediately (initial: no text, no CTA)
│   Давай сделаем первый шаг. │  appears after 2–3 s inactivity (calm fallback)
│   Я помогу тебе начать.     │
│   ┌─────────────────────┐   │
│   │     [Продолжить]     │   │  → S2 · same forward action as the Seed Form tap
│   └─────────────────────┘   │
└─────────────────────────────┘
```
- **Goal:** first meeting with the Presence. **Inputs:** none. **Direct action:** tap the Seed Form → **S2 immediately** (no reveal first; internal screen transition only, never a route). **Inactivity fallback:** after 2–3 s → dialogue + [Продолжить]; pressing [Продолжить] → S2; a Seed Form tap after the reveal still → S2. **Destination:** → S2. Only S1 Presence is interactive — S2–S4 Presence is non-interactive (the Entry Seed Form stays decorative — D074). **Forbidden:** any input/auth field; default avatar; Stage 10; chat panel.

**S2 — Goal + Hero/Heroine (D079)**
```
┌─────────────────────────────┐
│        ╭───────╮            │  PRESENCE ZONE — present, owns the framing (not decorative)
│        │ ◌ Seed │           │  unchanged on this screen (formation shows next screen)
│        ╰───────╯            │
│  Сейчас выберем направление │  S2 intro copy (D079)
│  и подстроим тренировки…    │
│  Какой результат тебе важен?│  Q1 Goal — MULTI-select (≥1)
│  [Снижение веса] [Масса]    │   weight_loss · muscle_gain · endurance ·
│  [Выносливость] [Форма] [Рекомп.]│ general_fitness · body_recomposition
│  Герой или героиня —        │  Q2 Hero/Heroine — single-select
│  чью главу открываем?       │
│  [ Герой ]  [ Героиня ]     │   male · female (labels «Герой»/«Героиня»)
│  Информацию можно изменить  │  helper line (→ Профиль)
│  позже в разделе «Профиль». │
│   ┌─────────────────────┐   │
│   │     [Продолжить]     │   │  active only when ≥1 Goal AND Hero/Heroine
│   └─────────────────────┘   │
└─────────────────────────────┘
```
- **Inputs:** Goal **multi-select (≥1)**; Hero/Heroine single-select (both required). **Hero/Heroine** drives Program Assignment + basic Stage-1 avatar direction (D061/D081); **Goal does NOT** drive assignment (framing / future personalization / future Post-MVP avatar starting-form). **Editable later in Profile (D080).** **Destination:** → S3.

**S3 — Experience + Training Format + Weekly Frequency + Conditional Training Structure (D079, D081, D085)**
```
┌─────────────────────────────┐
│        ╭───────╮            │  PRESENCE ZONE — first subtle FORMATION beat (from S2)
│        │ ◌ ~~~ │           │  still not the final default avatar
│        ╰───────╯            │
│  Мне нужно понять, какая    │  S3 intro copy (D079)
│  нагрузка подойдёт… и где.  │
│  Какой уровень тебе ближе?  │  Q1 Experience — single-select (GATE, not a family)
│  [Только начинаю]           │   beginner
│  [Тренируюсь менее года]    │   intermediate
│  [Регулярно больше года]    │   advanced
│  Где будешь тренироваться?  │  Q2 Training Format — single-select
│  [ Дома ]  [ В зале ]       │   home · gym
│  ── frequency hidden until both above selected ──
│  Сколько раз в неделю       │  Q3 appears ONLY after Experience + Format
│  тебе удобно тренироваться? │   shows only ALLOWED options for the Experience (D085)
│  [ 2 ] [ 3 ] [ 4 ]          │   Beginner→[2][3] · Intermediate→[3] · Advanced→[3][4]
│  ── structure hidden unless Gym AND Experience≠Beginner (D085) ──
│  Какой формат тебе ближе?   │  Q4 Training Structure — ONLY Gym Int-3 / Adv-3 / Adv-4
│  [ Фулбоди ]  [ Сплит ]     │   full_body · split (else auto Full Body, not shown)
│  Информацию можно изменить  │  helper line (→ Профиль)
│  позже в разделе «Профиль». │
│   ┌─────────────────────┐   │
│   │     [Продолжить]     │   │  active when Level+Place+Freq (+Structure if shown) set
│   └─────────────────────┘   │
└─────────────────────────────┘
   → [silent Program Assignment: direction(sex) × training_format × training_structure ×
      weekly_frequency → reduced 8-Program model (D085/D061); no screen]
```
- **Conditional frequency (D085, supersedes D081 matrix):** hidden until **both** Experience and Training Format are chosen; then only the allowed options **for the chosen Experience** show (same for Home and Gym) — **Beginner → 2/3 · Intermediate → 3 · Advanced → 3/4**; if only one is allowed (Intermediate), show only that value (single selectable/preselected), never unavailable alternatives; changing Experience/Format clears an invalid frequency and refreshes.
- **Conditional Training Structure (D085):** values `full_body`/`split`, labels **[Фулбоди]/[Сплит]** only; shown **only when Training Format = Gym AND Experience ≠ Beginner** (Gym Intermediate 3, Gym Advanced 3, Gym Advanced 4). Otherwise **hidden and auto-resolves to Full Body**. **2 days always → Full Body**; Split never for Home, never for Beginner. **Never expose** program family / variant / assignment key / internal IDs (Фулбоди/Сплит is user-facing, not internal). **Editable later (D080/D084).** **Destination:** silent assignment → S4. **Forbidden:** equipment checklist; biometrics/BMI/weight/height/injury; "choose your program/workout"; a visible assignment/loading screen; a Фулбоди/Сплит choice outside the eligible Gym cases.

**S4 — Default Avatar + Naming Ceremony (required, D079)**
```
┌─────────────────────────────┐
│        ╭───────╮            │  PRESENCE ZONE — now the STAGE-1 DEFAULT AVATAR
│        │  ◉◉◉  │           │  first appearance · direction from Hero/Heroine (basic m/f)
│        ╰───────╯            │  (no classes/cosmetics/editing — D078/D079)
│   Путь выбран.             │  S4 copy (D079) — gender-neutral (no выбрал/выбрала)
│   Осталось выбрать имя.     │
│   Имя  [ ____________ ]     │  required name field (future soft default still confirmed)
│   ┌─────────────────────┐   │
│   │     [Продолжить]     │   │  REQUIRED · no [Пропустить] · inactive until valid name
│   └─────────────────────┘   │
└─────────────────────────────┘
   [Продолжить] → onboarding complete → full Home (§8), NO auto-redirect to Workout 1 (D082); Continue Journey → Workout 1 (D059)
```
- **Inputs:** avatar **name** (required; **no skip / no [Пропустить]**; [Продолжить] inactive until valid; a future suggested default is still confirmed). **Presence:** Stage-1 Default Avatar (first appearance; never beyond Stage 1 — D010); direction from Hero/Heroine; writes to the single shared avatar visual state (D001, §9). Name **editable later in Profile (D080)** and never affects assignment/progression. **Destination (D082):** onboarding complete flag set → the **full Home (§8)** — **no automatic transition to Workout 1**, no forced workout launch, no first-run CTA highlight; the **Avatar Name appears on Home** as the first identity line of the Stage Block (§8), and the user may tap the Presence to customize before the first workout (D073). **Forbidden:** email-verification/OTP, password confirmation, legal consent, payment, subscription, any auth/security/admin field (D077); heavy customization; any evolved/Stage-10 form; metrics; trial/pricing; marketing; shame/body-negative copy; a [Пропустить]; an auto-redirect to Workout 1 or a forced-workout modal on the first Home (D082).

**1. Goal (section):** a calm Presence-led first dialogue that collects the four Program keys (Hero/Heroine, Experience, Training Format, Weekly Frequency — D081) plus Goal (framing only), and ends by giving the user their named Stage-1 avatar.

**2. Composition top → bottom (every screen):** Presence zone (asks/frames) → the question(s) as Presence dialogue → structured options / one name field (the replies) → single primary CTA.

**3. Primary visual accent:** the **Presence** on every screen (Seed Form → forming → Stage-1 avatar).

**4. Routing:** Verify Email ✓ → S1 · onboarding complete (S4 done) → Home · returning verified user with unfinished onboarding → resume at the earliest unanswered screen · verified + complete → Home (D076, D077, D078).

> **Scope (D079/D080/D081/D084/D085):** copy and taxonomies are accepted (D079); the Weekly-Frequency matrix, the conditional Training Structure choice, and the reduced 8-Program family model are **D085 (superseding the D081 matrix/family model)**; post-onboarding editing of Goal/Hero-Heroine/Experience/Training-Format/Weekly-Frequency/Training-Structure/Name lives in Profile with no progression reset (D080), and its save/confirmation behavior is **D084** (Goal & Name save immediately; the program-changing fields use a calm confirmation modal; an In-Progress workout defers the new assignment until it finishes — D058/D061). Default-avatar art direction and future Goal-driven starting-form remain separate (Post-MVP); Goal may later affect Nutrition only, never training assignment. Program assignment is silent and deterministic (**direction(sex) × training_format × training_structure × weekly_frequency**, D085/D061; Experience only gates the allowed options); the user never chooses a program/workout. Heavy customization is entered later from Home (D073), never in onboarding. **Avatar direction on later change (D083):** if the user later changes Hero/Heroine in Profile (D080) it switches the **active avatar direction** only — no customization migrates between the Hero and Heroine slots; the new direction renders its **saved slot** if present, otherwise its **default avatar at the current global Stage** (never Stage 1 for a mid-journey user); the other direction's slot is preserved; Avatar Name and Stage stay global; one Presence throughout (D001).

---

# 1. Activity

Functional browsing surface; the emotional center is Home (D055, D039). Fixed frame across all states:

```
┌─────────────────────────────┐
│  Activity                   │  Header: "Activity" only (D055) · RU: «Активность» (2026-07-05 naming note)
├─────────────────────────────┤
│  WORKOUTS                   │  Section 1 — always above (D042)
│  ┌───────────────────────┐  │  vertical list, program order,
│  │ [workout card]        │  │  no reorder, no horizontal scroll (D055)
│  │ [workout card]        │  │  equal-size cards (D054)
│  │ [workout card]        │  │
│  └───────────────────────┘  │
│  DAILY QUESTS               │  Section 2 — always below (D042)
│  ○ / ● quest row            │  binary state only (D055)
│  ○ / ● quest row            │
│  ○ / ● quest row            │
├─────────────────────────────┤
│  BottomNav                  │  (D003)
└─────────────────────────────┘
```

**1. Goal:** let the user browse the assigned workout program (primary) and the day's 3 supportive quests (secondary), and open any of them.

**2. Composition top → bottom:** Header "Activity" → **Workouts** section (vertical list of equal-size cards in program order) → **Daily Quests** section (3 binary rows) → BottomNav.

**3. Primary visual accent:** the single special-state workout card — **In Progress (green)** if one exists, otherwise **Upcoming (orange)**. Emphasis is by state/color/position, never size (D054).

**4. Secondary element:** Default (blue) workout cards, then the Daily Quests section (quests never carry workout-card weight, D042).

**5. User action:** tap a workout to open it; tap a quest row to mark it Completed.

**6. Destination after the action:**
- Tap a workout → its **Workout Start Screen** (§2).
- Tap a quest → row becomes **● Completed**; user **remains on Activity** (D069). If the quest caused a Stage Evolution → **Evolution Flow** (§7).

### Activity states (D054, D056–D059, D069)

| State | Workout list appearance | Notes |
|---|---|---|
| **First entry (new user)** | Workout 1 = Upcoming (orange + marker); all others Default (blue) | Pointer initialized to Workout 1 (D059) |
| **Upcoming exists (normal cycle)** | exactly one Upcoming (orange); rest Default | Which card is Upcoming is set by the pointer (D046/D051) |
| **Workout In Progress** | exactly one In Progress (green); **no orange/Upcoming anywhere** | In Progress has absolute priority (D057); other cards open with "Return To Workout" (D058) |
| **After completion** | finished card returns to **Default** (no marker); next cycle workout becomes Upcoming | No Completed/Finished card state; history lives on Progress (D056, D008) |

| Quest section state | Appearance |
|---|---|
| None done | three ○ Not Completed rows |
| Some done | mixed ● / ○; row order never changes; no "1/3" counter (D055) |
| All done | three ● rows; no celebration, no new CTA, no "3/3" (D055, D031) |

> No weight entry, analytics, dates, or progress metrics anywhere on Activity (D044, D045, D055). Empty/completed states are never framed as failure (D031).

---

# 2. Workout Start Screen

Pre-start screen (D062). The Start Workout press is the start boundary (D049).

```
┌─────────────────────────────┐
│  Push Day                   │  Workout Title (D062)
│                             │
│  Steps                      │
│  1. Жим лёжа                │  ordered Workout Step list —
│  2. Тяга + Скручивания      │  counts STEPS, not exercises (D068)
│  3. Разводка гантелей       │  (a superset = one Step, two exercises)
│  4. Французский жим          │
│                             │
│  [ Start Workout ]          │  primary (D062); or [ Return To Workout ]
└─────────────────────────────┘  if another workout is In Progress (D058)
```

**1. Goal:** show the shape of the session (its Steps) and provide the single start boundary.

**2. Composition top → bottom:** Workout Title → ordered Workout Step list → primary button (**Start Workout**, or **Return To Workout** when another workout is already In Progress).

**3. Primary visual accent:** the **Start Workout** button (the start boundary, D049).

**4. Secondary element:** the ordered Step list (shows session shape).

**5. User action:** press Start Workout to begin (weight fields appear, the "not started" reminder disappears — D053, D052); or swipe forward to preview Steps before starting (D052/D063).

**6. Destination after the action:** → **Workout Step 1** in the started state (§3). If Return To Workout → the currently active session.

> Forbidden here (D062): duration, difficulty, categories, analytics, companion content.

---

# 3. Single Exercise Step

One exercise = one Step screen (D060, D064). Two visualization states, before vs after Start Workout.

**State A — pre-start / preview (D052, D053):**
```
┌─────────────────────────────┐
│  ⓘ Тренировка не начата      │  persistent "not started" reminder (D052)
│  ┌───────────────────────┐  │
│  │       [ VIDEO ]       │  │  Exercise Video — primary position (D064)
│  └───────────────────────┘  │
│  Жим лёжа                   │  Exercise Title
│  3 подхода · 10 повторов    │  Prescription (Sets/Reps or Duration)
│  (weight field hidden)      │  weight hidden before Start (D053)
└─────────────────────────────┘
```

**State B — started (D053):**
```
┌─────────────────────────────┐
│  (no reminder)              │  reminder removed once started (D052)
│  ┌───────────────────────┐  │
│  │       [ VIDEO ]       │  │  Exercise Video — primary (D064)
│  └───────────────────────┘  │
│  Жим лёжа                   │  Title
│  3 подхода · 10 повторов    │  Prescription
│  Рабочий вес [ ___ ] кг     │  optional Weight Field, visible after Start (D053)
└─────────────────────────────┘
```

**1. Goal:** guide one exercise via video; after Start, allow optional weight logging.

**2. Composition top → bottom:** ("not started" reminder, pre-start only) → **Exercise Video → Exercise Title → Prescription → optional Weight Field** (weight only in State B). Strict vertical hierarchy (D064).

**3. Primary visual accent:** the **Exercise Video** (D064).

**4. Secondary element:** Title + Prescription; then the optional Weight Field last (D064). Pre-start, the calm non-blocking "not started" reminder (D052).

**5. User action:** watch the video / perform the exercise; optionally enter weight (State B); swipe between Steps (D063). Weight is optional, analytics-only, keyed to Exercise ID; it never affects XP/levels/streak (D040, D044).

**6. Destination after the action:** swipe forward → next Step; swipe forward past the final Step → **Workout Finish Screen** (§5/D063).

---

# 4. Superset Step

A superset is **one Step** with two exercises shown simultaneously (D060, D065). No Superset entity, no "1/2"/"2/2" notation, no "2 exercises" label (D065).

```
┌─────────────────────────────┐
│  (started: weight visible)  │
│  ┌──────────┐ ┌──────────┐  │  horizontal two-card structure (D065)
│  │ [VIDEO]  │ │ [VIDEO]  │  │  vertical (portrait) videos (D065)
│  │ portrait │ │ portrait │  │
│  │ Тяга     │ │Скручив-я │  │  each card: own Title
│  │ 3×12     │ │ 3×15     │  │  own Prescription
│  │ [__] кг  │ │ [__] кг  │  │  two INDEPENDENT weight fields (D065)
│  └──────────┘ └──────────┘  │
└─────────────────────────────┘
```

**1. Goal:** present a superset as a single Step while keeping each exercise individually identifiable.

**2. Composition top → bottom:** ("not started" reminder pre-start) → two side-by-side exercise cards, each with **Video → Title → Prescription → independent Weight Field** (weight only after Start, D053).

**3. Primary visual accent:** the two portrait Exercise Videos shown together (two co-equal cards).

**4. Secondary element:** the two Titles, two Prescriptions, and two independent Weight Fields (per-Exercise-ID history, D041/D044).

**5. User action:** perform both exercises; optionally enter weight in each field; swipe to navigate (D063). The two exercises must read as one Step yet stay visually distinct (D065).

**6. Destination after the action:** swipe forward → next Step or **Workout Finish Screen** (§5).

> Reconciliation follow-up (recorded in the registry, not a contradiction): the horizontal two-card + portrait-video layout must be validated against §1 (mobile 360–430px) and §13 (no carousels) — both cards are shown simultaneously, not as a carousel.

---

# 5. Workout Finish Screen

Separate screen after the final Step (D063, D066). Finish Workout is the completion boundary (D050).

```
┌─────────────────────────────┐
│                             │
│      Workout Complete       │  (D066)
│                             │
│     [ Finish Workout ]      │  completion boundary (D050)
│                             │
└─────────────────────────────┘
```

**1. Goal:** provide the explicit completion boundary.

**2. Composition top → bottom:** "Workout Complete" → **Finish Workout** button.

**3. Primary visual accent:** the **Finish Workout** button.

**4. Secondary element:** the "Workout Complete" line.

**5. User action:** press Finish Workout — records completion, grants workout XP (D015), advances the journey pointer from the workout actually completed (D050/D051).

**6. Destination after the action:** → **Reward Modal** (§6, D067).

> Forbidden here (D066): companion content, any additional metrics.

---

# 6. Reward Modal (D067, final version)

Presented as a **modal window over a dimmed background** — not a separate screen, not a bottom banner, not a toast (D067). Shows **only the values that changed**, largest first: **Stage → Level → XP**.

**State A — no Stage growth (button):**
```
        ╱ dimmed background ╲
   ┌─────────────────────────┐
   │      Уровень 7          │   shown only if Level changed
   │        + 10 XP          │   XP (always, if changed)
   │                         │
   │   [ Return To Activity ]│   single button (D067)
   └─────────────────────────┘
```
- Only-XP case shows just `+ 10 XP`. Level line appears only if the level changed (D067).

**State B — Stage growth (no button, auto-advance):**
```
        ╱ dimmed background ╲
   ┌─────────────────────────┐
   │   SEEKER / STAGE 4      │   Stage (largest, first — D067)
   │      Уровень 9          │   Level
   │        + 10 XP          │   XP
   │                         │
   │  (no button)            │   auto-advance to Home in 5–7s (D067)
   │  tap to speed up →      │   tap accelerates; never skips (D069)
   └─────────────────────────┘
```

**1. Goal:** show, honestly and calmly, only what changed from the completion.

**2. Composition top → bottom:** changed values in priority order **Stage → Level → XP** (each line shown only if it changed) → then either a **Return To Activity** button (no Stage growth) or nothing (Stage growth, auto-advance).

**3. Primary visual accent:** the **largest reward that changed** — Stage if present, else Level, else XP (D067).

**4. Secondary element:** the smaller changed values below the primary one; companion reaction only rarely, for meaningful milestones (D036/D037).

**5. User action:**
- **No Stage growth:** press **Return To Activity**.
- **Stage growth:** wait for the 5–7s auto-advance, or **tap the modal to speed up** the transition (tap cannot skip the Evolution Animation — D069).

**6. Destination after the action:**
- **No Stage growth →** **Activity** (§1, D069).
- **Stage growth →** **Home → Evolution Animation** (§7, D069).

> Deferred Progress Visualization (D070): the Reward Modal shows the in-the-moment change here. When the user later opens Home or Progress and an indicator was not on screen at completion time, that surface separately animates last-seen → current (§7 note; BFG_UI_RULES §19).

---

# 7. Evolution Flow (D069, final version)

A **Stage Evolution overrides the post-reward destination** and routes to **Home**, where the Evolution Animation plays — regardless of trigger (D069). The transformation is **unskippable**.

```
Workout: Finish Workout → Reward Modal (Stage shown) ─┐
Quest:   Quest Complete → Reward Display (Stage shown)─┤
                                                       ▼
                                                ┌────────────┐
                                                │    HOME     │
                                                │  ◉ Living   │  Evolution Animation
                                                │  Presence   │  plays here (D069, §15)
                                                │  Stage Block│  updated Title/Number
                                                │ [Continue   │
                                                │  Journey]   │
                                                └────────────┘
```

**1. Goal:** stage the most significant progression moment (Stage Evolution, D035) on Home — the emotional center (D002, D007, D039).

**2. Composition top → bottom:** route to Home → **Living Presence** (center) playing the **Evolution Animation** → updated **Stage Block** (Title + Number) → Home's standard composition resumes (§15). This is a transient milestone moment, not a new Home fixture (§15).

**3. Primary visual accent:** the **Living Presence + Evolution Animation** (the avatar transformation).

**4. Secondary element:** the updated Stage Block; Home's two progress rings (§15).

**5. User action:** watch the transformation (it **cannot be skipped**; a tap earlier only sped the transition to Home, D067/D069); then continue via "Continue Journey" (D043).

**6. Destination after the action:** animation completes → standard **Home**; "Continue Journey" → the next assigned workout (D043, D046).

> Priority rule (D069): Stage Evolution has **absolute priority** over the current screen; the reason for the evolution does not matter; Home is the stage for the transformation. Non-evolution completions do **not** reach this flow — normal workout completion returns to Activity, normal quest completion stays on Activity (D069).
> Deferred Progress Visualization (D070): on arriving at Home, Home also animates its own progress indicators (Level Progress + Activity Progress ring) from their last-seen state to current, then clears Home's memory — independently of the Progress screen's memory (BFG_UI_RULES §19).

---

# 8. Home (Final Home Product Structure, D071)

The **emotional center** of BFG (D002, D007, D039, D071) — not a dashboard, activity feed, statistics screen, or workout list. Home answers: *"Where is my Presence now, and how do I continue the journey?"* Composition is fixed; the Voice Slot is the only conditional element.

```
┌─────────────────────────────┐
│                        (👤) │  Minimal Header — Profile button only (D006)
│                             │  no notification bell in MVP (D071)
│          ╭───────╮          │  Two OPEN rings around the Presence (D071):
│        ╭─┤ ◉ ◉ ◉ ├─╮        │   • Inner Ring  = Level Progress   "12 УР."
│        │ │ Living│ │        │   • Outer Ring  = Weekly Activity  "12/24 АКТ."
│        ╰─┤Presence├─╯        │  open arcs: visible start/end + split,
│          ╰───────╯          │  value label in the split, calm fill (§5/§13)
│                             │
│        Auron                │  Avatar Name — first identity line of the Stage Block (D082)
│        SEEKER / STAGE 3     │  Stage Block — Title + Number (D071)
│   "you came back."          │  Voice Slot (event-driven, rare; may be empty) (D036–038, D071)
│                             │
│   ┌─────────────────────┐   │
│   │   Continue Journey   │   │  the ONLY primary CTA (D043) — no competitors
│   └─────────────────────┘   │
├─────────────────────────────┤
│  BottomNav                  │  (D003)
└─────────────────────────────┘
```

**1. Goal:** ground the user in their Presence (where am I now) and offer the single way forward (continue the journey).

**2. Composition top → bottom (D071, refined by D082):** Minimal Header (Profile button) → **Living Presence** (center, dominant) wrapped by **two open rings** (Inner = Level Progress, Outer = Weekly Activity Progress) → **Stage Block** (**Avatar Name** as first identity line, then Title + Number — D082) → **event-driven Voice Slot** (conditional) → **Continue Journey** CTA → BottomNav. The Avatar Name belongs to the Presence identity area — never in the header, the Profile button, the CTA, a stat card, or as a floating label (D082).

**3. Primary visual accent:** the **Living Presence**. The rings are a supporting layer and must never out-weigh it (§15).

**4. Secondary element:** the two open rings and the Stage Block; the Voice Slot when (rarely) present.

**5. User action:** tap **Continue Journey** (the only primary action); **tap the Living Presence → Avatar Customization / Appearance / Clothing** (the primary, MVP-only customization entry, D073 — an affordance on the Presence, not a second CTA); tap the header Profile button for account/subscription (D006).

> **Living Presence is interactive (D073).** Tap the Presence → Avatar Customization. The tap is a Presence affordance, not a competing button — "Continue Journey" stays the only primary CTA. Customization writes to **one shared avatar visual state**; changes propagate to the **Progress static portrait** (§9). One avatar, two representations (D001, D072, D073).

> **Avatar direction slots (D083).** The shared avatar state is **direction-specific** — a Hero slot and a Heroine slot stored separately. Home always shows the **active direction at the current global Stage**. A later Profile Hero/Heroine change (D080) switches the active direction only: **no customization migrates** between slots; the new direction renders its **saved slot** if present, else its **default avatar at the current Stage** (a Stage-7 user switching to Heroine for the first time sees Heroine Default Stage 7, not Stage 1); the other slot is preserved and restored on return, rendered on the current-Stage base (never frozen at its creation Stage). Avatar Name and Stage are global; still one Presence (D001).

**6. Destination after the action (Continue Journey, D043):**
- brand-new user → **Workout 1 Start Screen** (§2, D059);
- normal cycle → **next workout** in the current Program cycle (§2, D046);
- a workout is already In Progress → the **active workout session** (D058).

### Ring semantics (D071)

| Ring | Represents | Label | Resets weekly? | Counting |
|---|---|---|---|---|
| **Inner** | Level Progress | "12 УР." | No (long-term) | arc = progress toward next level |
| **Outer** | Weekly Activity Progress | "12/24 АКТ." | **Yes — UTC week** | 1 completed workout = 1 · 1 completed daily quest = 1 · only completed actions count |

> **Outer Ring denominator (weekly activity capacity, D071):** 21 daily-quest activities (3 × 7, D017) + the **active Program cycle length** (2–5 Workout Templates, D061) → 23–26. This is the **Program cycle length, not "workouts per week"** (the Journey/Program model is count-agnostic, D046/D061). **Overflow** caps the display (e.g. "24/24 АКТ."); deeper history lives on Progress, not Home.
> **Does NOT count toward the Outer Ring (D071):** opening the app, viewing a workout/quest, maintaining a streak, entering weight, visiting Home/Progress, profile actions, passive app time.
> **Tone (D031, Companion no-ledger §X):** the Weekly Activity Ring is never framed as debt, failure, quota, or punishment; the Voice never treats it as a target.
> **Deferred Progress Visualization (D070, §19):** on entering Home, both rings animate from their last-seen state to current, then Home clears its own memory — independently of the Progress screen.

**Home must not show (D071):** workout list, quest list, raw XP table, achievement grid, detailed statistics, activity history, strength analytics, weight history, profile/account details, subscription details, multiple primary CTAs, a permanent companion chat panel, a notification bell (MVP), a third ring, a streak ring, a separate XP ring, a quest progress ring, red failure states, shame copy, hype copy, or casino-style reward animation.

> Stage Evolution (§7, D069) temporarily takes over Home for the Evolution Animation; the standard composition above resumes after — it is a transient milestone, not a new fixture (§15).

> **First Home after onboarding (D082):** arriving from S4 (§0.2) lands the user on this **same full Home** — **no auto-redirect to Workout 1**, no forced-workout modal, and **no first-run highlight** on Continue Journey (no glow, pulse, tooltip, banner). Initial state: Stage-1 default avatar, the **Avatar Name** shown in the Stage Block, and calm starting Level / XP / Weekly Activity / Streak values (empty/zero framed as a beginning, not missing progress — D031/D040). The user may **tap the Living Presence to customize before the first workout** (D073) or press Continue Journey (→ Workout 1, D059/D043) when ready. D082 changes presentation/handoff only — routing is unchanged.

---

# 9. Progress (Final Progress Product Structure, D072)

The **identity / history / progression surface** (D005, D008, D072). Progress answers: *"Кем я стал? Как я развиваюсь? Что уже накопилось в моей истории?"* Home is the living present; Progress is the retrospective record. **Progress must not become a second Home, and must not become a noisy analytics dashboard.**

```
┌─────────────────────────────┐
│  Прогресс              (👤) │  Minimal Header — title + Profile button (D006)
├─────────────────────────────┤
│         ┌───────────┐       │  PRIMARY — Identity
│         │  ▢ STATIC  │       │  static identity portrait (D072):
│         │  PORTRAIT  │       │   • non-interactive · no tap · no animation
│         └───────────┘       │   • always = current customized avatar (D001)
│      SEEKER · STAGE 3 of 10 │  Stage / Evolution — journey position, not quota
│      Legend: «Путь ещё…»    │  Legend slot / pre-Legend placeholder (D027)
├─────────────────────────────┤
│  Ур. 12 · XP →next          │  SECONDARY — Progression (calm accumulation)
│  Серия 9 · Стадия 3/10      │  Streak = continuity, no pressure (D021/D031)
├─────────────────────────────┤
│  ▸ История                  │  ADDITIONAL — Archive (entry points, not walls)
│  ▸ Статистика               │  Statistics opt-in; strength only after 1st weight (D040)
│  ▸ Достижения               │  Achievements: MVP earned shelf → Post-MVP grid (D026)
├─────────────────────────────┤
│  BottomNav                  │  (D003)
└─────────────────────────────┘
```

**1. Goal:** show **who the user has become** (identity), **how they have grown** (progression), and **what has accumulated** (archive) — calmly, without duplicating Home's living center.

**2. Composition top → bottom (D072):** Minimal Header (title + Profile button) → **Primary Identity Block** (static portrait + Stage/Evolution + Legend slot) → **Secondary Progression Block** (Level · XP · Streak · Stage position) → **Additional Archive Block** (History · Statistics · Achievements, as entry points) → BottomNav.

**3. Primary visual accent:** the **static identity portrait** — but it is an identity *marker*, not Home's dominant living hero. The differentiator vs Home is **still + inert (Progress) vs living + interactive (Home)**, not size.

**4. Portrait rules (D072, D001):**
- **Static · non-interactive** — does not move, animate, breathe, or respond to taps; **never opens customization** (customization is entered only from Home, D073, §8).
- **Always reflects the current customized avatar state** (appearance, clothing, cosmetics, current stage form) — never stale — but it updates **statically and silently** (no movement, no tap transition, no animated reveal). This is **not** a D070 catch-up animation.
- One avatar, two representations: Home and Progress render the **same** avatar from the **same** shared visual state.
- **Active direction + current Stage (D083):** the portrait shows the **same active avatar direction and current global Stage** as Home. After a later Profile Hero/Heroine change (D080), it renders the new direction's **saved slot** if present, else that direction's **default avatar at the current Stage** — no cross-direction migration, no backward Stage. Hero and Heroine slots are stored separately; Avatar Name and Stage stay global; one Presence (D001).

**5. D070 Progress memory (independent from Home, §19):** on entering Progress, **XP / Level / Stage** animate last-seen → current (calm, < 600ms, `prefers-reduced-motion`), then Progress clears its own memory. Streak, History, Achievements, Statistics, and the static portrait do **not** participate. Viewing Home never clears Progress memory and vice versa.

**6. Achievements (D072):** MVP = lightweight **earned shelf** / preview; Post-MVP = full **Achievement Constellations / grid** (D026). No completion-%, no rarity comparison; locked = quiet potential; never outranks the Primary block.

**Progress must not show (D072):** leaderboards; PvP; social comparison; leagues; followers/kudos; user-selected classes; gear/loadout stats; closed rings / perfect-week framing; red failure states; shame copy; streak-loss pressure; numeric Energy / readiness / daily-verdict scores; performance-gated rewards; completion-% / rarity pressure; rank/level overlaid on the avatar; an avatar built for social identification; empty-state pressure to log weight; dense analytics walls; duplicating Home's two rings; duplicating Home's "Continue Journey" CTA; duplicating Home's living/interactive Presence role; an interactive/tappable avatar; avatar movement / idle animation / tap transition; customization entry from the portrait; casino-style animation.

---

# 10. Profile (Profile Screen Structure and Single-Modal Edit Flow, D086)

The **administrative** surface (D006), reached via the small header Profile button — **not** a bottom-nav tab, **not** the emotional center (Home, §8), **not** the identity/history surface (Progress, §9), **not** an Avatar Customization entry (Home only, D073). Title is **«Профиль»** — never «Настройки» (this is not app settings). Chevrons appear **only on editable rows**.

```
┌─────────────────────────────┐
│  ‹                          │  Header — Back
│  Профиль                    │  Title (D086) — NOT «Настройки»
│  Данные, которые помогают   │  Subtitle (D086)
│  подобрать тренировки…      │
│                             │
│  АККАУНТ                    │
│  Почта                      │  read-only · no chevron (email)
│  user@email.com             │
│                             │
│  ТРЕНИРОВКИ                 │
│  Цель               …    ›  │  multi-select · SAFE (immediate, no modal)
│  Снижение веса, общая форма │
│  Уровень            …    ›  │  program-changing · D084 confirm
│  Место тренировок   …    ›  │  program-changing · D084 confirm
│  Тренировок в неделю …   ›  │  program-changing · D084 · options by D085
│  Формат тренировок  Фулбоди │  chevron ONLY if Split allowed (D085), else read-only
│                             │
│  АВАТАР                     │
│  Имя                …    ›  │  text · SAFE (immediate, no modal) · global name
│  Направление  Герой      ›  │  program-changing · detailed D084 Hero/Heroine · D083
│                             │
│  ПОДПИСКА                   │
│  Пробный период активен     │  read-only · no chevron · no paywall
│  Осталось 24 дня            │
│                             │
│  ┌───────────────────────┐  │
│  │        Выйти          │  │  standalone bottom action → logout confirm modal
│  └───────────────────────┘  │  (no «Система» section)
└─────────────────────────────┘
```

**1. Goal:** let the user view and adjust their account, training inputs, avatar identity fields, and subscription state — and log out — calmly, without becoming Home, Progress, or a customization/settings screen.

**2. Composition top → bottom (D086):** Header (Back · «Профиль» · subtitle) → **Аккаунт** (Почта, read-only) → **Тренировки** (Цель · Уровень · Место тренировок · Тренировок в неделю · Формат тренировок) → **Аватар** (Имя · Направление) → **Подписка** (read-only state) → **«Выйти»** (standalone).

**3. Chevrons / editability (D086):**
- **Editable (chevron):** Цель, Уровень, Место тренировок, Тренировок в неделю, Имя, Направление; and **Формат тренировок only when D085 allows Split** (Gym + Intermediate 3 / Gym + Advanced 3 / Gym + Advanced 4).
- **Read-only (no chevron):** Почта (email); Подписка; **Формат тренировок when Split is not allowed** (all Home; Gym Beginner 2/3; 2 days → Full Body). No modal, no tap action, no disabled-error look.

**4. Safe vs program-changing (D084):**
- **Safe (save immediately, no confirmation):** Цель (multi-select ≥1; may later feed Nutrition only — never training assignment) and Имя (required text; global; no assignment/progression/slot effect — D083).
- **Program-changing (D084 confirmation):** Уровень, Место тренировок, Тренировок в неделю, Формат тренировок (when editable), Направление. Changing Уровень/Место/Frequency may change Training Structure availability; if Split becomes disallowed, Формат тренировок auto-resolves to **Фулбоди** (D085).

**5. Single-modal edit flow (D086 key rule):** one modal / bottom-sheet per edit, **never two Profile modals at once, no stacked modals, no separate edit screens, no toast**. Selection and the D084 confirmation are **states of the same modal container**:
```
editable row → open ONE modal
   → selection / input state
   → (program-changing) same modal transitions to the D084 confirmation state
        · detailed Hero/Heroine variant for Направление (D083)
        · In-Progress-workout deferral line when applicable (D058/D061)
   → Сохранить изменения → close → calm inline success on Profile
Cancel/back: selection state → close, no change · confirmation state → «Отмена» (no save)
             or modal-back → selection state. After save: stay on Profile, inline success.
```

**6. Logout (D086):** «Выйти» → confirmation modal (no immediate logout):
```
Выйти из аккаунта?

Твой прогресс сохранится.
Ты сможешь вернуться, войдя снова.

[Выйти]   [Отмена]
```
Logout deletes/resets nothing (account, progress, onboarding, avatar, subscription untouched) → unauthenticated Entry/Auth surface (§0/§0.1, D074).

**Profile must not show (D086):** a large avatar portrait; XP; Level; Stage; Streak; the Weekly Activity ring; workout history; strength analytics; achievements; Progress-style identity blocks; a Home-style Living Presence; an Avatar Customization entry (clothing/hair/accessories/body/colors/cosmetics/currency/catalog or «Изменить внешний вид»); app theme / notification / language / privacy settings; account deletion; email or password editing; payment management; technical auth status; Supabase IDs.

> **Implementation status (rebuild slice 16, 2026-07-13).** This wireframe is the accepted **final** Profile target and its edit affordances are unchanged. As built today, Slice 16 enables editing of **Цель** and **Имя** only (single-modal safe-field flow); the remaining D080 fields — **Уровень, Место тренировок, Тренировок в неделю, Формат тренировок, Направление** — are rendered **read-only** (no chevron) and their editing is **deferred** pending Program Assignment / Replacement (D061/D085) and the D084 confirmation states. The chevrons shown above remain correct for the final design.

---

## Decisions referenced

**D074 (Entry / Auth Start Screen)**, **D075 (Adaptive Cinematic Canvas Responsive Model)**, **D076 (Sign Up / Log In Auth Surface)**, **D077 (Required Email Verification Before Onboarding)**, **D078 (MVP Onboarding Flow Structure)**, **D079 (Onboarding Copy & Answer Taxonomies)**, **D080 (Editable Onboarding Inputs After Onboarding)**, **D081 (Conditional Weekly Frequency & Program Family Model)**, D031 (no-shame), D035 (evolution as milestone), D039 (Home composition), D040/D041/D044 (tracking philosophy, library, weight placement), D042–D068 (Activity + workout-session architecture), **D067 (Reward Modal, final)**, **D069 (Evolution Flow, final)**, **D070 (Deferred Progress Visualization)**, **D071 (Final Home Product Structure)**, **D072 (Final Progress Product Structure)**, **D073 (Avatar Customization Entry & Interaction)**, **D082 (First Home After Onboarding and Avatar Name Placement)**, **D083 (Avatar Direction Slots and Default Stage Forms)**, **D084 (Profile Editability and Change Confirmation Model)**, **D085 (Training Structure Choice and Reduced Program Family Model)**, **D086 (Profile Screen Structure and Single-Modal Edit Flow)**. UI rules: BFG_UI_RULES §15, §16, §17, §18, §19, §20, §21, §23, §24.

## Out of scope for this slice (later wireframe passes)

The per-state Activity screen mockups, the Reward Modal value variants in detail, the Avatar Customization surface itself (D073 catalog depth), and any new screens. No new product decisions are created by this document.
