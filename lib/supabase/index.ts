/**
 * Единая точка входа в Supabase-инфраструктуру BFG.
 *
 * Импортируй отсюда, чтобы не задумываться о пути:
 *   import { getSupabaseBrowserClient } from "@/lib/supabase";
 *   import { createSupabaseServerClient } from "@/lib/supabase";
 */
export { getSupabaseBrowserClient } from "./client";
export { updateSupabaseSession } from "./proxy";
export { createSupabaseServerClient } from "./server";
