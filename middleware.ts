import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "ta"],
  defaultLocale: "en",
  localePrefix: "as-needed" // This allows the root to work without /en
});

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // 1. Admin role guard
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Handle Localization
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes that don't need auth
        const publicRoutes = ["/", "/login", "/signup", "/api/products", "/api/auth/signup"];
        const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith("/products/"));
        
        if (isPublic) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // NextAuth protected routes
    "/admin/:path*",
    "/orders",
    "/cart",
    "/checkout",
    "/api/orders/:path*",
    "/api/cart/:path*",
    "/api/admin/:path*",
    // next-intl locales
    "/(ta|en)/:path*",
  ],
};
