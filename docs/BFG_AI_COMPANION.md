# BFG AI Companion

Engineering contract for the companion system. The companion is a **product feature**, not a chatbot. It must feel like a calm inner voice, work in Russia without VPN, and never be a security liability.

> Companion documents:
> [`BFG_GAME_SYSTEMS.md`](./BFG_GAME_SYSTEMS.md) ·
> [`BFG_SECURITY.md`](./BFG_SECURITY.md) ·
> [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) ·
> Emotional spec: legacy `COMPANION_SYSTEM.md`

---

## 1. Role of the companion

- The companion is the **continuity layer** of the experience. It acknowledges return, streak, and evolution.
- It is **read-only** with respect to progression. It cannot award XP, change levels, or unlock cosmetics. It only reads state and produces text.
- It is **deterministic in MVP** (local FNV-1a hash over user + day + state). No external API call is required to show a phrase. This is the Russia-without-VPN safety net.
- It is **swappable**: today rule-based; tomorrow LLM-augmented via an Edge Function. The UI contract does not change.

---

## 2. Current implementation (MVP)

Two layers exist in `lib/companion/`:

1. `build-companion-message.ts` — pure function that takes `{ userId, level, xpInLevel, xpForNextLevel, streak, lastActiveOn, todayIso }` and returns:
   ```ts
   {
     state: 'first_step' | 'present_today' | 'in_streak' | 'soft_return' | 'warm_return',
     daysSinceActive: number | null,
     stateLabel: string,    // Russian short label, UI-ready
     primary: string,       // Main short phrase, Russian
     secondary: string,     // Optional reflective second line
   }
   ```
2. `lib/workouts/companion-feedback.ts` — produces a contextual phrase right after a workout / quest completion (event-driven reaction).

Phrases are **stable within a day** for a given user/state. The seed is `userId|today|state`. This is intentional: a "lottery of phrases" on refresh would break presence.

---

## 3. States and tone

| State            | When                                              | Tone                                   |
| ---------------- | ------------------------------------------------- | -------------------------------------- |
| `first_step`     | `last_active_on = NULL`                           | Quiet beginning, no pressure           |
| `present_today`  | Active today                                      | Calm acknowledgement                   |
| `in_streak`      | Was active yesterday, not yet today               | Continuity                             |
| `soft_return`    | 2–6 days since last activity                      | Warm, safe return                      |
| `warm_return`    | 7+ days since last activity                       | Welcoming, no shame, no count of days  |

Tone rules (non-negotiable):

- Short, one sentence preferred.
- Russian only on MVP.
- Calm, atmospheric.
- **Never** shame, never mention "you missed N days", never push, never use exclamation marks as motivation.
- **No emojis** in companion text. Ever.
- Avoid productivity language. Avoid corporate fitness phrasing.

A useful negative checklist: the companion never says "ты должен", "не ленись", "давай!", "стань лучшей версией", "ты пропустил X дней".

---

## 4. Architectural rules

- The companion lives in `lib/companion/` and is consumed by `app/components/companion/`.
- Companion logic that touches user data goes through the **server**, never the browser. The Server Component fetches `profiles` + computes the message via `buildCompanionMessage`.
- The companion **never** writes to the DB. If a future memory layer needs persistence, it goes into a separate `public.companion_messages` table (see [`BFG_DATABASE.md`](./BFG_DATABASE.md) §10).
- The companion **never** triggers XP or level changes. Those flow only through `awardXp`.
- React component for the companion is a **Server Component** that renders the static phrase. Any animation wrapper is a thin Client Component.

---

## 5. Adding LLM-backed phrases (future)

Roadmap step, not MVP. When we introduce LLM-augmented phrases:

1. **The call must run in an Edge Function**, never in a browser, never in a Server Action with a third-party SDK key.
2. The Edge Function reads the user's `profiles` row, builds a **system prompt that excludes sensitive data** (no email, no auth tokens, no full XP history).
3. The output is **validated server-side** against a denylist and a max-length rule before being shown.
4. The provider must be reachable from Russia or routed through a proxy we operate. Hardcoded OpenAI from the browser is forbidden.
5. The Edge Function returns `{ data: { state, primary, secondary }, error }`. The UI contract is unchanged.
6. We cache responses per `(user, state, day)` so we do not pay for and re-roll the tone of the day.
7. If the Edge Function fails or times out (>1s), we **fall back** to the deterministic rule-based phrase. The user never sees a loading spinner for the companion.

---

## 6. Security and privacy rules

Detailed in [`BFG_SECURITY.md`](./BFG_SECURITY.md) §"AI security". Summary:

- The browser never holds an AI provider key.
- The companion is **never** an arbitrary chat surface in MVP. No free-form input from the user that is forwarded to an LLM.
- If we later add user input (e.g. "ask the companion"), all inputs are sanitized, length-capped, and rate-limited at the Edge Function. We never inject untrusted user text into a system prompt without isolating it as user content.
- No PII (email, real name, location, age) is included in LLM prompts. The companion may know `level`, `streak`, `daysSinceActive`, `evolution_stage`. Nothing else.
- Output filtering: a small denylist + length check. If the model produces toxic motivation, push notifications, ads, or anything off-brand, we drop and use the deterministic fallback.

---

## 7. Russia constraint

- The deterministic path **must remain the default** even after we add LLM augmentation. If the network is unreachable, the user always sees a calm phrase.
- Any LLM provider we pick must be reachable from Russia or accessible through our own proxy. We do not ship the app dependent on a domain that requires a VPN.
- This is a hard architectural rule. See [`BFG_ENGINEERING_RULES.md`](./BFG_ENGINEERING_RULES.md) §10.

---

## 8. Performance rules

- The companion message is part of the dashboard's initial HTML. It must not introduce a network round-trip on first paint.
- Animations around the companion (Framer Motion) must respect the 60fps mobile budget. No heavy backdrop filters.
- No third-party fonts loaded just for companion text. Use the global font stack from `app/layout.tsx`.

---

## 9. Memory model

MVP: stateless. Memory = the user's `profiles` row (XP, level, streak, last_active_on).

Future memory:

- `public.companion_messages` table — append-only log of `{ user_id, day, state, phrase, source: 'rule' | 'llm' }`.
- Used to (a) avoid repeating the same phrase day-to-day, (b) feed the LLM with a tiny tone-anchor (last 3–5 phrases), (c) provide an audit trail for AI safety reviews.
- RLS: select own, insert own (via Edge Function with service role only after validation).

---

## 10. Forbidden patterns

- ❌ Hardcoded OpenAI / any AI provider SDK in the browser bundle.
- ❌ Streaming companion text token-by-token in MVP (it breaks calm tone).
- ❌ Free-form user chat with the companion in MVP.
- ❌ "Personality switch" toggles ("hardcore mode"). The companion has one tone.
- ❌ Push-notification-style copy in the companion ("don't forget your workout!").
- ❌ Mentions of days missed, time spent, calories, BMI, weight.
- ❌ English phrases in Russian UI without explicit reason.
- ❌ Phrases longer than ~12 words.

---

## 11. Definition of "working companion"

For a release to be acceptable on the companion axis:

- Every authenticated user lands on the dashboard with a companion message **rendered on the server**.
- The phrase is stable for the same day at the same state.
- All five states are reachable through real usage (we manually test by simulating `last_active_on`).
- No companion phrase calls a third-party API on the client.
- The companion has zero ability to mutate progression data.
