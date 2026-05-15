import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";

/**
 * Серверный helper «кто сейчас залогинен».
 *
 * Используем `auth.getUser()`, а не `getSession()`: он валидирует JWT
 * на Supabase Auth-сервере и подходит для защиты роутов / Server Actions.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
