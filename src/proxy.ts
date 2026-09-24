import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { getSessionFromRequest } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // /admin/auth/confirm handles the password-reset email link before
    // any session exists yet — it establishes one itself via verifyOtp.
    if (pathname === "/admin/login" || pathname.startsWith("/admin/auth/")) {
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
