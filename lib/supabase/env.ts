/**
 * Единый источник правды для публичных переменных окружения Supabase.
 *
 * `NEXT_PUBLIC_*` инлайнятся бандлером, поэтому одинаково доступны
 * и в браузере, и на сервере. Падаем громко и понятно, если значение
 * не задано — это удобнее тихих 401/404 от Supabase позже.
 */

function readPublic(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required env var: ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const supabaseEnv = {
  get url() {
    return readPublic("NEXT_PUBLIC_SUPABASE_URL");
  },
  get anonKey() {
    return readPublic("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
};
