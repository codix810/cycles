import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getUser(token?: string) {
  try {
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return decoded;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = getUser(token);

  const isAuth = !!user;
  const role = user?.role;

  const { pathname } = req.nextUrl;

  /* ========= ADMIN ========= */

  if (pathname.startsWith("/admin")) {
    if (!isAuth || role !== "admin") {
      return NextResponse.rewrite(new URL("/404", req.url));
    }
  }

  /* ========= PROFILE ========= */

  if (pathname.startsWith("/profile")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  /* ========= AUTH PAGES ========= */

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};