"use server";

import { createSupabaseServerClient } from "@/lib/supabase";

export type AuthResult = { error: string | null };

/**
 * Server Actions для аутентификации.
 *
 * MVP-минимум: возвращают `{ error }`, не делают редиректов и не показывают
 * тосты — это ответственность UI-слоя, который мы подключим в следующих
 * итерациях. Куки сессии обновляются автоматически: серверный клиент
 * пишет их через `cookies()`, а на следующем запросе proxy.ts освежит токен.
 */

export async function signInWithPassword(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введи почту и пароль." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  return { error: error?.message ?? null };
}

export async function signUpWithPassword(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введи почту и пароль." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  return { error: error?.message ?? null };
}

export async function signOut(): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}
