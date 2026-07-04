"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

/**
 * PresenceFigure — статичное изображение Presence (временный placeholder).
 *
 * Что это: ЕДИНЫЙ визуальный источник Тела Presence для всех поверхностей
 * (D001/D073 — один аватар, разные представления). Home (живое присутствие),
 * Progress (статичный портрет), S4 онбординга и превью «Внешний вид»
 * должны рендерить фигуру ЧЕРЕЗ этот компонент — так Home↔Progress
 * визуальный паритет выполняется по построению.
 *
 * Временная модель (утверждённая политика rebuild):
 *   - НЕ 3D, НЕ кастомизация, НЕ каталог, НЕ косметика, НЕ валюта;
 *   - статичные картинки-плейсхолдеры по направлению (D083: hero / heroine),
 *     плюс нейтральная «Seed Form» для незалогиненных поверхностей (D074);
 *   - приложенные референс-изображения — временные ассеты, не финальный арт.
 *
 * Ассеты. Файлы кладутся в public/avatars/ и прописываются в PRESENCE_ASSETS.
 * Ожидаемые имена (когда владелец продукта добавит экспортированные файлы):
 *   public/avatars/presence-neutral.png  — нейтральная светящаяся фигура
 *                                          (референс: Entry-скрин «ТВОЙ ПУТЬ НАЧИНАЕТСЯ»);
 *   public/avatars/presence-hero.png     — направление Герой
 *                                          (референс: атлет с Home-мокапа);
 *   public/avatars/presence-heroine.png  — направление Героиня (референс не приложен).
 * Пока путь = null, работает fallback-цепочка:
 *   запрошенное направление → neutral → встроенный SVG-силуэт.
 *
 * Дыхание/свечение — спокойный idle-цикл (MVP Body floor, PRS §7):
 * только opacity/transform, prefers-reduced-motion → статично. Idle-цикл —
 * это непрерывная жизнь Тела, а не «момент» из бюджета §5 (< 600ms).
 * Тело никогда не выражает разочарование (D038) — состояние всегда спокойное.
 */

export type PresenceDirection = "hero" | "heroine" | "neutral";

/**
 * Манифест временных ассетов. null → файла ещё нет, используется fallback.
 * Когда картинка добавлена в public/avatars/, замени null на путь,
 * например: neutral: "/avatars/presence-neutral.png".
 */
const PRESENCE_ASSETS: Record<PresenceDirection, string | null> = {
  neutral: null,
  hero: null,
  heroine: null,
};

const SIZE_CLASSES = {
  sm: "h-28",
  md: "h-44",
  lg: "h-72",
} as const;

type PresenceFigureProps = {
  /** Активное направление аватара (D083). По умолчанию — нейтральная Seed Form. */
  direction?: PresenceDirection;
  /**
   * Текущая глобальная стадия (1–10, D010). Зарезервировано для будущих
   * постадийных ассетов; на выбор картинки пока не влияет.
   */
  stage?: number;
  size?: keyof typeof SIZE_CLASSES;
  /** false — полностью статичная фигура (например, портрет на Progress, D072). */
  animated?: boolean;
  alt?: string;
  className?: string;
};

// Проп `stage` принимается типом, но пока сознательно не читается —
// зарезервирован под будущие постадийные ассеты (см. JSDoc выше).
export function PresenceFigure({
  direction = "neutral",
  size = "md",
  animated = true,
  alt = "Presence",
  className = "",
}: PresenceFigureProps) {
  const reduced = useReducedMotion() === true;
  const breathe = animated && !reduced;

  // Fallback-цепочка ассетов: направление → neutral → встроенный SVG.
  const src = PRESENCE_ASSETS[direction] ?? PRESENCE_ASSETS.neutral;

  return (
    <div
      className={`relative mx-auto aspect-[3/4] ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* Свечение позади фигуры — атмосфера, может пульсировать. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[-18%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18)_0%,rgba(167,139,250,0.08)_45%,transparent_70%)] blur-2xl"
        animate={breathe ? { opacity: [0.5, 0.85, 0.55], scale: [0.97, 1.04, 0.99] } : undefined}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Фигура: картинка-плейсхолдер или встроенный SVG-силуэт. Дыхание — scale/opacity. */}
      <motion.div
        className="relative h-full w-full"
        animate={breathe ? { scale: [1, 1.015, 1], opacity: [0.96, 1, 0.96] } : undefined}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 85%" }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 430px) 70vw, 300px"
            className="object-contain object-bottom"
          />
        ) : (
          <FallbackSilhouette alt={alt} />
        )}
      </motion.div>

      {/* Кольцо-подиум у основания (в духе референса Seed Form). */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-[12%] bottom-[1%] h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent"
        animate={breathe ? { opacity: [0.25, 0.65, 0.3], scaleX: [0.85, 1, 0.9] } : undefined}
        transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/**
 * Встроенный нейтральный силуэт — «Seed Form» без ассетов: спокойная
 * светящаяся фигура, не гендерная, не кастомизированная, никогда не
 * финальная форма (D074). Приближает настроение референса до появления
 * настоящих картинок.
 */
function FallbackSilhouette({ alt }: { alt: string }) {
  return (
    <svg
      viewBox="0 0 240 360"
      role="img"
      aria-label={alt}
      className="h-full w-full overflow-visible drop-shadow-[0_0_28px_rgba(56,189,248,0.3)]"
    >
      <defs>
        <linearGradient id="presence-sil" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.35" />
        </linearGradient>
        <filter id="presence-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Голова */}
      <circle cx="120" cy="66" r="26" fill="url(#presence-sil)" fillOpacity="0.6" filter="url(#presence-blur)" />
      {/* Тело: мягкая вертикальная фигура с ногами, без деталей. */}
      <path
        fill="url(#presence-sil)"
        fillOpacity="0.5"
        filter="url(#presence-blur)"
        d="M120 100
           C 94 106 76 128 74 160
           L 70 208 C 69 218 76 224 84 222 L 92 220
           L 96 252 C 97 262 100 268 104 274 L 104 330 L 116 330 L 116 276
           L 124 276 L 124 330 L 136 330 L 136 274
           C 140 268 143 262 144 252 L 148 220 L 156 222
           C 164 224 171 218 170 208 L 166 160
           C 164 128 146 106 120 100 Z"
      />
      {/* Искра в центре груди — в духе референса. */}
      <circle cx="120" cy="150" r="4" fill="#e0f2fe" filter="url(#presence-blur)" />
      {/* Подиум-эллипс у основания. */}
      <ellipse
        cx="120"
        cy="342"
        rx="68"
        ry="9"
        fill="none"
        stroke="#38bdf8"
        strokeOpacity="0.3"
        strokeWidth="1.5"
        filter="url(#presence-blur)"
      />
    </svg>
  );
}
