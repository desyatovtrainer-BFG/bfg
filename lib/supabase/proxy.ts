import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { supabaseEnv } from "./env";

/**
 * Освежение сессии Supabase в Next.js Proxy (Next.js 16 заменил middleware на proxy).
 *
 * Что делает:
 *  - читает куки из входящего запроса;
 *  - вызывает `auth.getUser()` — Supabase сам ротейтит access token, если нужно;
 *  - переписывает обновлённые куки и в `request`, и в `response`,
 *    чтобы их получили и серверные компоненты, и браузер.
 *
 * Важно: ничего своего между `createServerClient` и `getUser()` не делаем —
 * это рекомендация Supabase, иначе можно сломать рефреш токенов.
 */
export async function updateSupabaseSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}
