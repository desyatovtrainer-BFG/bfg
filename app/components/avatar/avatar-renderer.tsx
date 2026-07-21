"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, type ReactNode } from "react";
import {
  describeResolvedAvatar,
  getAvatarRenderColors,
  resolveAvatarMotion,
  type AvatarMotion,
  type AvatarPresentation,
  type ResolvedAvatar,
} from "@/lib/avatar";

type AvatarRendererProps = {
  config: ResolvedAvatar;
  presentation: AvatarPresentation;
  motion?: AvatarMotion;
  label?: string;
  className?: string;
};

const PRESENTATION_SIZE: Record<AvatarPresentation, string> = {
  home: "h-44 w-32 sm:h-48 sm:w-36",
  progress: "h-52 w-40",
  editor: "h-[19rem] w-[14.5rem] sm:h-[21rem] sm:w-64",
};

const STAGE_ACCENTS = [
  { primary: "#7dd3fc", secondary: "#38bdf8" },
  { primary: "#67e8f9", secondary: "#22d3ee" },
  { primary: "#c4b5fd", secondary: "#8b5cf6" },
  { primary: "#f0abfc", secondary: "#c084fc" },
  { primary: "#fcd34d", secondary: "#f59e0b" },
] as const;

export function AvatarRenderer({
  config,
  presentation,
  motion: requestedMotion,
  label,
  className = "",
}: AvatarRendererProps) {
  const reduced = useReducedMotion() === true;
  const motionMode = resolveAvatarMotion(presentation, requestedMotion);
  const animated = motionMode !== "none" && !reduced;
  const colors = getAvatarRenderColors(config.slot);
  const accent = STAGE_ACCENTS[Math.min(4, Math.max(0, config.stage - 1))]!;
  const gid = useId().replace(/:/g, "");
  const accessibleLabel = label ?? describeResolvedAvatar(config);

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      className={`relative mx-auto isolate ${PRESENTATION_SIZE[presentation]} ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[-14%] -z-10 rounded-[48%] blur-2xl"
        style={{
          background: `radial-gradient(ellipse at center, ${accent.primary}33 0%, ${accent.secondary}14 48%, transparent 72%)`,
          opacity: config.auraIntensity,
        }}
        animate={
          animated
            ? { opacity: [config.auraIntensity * 0.78, config.auraIntensity, config.auraIntensity * 0.82] }
            : undefined
        }
        transition={{ duration: motionMode === "editor" ? 5.2 : 4.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        aria-hidden
        className="relative h-full w-full"
        style={{ transformOrigin: "50% 88%" }}
        animate={animated ? { y: [0, -1.5, 0], scaleY: [1, 1.009, 1] } : undefined}
        transition={{ duration: motionMode === "editor" ? 5.4 : 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 260 420"
          aria-hidden
          focusable="false"
          className="h-full w-full overflow-visible drop-shadow-[0_18px_28px_rgba(0,0,0,0.5)]"
          style={{ transform: `scale(${config.bodyScale})`, transformOrigin: "50% 88%" }}
        >
          <defs>
            <linearGradient id={`outfit-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={outfitPalette(config.slot.outfitId).light} />
              <stop offset="0.58" stopColor={outfitPalette(config.slot.outfitId).base} />
              <stop offset="1" stopColor={outfitPalette(config.slot.outfitId).dark} />
            </linearGradient>
            <linearGradient id={`skin-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={lighten(colors.skin, 18)} />
              <stop offset="0.55" stopColor={colors.skin} />
              <stop offset="1" stopColor={darken(colors.skin, 20)} />
            </linearGradient>
            <linearGradient id={`hair-${gid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={lighten(colors.hair, 18)} />
              <stop offset="1" stopColor={darken(colors.hair, 18)} />
            </linearGradient>
            <radialGradient id={`aura-${gid}`} cx="50%" cy="43%" r="55%">
              <stop offset="0" stopColor={accent.primary} stopOpacity="0.2" />
              <stop offset="1" stopColor={accent.secondary} stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="130" cy="392" rx="77" ry="13" fill="#020617" opacity="0.7" />
          <ellipse
            cx="130"
            cy="390"
            rx="62"
            ry="8"
            fill="none"
            stroke={accent.primary}
            strokeOpacity={0.18 + config.stage * 0.018}
            strokeWidth="2"
          />
          <ellipse cx="130" cy="205" rx="115" ry="170" fill={`url(#aura-${gid})`} />

          <g>
            <path
              d={
                config.direction === "hero"
                  ? "M91 207 112 202 126 224 115 363 86 363 101 272Z"
                  : "M97 207 116 202 127 224 116 363 91 363 103 273Z"
              }
              fill={`url(#outfit-${gid})`}
            />
            <path
              d={
                config.direction === "hero"
                  ? "M169 207 148 202 134 224 145 363 174 363 159 272Z"
                  : "M163 207 144 202 133 224 144 363 169 363 157 273Z"
              }
              fill={`url(#outfit-${gid})`}
            />
            <path d="M87 350 115 350 114 377 79 377Q76 367 87 350Z" fill="#111827" />
            <path d="M145 350 173 350 181 377 146 377Z" fill="#111827" />
            <path d="M80 377h36v10H72q1-8 8-10Z" fill="#090d14" />
            <path d="M145 377h36q7 2 8 10h-44Z" fill="#090d14" />
            <path d="M116 201h28l5 40-19 18-19-18Z" fill={outfitPalette(config.slot.outfitId).dark} />
          </g>

          <g>
            <path
              d={
                config.direction === "hero"
                  ? "M72 151Q91 126 112 123h36q22 3 40 28l-16 78H88Z"
                  : "M80 151Q96 129 113 124h34q18 5 33 27l-13 79H93Z"
              }
              fill={`url(#outfit-${gid})`}
            />
            <path
              d={
                config.direction === "hero"
                  ? "M81 154 60 181 72 266 90 262 84 191Z"
                  : "M87 155 67 182 77 263 93 260 89 191Z"
              }
              fill={`url(#skin-${gid})`}
            />
            <path
              d={
                config.direction === "hero"
                  ? "M179 154 200 181 188 266 170 262 176 191Z"
                  : "M173 155 193 182 183 263 167 260 171 191Z"
              }
              fill={`url(#skin-${gid})`}
            />
            <path
              d="M74 257q9-6 17 2l-3 18q-10 9-17-2Z"
              fill={`url(#skin-${gid})`}
            />
            <path
              d="M186 257q-9-6-17 2l3 18q10 9 17-2Z"
              fill={`url(#skin-${gid})`}
            />
            <path
              d={
                config.direction === "hero"
                  ? "M77 151Q96 128 114 125l16 30 16-30q20 4 37 26l-9 86H86Z"
                  : "M83 151Q99 132 115 127l15 30 15-30q17 5 32 24l-10 86H93Z"
              }
              fill={`url(#outfit-${gid})`}
            />
            <path
              d="M104 137q26 15 52 0"
              fill="none"
              stroke={outfitPalette(config.slot.outfitId).accent}
              strokeWidth="2.5"
              strokeOpacity="0.75"
            />
            <path
              d="M130 158v73"
              fill="none"
              stroke={outfitPalette(config.slot.outfitId).accent}
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <path d="M116 118h28v29q-14 13-28 0Z" fill={`url(#skin-${gid})`} />
          </g>

          <g>
            <path d={facePath(config.slot.faceId)} fill={`url(#skin-${gid})`} />
            <path d="M103 82q-9 1-7 15t10 10M157 82q9 1 7 15t-10 10" fill={`url(#skin-${gid})`} />
            <path d="M128 80q-4 17-1 24l7 1" fill="none" stroke={darken(colors.skin, 20)} strokeWidth="1.6" strokeLinecap="round" opacity="0.72" />

            <motion.g
              style={{ transformOrigin: "130px 91px" }}
              animate={
                animated
                  ? { scaleY: [1, 1, 0.12, 1, 1] }
                  : undefined
              }
              transition={{ duration: 5.8, repeat: Infinity, times: [0, 0.88, 0.9, 0.93, 1], ease: "easeInOut" }}
            >
              {eyeShape(config.slot.eyeId)}
            </motion.g>

            {browShape(config.slot.browId, colors.hair)}
            {mouthShape(config.slot.mouthId, darken(colors.skin, 30))}
            {hairShape(config.slot.hairId, `url(#hair-${gid})`)}
            {config.slot.accessoryIds.some((id) => id.endsWith("glasses")) ? (
              <g fill="none" stroke={accent.primary} strokeWidth="1.8" opacity="0.82">
                <rect x="104" y="83" width="21" height="14" rx="6" />
                <rect x="135" y="83" width="21" height="14" rx="6" />
                <path d="M125 89h10" />
              </g>
            ) : null}
            {config.slot.accessoryIds.includes("heroine-accessory-mark") ? (
              <path d="m151 104 3 4-3 4-3-4Z" fill={accent.primary} opacity="0.8" />
            ) : null}
          </g>

          {config.slot.accessoryIds.includes("hero-accessory-band") ? (
            <path d="M170 252q8 3 16 0l1 7q-9 4-17 0Z" fill={accent.primary} opacity="0.78" />
          ) : null}
        </svg>
      </motion.div>
    </div>
  );
}

function facePath(faceId: string): string {
  if (faceId.endsWith("broad")) return "M101 55Q130 37 159 55l-2 43q-6 29-27 38-22-9-27-38Z";
  if (faceId.endsWith("oval")) return "M104 52Q130 37 156 52l2 42q-5 31-28 43-23-12-28-43Z";
  if (faceId.endsWith("soft")) return "M105 53Q130 38 155 53l2 40q-4 30-27 43-23-13-27-43Z";
  if (faceId.endsWith("sculpted")) return "M103 52Q130 36 157 52l1 42-10 29-18 13-18-13-10-29Z";
  return "M102 53Q130 35 158 53l-1 44-11 28-16 11-17-11-10-28Z";
}

function eyeShape(eyeId: string): ReactNode {
  const open = eyeId.endsWith("open");
  const calm = eyeId.endsWith("calm");
  const curve = open ? 6 : calm ? 3 : 4;
  return (
    <g fill="none" stroke="#18212b" strokeWidth="2" strokeLinecap="round">
      <path d={`M108 90q8 ${curve} 16 0`} />
      <path d={`M136 90q8 ${curve} 16 0`} />
      {open ? <><circle cx="116" cy="92" r="1.8" fill="#18212b" /><circle cx="144" cy="92" r="1.8" fill="#18212b" /></> : null}
    </g>
  );
}

function browShape(browId: string, color: string): ReactNode {
  const strong = browId.endsWith("strong") || browId.endsWith("defined");
  const arched = browId.endsWith("arched");
  return (
    <g fill="none" stroke={color} strokeWidth={strong ? 3.4 : 2.5} strokeLinecap="round">
      <path d={arched ? "M107 80q9-7 18-1" : "M107 80q9-3 18 0"} />
      <path d={arched ? "M135 79q9-6 18 1" : "M135 80q9-3 18 0"} />
    </g>
  );
}

function mouthShape(mouthId: string, color: string): ReactNode {
  const d = mouthId.endsWith("soft")
    ? "M119 116q11 5 22 0"
    : mouthId.endsWith("determined")
      ? "M120 117q10-2 20 0"
      : "M120 116q10 2 20 0";
  return <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />;
}

function hairShape(hairId: string, fill: string): ReactNode {
  if (hairId.endsWith("long")) {
    return <path d="M101 62q7-31 30-29 26 2 31 30l5 78-18-10 8-59q-4-25-27-26-22 2-27 27l8 58-18 10Z" fill={fill} />;
  }
  if (hairId.endsWith("wave")) {
    return <path d="M101 69q-2-30 28-37 31 2 34 34l-4 66-15-9 7-51q-3-25-24-26-18 4-22 25l7 52-14 9Z" fill={fill} />;
  }
  if (hairId.endsWith("bob")) {
    return <path d="M100 67q4-31 30-33 28 3 31 33l-4 62-17 5 8-61q-4-25-20-27-18 3-23 27l8 61-17-5Z" fill={fill} />;
  }
  if (hairId.endsWith("undercut")) {
    return <path d="M104 64q5-27 29-29 23 5 25 25-17-10-49 9Z" fill={fill} />;
  }
  if (hairId.endsWith("textured")) {
    return <path d="m103 65 5-23 10 5 8-14 8 12 11-10 5 14 10 1-3 20q-23-14-54-5Z" fill={fill} />;
  }
  if (hairId.endsWith("swept")) {
    return <path d="M103 67q1-28 23-33 22-3 34 18-25-10-53 18Z" fill={fill} />;
  }
  return <path d="M104 67q3-29 27-32 24 3 28 30-27-14-55 2Z" fill={fill} />;
}

function outfitPalette(outfitId: string): { base: string; light: string; dark: string; accent: string } {
  if (outfitId.endsWith("dusk")) {
    return { base: "#263d52", light: "#405b72", dark: "#121d29", accent: "#7dd3fc" };
  }
  if (outfitId.endsWith("horizon")) {
    return { base: "#55462e", light: "#796644", dark: "#211b13", accent: "#fcd34d" };
  }
  return { base: "#303844", light: "#4b5563", dark: "#141922", accent: "#a7b4c6" };
}

function lighten(hex: string, amount: number): string {
  return shiftColor(hex, amount);
}

function darken(hex: string, amount: number): string {
  return shiftColor(hex, -amount);
}

function shiftColor(hex: string, amount: number): string {
  const value = hex.replace("#", "");
  const number = Number.parseInt(value, 16);
  const r = Math.min(255, Math.max(0, (number >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((number >> 8) & 255) + amount));
  const b = Math.min(255, Math.max(0, (number & 255) + amount));
  return `#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("")}`;
}
