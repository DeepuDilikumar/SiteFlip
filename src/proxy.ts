import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/token";

const APP_ROUTES = ["/dashboard", "/find", "/generate", "/preview", "/checkout"];
const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Optimistic routing only: redirects based on whether a valid session cookie
 * exists. Pages and route handlers still check the user themselves.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = Boolean(await verifySession(request.cookies.get(SESSION_COOKIE)?.value));

  if (!signedIn && APP_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (signedIn && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/find/:path*", "/generate/:path*", "/preview/:path*", "/checkout/:path*", "/login", "/signup"],
};
