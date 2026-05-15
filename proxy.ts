import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase";

/**
 * Корневой Proxy (Next.js 16 заменил `middleware` на `proxy`).
 *
 * Делает одно: на каждом матчащемся запросе освежает сессию Supabase
 * и переносит обновлённые куки на ответ. Никакой авторизационной логики
 * здесь нет — реальные проверки делаем рядом с данными (Server Actions,
 * Route Handlers, RLS на стороне Supabase).
 */
export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     *  - api routes
     *  - Next internals (_next/static, _next/image)
     *  - common static assets (favicon, robots, sitemap, images, fonts)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
