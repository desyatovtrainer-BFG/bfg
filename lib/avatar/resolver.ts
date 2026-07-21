import { findAvatarOption } from "./catalog";
import { normalizeAvatarConfig } from "./config";
import { getDefaultAvatarSlot } from "./defaults";
import type {
  AvatarConfigV1,
  AvatarMotion,
  AvatarPresentation,
  AvatarSlotConfig,
  ResolvedAvatar,
} from "./types";

const HAIR_COLORS: Record<string, string> = {
  "hair-midnight": "#151821",
  "hair-espresso": "#35231d",
  "hair-chestnut": "#70422b",
  "hair-silver": "#aab2bd",
};

const SKIN_TONES: Record<string, string> = {
  "skin-porcelain": "#f0cfbd",
  "skin-warm": "#d6a47e",
  "skin-olive": "#ad7c58",
  "skin-bronze": "#80543c",
  "skin-deep": "#4d3028",
};

export function resolveAvatarSlot(config: AvatarConfigV1): AvatarSlotConfig {
  const normalized = normalizeAvatarConfig(config, config.activeDirection);
  return (
    normalized.slots[normalized.activeDirection] ??
    getDefaultAvatarSlot(normalized.activeDirection)
  );
}

export function resolveAvatar(config: AvatarConfigV1, stage: number): ResolvedAvatar {
  const normalized = normalizeAvatarConfig(config, config.activeDirection);
  const safeStage = Math.min(10, Math.max(1, Math.round(Number(stage) || 1)));

  return {
    direction: normalized.activeDirection,
    slot:
      normalized.slots[normalized.activeDirection] ??
      getDefaultAvatarSlot(normalized.activeDirection),
    stage: safeStage,
    bodyScale: 1 + (safeStage - 1) * 0.006,
    auraIntensity: 0.42 + (safeStage - 1) * 0.045,
  };
}

export function resolveAvatarMotion(
  presentation: AvatarPresentation,
  requested?: AvatarMotion,
): AvatarMotion {
  if (presentation === "progress") return "none";
  if (requested === "none") return "none";
  if (requested) return requested;
  return presentation === "home" ? "live" : "editor";
}

export function describeResolvedAvatar(avatar: ResolvedAvatar): string {
  const direction = avatar.direction === "hero" ? "Герой" : "Героиня";
  const outfit =
    findAvatarOption(avatar.direction, "outfit", avatar.slot.outfitId)?.label ??
    "базовый образ";
  return `${direction}, образ «${outfit}», стадия ${avatar.stage}`;
}

export function getAvatarRenderColors(slot: AvatarSlotConfig): {
  hair: string;
  skin: string;
} {
  return {
    hair: HAIR_COLORS[slot.hairColorId] ?? HAIR_COLORS["hair-espresso"]!,
    skin: SKIN_TONES[slot.skinToneId] ?? SKIN_TONES["skin-warm"]!,
  };
}
