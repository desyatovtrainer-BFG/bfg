import type { AvatarConfigV1, AvatarDirection, AvatarSlotConfig } from "./types";

const DEFAULT_SLOTS: Record<AvatarDirection, AvatarSlotConfig> = {
  hero: {
    faceId: "hero-face-angular",
    eyeId: "hero-eyes-focused",
    browId: "hero-brows-straight",
    mouthId: "hero-mouth-neutral",
    hairId: "hero-hair-swept",
    hairColorId: "hair-espresso",
    skinToneId: "skin-warm",
    outfitId: "hero-outfit-graphite",
    accessoryIds: [],
  },
  heroine: {
    faceId: "heroine-face-sculpted",
    eyeId: "heroine-eyes-focused",
    browId: "heroine-brows-arched",
    mouthId: "heroine-mouth-neutral",
    hairId: "heroine-hair-wave",
    hairColorId: "hair-espresso",
    skinToneId: "skin-warm",
    outfitId: "heroine-outfit-graphite",
    accessoryIds: [],
  },
};

export function getDefaultAvatarSlot(direction: AvatarDirection): AvatarSlotConfig {
  const slot = DEFAULT_SLOTS[direction];
  return { ...slot, accessoryIds: [...slot.accessoryIds] };
}

export function createDefaultAvatarConfig(
  activeDirection: AvatarDirection = "hero",
): AvatarConfigV1 {
  return {
    version: 1,
    activeDirection,
    slots: { hero: null, heroine: null },
  };
}
