export const AVATAR_DIRECTIONS = ["hero", "heroine"] as const;

export type AvatarDirection = (typeof AVATAR_DIRECTIONS)[number];

export const AVATAR_CATEGORIES = [
  "face",
  "eyes",
  "brows",
  "mouth",
  "hair",
  "hairColor",
  "skinTone",
  "outfit",
  "accessories",
] as const;

export type AvatarCategory = (typeof AVATAR_CATEGORIES)[number];

export type AvatarSlotConfig = {
  faceId: string;
  eyeId: string;
  browId: string;
  mouthId: string;
  hairId: string;
  hairColorId: string;
  skinToneId: string;
  outfitId: string;
  accessoryIds: string[];
};

export type AvatarConfigV1 = {
  version: 1;
  activeDirection: AvatarDirection;
  slots: {
    hero: AvatarSlotConfig | null;
    heroine: AvatarSlotConfig | null;
  };
};

export type AvatarOption = {
  id: string;
  label: string;
  swatch?: string;
};

export type AvatarCatalog = Record<
  AvatarDirection,
  Record<AvatarCategory, readonly AvatarOption[]>
>;

export type ResolvedAvatar = {
  direction: AvatarDirection;
  slot: AvatarSlotConfig;
  stage: number;
  bodyScale: number;
  auraIntensity: number;
};

export type AvatarPresentation = "home" | "progress" | "editor";
export type AvatarMotion = "live" | "none" | "editor";
