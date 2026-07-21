import type { Metadata } from "next";
import { AvatarEditor } from "@/app/components/avatar/avatar-editor";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getAvatarEvolutionForLevel, getLevelProgress } from "@/lib/progression";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Настройка аватара — BFG",
};

/**
 * Avatar Customization (D073/D083): сервер передаёт только текущую глобальную
 * Stage, а сохранённый тестовый AvatarConfig живёт за клиентским адаптером.
 */
export default async function AppearancePage() {
  const user = await getCurrentUser();
  let level = 1;

  if (user) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", user.id)
      .maybeSingle();
    if (error) {
      console.error("[AppearancePage] read profile", error);
    }
    level = getLevelProgress(Number(data?.xp ?? 0)).level;
  }

  return <AvatarEditor stage={getAvatarEvolutionForLevel(level).stage} />;
}
