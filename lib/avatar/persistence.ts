import { normalizeAvatarConfig } from "./config";
import { createDefaultAvatarConfig } from "./defaults";
import type { AvatarConfigV1, AvatarDirection } from "./types";

export const AVATAR_STORAGE_KEY = "bfg.avatarConfig.v1";

export type AvatarStorage = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): AvatarStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readAvatarConfig(
  fallbackDirection: AvatarDirection,
  storage: AvatarStorage | null = browserStorage(),
): AvatarConfigV1 {
  if (!storage) return createDefaultAvatarConfig(fallbackDirection);

  try {
    const raw = storage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return createDefaultAvatarConfig(fallbackDirection);
    return normalizeAvatarConfig(JSON.parse(raw), fallbackDirection);
  } catch {
    return createDefaultAvatarConfig(fallbackDirection);
  }
}

export function writeAvatarConfig(
  config: AvatarConfigV1,
  storage: AvatarStorage | null = browserStorage(),
): boolean {
  if (!storage) return false;

  try {
    const normalized = normalizeAvatarConfig(config, config.activeDirection);
    storage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch {
    return false;
  }
}
