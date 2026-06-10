import { auth } from "@/auth";

const publicRoutes = ["/", "/login", "/register"] as const;

const isPublicRoute = (pathname: string): boolean =>
    publicRoutes.includes(pathname as (typeof publicRoutes)[number]) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhooks/stripe");

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    if (!isLoggedIn && !isPublicRoute(pathname)) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }

    if (
        isLoggedIn &&
        (pathname === "/login" || pathname === "/register")
    ) {
        return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
