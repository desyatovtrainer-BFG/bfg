# BFG UI Rules

Practical UI engineering rules for BFG: a mobile-first, dark, cinematic, calm interface built with Tailwind v4 and Framer Motion. Emotional spec lives in `BFG_CONTEXT.md`; this document is for engineers and Cursor agents.

> Companion documents:
> [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) ·
> [`BFG_ARCHITECTURE.md`](./BFG_ARCHITECTURE.md) ·
> [`BFG_AI_COMPANION.md`](./BFG_AI_COMPANION.md)

---

## 1. Non-negotiables

- **Mobile-first**. Default layout = 360–430px width. Tablet/desktop are a polish target, not the base case.
- **Dark theme is the product.** Pure light theme is not in MVP. Even system "light" should fall back to our dark canvas.
- **Calm, cinematic, immersive.** Motion is subtle. Color is restrained. The user feels presence, not noise.
- **Tailwind utilities only.** No CSS-in-JS, no styled-components, no Sass. Globals live in `app/globals.css` and stay minimal.
- **One animation library.** Framer Motion only.
- **No emoji in product copy.** Russian text is calm and short.

---

## 2. Layout

- Root container width on mobile: full viewport, 16px gutters.

### Adaptive Cinematic Canvas (Decision 075)

BFG is **mobile-first, not mobile-only**, and this model is **app-wide** (every screen). It **refines** the previous "max content width 480px centered on tablet/desktop" rule: the strict 480px-everywhere cap is replaced by **readable content is capped, but the atmospheric canvas may expand.** Mobile-first remains the source of truth and the app never becomes a desktop dashboard.

- **Source of truth.** The **360–430px** phone layout decides structure and hierarchy on every screen.
- **Atmosphere expands on wider screens.** Atmospheric / background elements MAY expand: glow, rings, ambient space, the visual stage, side fields, and large visual presence areas where appropriate.
- **Readable / interactive elements stay capped.** Headline / subtitle line length, **CTA width, form controls, dense content blocks, and text size** remain capped and centered. Text and buttons must **not** scale endlessly with viewport width.
- **Same app, not two products.** Tablet is a valid, intentional case — an expanded cinematic canvas, not a separate tablet layout with extra content. Desktop Chrome shows a **centered app / cinematic canvas**, never desktop-dashboard content.
- **Responsive tiers:** **Tier 1 Phone 360–430px** (source of truth) · **Tier 2 Large phone / small tablet 431–600px** (slightly expanded spacing) · **Tier 3 Tablet 600–900px** (expanded cinematic canvas, central content preserved) · **Tier 4 Desktop Chrome 900px+** (centered app / cinematic canvas, no desktop dashboard).

- Bottom navigation bar is the primary nav inside `(app)`. Top app bars are minimal — a title or a back arrow, nothing else.
- Safe-area aware: respect `env(safe-area-inset-bottom)` for the bottom nav, especially on iOS PWAs.
- No fixed footers other than the bottom nav.
- Every screen has a clear hierarchy: hero block → primary actions → secondary content. No "wall of cards".

---

## 3. Typography

Fonts wired in `app/layout.tsx`:

- `--font-onest` — body and UI default.
- `--font-unbounded` — headings, hero numbers.
- `--font-geist-mono` — numeric / monospaced edges (XP counters, code-ish badges).

Rules:

- One heading per screen with `--font-unbounded`. Do not sprinkle display font across the UI.
- Body line-height: comfortable for Cyrillic — Tailwind's `leading-snug` or `leading-relaxed`, not `leading-tight`.
- No font sizes below `text-xs` for UI text. Tap targets and legibility win.
- Russian copy: short sentences, no exclamation marks for motivation, no all-caps except for very deliberate badges.

---

## 4. Color palette and atmosphere

We don't ship a token system in MVP. Instead, follow these conventions consistently:

- Background base: near-black (`bg-black`, `bg-zinc-950`). Surfaces above the base: subtle white overlays (`bg-white/[0.04]` … `bg-white/[0.10]`).
- Borders: low-contrast (`border-white/10`, `border-white/14`). Solid borders are rare.
- Accents:
  - Sky (`sky-400` family) for primary action and "presence".
  - Violet for evolution / progression milestones.
  - Rose for high-difficulty markers.
  - Cyan for calm states.
- Avoid pure white. Use `text-zinc-100`, `text-zinc-300`, `text-zinc-400` for tiers of importance.
- Gradient surfaces are allowed (`from-white/[0.14] to-white/[0.05]`) but kept subtle. No saturated arcade gradients.

The `GameButton` and `GameCard` components in `app/components/ui/` are the reference for the visual language. **Use them.** Don't reinvent buttons or cards inline.

---

## 5. Motion

- Use Framer Motion's `motion` primitives. Animate `opacity` and `transform` only when possible.
- Default transitions: `duration: 0.2–0.4s`, `ease: 'easeOut'`. No bouncy springs for UI chrome.
- Page transitions are not part of MVP. Each route renders directly.
- Level-up, evolution, and XP grants get **one** subtle moment of motion (fade + slight scale, < 600ms). No confetti, no flashing, no audio.
- Respect `prefers-reduced-motion`. Wrap any non-trivial animation in a check (`useReducedMotion`) and degrade to fade-only.

---

## 6. Components

### 6.1 Where they live

- Feature components: `app/components/<feature>/<component>.tsx`.
- Cross-feature primitives: `app/components/ui/<primitive>.tsx` (`GameButton`, `GameCard`, etc.).
- One component per file. PascalCase symbol, kebab-case file name.

### 6.2 Size rules

- A component file > 200 lines is a warning. > 300 lines is a bug — split it.
- A component with more than ~6 props or branching renders for unrelated reasons needs to be split into smaller components.

### 6.3 Server vs Client

- Default to Server Components. Add `'use client'` only when needed: state, effects, animations, browser APIs.
- Push `'use client'` to the smallest leaf possible. Don't mark the screen wrapper as client.

