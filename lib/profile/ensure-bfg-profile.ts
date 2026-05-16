import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Гарантирует наличие BFG-данных для пользователя:
 * строки в `public.profiles` и `public.avatars` с MVP-дефолтами.
 *
 * Идемпотентно: сначала смотрим, есть ли строка, и только потом insert.
 * Намеренно не используем `upsert + onConflict + ignoreDuplicates` —
 * он требует явного UNIQUE-индекса на колонке onConflict, и если его
 * нет (или он на другой колонке), supabase-js возвращает ошибку, а
 * строка не создаётся. Простой select → insert работает при любом
 * RLS, разрешающем INSERT, и не зависит от формы уникальных индексов.
 *
 * Любая ошибка возвращается наверх и логируется в server-консоль —
 * тихих фейлов больше нет.
 */
export async function ensureBfgProfile(
  supabase: SupabaseClient,
  user: Pick<User, "id">,
): Promise<{ error: string | null }> {
  const profileError = await ensureRow(supabase, {
    table: "profiles",
    match: { id: user.id },
    insert: {
      id: user.id,
      level: 1,
      xp: 0,
      streak: 0,
      title: "Начало пути",
    },
  });
  if (profileError) return { error: profileError };

  // У avatars PK — это `id` с FK на auth.users(id). Отдельной user_id-колонки
  // нет, поэтому матчим и пишем по `id`.
  const avatarError = await ensureRow(supabase, {
    table: "avatars",
    match: { id: user.id },
    insert: {
      id: user.id,
      aura: "soft_glow",
      form: "starter",
      evolution_stage: 1,
      glow_intensity: 1,
    },
  });
  if (avatarError) return { error: avatarError };

  return { error: null };
}

async function ensureRow(
  supabase: SupabaseClient,
  opts: {
    table: "profiles" | "avatars";
    match: Record<string, string>;
    insert: Record<string, unknown>;
  },
): Promise<string | null> {
  const [matchKey, matchValue] = Object.entries(opts.match)[0]!;

  const { data: existing, error: selectError } = await supabase
    .from(opts.table)
    .select(matchKey)
    .eq(matchKey, matchValue)
    .maybeSingle();

  if (selectError) {
    console.error(`[ensureBfgProfile] select ${opts.table}`, selectError);
    return selectError.message;
  }
  if (existing) return null;

  const { error: insertError } = await supabase
    .from(opts.table)
    .insert(opts.insert);

  // 23505 = duplicate key. Безопасно игнорируем — значит, между нашим
  // select и insert строку успел создать кто-то ещё (например, триггер
  // handle_new_user или параллельный запрос). Цель достигнута.
  if (insertError && insertError.code !== "23505") {
    console.error(`[ensureBfgProfile] insert ${opts.table}`, insertError);
    return insertError.message;
  }

  return null;
}
