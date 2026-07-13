"use client";

/**
 * ProfileEditableRow — строка редактируемого поля Профиля (D086).
 *
 * Только редактируемые строки получают chevron и tap-действие; read-only
 * строки живут в profile-screen.tsx без chevron и обработчиков. Под
 * строкой может появиться спокойная inline-строка успеха (D084) —
 * не тост, не редирект.
 */
export function ProfileEditableRow({
  label,
  value,
  muted = false,
  last = false,
  saved = false,
  onClick,
}: {
  label: string;
  value: string;
  muted?: boolean;
  last?: boolean;
  /** Показать «Изменения сохранены.» под строкой (inline-успех D084). */
  saved?: boolean;
  onClick: () => void;
}) {
  return (
    <div className={last ? "" : "border-b border-white/[0.06]"}>
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        className="flex min-h-[3.25rem] w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60"
      >
        <span className="shrink-0 text-sm text-zinc-300 [font-family:var(--font-onest)]">
          {label}
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <span
            className={`min-w-0 text-right text-sm [font-family:var(--font-onest)] ${
              muted ? "text-zinc-500" : "text-zinc-100"
            }`}
          >
            {value}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="shrink-0 text-zinc-500"
          >
            <path
              d="M9.5 5.5 16 12l-6.5 6.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {saved ? (
        <p
          role="status"
          className="pb-3 text-xs text-cyan-300/80 [font-family:var(--font-onest)]"
        >
          Изменения сохранены.
        </p>
      ) : null}
    </div>
  );
}
