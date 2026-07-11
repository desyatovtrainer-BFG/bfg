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
- **Avatar direction slots and default Stage forms (Decision 083).** The shared avatar visual state is **direction-specific**: BFG stores a **Hero visual slot** and a **Heroine visual slot** separately, and the **active direction** (set at S4, D079; editable later in Profile, D080) decides which slot renders. Changing Hero/Heroine in Profile switches the active direction only and **never migrates customization between directions** — clothing, hair, beard, moustache, accessories, body shape/silhouette, facial features, colors, accents, aura/glow, and any other customization are direction-specific (no compatibility mapping, no partial migration). On switch, the active direction renders either **its saved slot** (if one exists) or the **default avatar for that direction at the user's current global Stage** — never Stage 1 for a mid-journey user, never a Stage frozen at the moment the slot was created (a restored slot renders on the current-Stage base). Switching away **preserves** (never deletes) the other direction's slot. **Avatar Name and Stage stay global** and are unaffected by the switch; there is still **one Presence** with one active direction at a time (D001), and Home always shows the **active direction at the current global Stage**. Default avatars exist conceptually for **each direction at every Stage 1–10** (D010). D083 defines persistence and switching only — not catalog depth, art, cosmetics, currency, or schema.
- **Two open progress rings around the Presence (Decision 071).** Exactly two — an **Inner Ring = Level Progress** and an **Outer Ring = Weekly Activity Progress**. No additional rings, meters, bars, XP gauges, streak rings, quest rings, or raw progress indicators are allowed on Home. Both are **open rings / open arcs**, never fully closed circles: each must have a **visible start**, a **visible end**, a **deliberate split / open segment**, a **value label inside or near the split**, and a **calm fill animation** on value change. The rings are a supporting layer and must never out-weigh the Presence. Render with the calm motion budget (subtle, `< 600ms` fills, `prefers-reduced-motion` respected, no casino-style sweeps — §5, §13).
  - **Inner Ring — Level Progress.** Shows the current level value (e.g. "12 УР."); arc fill = progress toward the next level; does **not** reset weekly; belongs to long-term vertical progression; participates in Home visualization memory (§19). It is an **open ring** (this standardizes the "Level Progress bar/ring" wording of Decision 070 / §19 in favor of a ring).
  - **Outer Ring — Weekly Activity Progress.** Shows the weekly activity count (e.g. "12/24 АКТ."); arc fill = weekly activity completed vs weekly activity capacity. **Counting:** one completed workout = one activity; one completed daily quest = one activity; **only completed actions count**. Opening the app, viewing a workout, viewing a quest, maintaining a streak, entering weight, visiting Home/Progress, profile actions, and passive app time **do not count**. **Reset:** at the start of each new **UTC week** (MVP); previous weekly activity lives on Progress / History, not Home. **Denominator (weekly activity capacity):** 21 daily-quest activities (3 quests × 7 days, Decision 017) + the **active Program's cycle length** (its number of Workout Templates, 2–5 per Decision 061) → 23–26. The workout term is the **active Program cycle length, not "workouts per week"** — there is no weekly workout cadence in the count-agnostic Journey/Program model (Decisions 046, 061). **Overflow:** if completed activity exceeds the denominator (the cycle may repeat within a week), Home shows a **capped** value (e.g. "24/24 АКТ.").
