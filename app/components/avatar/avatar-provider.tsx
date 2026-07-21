"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AVATAR_STORAGE_KEY,
  createDefaultAvatarConfig,
  normalizeAvatarConfig,
  readAvatarConfig,
  writeAvatarConfig,
  type AvatarConfigV1,
  type AvatarDirection,
} from "@/lib/avatar";

type AvatarStateValue = {
  savedConfig: AvatarConfigV1;
  isHydrated: boolean;
  saveConfig: (config: AvatarConfigV1) => boolean;
};

const AvatarStateContext = createContext<AvatarStateValue | null>(null);

export function AvatarStateProvider({
  initialDirection,
  children,
}: {
  initialDirection: AvatarDirection;
  children: ReactNode;
}) {
  const [savedConfig, setSavedConfig] = useState<AvatarConfigV1>(() =>
    createDefaultAvatarConfig(initialDirection),
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSavedConfig(readAvatarConfig(initialDirection));
      setIsHydrated(true);
    });

    function handleStorage(event: StorageEvent) {
      if (event.key === AVATAR_STORAGE_KEY) {
        setSavedConfig(readAvatarConfig(initialDirection));
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", handleStorage);
    };
  }, [initialDirection]);

  const saveConfig = useCallback((config: AvatarConfigV1): boolean => {
    const normalized = normalizeAvatarConfig(config, config.activeDirection);
    const persisted = writeAvatarConfig(normalized);
    setSavedConfig(normalized);
    return persisted;
  }, []);

  const value = useMemo(
    () => ({ savedConfig, isHydrated, saveConfig }),
    [isHydrated, saveConfig, savedConfig],
  );

  return <AvatarStateContext.Provider value={value}>{children}</AvatarStateContext.Provider>;
}

export function useAvatarState(): AvatarStateValue {
  const value = useContext(AvatarStateContext);
  if (!value) {
    throw new Error("useAvatarState must be used inside AvatarStateProvider");
  }
  return value;
}
