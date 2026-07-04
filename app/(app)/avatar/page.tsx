import { redirect } from "next/navigation";

/**
 * /avatar — маршрут упразднён принятой навигацией: Прогресс поглощает
 * Аватар + Прогресс + Профиль-контент (D005); идентичность/портрет
 * переезжают на экран Прогресса (D072, слайс Progress).
 *
 * Компоненты старого экрана (avatar-hero, cosmetic-rewards) сохранены
 * в app/components/avatar/ и переиспользуются позже. Маршрут оставлен
 * как redirect, чтобы старые ссылки/закладки не ломались.
 */
export default function AvatarRedirect(): never {
  redirect("/progress");
}
