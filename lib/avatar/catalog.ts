import type {
  AvatarCatalog,
  AvatarCategory,
  AvatarDirection,
  AvatarOption,
} from "./types";

export const AVATAR_CATEGORY_LABELS: Record<AvatarCategory, string> = {
  face: "Лицо",
  eyes: "Глаза",
  brows: "Брови",
  mouth: "Рот",
  hair: "Волосы",
  hairColor: "Цвет волос",
  skinTone: "Кожа",
  outfit: "Одежда",
  accessories: "Аксессуары",
};

const HAIR_COLORS = [
  { id: "hair-midnight", label: "Полночь", swatch: "#151821" },
  { id: "hair-espresso", label: "Эспрессо", swatch: "#35231d" },
  { id: "hair-chestnut", label: "Каштан", swatch: "#70422b" },
  { id: "hair-silver", label: "Серебро", swatch: "#aab2bd" },
] as const;

const SKIN_TONES = [
  { id: "skin-porcelain", label: "Светлый", swatch: "#f0cfbd" },
  { id: "skin-warm", label: "Тёплый", swatch: "#d6a47e" },
  { id: "skin-olive", label: "Оливковый", swatch: "#ad7c58" },
  { id: "skin-bronze", label: "Бронзовый", swatch: "#80543c" },
  { id: "skin-deep", label: "Глубокий", swatch: "#4d3028" },
] as const;

export const AVATAR_CATALOG: AvatarCatalog = {
  hero: {
    face: [
      { id: "hero-face-angular", label: "Чёткое" },
      { id: "hero-face-oval", label: "Овальное" },
      { id: "hero-face-broad", label: "Широкое" },
    ],
    eyes: [
      { id: "hero-eyes-focused", label: "Собранные" },
      { id: "hero-eyes-calm", label: "Спокойные" },
      { id: "hero-eyes-open", label: "Открытые" },
    ],
    brows: [
      { id: "hero-brows-straight", label: "Прямые" },
      { id: "hero-brows-strong", label: "Выразительные" },
      { id: "hero-brows-soft", label: "Мягкие" },
    ],
    mouth: [
      { id: "hero-mouth-neutral", label: "Нейтральный" },
      { id: "hero-mouth-soft", label: "Мягкий" },
      { id: "hero-mouth-determined", label: "Собранный" },
    ],
    hair: [
      { id: "hero-hair-crop", label: "Короткие" },
      { id: "hero-hair-swept", label: "Зачёс" },
      { id: "hero-hair-textured", label: "Текстура" },
      { id: "hero-hair-undercut", label: "Андеркат" },
    ],
    hairColor: HAIR_COLORS,
    skinTone: SKIN_TONES,
    outfit: [
      { id: "hero-outfit-graphite", label: "Графит", swatch: "#303844" },
      { id: "hero-outfit-dusk", label: "Сумерки", swatch: "#263d52" },
      { id: "hero-outfit-horizon", label: "Горизонт", swatch: "#55462e" },
    ],
    accessories: [
      { id: "hero-accessory-glasses", label: "Очки" },
      { id: "hero-accessory-band", label: "Браслет" },
    ],
  },
  heroine: {
    face: [
      { id: "heroine-face-sculpted", label: "Скульптурное" },
      { id: "heroine-face-oval", label: "Овальное" },
      { id: "heroine-face-soft", label: "Мягкое" },
    ],
    eyes: [
      { id: "heroine-eyes-focused", label: "Собранные" },
      { id: "heroine-eyes-calm", label: "Спокойные" },
      { id: "heroine-eyes-open", label: "Открытые" },
    ],
    brows: [
      { id: "heroine-brows-arched", label: "Изогнутые" },
      { id: "heroine-brows-defined", label: "Чёткие" },
      { id: "heroine-brows-soft", label: "Мягкие" },
    ],
    mouth: [
      { id: "heroine-mouth-neutral", label: "Нейтральный" },
      { id: "heroine-mouth-soft", label: "Мягкий" },
      { id: "heroine-mouth-determined", label: "Собранный" },
    ],
    hair: [
      { id: "heroine-hair-bob", label: "Боб" },
      { id: "heroine-hair-long", label: "Длинные" },
      { id: "heroine-hair-wave", label: "Волна" },
      { id: "heroine-hair-crop", label: "Короткие" },
    ],
    hairColor: HAIR_COLORS,
    skinTone: SKIN_TONES,
    outfit: [
      { id: "heroine-outfit-graphite", label: "Графит", swatch: "#303844" },
      { id: "heroine-outfit-dusk", label: "Сумерки", swatch: "#303c58" },
      { id: "heroine-outfit-horizon", label: "Горизонт", swatch: "#5a4536" },
    ],
    accessories: [
      { id: "heroine-accessory-glasses", label: "Очки" },
      { id: "heroine-accessory-mark", label: "Знак" },
    ],
  },
};

export function getAvatarOptions(
  direction: AvatarDirection,
  category: AvatarCategory,
): readonly AvatarOption[] {
  return AVATAR_CATALOG[direction][category];
}

export function findAvatarOption(
  direction: AvatarDirection,
  category: AvatarCategory,
  id: string,
): AvatarOption | undefined {
  return getAvatarOptions(direction, category).find((option) => option.id === id);
}

export function isAvatarOptionId(
  direction: AvatarDirection,
  category: AvatarCategory,
  id: unknown,
): id is string {
  return typeof id === "string" && Boolean(findAvatarOption(direction, category, id));
}