- **Stage Block under the Presence.** Refined by Decision 082 to include the **Avatar Name as its first identity line**, followed by the **Stage Title** and **Stage Number** (reference: name + "SEEKER / STAGE 3"; final naming may change — the structure is fixed, the words are not). The identity block order is **Living Presence → Avatar Name → Stage Title / Stage Number → Voice Slot → Continue Journey**. The Avatar Name (set at S4, D079; editable in Profile, D080) belongs to the Presence identity area and must **not** appear in the minimal header, inside the Profile button, inside Continue Journey, as a separate dashboard/stat card, or as a floating decorative label. D082 locks placement and hierarchy only — the exact visual styling of the name is not locked, and the name is never account/profile UI, never part of the CTA, and never a new primary action.
- **Event-driven Voice Slot under the Stage Block (Decision 071).** Home **may** show a Voice Slot under the Stage Block — this **closes the previously-open Voice-placement question** (Decision 039 #9). It is **not** a permanent companion text panel: Voice is **event-driven and rare**, idle Home may show **no** voice line, and it never becomes a standing fixture. Voice follows the Companion Doctrine and Presence Response System (Decisions 036–038): calm, restrained, specific, no hype, no guilt, no pressure.
- **Primary CTA — "Continue Journey".** A single primary action; no competing buttons on Home. It opens the next assigned workout directly (Decision 043): brand-new user → Workout 1 Start Screen (Decision 059); normal cycle → next workout in the current Program cycle (Decision 046); active workout exists → the active workout session (Decision 058). It does not open Activity.
- **First Home after onboarding (Decision 082).** After S4 (Naming Ceremony, D079) the user lands on this full Home — **no automatic transition to Workout 1**, no forced workout launch. Continue Journey is visible and available immediately, but it must **not** receive an extra first-run **glow, pulse, forced tooltip, modal, banner, or onboarding hint** by default; the normal primary-CTA hierarchy above is enough, and the interface must not pressure the user into starting the first workout. From this first Home the user may **tap the Living Presence to enter Avatar Customization before the first workout** (D073), explore other surfaces, or press Continue Journey when ready. The first Home shows the Stage-1 default avatar, the Avatar Name, and calm starting Level / XP / Weekly Activity / Streak values — empty or zero values are framed as a **beginning**, not missing progress (Decision 031). For a brand-new user Continue Journey still resolves to Workout 1 (D059/D043); D082 changes presentation and handoff only, not routing.
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
- **Accepted Russian labels (2026-07-05 — D003/D055 naming clarification).** Screen title: **«Активность»**. Section headers: **«Тренировки»**, then **«Ежедневные квесты»**. Bottom-nav tab label: **«Активность»** (not «Тренировки»). The route may remain `/workouts` during the MVP rebuild as an implementation detail. Naming/UX only — no workout/quest logic, economy, or Program Assignment change.
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
  - **Active direction + current Stage (Decision 083).** The portrait renders the **same active avatar direction and current global Stage** as the Home Living Presence (one shared, direction-specific visual truth — §15, D001/D073). After a Profile Hero/Heroine change (D080), the portrait shows the new direction's **saved slot** if one exists, otherwise that direction's **default avatar at the current Stage** — never a migrated look and never a backward Stage. No customization migrates between the Hero and Heroine slots.
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
  - **Onboarding boundary (note only, updated 2026-07-11).** Onboarding Seed Form behavior remains **outside §21 / Decision 074 scope** and is now governed by **Decision 079 / §23**: the onboarding **S1** Seed Form is **functional** — a direct tap advances to S2 — while the **Entry** Seed Form here stays **decorative and non-navigational**; S2–S4 Presence is non-interactive. The two Seed Forms are context-scoped and intentionally different; §21 neither defines nor overrides D079.
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

## 23. Onboarding flow (Decisions 078, 079, 080, 081, 084, 085)

The MVP rules for onboarding, which begins only after email verification succeeds (§22, D077) and ends by handing off to Home (§15). Flow: **Verify Email ✓ → S1 Seed Form → S2 Goal + Hero/Heroine → S3 Experience + Training Format + Weekly Frequency + Conditional Training Structure → [silent Program Assignment] → S4 Default Avatar + Naming Ceremony → Home.** Structure is D078; copy/taxonomies are D079; post-onboarding editability is D080; the Weekly-Frequency matrix, Training Structure choice, and reduced Program Family model are **D085 (superseding the D081 matrix/family model)**; Profile save/confirmation behavior is **D084**. This section governs onboarding only; it does not modify Auth (§22) or Home (§15), and it consumes D061/D085 for assignment. Russian copy below is the **accepted MVP copy (D079)** — calm, warm "ты", no exclamation marks, no emoji, no hype, no shame (§11).

- **Presence-led dialogue (governing rule).** Onboarding questions are presented as **Presence-led dialogue, not app-form labels**. The **Presence is visible on every onboarding screen** and **owns the question framing** — the Presence asks; the on-screen options are the **user's structured replies**. Onboarding must feel like *"the Presence is getting to know me,"* never *"the app is collecting form data."* The Presence is **never a decorative background only** (notably on S2/S3). Framing uses short, calm Voice/text governed by the Presence Response System §4 and the Companion Doctrine — **restrained, rare, calm, no hype, no pressure**. **No free-form chat, no companion chat panel, no Voice overuse**; questions stay **structured (selectable options / one name field) only**.
- **S1 — Seed Form / First Meeting (D079, finalized 2026-07-11).** Initial state: the Seed Form is visible with **no text and no CTA**. Two paths:
  - **Active path:** a direct **tap on the Seed Form → S2 immediately** (no reveal first, no second tap). The Seed Form is a **real forward action on S1** — it changes only the internal onboarding screen, never a route, and it uses the same S1 → S2 transition as [Продолжить]. Keyboard activation of the semantic S1 button (Enter/Space) performs the same forward action.
  - **Calm / inactivity path:** after **2–3 s of inactivity**, the Presence says «Давай сделаем первый шаг. / Я помогу тебе начать.» with CTA **[Продолжить]** → S2. After the dialogue appears, tapping the Seed Form still advances to S2 — one logical forward action, two surfaces.
  - Neutral/unformed Seed Form (not the default avatar, never Stage 10 — D010). Presence on **S2–S4 is non-interactive and non-focusable** — no S1 tap behavior is added to later onboarding screens.
  - **Context boundary (do not confuse the two Seed Forms):** the **Entry-screen** Seed Form stays **decorative and non-navigational** (D074, §21 — tap is at most a decorative hint); the **onboarding S1** Seed Form is **functional** and advances to S2 (D079). The interaction is context-scoped, exactly as D074 records.
- **S2 — Goal + Hero/Heroine (D079).** Copy: «Сейчас выберем направление и подстроим тренировки под тебя. / Пара ответов — и я пойму, с чего нам начать.»
  - **Goal — Q1 «Какой результат тебе сейчас важен?» — MULTI-select (≥1).** Options/enums: Снижение веса `weight_loss` · Наращивание мышечной массы `muscle_gain` · Улучшение выносливости `endurance` · Общая физическая форма `general_fitness` · Рекомпозиция тела `body_recomposition`. **Goal does NOT drive MVP Program Assignment**; it may inform future Presence tone / personalization / quest tone and a **future, Post-MVP** avatar starting-form direction (never shame/body-negative; multi-goal visual resolution deferred).
  - **Hero/Heroine — Q2 «Герой или героиня — чью главу мы открываем?» — single-select.** Options/enums: Герой `male` · Героиня `female` (internal `male`/`female`; UI shows «Герой»/«Героиня»; no "(М)"/"(Ж)" markers). **Drives Program Assignment and basic Stage-1 avatar direction**; framed as opening a story path, not identity policing.
  - Helper line: «Информацию можно будет изменить позже в разделе «Профиль».» CTA **[Продолжить]** active only when **≥1 Goal AND Hero/Heroine** are selected.
- **S3 — Experience + Training Format + Weekly Frequency + Conditional Training Structure (D079, D081, D085).** Copy (before frequency): «Мне нужно понять, какая нагрузка подойдёт тебе сейчас. / И где ты будешь тренироваться.» S3 order: **Experience → Training Format → Weekly Frequency → Training Structure (only when available)**.
  - **Experience — Q1 «Какой уровень тебе ближе?» — single-select.** Options/enums: Только начинаю `beginner` · Тренируюсь менее года `intermediate` · Тренируюсь регулярно больше года `advanced`. Framed as current training background, not worth/identity; no shame. Experience **gates** the allowed frequency and whether the Training Structure choice appears — it does **not** multiply Program Families (D085).
  - **Training Format — Q2 «Где будешь тренироваться?» — single-select.** Options/enums: Дома `home` · В зале `gym`.
  - **Conditional Weekly Frequency (D085, supersedes the D081 matrix).** **Hidden until BOTH Experience and Training Format are selected** — no question, no hint, no placeholder before then. After both: «Сколько раз в неделю тебе удобно тренироваться?» showing **only the allowed options for the chosen Experience** (same for Home and Gym). Enums: `two_per_week` · `three_per_week` · `four_per_week`. **Matrix: Beginner → [2][3] · Intermediate → [3] · Advanced → [3][4].** If only one frequency is allowed (Intermediate), show only that value (may render as a single selectable/preselected option), never unavailable alternatives. If Experience or Training Format changes after a frequency was picked, an **invalid frequency is cleared and the options refresh**.
  - **Conditional Training Structure (D085).** Values `full_body` · `split`; user-facing labels **[Фулбоди] / [Сплит]** only. **Shown only when Training Format = Gym AND Experience ≠ Beginner** — i.e. **Gym Intermediate 3, Gym Advanced 3, Gym Advanced 4**. In every other case (all Home; Gym Beginner 2/3) it is **hidden and resolves automatically to Full Body**. Hard rules: **2 days always → Full Body**; Split is **never** for Home; Split is **never** for Beginner; Beginner **never** sees this choice. No technical explanation in onboarding.
  - Helper line: «Информацию можно будет изменить позже в разделе «Профиль».» CTA **[Продолжить]** active only when **Experience, Training Format, Weekly Frequency, and (when shown) Training Structure** are set.
  - **Never expose internal labels** (program family, program variant, assignment key, scalable family, template subset, internal program IDs) — the user sees only level, place, frequency, and (when eligible) Фулбоди/Сплит.
- **Silent Program Assignment (D085, refines D081 / D061).** Once **avatar direction (sex) × training_format × training_structure × weekly_frequency** are known (leaving S3), the active Program is determined **server-side, deterministically, with no screen** and **no "building your path" loading-as-meaning** from the **reduced 8-Program model** (Home always Full Body; Split only for eligible Gym users; Full Body Programs expose a frequency-sized active subset — D085). Experience gates the allowed options but does not select a separate family. The user never chooses a program/workout. Goal and Avatar Name never drive assignment.
- **S4 — Default Avatar + Naming Ceremony (D079).** The Presence is now the **Stage-1 Default Avatar** (first appearance; never beyond Stage 1 — D010), direction from **Hero/Heroine** (basic masculine/feminine only — no classes/stereotypes/manual editing/cosmetics/gameplay/social mechanics; final art separate; future Goal-driven starting-form is Post-MVP). Copy: «Путь выбран. / Осталось выбрать имя.» (gender-neutral — avoids выбрал/выбрала branching by Hero/Heroine). Input **[Имя]**, CTA **[Продолжить]**. **Naming is required — S4 cannot be skipped, there is no [Пропустить]; [Продолжить] is inactive until a valid name is entered.** A future suggested/default name does not make S4 skippable (the user still confirms). The **onboarding-complete flag flips only after S4**. The name writes to the single shared avatar visual state (D001, §15/§20); heavy customization is not here (entered from Home, D073). **After S4 → Home (Decision 082):** [Продолжить] lands the user on the **full Home** (§15) — **no automatic transition to Workout 1**, no forced workout launch, no first-run CTA glow/pulse/tooltip/modal/banner. The **Avatar Name appears on Home** in the Presence identity area, as the first identity line of the Stage Block (§15). The user may tap the Presence to customize before the first workout (D073) or press Continue Journey (→ Workout 1, D059/D043) when ready.
- **Editable later in Profile (D080).** Goal, Hero/Heroine, Experience, Training Format, Weekly Frequency, **Training Structure (when the current values allow it — D085)**, and Avatar Name are **editable later (preliminarily in Profile)**. The "Информацию можно будет изменить позже в разделе «Профиль»" helper reflects this. Editing **never resets** XP, Level, Stage, Streak, Workout History, Weight History, or Avatar Progression; Sex/Experience/Format/Frequency/Structure changes trigger Program Replacement / recalculation (D061 §7, D085). **A Hero/Heroine change follows the avatar direction-slot model (D083, §15):** it switches the active direction only — **no customization migrates** between the Hero and Heroine slots; the new direction renders its **saved slot** if present, otherwise its **default avatar at the current global Stage** (never Stage 1 for a mid-journey user); the other direction's slot is **preserved, not deleted**; Avatar Name and Stage stay global; and there is still **one Presence** (D001).
- **Profile save & confirmation model (D084).** **Goal and Avatar Name save immediately, no confirmation** (Goal is training-assignment-neutral in MVP and may later feed Nutrition only). **Hero/Heroine, Experience, Training Format, Weekly Frequency, and Training Structure are program-changing** and require a **calm confirmation modal** (never a full screen): a **detailed D083-accurate Hero/Heroine modal** and a **shorter modal** for the training fields (accepted Russian copy in the D084 registry entry — «Изменится направление аватара и подбор тренировок…» / «Тренировки могут измениться. Прогресс, уровень, история и аватар сохранятся.»). If a workout is **In Progress**, the modal adds that the current workout stays unchanged and the new assignment applies after it finishes (D058/D061). **After save the user stays in Profile** — no auto-nav to Home/Activity, no forced workout launch, no forced customization — with a **calm inline success line** (suggested copy only). If a field change makes Split no longer allowed, Training Structure **auto-resolves to Full Body** within the same program-changing flow (no hidden Split restoration — D085).
- **Avatar formation (no separate screen).** Formation is woven into transitions — "changes appear on the following screen after answers"; the Stage-1 default avatar first appears on S4. No separate Avatar Formation or transformation screen.
- **Routing.** Verify Email ✓ → S1 · onboarding complete (S4 done) → Home · returning verified user with unfinished onboarding → resume at the earliest unanswered screen (per-step progress marker) · verified + complete → Home.
- **Responsive (Adaptive Cinematic Canvas, §2 / D075).** Mobile-first 360–430px source of truth; no horizontal scroll; calm motion (§5, formation beats `< 600ms`, `prefers-reduced-motion` respected); on tablet the Presence/atmosphere may expand while the readable dialogue/options column stays capped and centered; never a desktop dashboard.

**Onboarding must not show (Decisions 078, 079, 081, 085):** email-verification / OTP / password-confirmation / legal-consent / payment / subscription / any auth-security-admin field on any onboarding or Naming Ceremony screen (D077); a companion chat panel or free-form chat; over-frequent Voice; the Presence as a decorative background only; the default avatar before S4; any evolved / Stage-10 form; a separate program-assignment, "building your path", transformation, safety-screening, or biometrics screen; height / weight / BMI / injury / medical / safety questions; an equipment checklist; a weekly-frequency question before Experience + Training Format are selected; a Training Structure (Фулбоди/Сплит) choice outside the eligible Gym-non-Beginner cases (D085); unavailable weekly-frequency options for the chosen Experience (D085); internal labels (program family / program variant / assignment key / scalable family / template subset / internal program IDs) — note the **[Фулбоди] / [Сплит]** choice IS user-facing where eligible (D085) and is not an "internal label"; manual program/workout selection; Goal affecting MVP Program Assignment; heavy avatar customization; dashboard metrics; trial / pricing / marketing; shame / body-negative / before-after copy; a [Пропустить] on S4 or any "skip / later" naming model; casino-style motion; emoji; horizontal scroll.

---

## 24. Profile screen (Decision 086)

The MVP Profile composition and edit-flow (Decision 086), consuming D080/D083/D084/D085. Profile is the **administrative** surface reached via the small header Profile button (Decision 006), **not** a bottom-nav tab, **not** the emotional center (Home stays that — §15), **not** the identity/history surface (Progress stays that — §20), and **not** an Avatar Customization entry (that stays on Home — §15, D073). This section governs Profile only.

- **Title & subtitle.** User-facing title **«Профиль»** — **do not rename to «Настройки».** Profile is not general app settings (no theme/language/notifications/privacy); it is account + training inputs + avatar identity fields + subscription state + logout. Subtitle: **«Данные, которые помогают подобрать тренировки и сохранить твой путь.»**
- **Block hierarchy, top → bottom:** **Header (Back · «Профиль» · subtitle) → Аккаунт → Тренировки → Аватар → Подписка → «Выйти».** There is **no «Система» section**; **«Выйти» is a single standalone bottom action** after Подписка, never a settings group.
- **Аккаунт.** One row, **«Почта»** (email), **read-only** in MVP — no chevron, no modal, no email editing. **No email-verification status on the happy path** (the user already passed the D077 gate). Never show user/Supabase IDs, auth provider, registration date, technical status, or any XP/Level/Stage/Streak/History. D086 does not decide email/password change, account deletion, or recovery.
- **Тренировки.** Rows: **Цель · Уровень · Место тренировок · Тренировок в неделю · Формат тренировок.**
  - **Цель** — multi-select (≥1); **safe field** — saves immediately, no D084 modal; does not affect training assignment (may later feed Nutrition only).
  - **Уровень / Место тренировок / Тренировок в неделю** — single-select, **program-changing**, use the D084 confirmation. Тренировок-в-неделю shows only the allowed options for the current Experience (D085: Beginner 2/3 · Intermediate 3 · Advanced 3/4). Changing Уровень/Место/Frequency may change Training Structure availability; if the new combination no longer allows Split (or Место → Home), **Training Structure auto-resolves to Full Body** (D085, no hidden Split restoration).
  - **Формат тренировок** — labels **Фулбоди/Сплит**; the row is **always shown** as the current structure, but **editable (with chevron) only when D085 allows Split** — **Gym + Intermediate + 3, Gym + Advanced + 3, Gym + Advanced + 4** — and **read-only (no chevron) otherwise** (all Home; Gym Beginner 2/3; 2 days always → Full Body). When editable it is **program-changing** (D084).
- **Аватар.** Rows: **Имя · Направление.**
  - **Имя** — text input; required; **safe field** — saves immediately, no D084 modal; does not affect assignment or any progression/visual slot; Avatar Name is **global**, not per-direction (D083).
  - **Направление** — single-select Герой/Героиня; **program-changing**, uses the **detailed D084 Hero/Heroine confirmation** and switches the active avatar direction per **D083** (no customization migration; saved slot returns if present, else default avatar of the selected direction at the current global Stage; Stage & Avatar Name stay global; no progress/history reset).
  - **Avatar Customization exclusion.** Profile does **not** open Avatar Customization and shows **no** clothing/hair/accessories/body/colors/cosmetics/currency/catalog and **no** «Изменить внешний вид» button — customization is entered only from the Home Living Presence (D073).
- **Подписка.** Read-only calm state — no chevron, no modal, no paywall, no fear copy, no "progress will be lost" claim. MVP states e.g. «Пробный период активен / Осталось 24 дня» or «Пробный период завершён / Прогресс сохранён»; future «Подписка активна». Payments stay post-MVP.
- **«Выйти».** Standalone bottom action → **logout confirmation modal** (no immediate logout). Copy: «Выйти из аккаунта? / Твой прогресс сохранится. / Ты сможешь вернуться, войдя снова. / [Выйти] [Отмена]». Logout deletes/resets nothing (account, progress, onboarding, avatar, subscription untouched); after logout → the unauthenticated Entry/Auth surface (§21/§22, D074).
- **Single-modal edit flow (key rule).** Profile uses **one modal / bottom-sheet per edit**; **never more than one Profile modal open at once**; **no stacked modals**, **no separate edit screens in MVP**, **no toast as primary feedback** (§13). Safe fields (Цель, Имя): row → one modal → select/input → save → close → **calm inline success**. Program-changing fields (Уровень, Место, Тренировок в неделю, Формат тренировок, Направление): row → one modal → selection state → **the same modal transitions to the D084 confirmation state** (detailed Hero/Heroine variant for Направление; the In-Progress-workout deferral line when applicable — D058/D061) → optional saving state → close → calm inline success. **The D084 confirmation happens inside the same modal container**, never as a second stacked modal.
  - **Cancel/back:** selection/input state — cancel/close/swipe-down closes with no change; confirmation state — «Отмена» closes without saving, modal-back returns to the selection state, «Сохранить изменения» applies. After save: close modal, remain on Profile, calm inline success (no auto-nav, no forced launch/customization).
  - **Read-only rows** (account email; subscription; Формат тренировок when Split is not allowed) have **no chevron, no modal, no tap action, and no disabled-looking error state.**
- **Profile must not show (Decision 086):** a large avatar portrait; XP; Level; Stage; Streak; the Weekly Activity ring; workout history; strength analytics; achievements; Progress-style identity blocks; a Home-style Living Presence; an Avatar Customization entry; app theme / notification / language / privacy settings; account deletion; email editing; password editing; payment management; technical auth status; Supabase IDs.
