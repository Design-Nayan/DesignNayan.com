import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "dn_admin_token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "design-nayan-secret-salt-key-2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cleanPath = pathname.replace(/\/+$/, "") || "/";

  // 1. Apply baseline security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 2. Allow public auth endpoints (login page / auth APIs)
  if (
    cleanPath === "/admin/login" ||
    cleanPath === "/api/auth/login" ||
    cleanPath === "/api/auth/logout"
  ) {
    return response;
  }

  // 3. Only intercept /admin and /api/admin paths
  const isAdminPage = cleanPath === "/admin" || cleanPath.startsWith("/admin/");
  const isAdminApi = cleanPath.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return response;
  }

  // 4. Extract session token from HttpOnly cookie
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Authentication required. Missing session cookie." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login/", request.url);
    if (cleanPath !== "/admin") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 5. Cryptographically verify the session token
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload || !payload.adminId) {
      throw new Error("Invalid session payload");
    }

    return response;
  } catch {
    if (isAdminApi) {
      return NextResponse.json(
        { error: "Session expired or invalid. Please re-authenticate." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin/login/", request.url);
    if (cleanPath !== "/admin") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.cookies.delete(AUTH_COOKIE_NAME);
    return redirectResponse;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
