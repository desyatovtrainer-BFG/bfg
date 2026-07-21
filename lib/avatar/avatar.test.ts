import assert from "node:assert/strict";
import test from "node:test";
import {
  AVATAR_STORAGE_KEY,
  createAvatarDraft,
  createDefaultAvatarConfig,
  getDefaultAvatarSlot,
  normalizeAvatarConfig,
  readAvatarConfig,
  resetAvatarDraftDirection,
  resolveAvatar,
  resolveAvatarMotion,
  setAvatarDraftOption,
  switchAvatarDraftDirection,
  writeAvatarConfig,
  type AvatarStorage,
} from "./index";

class MemoryStorage implements AvatarStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

test("Hero and Heroine drafts remain independent", () => {
  let draft = createAvatarDraft(createDefaultAvatarConfig("hero"));
  draft = setAvatarDraftOption(draft, "hero", "hair", "hero-hair-undercut");
  draft = setAvatarDraftOption(draft, "heroine", "hair", "heroine-hair-long");

  assert.equal(draft.slots.hero?.hairId, "hero-hair-undercut");
  assert.equal(draft.slots.heroine?.hairId, "heroine-hair-long");
});

test("switching direction changes no appearance field", () => {
  let draft = createDefaultAvatarConfig("hero");
  draft = setAvatarDraftOption(draft, "hero", "outfit", "hero-outfit-horizon");
  const heroBefore = structuredClone(draft.slots.hero);
  const switched = switchAvatarDraftDirection(draft, "heroine");

  assert.equal(switched.activeDirection, "heroine");
  assert.deepEqual(switched.slots.hero, heroBefore);
  assert.equal(switched.slots.heroine, null);
});

test("unknown IDs resolve to direction defaults while valid fields survive", () => {
  const normalized = normalizeAvatarConfig({
    version: 1,
    activeDirection: "hero",
    slots: {
      hero: {
        ...getDefaultAvatarSlot("hero"),
        hairId: "removed-hair",
        outfitId: "hero-outfit-dusk",
        accessoryIds: ["removed-accessory", "hero-accessory-glasses"],
      },
      heroine: null,
    },
  });

  assert.equal(normalized.slots.hero?.hairId, getDefaultAvatarSlot("hero").hairId);
  assert.equal(normalized.slots.hero?.outfitId, "hero-outfit-dusk");
  assert.deepEqual(normalized.slots.hero?.accessoryIds, ["hero-accessory-glasses"]);
});

test("malformed persisted JSON falls back without throwing", () => {
  const storage = new MemoryStorage();
  storage.setItem(AVATAR_STORAGE_KEY, "{definitely-not-json");
  assert.doesNotThrow(() => readAvatarConfig("heroine", storage));
  assert.deepEqual(readAvatarConfig("heroine", storage), createDefaultAvatarConfig("heroine"));
});

test("Reset affects only the current direction", () => {
  let draft = createDefaultAvatarConfig("heroine");
  draft = setAvatarDraftOption(draft, "hero", "hair", "hero-hair-crop");
  draft = setAvatarDraftOption(draft, "heroine", "hair", "heroine-hair-bob");
  const heroBefore = structuredClone(draft.slots.hero);
  const reset = resetAvatarDraftDirection(draft, "heroine");

  assert.deepEqual(reset.slots.hero, heroBefore);
  assert.equal(reset.slots.heroine, null);
});

test("discarding a draft does not persist it", () => {
  const storage = new MemoryStorage();
  const saved = createDefaultAvatarConfig("hero");
  writeAvatarConfig(saved, storage);
  setAvatarDraftOption(createAvatarDraft(saved), "hero", "face", "hero-face-broad");

  assert.deepEqual(readAvatarConfig("hero", storage), saved);
});

test("Save persists both draft slots atomically", () => {
  const storage = new MemoryStorage();
  let draft = createDefaultAvatarConfig("heroine");
  draft = setAvatarDraftOption(draft, "hero", "outfit", "hero-outfit-dusk");
  draft = setAvatarDraftOption(
    draft,
    "heroine",
    "outfit",
    "heroine-outfit-horizon",
  );

  assert.equal(writeAvatarConfig(draft, storage), true);
  const saved = readAvatarConfig("hero", storage);
  assert.equal(saved.activeDirection, "heroine");
  assert.equal(saved.slots.hero?.outfitId, "hero-outfit-dusk");
  assert.equal(saved.slots.heroine?.outfitId, "heroine-outfit-horizon");
});

test("Home and Progress resolve identical saved appearance fields", () => {
  let config = createDefaultAvatarConfig("hero");
  config = setAvatarDraftOption(config, "hero", "face", "hero-face-broad");
  config = setAvatarDraftOption(config, "hero", "accessories", "hero-accessory-band");

  assert.deepEqual(resolveAvatar(config, 7), resolveAvatar(config, 7));
});

test("Progress presentation always disables avatar motion", () => {
  assert.equal(resolveAvatarMotion("progress", "live"), "none");
  assert.equal(resolveAvatarMotion("progress", "editor"), "none");
});

test("cosmetic draft changes do not mutate progression state", () => {
  const state = {
    progression: { xp: 245, level: 5, stage: 3, streak: 8 },
    avatar: createDefaultAvatarConfig("hero"),
  };
  const progressionBefore = structuredClone(state.progression);
  const avatar = setAvatarDraftOption(state.avatar, "hero", "mouth", "hero-mouth-soft");

  assert.notDeepEqual(avatar, state.avatar);
  assert.deepEqual(state.progression, progressionBefore);
});
