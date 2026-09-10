import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/sign-in", "/sign-up", "/api/auth"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (sessionToken && isPublicPath) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!sessionToken && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!sessionToken && pathname.startsWith("/teacher")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!sessionToken && pathname.startsWith("/student")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!sessionToken && pathname.startsWith("/parent")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
