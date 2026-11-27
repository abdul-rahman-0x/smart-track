import { auth } from "@/auth";

// Next.js route guard proxy
export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Publicly accessible paths (never require authentication)
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/login" ||
    nextUrl.pathname.startsWith("/terms") ||
    nextUrl.pathname.startsWith("/privacy") ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname === "/icon.svg";

  // Redirect unauthenticated traffic attempting to access protected workspace routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|svg|webp|woff2?)).*)",
  ],
};
