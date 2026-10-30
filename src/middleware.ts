import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dn_jwt_secure_key_a89f31b8c2e90e447b931dc912f73e5a7b68c9d0e1f2";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "dn_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isValid = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (payload.role === "admin") {
        isValid = true;
      }
    } catch {
      isValid = false;
    }
  }

  // 1. Secret doorway: /kla-dorja-khul
  if (pathname === "/kla-dorja-khul") {
    if (isValid) {
      // Already authenticated -> go directly to dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Allow unauthenticated owner to see the secret login portal
    return NextResponse.next();
  }

  // 2. Protected /admin routes
  if (pathname.startsWith("/admin")) {
    if (isValid) {
      // Authenticated admin can view the admin console
      return NextResponse.next();
    }

    // Unauthenticated visitor trying to probe /admin -> return 404 Not Found!
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/kla-dorja-khul"],
};