### 6.4 Props

- No "config object" props with 10 fields. If a prop describes the component's purpose, take it as a named prop.
- Booleans should be specific: `isLoading`, `hasError`, `isPremiumLocked`. Not `mode='loading'`.
- Don't pass entire DB rows where a typed subset suffices.

### 6.5 Composition over abstraction

- Prefer composition (`<Card><Card.Header /></Card>` style or just passing children) over deep prop trees.
- No render-props patterns in MVP. No "headless" component libraries.

---

## 7. Forms and inputs

- Forms use native `<form>` + Server Actions. No form libraries in MVP.
- Validation: server-side via the action; client-side `required`/`type` attributes for fast feedback.
- Inputs follow the visual language of `auth-input.tsx`. New input flavors must reuse the same base classes.
- Error messages: short, Russian, calm. Show under the input, not in a toast.

---

## 8. Loading and empty states

- Every async surface has a **skeleton sized to the final layout**. No layout shift, no spinner-only states for content blocks.
- Empty states are emotionally framed. Not "No data" — something like "Сегодня ещё нет шагов. Это нормально."
- A failed fetch shows a soft retry button. No stack traces in the UI. Ever.

---

## 9. Accessibility

- All interactive elements are buttons, links, or have explicit roles. No clickable divs.
- Focus outlines are visible (already in `GameButton`). Do not remove them globally.
- Tap targets ≥ 44×44 px on mobile.
- Color contrast for body text ≥ 4.5:1. For large display text ≥ 3:1.
- All inputs have associated labels. The label can be visually compact but must exist.
- Animations honor `prefers-reduced-motion`.

---

## 10. Images, video, and icons

- Images: `next/image`. Always set `sizes`. Always have width/height or a containing aspect ratio.
- LCP image (dashboard hero / avatar) is preloaded and prioritized. The avatar is the body of the unified presence — render it alongside the companion voice as a single unit on the dashboard, not as an independent image asset.
- Video: only Kinescope on MVP. Embed URL composed in code from `video_provider + video_id`. See [`BFG_DATABASE.md`](./BFG_DATABASE.md) §3.5.
- Icons: import individually from the icon library. Do not bundle whole sets.
- No image CDNs that fail in Russia. Use Supabase Storage public URLs when content is user-uploaded.

---

## 11. Russian UI copy rules

- Use formal but warm "ты" (we are the voice-role of a unified presence — the companion text speaks; the avatar body is seen — not a brand).
- No exclamation marks for motivation. They are reserved for actual exclamations.
- No corporate fitness vocabulary ("crush your goals", "be your best self" translated to Russian — both unwelcome).
- Numbers and units in Russian: `мин`, `сек`, `XP`, `ур.`
- No abbreviations the user has to decode. Write "Уровень 7", not "Ур. 7" in primary copy.

---

## 12. Surface patterns we use

Reuse, don't reinvent:

- `GameCard` for any framed content block.
- `GameButton` for any tappable action with weight.
- `BottomNav` for app-level navigation.
- Streak panel, level card — both in `app/components/progression/`. Open them before designing a new variant. (The daily reward panel was removed from MVP.)

---

## 13. Forbidden UI patterns

- ❌ Casino-style XP / coin animations.
- ❌ Aggressive "GET PRO" modals on app open.
- ❌ Pop-ups that block the workout session screen.
- ❌ Toasts as primary feedback for important actions (use inline state).
- ❌ Tooltips on mobile-only UIs (we have no hover).
- ❌ Carousels where a list would do.
- ❌ Skeuomorphic 3D buttons. We are clean, dark, cinematic.
- ❌ Backdrops with heavy blur on long lists (kills mobile FPS).
- ❌ Hard-coded inline styles. Tailwind classes only, with rare CSS-variable plumbing in `globals.css`.
- ❌ More than one display font on the same screen.

---

## 14. Definition of "shippable UI"

A screen ships when:

- It renders correctly on a 360px viewport without horizontal scroll.
- Loading state, empty state, and error state all exist.
- All actions provide non-toast feedback.
- Motion respects `prefers-reduced-motion`.
- No `console.log` left behind.
- Lighthouse mobile score for the route ≥ 90 (Performance) and ≥ 95 (Accessibility) on a clean build, or a documented reason why not.

---

## 15. Home composition (Final Home Product Structure)

The final MVP Home composition (Decision 071, finalizing Decision 039 "Home Concept Candidate A", which refines Decision 007). This section governs Home content only; bottom navigation follows Decisions 003–006. Home is the **emotional center** of BFG — not a dashboard, activity feed, statistics screen, or workout list. It answers one question: *"Where is my Presence now, and how do I continue the journey?"*

**Composition, top → bottom (Decision 071):** Minimal Header → Living Presence Zone → Two Open Progress Rings → Stage Block → event-driven Voice Slot → Primary CTA "Continue Journey" → Bottom Navigation.

