import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

/**
 * Singleton-клиент Supabase для браузера (Client Components, эффекты, обработчики).
 *
 * SSR-куки читает/пишет автоматически — это позволяет realtime, auth state
 * и БД-запросы из клиента работать с теми же сессионными куками,
 * что и серверные клиенты ниже.
 */
let cached: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!cached) {
    cached = createBrowserClient(supabaseEnv.url, supabaseEnv.anonKey);
  }
  return cached;
}
