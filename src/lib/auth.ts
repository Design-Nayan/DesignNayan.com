import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "dn_admin_token";
const TOKEN_EXPIRY = "7d"; // 7 days session

// HMAC secret key for signing admin session tokens
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "design-nayan-secret-salt-key-2026"
);

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  role: string;
  name?: string;
}

/**
 * Hash a plain-text password using salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain-text password against stored bcrypt hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Cryptographically sign an Edge-compatible JWT token
 */
export async function signAdminToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verify token authenticity and return decoded payload, or null if invalid/expired
 */
export async function verifyAdminToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      role: (payload.role as string) || "SUPERADMIN",
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Helper to retrieve currently authenticated admin from Next.js server cookies
 */
export async function getCurrentAdmin(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Standard cookie configuration for HttpOnly session security
 */
export const SECURE_COOKIE_OPTIONS = {
  name: AUTH_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};