- **Minimal Header.** The only standing function is **Profile access via a small header button** (Decision 006 — Profile is administrative, reached by a small header button, not a bottom-nav tab). **No notification bell in MVP** (deferred to post-MVP, Decision 071).
- **Living Presence — visual center, primary focus.** The Presence (avatar body) sits in the optical center and must remain the dominant element. Everything else is a supporting layer.
- **Living Presence is the avatar customization entry (Decision 073).** Tapping the Living Presence opens Avatar Customization / Appearance / Clothing — the primary, and in MVP the only, emotional entry into customization. The tap is an **affordance on the Presence itself, not a competing button**, and does **not** violate the single-primary-CTA rule (the Primary CTA "Continue Journey" is unchanged). Use a short, calm transition (§5, §13); the purpose is navigation, not a decorative tap-reaction. Customization writes to **one shared avatar visual state**; changes propagate to every avatar surface, including the static Progress portrait (§20) — one avatar, two representations (Decisions 001, 072, 073).
- **Two open progress rings around the Presence (Decision 071).** Exactly two — an **Inner Ring = Level Progress** and an **Outer Ring = Weekly Activity Progress**. No additional rings, meters, bars, XP gauges, streak rings, quest rings, or raw progress indicators are allowed on Home. Both are **open rings / open arcs**, never fully closed circles: each must have a **visible start**, a **visible end**, a **deliberate split / open segment**, a **value label inside or near the split**, and a **calm fill animation** on value change. The rings are a supporting layer and must never out-weigh the Presence. Render with the calm motion budget (subtle, `< 600ms` fills, `prefers-reduced-motion` respected, no casino-style sweeps — §5, §13).
  - **Inner Ring — Level Progress.** Shows the current level value (e.g. "12 УР."); arc fill = progress toward the next level; does **not** reset weekly; belongs to long-term vertical progression; participates in Home visualization memory (§19). It is an **open ring** (this standardizes the "Level Progress bar/ring" wording of Decision 070 / §19 in favor of a ring).
  - **Outer Ring — Weekly Activity Progress.** Shows the weekly activity count (e.g. "12/24 АКТ."); arc fill = weekly activity completed vs weekly activity capacity. **Counting:** one completed workout = one activity; one completed daily quest = one activity; **only completed actions count**. Opening the app, viewing a workout, viewing a quest, maintaining a streak, entering weight, visiting Home/Progress, profile actions, and passive app time **do not count**. **Reset:** at the start of each new **UTC week** (MVP); previous weekly activity lives on Progress / History, not Home. **Denominator (weekly activity capacity):** 21 daily-quest activities (3 quests × 7 days, Decision 017) + the **active Program's cycle length** (its number of Workout Templates, 2–5 per Decision 061) → 23–26. The workout term is the **active Program cycle length, not "workouts per week"** — there is no weekly workout cadence in the count-agnostic Journey/Program model (Decisions 046, 061). **Overflow:** if completed activity exceeds the denominator (the cycle may repeat within a week), Home shows a **capped** value (e.g. "24/24 АКТ.").
