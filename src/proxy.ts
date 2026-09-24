import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { getSessionFromRequest } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // /admin/reset-password is reached via the password-reset email link
    // before any session cookie exists yet — Supabase's client library
    // establishes the session client-side from the URL fragment tokens
    // once the page loads, so the middleware can't check for one here.
    if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
      return NextResponse.next();
    }

    const { response, user } = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/admin/:path*"],
};
