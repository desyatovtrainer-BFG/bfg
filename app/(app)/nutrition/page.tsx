import type { Metadata } from "next";
import { PlaceholderScreen } from "@/app/components/ui/placeholder-screen";

export const metadata: Metadata = {
  title: "Питание — BFG",
};

/**
 * Питание — placeholder-экран принятого будущего направления навигации
 * (D003, Registry Notes — Future Product Surface Notes).
 *
 * Только заглушка: никакой логики питания, калорий, планов, форм и БД.
 * Текст — implementation copy, не продуктовое решение.
 */
export default function NutritionPage() {
  return (
    <PlaceholderScreen
      title="Питание"
      lines={[
        "Этот раздел появится позже.",
        "Сейчас путь строится вокруг тренировок и прогресса.",
      ]}
    />
  );
}
