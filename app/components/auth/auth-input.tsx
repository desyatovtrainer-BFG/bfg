import type { InputHTMLAttributes } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/**
 * Простое поле формы под тёмную тему BFG.
 * 48px высоты для удобного тапа на мобиле.
 */
export function AuthInput({ label, className = "", id, name, ...rest }: AuthInputProps) {
  const fieldId = id ?? name;
  return (
    <label htmlFor={fieldId} className="block">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 [font-family:var(--font-onest)]">
        {label}
      </span>
      <input
        id={fieldId}
        name={name}
        className={[
          "mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 text-base text-white",
          "placeholder:text-zinc-600",
          "focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400/25",
          "[font-family:var(--font-onest)]",
          className,
        ].join(" ")}
        {...rest}
      />
    </label>
  );
}
