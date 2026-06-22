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
- Max content width on tablet/desktop: 480px centered. We are not designing a desktop dashboard.
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

## 15. Home composition (Candidate A)

The approved MVP Home composition (Decision 039 — "Home Concept Candidate A", refines Decision 007). This section governs Home content only; bottom navigation follows Decisions 003–006.

- **Living Presence — visual center, primary focus.** The Presence (avatar body) sits in the optical center and must remain the dominant element. Everything else is a supporting layer.
- **Two progress rings around the Presence.** An **inner ring = Level Progress** and an **outer ring = Weekly Progress**. The rings are a supporting layer and must never out-weigh the Presence. Render them with the calm motion budget (subtle, `< 600ms` fills, `prefers-reduced-motion` respected, no casino-style sweeps — §5, §13).
- **Stage Block under the Presence.** Contains a **Stage Title** and a **Stage Number** (reference: "SEEKER / STAGE 3"; final naming may change — the structure is fixed, the words are not).
- **Primary CTA — "Continue Journey".** A single primary action. No competing buttons on Home.
- **Simplified progress only.** Home shows a simplified progress layer; detailed statistics live on the Progress screen (Decision 008). Do not surface raw stat tables on Home.
- **Presence Voice placement is open.** Whether/where the event-driven Voice surfaces on Home is deferred (Decisions 036–037); do not add a persistent companion text block as a standing fixture pending that decision.
- **Tone guard.** The Weekly Progress indicator must honor the no-shame rule (Decision 031) — no failure/deficit framing for an incomplete week.
- **Home is the stage for Stage Evolution (Decision 069).** When a completion (workout or quest) causes a Stage Evolution, the flow routes to Home and the Evolution Animation plays here — Home is the emotional stage for the avatar transformation (Decisions 002, 007, 035). This is a transient milestone moment, not a new standing Home fixture; the §15 composition above is unchanged. The full reveal flow (including non-evolution destinations) is specified in §18.

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
- **Workout Result Banner (Decision 067).** After Finish Workout, show **only what changed**, largest reward first: **Stage → Level → XP**. Keep the calm motion budget (§5, §13 — no casino-style sweeps). Companion reactions are **rare** and only for meaningful milestones (Decisions 035, 036, 037).
- **Evolution Reveal flow (Decision 069).** A **Stage Evolution overrides the post-reward destination** and routes to **Home**, where the Evolution Animation plays — regardless of trigger. Normal workout completion: Finish Workout → Result Banner → **return to Activity**. Normal quest completion: Quest Complete → Reward Display → **remain on Activity**. Evolution (workout or quest): after the Result Banner / Reward Display → **Home → Evolution Animation** (§15). Stage Evolution has priority over the current screen; the reason for it does not matter.
- **Tone & surface guards.** Session screens stay calm and metric-light (§1, §5): no duration/difficulty/analytics on the Start Screen (Decision 062), no extra metrics on the Finish Screen (Decision 066), no emoji or motivational exclamation copy (§11). Russian copy rules (§11) apply to all session copy.
