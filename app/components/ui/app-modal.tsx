"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId } from "react";
import type { ReactNode } from "react";

/**
 * AppModal — спокойный модальный примитив (окно / bottom-sheet).
 *
 * Что это: единственный модальный контейнер BFG. Один открытый экземпляр
 * за раз, никаких стеков (D086 — single-modal edit flow). Многошаговые
 * сценарии (выбор → подтверждение D084) реализуются СМЕНОЙ children
 * внутри того же открытого контейнера, а не вторым модальным окном.
 *
 * Будущие потребители:
 *   - Reward Modal (D067): variant="center", dismissible=false —
 *     закрытием управляет вызывающий код (кнопка / авто-переход);
 *   - Profile edit flow (D084/D086): variant="sheet", состояния
 *     selection → confirmation внутри одного контейнера;
 *   - подтверждение «Выйти» (D086).
 *
 * Чем это НЕ является: не тост, не баннер, не нотификация. Тосты как
 * primary feedback запрещены (§13) — важные ответы живут inline или здесь.
 *
 * Поведение:
 *   - фон затемняется; клик по фону / Escape / свайп-вниз (sheet)
 *     закрывают ТОЛЬКО при dismissible=true;
 *   - скролл body блокируется, пока модал открыт;
 *   - reduced-motion: только fade, без сдвигов и масштабирования;
 *   - анимации < 600ms, спокойные (§5).
 */

type AppModalProps = {
  open: boolean;
  /** Запрос на закрытие (фон / Escape / свайп). Игнорируется при dismissible=false. */
  onClose: () => void;
  children: ReactNode;
  /** Заголовок модала. Если не задан — передай ariaLabel. */
  title?: string;
  /** aria-label на случай модала без видимого заголовка. */
  ariaLabel?: string;
  /** center — окно по центру (Reward Modal); sheet — нижний лист (Profile edit). */
  variant?: "center" | "sheet";
  /** false — фон/Escape/свайп не закрывают; закрытием управляет вызывающий код. */
  dismissible?: boolean;
  className?: string;
};

export function AppModal({
  open,
  onClose,
  children,
  title,
  ariaLabel,
  variant = "center",
  dismissible = true,
  className = "",
}: AppModalProps) {
  const reduced = useReducedMotion() === true;
  const titleId = useId();

  // Escape закрывает (только dismissible).
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  // Блокировка скролла body, пока модал открыт.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isSheet = variant === "sheet";

  const containerMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : isSheet
      ? {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 28 },
          transition: { duration: 0.26, ease: "easeOut" as const },
        }
      : {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.97 },
          transition: { duration: 0.22, ease: "easeOut" as const },
        };

  return (
    <AnimatePresence>
      {open ? (
        <div
          className={`fixed inset-0 z-[100] flex ${
            isSheet ? "items-end" : "items-center"
          } justify-center`}
        >
          {/* Затемнённый фон. Лёгкий blur допустим: под ним нет длинных списков (§13). */}
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.2 }}
            onClick={dismissible ? onClose : undefined}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={!title ? ariaLabel : undefined}
            drag={isSheet && dismissible && !reduced ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (isSheet && dismissible && info.offset.y > 90) onClose();
            }}
            className={[
              "relative w-full border border-white/10 bg-zinc-950/95 backdrop-blur-xl",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_80px_-24px_rgba(0,0,0,0.9)]",
              isSheet
                ? "max-w-[430px] rounded-t-3xl px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                : "mx-5 max-w-[420px] rounded-3xl px-5 py-5",
              className,
            ].join(" ")}
            {...containerMotion}
          >
            {/* Градиентная поверхность в языке GameCard. */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-white/[0.01] ${
                isSheet ? "rounded-t-3xl" : "rounded-3xl"
              }`}
            />

            {isSheet ? (
              <div aria-hidden className="relative mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" />
            ) : null}

            {title ? (
              <h2
                id={titleId}
                className="relative mb-3 text-lg font-bold text-white [font-family:var(--font-onest)]"
              >
                {title}
              </h2>
            ) : null}

            <div className="relative">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
