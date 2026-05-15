import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45 [font-family:var(--font-onest)]";

const variants: Record<Variant, string> = {
  primary:
    "border border-sky-400/35 bg-gradient-to-b from-white/[0.14] to-white/[0.05] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_16px_40px_-18px_rgba(56,189,248,0.45)] hover:border-sky-400/50 focus-visible:outline-sky-400/70",
  secondary:
    "border border-white/14 bg-white/[0.06] text-zinc-100 hover:bg-white/[0.1] focus-visible:outline-white/30",
  ghost:
    "border border-transparent bg-transparent text-zinc-300 hover:bg-white/[0.05] hover:text-white focus-visible:outline-zinc-500/40",
};

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  href?: undefined;
};

export type GameButtonProps = LinkButtonProps | NativeButtonProps;

function isLinkButton(props: GameButtonProps): props is LinkButtonProps {
  return typeof (props as LinkButtonProps).href === "string";
}

export function GameButton(props: GameButtonProps) {
  if (isLinkButton(props)) {
    const { href, variant = "primary", className = "", children } = props;
    return (
      <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  const { variant = "primary", className = "", children, type = "button", ...rest } = props;
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
