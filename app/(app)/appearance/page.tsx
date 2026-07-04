import type { Metadata } from "next";
import { PlaceholderScreen } from "@/app/components/ui/placeholder-screen";
import { PresenceFigure } from "@/app/components/ui/presence-figure";
import { ScreenHeader } from "@/app/components/ui/screen-header";

export const metadata: Metadata = {
  title: "Внешний вид — BFG",
};

/**
 * Внешний вид — placeholder кастомизации аватара (D073, rebuild-политика).
 *
 * Точка входа сюда — ТОЛЬКО тап по Living Presence на Home (подключается
 * в слайсе Home). Профиль и Прогресс на этот экран не ссылаются (D072/D086)
 * — маршрут сознательно нигде не слинкован в этом слайсе.
 *
 * Только заглушка: никакого редактора, каталога, одежды/волос/аксессуаров,
 * кастомизации тела, платной косметики, валюты и 3D. Превью показывает
 * текущую временную фигуру Presence. Этот placeholder не является
 * продуктовым решением о глубине финальной кастомизации.
 * Текст — implementation copy, не продуктовое решение.
 */
export default function AppearancePage() {
  return (
    <PlaceholderScreen
      title="Внешний вид"
      lines={[
        "Кастомизация появится позже.",
        "Сейчас важно сохранить путь и увидеть форму BFG.",
      ]}
      header={<ScreenHeader title="Внешний вид" titleHidden backHref="/dashboard" />}
      figure={<PresenceFigure size="md" direction="neutral" />}
    />
  );
}
