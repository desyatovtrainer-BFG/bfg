import { isAvatarOptionId } from "./catalog";
import { cloneAvatarConfig } from "./config";
import { getDefaultAvatarSlot } from "./defaults";
import type {
  AvatarCategory,
  AvatarConfigV1,
  AvatarDirection,
  AvatarSlotConfig,
} from "./types";

const SINGLE_VALUE_FIELDS: Record<
  Exclude<AvatarCategory, "accessories">,
  keyof Omit<AvatarSlotConfig, "accessoryIds">
> = {
  face: "faceId",
  eyes: "eyeId",
  brows: "browId",
  mouth: "mouthId",
  hair: "hairId",
  hairColor: "hairColorId",
  skinTone: "skinToneId",
  outfit: "outfitId",
};

export function createAvatarDraft(saved: AvatarConfigV1): AvatarConfigV1 {
  return cloneAvatarConfig(saved);
}

export function switchAvatarDraftDirection(
  draft: AvatarConfigV1,
  direction: AvatarDirection,
): AvatarConfigV1 {
  return { ...cloneAvatarConfig(draft), activeDirection: direction };
}

export function setAvatarDraftOption(
  draft: AvatarConfigV1,
  direction: AvatarDirection,
  category: AvatarCategory,
  optionId: string,
): AvatarConfigV1 {
  if (!isAvatarOptionId(direction, category, optionId)) return cloneAvatarConfig(draft);

  const next = cloneAvatarConfig(draft);
  const slot = next.slots[direction] ?? getDefaultAvatarSlot(direction);

  if (category === "accessories") {
    slot.accessoryIds = slot.accessoryIds.includes(optionId)
      ? slot.accessoryIds.filter((id) => id !== optionId)
      : [...slot.accessoryIds, optionId];
  } else {
    slot[SINGLE_VALUE_FIELDS[category]] = optionId;
  }

  next.slots[direction] = slot;
  return next;
}

export function resetAvatarDraftDirection(
  draft: AvatarConfigV1,
  direction: AvatarDirection,
): AvatarConfigV1 {
  const next = cloneAvatarConfig(draft);
  next.slots[direction] = null;
  return next;
}
