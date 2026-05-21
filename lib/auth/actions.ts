"use server";

import { ensureBfgProfile } from "@/lib/profile";
import { createSupabaseServerClient } from "@/lib/supabase";

export type AuthResult = { error: string | null };

/**
 * Server Actions для аутентификации.
 *
 * MVP-минимум: возвращают `{ error }`, не делают редиректов и не показывают
 * тосты — это ответственность UI-слоя, который мы подключим в следующих
 * итерациях. Куки сессии обновляются автоматически: серверный клиент
 * пишет их через `cookies()`, а на следующем запросе proxy.ts освежит токен.
 *
 * Ошибки наружу: только короткие спокойные русские тексты. Сырые сообщения
 * Supabase (включая то, есть ли такой email, какой формат пароля и пр.)
 * никогда не возвращаем клиенту — это требование BFG_SECURITY.md §7.1.
 * Детали логируем в серверной консоли с тегом фичи.
 */

export async function signInWithPassword(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введи почту и пароль." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[signInWithPassword]", error);
    return { error: "Не удалось войти. Проверь почту и пароль." };
  }

  return { error: null };
}

export async function signUpWithPassword(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введи почту и пароль." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("[signUpWithPassword]", error);
    return { error: "Не удалось зарегистрироваться. Попробуй ещё раз." };
  }

  // Если email confirmation выключен — Supabase сразу выдаёт сессию,
  // и под её JWT мы можем создать BFG-профиль и аватар. Если же
  // confirmation включён — `session` пустая, RLS отклонит insert,
  // поэтому строки создадим лениво на первом заходе в защищённый layout
  // (см. app/(app)/layout.tsx → ensureBfgProfile).
  if (data.session && data.user) {
    const { error: ensureError } = await ensureBfgProfile(supabase, data.user);
    if (ensureError) {
      // Аккаунт создан, но BFG-инициализация упала — сообщаем наверх
      // спокойным сообщением; подробности уже залогированы в ensureBfgProfile.
      return { error: "Аккаунт создан, но не удалось подготовить профиль. Попробуй войти ещё раз." };
    }
  }

  return { error: null };
}

export async function signOut(): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[signOut]", error);
    return { error: "Сейчас не получилось выйти. Попробуй ещё раз." };
  }
  return { error: null };
}
