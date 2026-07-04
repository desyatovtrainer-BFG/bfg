"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import type { ReactNode } from "react";

/**
 * OpenRing — открытое прогресс-кольцо (open arc) по D071.
 *
 * Что это: единственный вид прогресс-кольца в BFG. Никогда не замкнутый
 * круг: у дуги есть видимое начало, видимый конец и намеренный разрыв
 * снизу, в зоне которого стоит подпись значения. Заполнение анимируется
 * спокойно (< 600ms), prefers-reduced-motion → статичная отрисовка.
 *
 * Будущие потребители (Home, D071):
 *   - Inner Ring  = Level Progress   («12 УР.», accent="amber»);
 *   - Outer Ring  = Weekly Activity  («12/24 АКТ.», accent="sky»).
 * Экран Home здесь НЕ строится — это только примитив.
 *
 * Чем это НЕ является: не датчик, не «казино»-анимация, не третий вид
 * кольца. На Home допустимы ровно два кольца (D071) — оба этим примитивом.
 */

type OpenRingAccent = "amber" | "sky";

const ACCENTS: Record<OpenRingAccent, { stroke: string; glow: string }> = {
  // Тёплый акцент уровня (в языке gold-глоу GameCard и D054-orange направления).
  amber: { stroke: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
  // Спокойный sky — базовый акцент присутствия (§4).
  sky: { stroke: "#38bdf8", glow: "rgba(56,189,248,0.4)" },
};

type OpenRingProps = {
  /** Заполнение дуги, 0..1. Значения вне диапазона обрезаются. */
  progress: number;
  /** Подпись значения в зоне разрыва (например, «12 УР.» или «12/24 АКТ.»). */
  label: string;
  /** Диаметр в px. */
  size?: number;
  /** Толщина дуги в px. */
  thickness?: number;
  accent?: OpenRingAccent;
  /** Угол разрыва в градусах (разрыв всегда снизу, по центру). */
  gapDegrees?: number;
  /** Контент внутри кольца (например, вложенное кольцо или фигура Presence). */
  children?: ReactNode;
  /** aria-label; по умолчанию — label. */
  ariaLabel?: string;
  className?: string;
};

function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function OpenRing({
  progress,
  label,
  size = 200,
  thickness = 6,
  accent = "sky",
  gapDegrees = 72,
  children,
  ariaLabel,
  className = "",
}: OpenRingProps) {
  const reduced = useReducedMotion() === true;
  const gradientId = useId();

  const clamped = Math.min(1, Math.max(0, progress));
  const c = ACCENTS[accent];

  // Дуга: разрыв по центру снизу (90° в SVG-координатах, y вниз).
  // Старт — слева от разрыва, обход по часовой через верх, конец — справа от разрыва.
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startDeg = 90 + gapDegrees / 2;
  const sweep = 360 - gapDegrees;
  const endDeg = startDeg + sweep;
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = sweep > 180 ? 1 : 0;
  const arcPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? label}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={c.stroke} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c.stroke} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Трек: полная открытая дуга — видно начало, конец и разрыв. */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Заполнение: спокойная анимация до текущего значения (< 600ms). */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
          initial={false}
          animate={{ pathLength: clamped }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        />
      </svg>

      {/* Подпись значения — в зоне разрыва (снизу, по центру). */}
      <span
        className="absolute inset-x-0 bottom-0 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-200 [font-family:var(--font-geist-mono)]"
        aria-hidden
      >
        {label}
      </span>

      {/* Контент внутри кольца. */}
      {children ? (
        <div className="relative flex items-center justify-center" style={{ padding: thickness * 2 }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
