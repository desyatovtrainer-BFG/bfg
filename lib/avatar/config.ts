import { isAvatarOptionId } from "./catalog";
import { createDefaultAvatarConfig, getDefaultAvatarSlot } from "./defaults";
import {
  AVATAR_DIRECTIONS,
  type AvatarConfigV1,
  type AvatarDirection,
  type AvatarSlotConfig,
} from "./types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isAvatarDirection(value: unknown): value is AvatarDirection {
  return AVATAR_DIRECTIONS.includes(value as AvatarDirection);
}

function safeId(
  direction: AvatarDirection,
  category:
    | "face"
    | "eyes"
    | "brows"
    | "mouth"
    | "hair"
    | "hairColor"
    | "skinTone"
    | "outfit",
  value: unknown,
  fallback: string,
): string {
  return isAvatarOptionId(direction, category, value) ? value : fallback;
}

export function normalizeAvatarSlot(
  value: unknown,
  direction: AvatarDirection,
): AvatarSlotConfig | null {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) return null;

  const fallback = getDefaultAvatarSlot(direction);
  const accessories = Array.isArray(value.accessoryIds)
    ? Array.from(
        new Set(
          value.accessoryIds.filter((id) =>
            isAvatarOptionId(direction, "accessories", id),
          ),
        ),
      )
    : [];

  return {
    faceId: safeId(direction, "face", value.faceId, fallback.faceId),
    eyeId: safeId(direction, "eyes", value.eyeId, fallback.eyeId),
    browId: safeId(direction, "brows", value.browId, fallback.browId),
    mouthId: safeId(direction, "mouth", value.mouthId, fallback.mouthId),
    hairId: safeId(direction, "hair", value.hairId, fallback.hairId),
    hairColorId: safeId(
      direction,
      "hairColor",
      value.hairColorId,
      fallback.hairColorId,
    ),
    skinToneId: safeId(
      direction,
      "skinTone",
      value.skinToneId,
      fallback.skinToneId,
    ),
    outfitId: safeId(direction, "outfit", value.outfitId, fallback.outfitId),
    accessoryIds: accessories,
  };
}

export function normalizeAvatarConfig(
  value: unknown,
  fallbackDirection: AvatarDirection = "hero",
): AvatarConfigV1 {
  if (!isRecord(value) || value.version !== 1) {
    return createDefaultAvatarConfig(fallbackDirection);
  }

  const activeDirection = isAvatarDirection(value.activeDirection)
    ? value.activeDirection
    : fallbackDirection;
  const slots = isRecord(value.slots) ? value.slots : {};

  return {
    version: 1,
    activeDirection,
    slots: {
      hero: normalizeAvatarSlot(slots.hero, "hero"),
      heroine: normalizeAvatarSlot(slots.heroine, "heroine"),
    },
  };
}

export function cloneAvatarConfig(config: AvatarConfigV1): AvatarConfigV1 {
  return {
    version: 1,
    activeDirection: config.activeDirection,
    slots: {
      hero: config.slots.hero
        ? { ...config.slots.hero, accessoryIds: [...config.slots.hero.accessoryIds] }
        : null,
      heroine: config.slots.heroine
        ? {
            ...config.slots.heroine,
            accessoryIds: [...config.slots.heroine.accessoryIds],
          }
        : null,
    },
  };
}
