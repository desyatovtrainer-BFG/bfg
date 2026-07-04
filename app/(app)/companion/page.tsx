import { redirect } from "next/navigation";

/**
 * /companion — маршрут упразднён принятой навигацией: Компаньон — это
 * Голос единого Presence на поверхностях (D001, D036–D038, D071 Voice Slot),
 * а не отдельный раздел. Реплика Голоса уже показывается на dashboard/Home.
 *
 * Компонент старого экрана (companion-screen) сохранён в
 * app/components/companion/. Маршрут оставлен как redirect,
 * чтобы старые ссылки/закладки не ломались.
 */
export default function CompanionRedirect(): never {
  redirect("/dashboard");
}
