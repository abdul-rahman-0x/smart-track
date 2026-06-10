// Path: proxy.ts
import { auth } from "@/auth";

// Next.js 16 expects a named export 'proxy' instead of default export
export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isPublicRoute = 
    nextUrl.pathname === "/" || 
    nextUrl.pathname === "/login" || 
    nextUrl.pathname.startsWith("/api/auth");

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};