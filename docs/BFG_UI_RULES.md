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

---

## 16. Activity composition

The accepted MVP Activity composition (Decisions 042–045). This section governs the Activity surface only; it does not modify Home (§15) or Presence rules.

- **Information hierarchy — Workouts primary, Quests secondary.** Assigned Workouts render above Daily Quests. Daily Quests are a supportive layer beneath training and must never adopt the visual weight of a workout card (Decisions 042, 020; quests live in the Workouts area per Decision 004).
- **Workout card composition — minimal.** A workout card shows only the **Workout Title** and the **Exercise Count**. Never show previous results, analytics, categories, weight history, or progress metrics on a card (Decision 045). Reuse `GameCard` (§6, §12); do not build a stat-dense card variant. Detailed metrics live on Progress (Decision 008).
- **Activity is a browsing surface, not the resume surface.** The primary resume action — "Continue Journey" — lives on Home and opens the next assigned workout directly (Decision 043, §15). Activity carries no competing global primary CTA.
- **No weight entry on Activity.** Optional weight logging appears on the exercise screen only — never on the Activity surface and never on a workout card (Decision 044).
- **Tone guard.** Completion and empty states on Activity honor the no-shame rule (Decision 031) and the no-empty-state-pressure rule for optional data (Decision 040) — absent content is never framed as failure (§8).
