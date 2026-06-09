import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, updateSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  // Paths that require authentication
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/verify");

  let session: any = null;
  if (sessionCookie) {
    session = await decrypt(sessionCookie);
  }

  // Redirect to login if unauthenticated on protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if authenticated on auth routes
  if (isAuthRoute && session) {
    const redirectUrl = session.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Role-based access control for /admin
  if (isAdminRoute && session?.role !== "admin") {
    // If not admin, redirect to normal dashboard or another error page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Optionally update session expiry
  if (session) {
    const res = await updateSession(request);
    if (res) {
      // Create a response to forward the request and set the updated cookie
      const response = NextResponse.next();
      const cookieHeader = res.headers.get("Set-Cookie");
      if (cookieHeader) {
        response.headers.set("Set-Cookie", cookieHeader);
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/verify",
  ],
};