- **Stage Block under the Presence.** Contains a **Stage Title** and a **Stage Number** (reference: "SEEKER / STAGE 3"; final naming may change — the structure is fixed, the words are not).
- **Event-driven Voice Slot under the Stage Block (Decision 071).** Home **may** show a Voice Slot under the Stage Block — this **closes the previously-open Voice-placement question** (Decision 039 #9). It is **not** a permanent companion text panel: Voice is **event-driven and rare**, idle Home may show **no** voice line, and it never becomes a standing fixture. Voice follows the Companion Doctrine and Presence Response System (Decisions 036–038): calm, restrained, specific, no hype, no guilt, no pressure.
- **Primary CTA — "Continue Journey".** A single primary action; no competing buttons on Home. It opens the next assigned workout directly (Decision 043): brand-new user → Workout 1 Start Screen (Decision 059); normal cycle → next workout in the current Program cycle (Decision 046); active workout exists → the active workout session (Decision 058). It does not open Activity.
- **Simplified progress only.** Home shows a simplified progress layer; detailed statistics live on the Progress screen (Decision 008). Do not surface raw stat tables on Home.
- **Home must not show (Decision 071):** workout list; quest list; raw XP table; achievement grid; detailed statistics; activity history; strength analytics; weight history; profile/account details; subscription details; multiple primary CTAs; permanent companion chat panel; notification bell (MVP); a third progress ring; a streak ring; a separate XP ring; a quest progress ring; red failure states; shame copy; motivational hype copy; casino-style reward animation.
- **Tone guard.** The Weekly Activity Ring must honor the no-shame rule (Decision 031) — no failure/deficit/debt/quota framing for an incomplete week (Companion no-ledger principle, BFG_Companion_Doctrine.md §X). The Voice must never reference the ring as a quota or target.
- **Home is the stage for Stage Evolution (Decision 069).** When a completion (workout or quest) causes a Stage Evolution, the flow routes to Home and the Evolution Animation plays here — Home is the emotional stage for the avatar transformation (Decisions 002, 007, 035). This is a transient milestone moment, not a new standing Home fixture; the §15 composition above is unchanged. The full reveal flow (including non-evolution destinations) is specified in §18.
- **Home has its own progress-visualization memory (Decision 070).** Home persists the last visually-shown state of its progress indicators — at least the **Inner Level Progress ring** and the **Outer Weekly Activity Progress ring** (e.g. 12/24). If a progression change happened while the user was not on Home (or before the indicator was last shown), Home **animates from the last-seen state to the current state** on the next visit, then clears its own memory. Home's memory is **independent** of the Progress screen's memory (§19): viewing Progress never clears Home, and viewing Home never clears Progress. Use the calm motion budget (subtle, `< 600ms`, `prefers-reduced-motion` respected — §5, §13). Full rule in §19.
- **Post-MVP (deferred, Decision 071):** notification bell; notification center; richer idle interactions; advanced Home personalization; cosmetics showcase on Home; deep weekly recap; manual Home customization; multiple Home layouts; complex companion conversation on Home.

---

## 16. Activity composition

The accepted MVP Activity composition (Decisions 042–045). This section governs the Activity surface only; it does not modify Home (§15) or Presence rules.

- **Information hierarchy — Workouts primary, Quests secondary.** Assigned Workouts render above Daily Quests. Daily Quests are a supportive layer beneath training and must never adopt the visual weight of a workout card (Decisions 042, 020; quests live in the Workouts area per Decision 004).
- **Workout card composition — minimal.** A workout card shows the **Workout Number** (program-order index), the **Workout Title**, and the **Exercise Count** — and nothing else. Never show previous results, analytics, categories, duration, weight history, or progress metrics on a card (Decisions 045, 055). Reuse `GameCard` (§6, §12); do not build a stat-dense card variant. Detailed metrics live on Progress (Decision 008).
- **Count semantics — Exercise Count vs Step Count (Decision 068).** The workout card's count is the **Exercise Count** (number of exercises/movements). The **Workout Start Screen** lists **Workout Steps** (one Step = one session screen; a two-exercise superset Step is one Step, two exercises). Exercise Count and Step Count are different concepts and must not be conflated — the card counts exercises, the Start Screen lists Steps (Decisions 060, 062, §18).
- **Header — "Activity" only.** The Activity header reads "Activity" — no date, no Today section, no motivational subtitle, no journey subtitle (Decision 055). Activity is a functional navigation surface; Home remains the emotional center (§15).
- **Visible section headers, fixed order.** Two sections, each with a visible header: **Workouts** then **Daily Quests**, workouts always above quests (Decisions 055, 042).
- **Vertical list, program order, no reorder, no horizontal scroll.** Workout cards render as a vertical list in fixed program order (Workout 1, 2, 3, …); cards never reorder, and cycle position is shown via state markers only (Decisions 055, 054, 048). No horizontal scrolling or carousels (also §13).
- **Binary quest state.** A daily quest is **Completed or Not Completed only** — no partial progress, percentages, progress bars, or counters (e.g. "3/5 л", "8000/10000 шагов"), and no intermediate states (Decision 055; no-shame, Decision 031).
- **Completed workout → Default state (Decision 056).** After Start → Finish, the workout card returns to the Default blue outline with no marker. There is no Completed/Finished card state and no dedicated completion color; completion history lives on Progress (Decision 008), not Activity.
- **Marker priority: In Progress over Upcoming (Decision 057).** Only one special state may exist in the workout list at a time. While any workout is **In Progress** (green), no **Upcoming** marker and no orange card appear anywhere; when the active workout completes, the next workout in the cycle becomes Upcoming (Decisions 046, 051). This keeps the one-state rule (Decision 048) true at the list level.
- **Initial journey state: Workout 1 is Upcoming (Decision 059).** For a brand-new user — no workout ever completed and none In Progress — the journey pointer initializes to **Workout 1**: Workout 1 renders with the **Upcoming** marker and orange outline (Decisions 054, 057), and Continue Journey (on Home) resolves to Workout 1 (Decision 043). After the first completion (Start → Finish), the D046 cycle becomes authoritative. D059 adds no expiration, cancellation, reset, or session recovery — started workouts follow Decision 058.
- **Activity is a browsing surface, not the resume surface.** The primary resume action — "Continue Journey" — lives on Home and opens the next assigned workout directly (Decision 043, §15). Activity carries no competing global primary CTA.
- **No weight entry on Activity.** Optional weight logging appears on the exercise screen only — never on the Activity surface and never on a workout card (Decision 044).
- **Tone guard.** Completion and empty states on Activity honor the no-shame rule (Decision 031) and the no-empty-state-pressure rule for optional data (Decision 040) — absent content is never framed as failure (§8).
- **All workouts visible and accessible — no locks.** Every workout in the program is shown and manually openable; no locked, hidden, or paywalled workouts (Decision 047; consistent with Decision 030). Workouts later in the cycle are browsable, never gated.
- **One state marker per workout card.** A card shows at most one state marker — **Upcoming Workout** or **Workout In Progress** — never both at once; a card with no applicable state shows no marker (Decision 048).
- **Equal card size — emphasis by state, color, and position, never size (Decision 054).** All workout cards use the same visual size; the current workout is never enlarged. Do not import Home's hero/focal enlargement (§15) — Activity is a browsing surface, not a dashboard or Home.
- **Card outline color by state (Decision 054):** **Default** workout — neutral / blue outline; **Upcoming** workout — orange outline + Upcoming marker; **Workout In Progress** — green outline + In Progress marker. One state only (Decision 048). Note: the orange (Upcoming) and green (In Progress) accents are Activity-card state semantics that extend the base palette in §4 (sky / violet / rose / cyan); reconcile in the next §4 palette pass.

---

## 17. Workout interface (pre-start & boundaries)

The accepted MVP rules for the workout viewing/session interface (Decisions 049–053). This section governs the workout interface only; it does not modify Home (§15) and touches Activity (§16) only via the card-state marker.

- **Start boundary.** A workout is "started" only after the user presses **Start Workout**; viewing a workout (exercises, videos, content) is not starting it (Decision 049).
- **Completion boundary.** A workout is "completed" only after **Start Workout → Finish Workout**; only completed workouts advance the journey cycle (Decisions 050, 046, 051).
- **Pre-start content is open.** Before Start Workout, users may view exercises, videos, and inspect content — content access is never blocked (Decisions 052, 030).
- **Persistent not-started reminder.** Before Start Workout, a persistent visual reminder that the workout has not started must remain visible throughout the workout interface, including while viewing exercise videos (Decision 052). Keep it calm (§5, §11) and non-blocking — never a modal that blocks the interface (§13).
- **Weight fields gated to the started state.** Weight input fields are hidden before Start Workout and become available only after (Decision 053, refining Decision 044). No workout data is recorded before start (Decision 050). Weight stays optional and analytics-only on the exercise screen (Decision 044, §16).
- **One active workout at a time (Decision 058).** Only one workout may be **In Progress**. While an active workout exists, users may leave it, navigate anywhere, and open/inspect any other workout and its videos (Decisions 047, 052) — but they cannot start a second. Other workouts must not show **Start Workout**; they show **Return To Workout** (or equivalent), which returns the user directly to the active session. No workout-cancellation flow is introduced.

---

## 18. Workout session screens & flow

The accepted MVP composition of the workout session screens and their flow (Decisions 062–067, 069). This section governs the session screens only; it builds on the pre-start boundaries in §17 and does not modify Home (§15) beyond the evolution-stage note, or Activity (§16) beyond the card-count clarification.

- **Session flow (Decision 063).** Workout Start Screen → Workout Step → Workout Step → … → Workout Finish Screen. Navigation is **swipe-only** — swipe forward and swipe backward — with **no visible Next/Previous buttons**. Swiping forward past the final Workout Step opens the Workout Finish Screen. Moving between Steps is navigation only and carries no completion meaning (Decision 060).
- **Workout Start Screen (Decision 062).** Displays only the **Workout Title** and an **ordered Workout Step list** (e.g. "1. Squat / 2. Leg Press + Crunch / 3. Lunges"). Primary button: **Start Workout**, or **Return To Workout** if another workout is already In Progress (Decision 058, §17). Do **not** display duration, difficulty, categories, analytics, or companion content. The Step list counts Steps, not exercises (Decision 068, §16).
- **Single Exercise Step layout (Decision 064).** Vertical hierarchy: **Exercise Video → Exercise Title → Prescription (Sets, Reps or Duration) → optional Weight Field.** The video holds the primary visual position. The weight field is hidden before Start Workout and visible only after (Decision 053, §17). No progress/analytics on the Step — detailed metrics live on Progress (Decision 008).
- **Superset Step layout (Decision 065).** A superset is **one Workout Step** (Decision 060) showing **both exercises simultaneously** in a **horizontal card structure** (Exercise 1 + Exercise 2). Each card carries its own **Video, Title, Prescription, and independent Weight Field**; videos use **vertical (portrait) orientation**. The two exercises must remain visually distinct and be immediately readable as one Step. Do **not** add a Superset entity, a "1/2"/"2/2" notation, or a "2 exercises" label. Two independent weight fields, one per exercise (per-Exercise-ID history, Decisions 041, 044). *Reconciliation note: the horizontal two-card layout must be validated against §1 (mobile-first 360–430px) and §13 (no carousels where a list would do) at implementation — both cards are shown simultaneously, not as a scrolling carousel, and portrait video is chosen to fit the two-up layout; flagged for the §1/§13 pass.*
- **Workout Finish Screen (Decision 066).** A **separate** screen after the final Step, displaying **"Workout Complete"** and a **Finish Workout** button (the completion boundary, Decision 050). No companion content, no additional metrics.
- **Workout Reward Modal (Decision 067, finalized 2026-06-23).** After Finish Workout, the reward is a **modal window over a dimmed background** — **not** a separate screen, **not** a bottom banner, **not** a toast. It shows **only what changed**, largest reward first: **Stage → Level → XP**. Behavior split: **no Stage growth →** the modal carries a single **Return To Activity** button that returns to Activity; **Stage growth →** the modal has **no button**, auto-advances to **Home after 5–7 seconds**, and a **tap speeds up the transition** to Home but can **never skip the Evolution Animation** (Decision 069). Keep the calm motion budget (§5, §13 — no casino-style sweeps). Companion reactions are **rare** and only for meaningful milestones (Decisions 035, 036, 037). *(This supersedes the interim "Result Banner" wording; any remaining "Result Banner" reference means this Reward Modal.)*
- **Evolution Reveal flow (Decision 069, finalized 2026-06-23).** A **Stage Evolution overrides the post-reward destination** and routes to **Home**, where the Evolution Animation plays — regardless of trigger. Normal workout completion: Finish Workout → Reward Modal → **Return To Activity**. Normal quest completion: Quest Complete → Reward Display → **remain on Activity**. Evolution (workout or quest): after the Reward Modal / Reward Display → **Home → Evolution Animation** (§15). Stage Evolution has **absolute priority** over the current screen; the reason for it does not matter; the **transformation cannot be skipped** — a tap may accelerate the transition to Home, never skip the animation.
- **Tone & surface guards.** Session screens stay calm and metric-light (§1, §5): no duration/difficulty/analytics on the Start Screen (Decision 062), no extra metrics on the Finish Screen (Decision 066), no emoji or motivational exclamation copy (§11). Russian copy rules (§11) apply to all session copy.

---

## 19. Deferred progress visualization (Decision 070)

The accepted MVP rule for showing progression movement after the fact (Decision 070). This section governs progress-indicator animation memory across screens; it does not change the Home composition (§15) or the Progress screen hierarchy (Decision 008).

- **Persist last-shown state, not "unviewed XP".** After any progression change, the system stores **the last visually-presented state of each progress surface separately**. It never relies on a single global "unviewed" flag. The user must always **see the indicators move**, even if the underlying change happened earlier (between sessions, after the app was closed, or while the user was on a screen that does not show that indicator).
- **Animate last-seen → current, then clear.** When a screen opens and its current value differs from its last-shown value, that screen **animates from the last-shown state to the current state** with the calm motion budget (subtle, `< 600ms`, `prefers-reduced-motion` respected, no casino-style sweeps — §5, §13). After the animation completes, **that screen's memory updates to the current state**.
- **Per-screen, independent memory.** Memory is owned per screen and never shared:
  - **Home memory** covers at least the **Level Progress open ring** (Inner Ring — progress toward the next level) and the **Weekly Activity Progress (Outer Ring)** (e.g. 12/24). Both are open rings (Decision 071). See §15.
  - **Progress memory** covers the Progress screen's progression elements (e.g. **XP Progress, Level Progress, Stage Progress**, and any other progression elements present, per Decision 008).
  - **Independence rule:** viewing **Home does not clear Progress memory**; viewing **Progress does not clear Home memory**. Each surface is satisfied only once it has shown its own animation.
- **Scenarios that must resolve correctly** (non-exhaustive): completed a workout; completed a quest; closed the app; stayed only on Activity for a long time; visited Home but not Progress; visited Progress but not Home.
- **Tone guard.** The catch-up animation is acknowledgment of movement, never pressure about what was missed (no-shame rule, Decision 031). It must not re-trigger casino-style or repeated celebration; it plays once per surface per change set.
- **Relation to the Reward Modal / Evolution flow.** The Reward Modal (§18, Decision 067) shows the immediate post-completion change in the moment; §19 governs the **separate** later catch-up on Home and Progress when an indicator was not on screen at the time. A Stage Evolution still routes to Home for the Evolution Animation (§18, Decision 069); §19 does not replace that milestone moment.

---

## 20. Progress composition (Final Progress Product Structure)

The final MVP Progress composition (Decision 072, refining Decisions 008 and 005). This section governs the Progress surface only; it does not modify Home (§15) or the D070 memory mechanics (§19) beyond naming the Progress participants. Progress is the identity / history / progression surface. It answers *"Кем я стал? Как я развиваюсь? Что уже накопилось в моей истории?"* Home is the living present; Progress is the retrospective record. **Progress must not become a second Home, and must not become a noisy analytics dashboard.**

**Composition, top → bottom (Decision 072):** Minimal Header (title + small Profile button) → Primary Identity Block → Secondary Progression Block → Additional Archive Block → Bottom Navigation.

- **Minimal Header.** Screen title plus the small **Profile button** (Decision 006) — one shared account surface, also reachable from Home. Not a bottom-nav tab.
- **Primary Identity Block — static identity portrait.**
  - **One avatar, two representations (Decision 001).** Home renders the live, interactive, customizable Presence; Progress renders a **static, non-interactive** portrait of the **same** avatar and the **same** visual state. They are not separate avatars.
  - The portrait **does not move, animate, breathe, or respond to taps**, and **never opens customization**. Avatar customization is entered only from Home (Decision 073, §15).
  - **Synchronization guard.** The portrait **always reflects the current customized avatar state** (appearance, clothing, cosmetics, current stage form). It is never stale, yet it updates **statically and silently** — no movement, no tap transition, no animated reveal, no celebration. **This is not a D070 catch-up** (§19); it is a silent static update outside the §19 path.
  - **Stage / Evolution identity** shown as **journey position** ("Stage 3 of 10" / "3 из 10") — never quota / deficit / completion framing (§11, Decision 031).
  - **Legend slot** — system-assigned only (Decision 027), with the pre-Legend placeholder ("Path is still forming"; final Russian copy later) framed as emerging identity, never empty.
- **Secondary Progression Block.** Level, XP (toward next), Streak, Stage position. Calm accumulation. Streak = continuity, **never** currency (Decision 021), **never** pressure (Decisions 031, 038).
- **Additional Archive Block.** History, Statistics, Achievements — **entry points / progressive disclosure**, never dense inline walls.
  - **History** — a private chronicle of completed workouts + evolution milestones (Decision 056).
  - **Statistics** — opt-in; strength stats only after the first weight is logged (Decision 040); no empty-state pressure (§8).
  - **Achievements** — inside the Additional block; **MVP = lightweight earned shelf**; **Post-MVP = full Achievement Constellations / grid** (Decision 026); no completion-% or rarity; locked = quiet potential; never outranks the Primary block.
- **D070 Progress memory (§19).** Participants: **XP Progress, Level Progress, Stage Progress**. Non-participants: Streak, History, Achievements, Statistics, and the static portrait. Viewing Home never clears Progress memory, and viewing Progress never clears Home memory.
- **Tone guard.** Progress honors no-shame / no-ledger (Decisions 031, 038): no failure / deficit / quota framing, no red failure UI, no motivational hype (§11).

**Progress must not show (Decision 072):** leaderboards; PvP; social comparison; leagues; followers/kudos feed; user-selected classes; gear/loadout stats; closed rings / perfect-week framing; red failure states; shame copy; streak-loss pressure; numeric Energy / readiness / daily-verdict scores; performance-gated rewards (e.g. a crown for hitting a score); completion-% or rarity pressure; rank/level overlaid on the avatar; an avatar built for social identification; empty-state pressure to log weight; dense analytics walls; duplicating Home's two rings; duplicating Home's "Continue Journey" CTA; duplicating Home's living/interactive Presence role; an interactive / tappable avatar; any avatar movement, idle animation, or tap transition; customization entry from the portrait; casino-style animation.

---

## 21. Entry / Auth Start screen (unauthenticated first contact)

The MVP rules for the first **unauthenticated** screen (Decision 074). This section governs the Entry / Auth Start surface only; it does not modify any post-auth surface (Home §15, Activity §16, workout session §17–§18, Progress §20). This screen is the user's **first contact** with the product: calm, dark, cinematic, premium — not a raw login form and not a marketing landing page. It answers one thing: *"begin here."*

**Composition, top → bottom (Decision 074):** Minimal brand mark → **Seed Form (First Presence Form)** in the optical center → calm headline (+ optional one-line subtitle) → **single primary CTA** → quiet secondary Log In link.

- **No scroll.** The entire screen fits the initial viewport on mobile-first 360–430px (§1). Nothing lives below the fold; the screen is the source-of-truth frame.
- **Responsive (Adaptive Cinematic Canvas, §2 / Decision 075).** No scroll is **mandatory** on the phone viewport (and should also hold on larger tiers). On tablet the **Seed Form and atmosphere (glow / rings / side fields / visual stage) may scale up moderately**; the **headline / subtitle stay capped and centered** and the **primary CTA stays capped (~320–420px)**. Do not force the screen into a narrow ~480px strip when the viewport supports a richer stage, and do not build a separate tablet/desktop layout with extra content.
- **Seed Form — visual center, non-final.** A neutral, unfinished **pre-presence**: not gendered, not customized, **never a default/final avatar, never Stage 10 or any evolved form** (Decision 010). It is a *pre-figuration* of the Presence, **not** the user's avatar — the default avatar is received only after onboarding. It is **alive but minimal** (breathing + subtle glow, the MVP Body floor — §5, BFG_PRESENCE_RESPONSE_SYSTEM §7) and **Voice-silent**: the first-ever Presence Voice moment belongs to the first session after account creation (BFG_PRESENCE_RESPONSE_SYSTEM §4) and must not be spent here.
- **Seed Form interaction is context-scoped — no global rule.** On the Entry / Auth Start screen, **Seed Form is tap-reactive decoratively but is not a navigation affordance** (Decision 074). The tap **does not** navigate, open auth, open onboarding, open customization, show Voice/companion text, or show any modal / tooltip / text hint, and **never becomes a second CTA**. The permitted tap response is a **decorative path hint only**: softly stir / pulse / brighten the Seed Form, send a subtle glow / path toward the primary CTA, and/or softly highlight the primary CTA — a **short, calm moment within the existing motion budget** (§5 / §13 — up to ~600ms, `prefers-reduced-motion` respected, degrading to a static emphasis), never casino-style, never marketing.
  - **Onboarding boundary (note only).** Onboarding Seed Form behavior is **outside §21 / Decision 074 scope** and is specified separately by future onboarding decisions (none accepted today). Boundary note: a later onboarding Seed Form must **not** become a repeated tap target. This section neither defines nor overrides any onboarding Seed Form interaction.
- **Single primary action.** Exactly **one** primary CTA leads to **Sign Up** (email/password, MVP) → onboarding. It is the only path forward; the Seed Form's decorative tap-reactivity is **not** a competing action (single-primary-CTA discipline, §15; Decisions 071, 073; the Body never reaches — Companion Doctrine §X). A **quiet, low-emphasis secondary Log In link** serves returning users.
- **Copy & tone — principles only, no final copy.** Calm, **sentence-case** headline + optional one-line subtitle; **no all-caps motivational headline**, no exclamation marks, **no win / achievement / competition framing** ("победы" and equivalents are forbidden — §11, Decision 032), no corporate fitness vocabulary, warm "ты", no emoji (§11). The screen **does not over-explain** (no feature list, no descriptive paragraph) and is **not aggressive marketing**. Decision 074 approves **structure, interaction rules, and copy principles only** — exact headline / subtitle / CTA copy is a later approval; current text variants are placeholders.
- **No trial / subscription on entry.** No 30-day trial, pricing, or subscription state on this screen — those are account/profile details (Decision 006) and never gate the core loop (Decision 030). A quiet trial-reassurance line is **Post-MVP only, never hype**.

**Entry / Auth Start must not show (Decision 074):** Stage 10 or any evolved / final / "beautiful" avatar form; a gendered, customized, or finished avatar; the Seed Form as a navigation affordance or a second CTA; a second primary CTA; a companion Voice line / chat / per-load phrase; trial / subscription / pricing (MVP); feature lists, marketing bullets, screenshots, testimonials, social proof, descriptive paragraphs; "победы" / win / achievement / competition copy; hype; exclamation marks; all-caps motivational headline; casino-style or aggressive motion; any scroll / content below the fold; emoji.

**Post-MVP (deferred, Decision 074):** richer Seed Form ambient motion / parallax; an optional quiet trial-reassurance line (only if conversion data later shows a need, never hype); headline A/B testing; any seed → avatar morph teaser (risky — could leak evolved forms; deferred); non-RU locales (out of MVP scope §3.1).

---

## 22. Auth surface — Sign Up / Verify Email / Log In (Decisions 076, 077)

The MVP rules for the Auth flow that follows the Entry / Auth Start screen (§21, D074). One **Auth surface with three states — Sign Up · Verify Email · Log In — sharing one visual shell**, reached as a real navigation step from Entry (not a modal/sheet). Overall flow: **Entry → Auth Surface → Onboarding → Home.** This section governs the Auth surface only; it does not modify Entry (§21), Home (§15), or any onboarding screen.

- **Shared shell.** A minimal top bar carries only a **back affordance → Entry** (D074); no bottom navigation (pre-app surface), no other top-bar content (§2). The three states reuse one shell, brand mark, and atmosphere.
- **Seed Form continuity.** The Seed Form continues from Entry as a **reduced, non-interactive background presence** (glow / silhouette): **not central, not tappable** (the Entry decorative tap-hint was context-scoped to Entry, D074), **Voice-silent** (the first Presence Voice moment belongs to the first onboarding session, `BFG_PRESENCE_RESPONSE_SYSTEM §4`). It **recedes further while the soft keyboard is open**.
- **Sign Up state.** Heading (+ optional subtitle) → **email** → **password** (show/hide, new-password) → single primary submit CTA → quiet switch link to Log In → optional quiet legal line (Terms/Privacy) where required. **Success → Verify Email state** (never straight to onboarding).
- **Verify Email state (required gate, D077).** Calm heading → **"code sent to {email}" line** → **6-digit OTP field** → primary **verify CTA** → quiet **"resend code" (visible cooldown)** → quiet **"change email"** action → calm inline error. **Change email** returns to Sign Up with the email editable, **invalidates the old code**, sends a new one (covers the typo'd-address failure). **Correct OTP → onboarding start.** **OTP, not magic link** (same-session continuity, RU email-client robustness). No companion Voice, no onboarding questions, no pricing.
- **Log In state.** **email** → **password** (show/hide, current-password) → quiet **"forgot password"** link (entry point only; the reset flow is a separate future decision) → single primary submit CTA → quiet switch link to Sign Up.
- **Routing.** Sign Up success → Verify Email · Verify Email (correct OTP) → onboarding start · Log In verified + onboarding done → **Home** (§15) · Log In verified + onboarding unfinished → **resume onboarding** · Log In unverified (correct credentials) → **Verify Email** · Log In wrong credentials → **generic invalid-credentials error** (never reveals account-exists-but-unverified) · already-authenticated visit → **redirect** (Home / resume onboarding / Verify Email), never the form.
- **States & feedback.** **Default · Loading · Error · Success.** Loading is **inline on the CTA** (disabled + calm indicator), fields locked, no full-screen spinner, no layout shift. **Errors are calm, Russian, inline under the field/form — never a toast** (§7, §13). Error copy is **generic and non-enumerating** (`BFG_SECURITY §3`); **no aggressive live validation** — validate on submit (server-authoritative). **Rate limits** on submit/send/verify show a calm "try later" message that leaks no specifics.
- **Responsive (Adaptive Cinematic Canvas, §2 / D075).** Mobile-first 360–430px is the source of truth; **no horizontal scroll**; the **keyboard-closed viewport has no vertical scroll**. On tablet the atmosphere / Seed silhouette / side fields may expand while the **form column stays capped** (readable width, **CTA ~320–420px**) and centered; never a desktop dashboard. When the keyboard is open, the active field and CTA must remain reachable; **minimal internal scroll of the form region is allowed only as a keyboard fallback, never the default**.
- **Copy.** Structure and principles only; **no final copy is locked** (D076/D077). Calm, sentence-case, warm "ты", no exclamation marks, no emoji (§11).

**Auth surface must not show (Decisions 076, 077):** trial / subscription / pricing; marketing paragraphs / feature lists / testimonials / social proof; any companion Voice line / chat / per-load phrase; onboarding questions; dashboard metrics; bottom navigation; the Seed Form as central, interactive, or a tap target; a second primary CTA per state; aggressive / live red validation; toast as primary feedback; **account-existence-leaking / enumerating error copy**; "which field was wrong" leaks; hype; exclamation marks; all-caps headings; casino-style motion; emoji; any horizontal scroll; default-state vertical scroll (keyboard closed); a separate tablet/desktop layout with extra content; endlessly scaling form/buttons; **any verification / legal / payment field on an onboarding or Naming Ceremony screen** (verification lives only in the Verify Email auth state, D077).

---

## 23. Onboarding flow (Decision 078)

The MVP rules for onboarding, which begins only after email verification succeeds (§22, D077) and ends by handing off to Home (§15). Flow: **Verify Email ✓ → S1 Seed Form → S2 Goal + Sex → S3 Fitness Level + Environment/Home-Gym → [silent Program Assignment] → S4 Default Avatar + Naming Ceremony → Home.** This section governs onboarding only; it does not modify Auth (§22), Home (§15), or the Program Architecture (it consumes D061).

- **Presence-led dialogue (governing rule).** Onboarding questions are presented as **Presence-led dialogue, not app-form labels**. The **Presence is visible on every onboarding screen** and **owns the question framing** — the Presence asks; the on-screen options are the **user's structured replies**. Onboarding must feel like *"the Presence is getting to know me,"* never *"the app is collecting form data."* The Presence is **never a decorative background only** (notably on S2/S3). Framing uses short, calm Voice/text governed by the Presence Response System §4 and the Companion Doctrine — **restrained, rare, calm, no hype, no pressure**. **No free-form chat, no companion chat panel, no Voice overuse**; questions stay **structured (selectable options / one name field) only**.
- **S1 — Seed Form (First Meeting).** The living Presence Body appears for the first time as the Seed Form; may carry the first restrained Voice moment (PRS §4); no inputs, one forward action. Neutral/unformed — not the default avatar, never Stage 10 (D010, §21).
- **S2 — Goal + Sex.** Same screen; the Presence frames **Goal first** (single-select), then **Sex** (single-select). Sex is a Program-assignment key (D061); **Goal is not** (collected for framing/future use only).
- **S3 — Fitness Level + Environment / Home-Gym.** Same screen; the Presence frames both (Environment = Training Format Home/Gym, D061). Shows the **first subtle formation beat** reflecting S2 answers — still not the final default avatar.
- **Silent Program Assignment.** Once Sex × Fitness Level × Training Format are known (leaving S3), the Program is assigned **server-side, deterministically, with no screen** and **no "building your path" loading-as-meaning** (D061). The user never chooses a program/workout.
- **S4 — Default Avatar + Naming Ceremony.** The Presence is now the **Stage-1 Default Avatar** (its first appearance; never beyond Stage 1 — D010). **Sex may set the basic masculine/feminine default-avatar direction** (basic direction only — no classes/stereotypes/manual editing/cosmetics/gameplay/social mechanics; final art is a separate decision). **Naming is required** (not skippable): the name is the final personal action before Home; a **soft suggested/default name** may be offered (acceptable or editable) but **S4 must be completed**, and the **onboarding-complete flag flips only after S4**. The name writes to the single shared avatar visual state (D001, §15/§20). Heavy customization is **not** here (entered from Home, D073).
- **Avatar formation (no separate screen).** Formation is woven into transitions — "changes appear on the following screen after answers"; the Stage-1 default avatar first appears on S4. No separate Avatar Formation or transformation screen.
- **Routing.** Verify Email ✓ → S1 · onboarding complete (S4 done) → Home · returning verified user with unfinished onboarding → resume at the earliest unanswered screen (per-step progress marker) · verified + complete → Home.
- **Responsive (Adaptive Cinematic Canvas, §2 / D075).** Mobile-first 360–430px source of truth; no horizontal scroll; calm motion (§5, formation beats `< 600ms`, `prefers-reduced-motion` respected); on tablet the Presence/atmosphere may expand while the readable dialogue/options column stays capped and centered; never a desktop dashboard.
- **Copy.** Structure and principles only; **no final copy is locked**.

**Onboarding must not show (Decision 078):** email-verification / OTP / password-confirmation / legal-consent / payment / subscription / any auth-security-admin field on any onboarding or Naming Ceremony screen (D077); a companion chat panel or free-form chat; over-frequent Voice; the Presence as a decorative background only; the default avatar before S4; any evolved / Stage-10 form; a separate program-assignment, "building your path", transformation, safety-screening, or biometrics screen; manual program/workout selection; heavy avatar customization; dashboard metrics; trial / pricing / marketing; shame copy; "skip / later" naming as the default model; casino-style motion; emoji; horizontal scroll.
