export {
  AVATAR_CATALOG,
  AVATAR_CATEGORY_LABELS,
  findAvatarOption,
  getAvatarOptions,
  isAvatarOptionId,
} from "./catalog";
export {
  cloneAvatarConfig,
  isAvatarDirection,
  normalizeAvatarConfig,
  normalizeAvatarSlot,
} from "./config";
export { createDefaultAvatarConfig, getDefaultAvatarSlot } from "./defaults";
export {
  createAvatarDraft,
  resetAvatarDraftDirection,
  setAvatarDraftOption,
  switchAvatarDraftDirection,
} from "./draft";
export {
  AVATAR_STORAGE_KEY,
  readAvatarConfig,
  writeAvatarConfig,
  type AvatarStorage,
} from "./persistence";
export {
  describeResolvedAvatar,
  getAvatarRenderColors,
  resolveAvatar,
  resolveAvatarMotion,
  resolveAvatarSlot,
} from "./resolver";
export {
  AVATAR_CATEGORIES,
  AVATAR_DIRECTIONS,
  type AvatarCatalog,
  type AvatarCategory,
  type AvatarConfigV1,
  type AvatarDirection,
  type AvatarMotion,
  type AvatarOption,
  type AvatarPresentation,
  type AvatarSlotConfig,
  type ResolvedAvatar,
} from "./types";
