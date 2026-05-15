import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Серверный Supabase-клиент для Server Components, Route Handlers и Server Actions.
 *
 * В Next.js 16 `cookies()` асинхронный, поэтому фабрика тоже async.
 * Создаётся per-request — не кешируем между запросами.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `set` нельзя вызвать из Server Component при рендере — это нормально.
          // Освежением сессии и записью кук занимается proxy.ts на каждом запросе.
        }
      },
    },
  });
}
