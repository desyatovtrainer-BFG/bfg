import type { HTMLAttributes } from "react";

type GameCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Слабый цветной акцент свечения */
  glow?: "cyan" | "violet" | "rose" | "gold" | "none";
};

const glowMap = {
  cyan: "shadow-[0_0_40px_-12px_rgba(56,189,248,0.35)]",
  violet: "shadow-[0_0_40px_-12px_rgba(167,139,250,0.35)]",
  rose: "shadow-[0_0_40px_-12px_rgba(251,113,133,0.3)]",
  gold: "shadow-[0_0_48px_-12px_rgba(251,191,36,0.32)]",
  none: "",
} as const;

export function GameCard({
  glow = "none",
  className = "",
  children,
  ...props
}: GameCardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02]",
        "backdrop-blur-xl",
        glowMap[glow],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
