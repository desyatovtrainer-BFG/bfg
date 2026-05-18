/**
 * Чистый детерминированный расчёт «что открыто» по прогрессу.
 *
 * Источник истины — каталог в catalog.ts. Никакой БД, никаких таблиц
 * наград: один и тот же (level, stage) всегда даёт один и тот же
 * список. Это позволяет считать косметику и в SSR, и в тестах, и
 * в превью без обращения к Supabase.
 */

import {
  AURA_REWARDS,
  MARK_REWARDS,
  TITLE_REWARDS,
  type CosmeticMark,
  type CosmeticReward,
} from "./catalog";

export type UnlockableCosmetic<T extends CosmeticReward = CosmeticReward> = T & {
  unlocked: boolean;
  /** Короткое человеческое условие открытия — для UI «как получить». */
  requirement: string;
};

export type UnlockedCosmetics = {
  auras: ReadonlyArray<UnlockableCosmetic>;
  titles: ReadonlyArray<UnlockableCosmetic>;
  marks: ReadonlyArray<UnlockableCosmetic<CosmeticMark>>;
  /** Сколько всего открыто (для маленьких счётчиков «3 / 5»). */
  totals: {
    auras: { unlocked: number; total: number };
    titles: { unlocked: number; total: number };
    marks: { unlocked: number; total: number };
  };
};

function describeRequirement(reward: CosmeticReward): string {
  if (reward.minStage && reward.minLevel) {
    return `Стадия ${reward.minStage} · ур. ${reward.minLevel}`;
  }
  if (reward.minStage) return `Стадия ${reward.minStage}`;
  if (reward.minLevel) return `Уровень ${reward.minLevel}`;
  return "Открыто";
}

function isUnlocked(
  reward: CosmeticReward,
  level: number,
  stage: number,
): boolean {
  if (reward.minLevel && level < reward.minLevel) return false;
  if (reward.minStage && stage < reward.minStage) return false;
  return true;
}

function mapList<T extends CosmeticReward>(
  list: ReadonlyArray<T>,
  level: number,
  stage: number,
): ReadonlyArray<UnlockableCosmetic<T>> {
  return list.map((reward) => ({
    ...reward,
    unlocked: isUnlocked(reward, level, stage),
    requirement: describeRequirement(reward),
  }));
}

function countUnlocked(list: ReadonlyArray<{ unlocked: boolean }>): number {
  let n = 0;
  for (const item of list) if (item.unlocked) n += 1;
  return n;
}

/**
 * Возвращает полный каталог с пометкой «открыто/закрыто» для данного
 * пользователя. Безопасно дёргать в server-component на странице
 * аватара — это чистая функция.
 */
export function getUnlockedCosmetics(
  level: number,
  stage: number,
): UnlockedCosmetics {
  const safeLevel = Math.max(1, Math.floor(level || 1));
  const safeStage = Math.max(1, Math.min(5, Math.floor(stage || 1)));

  const auras = mapList(AURA_REWARDS, safeLevel, safeStage);
  const titles = mapList(TITLE_REWARDS, safeLevel, safeStage);
  const marks = mapList(MARK_REWARDS, safeLevel, safeStage);

  return {
    auras,
    titles,
    marks,
    totals: {
      auras: { unlocked: countUnlocked(auras), total: auras.length },
      titles: { unlocked: countUnlocked(titles), total: titles.length },
      marks: { unlocked: countUnlocked(marks), total: marks.length },
    },
  };
}
