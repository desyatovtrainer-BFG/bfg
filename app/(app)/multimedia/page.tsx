import type { Metadata } from "next";
import { PlaceholderScreen } from "@/app/components/ui/placeholder-screen";

export const metadata: Metadata = {
  title: "Мультимедиа — BFG",
};

/**
 * Мультимедиа — placeholder-экран принятого будущего направления навигации
 * (D003, Registry Notes — Future Product Surface Notes).
 *
 * Только заглушка: никакой медиатеки, статей, загрузок, рекомендаций и БД.
 * Существующая логика видео тренировок (Kinescope) не затрагивается.
 * Текст — implementation copy, не продуктовое решение.
 */
export default function MultimediaPage() {
  return (
    <PlaceholderScreen
      title="Мультимедиа"
      lines={[
        "Этот раздел появится позже.",
        "Здесь будут материалы, которые поддерживают путь.",
      ]}
    />
  );
}
