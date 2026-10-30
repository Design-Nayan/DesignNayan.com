import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

const JWT_SECRET = process.env.JWT_SECRET || "dn_jwt_secure_key_a89f31b8c2e90e447b931dc912f73e5a7b68c9d0e1f2";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "dn_admin_token";

/**
 * Verify admin password against the database record (or fallback default).
 */
export async function verifyAdminPassword(inputPassword: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from("admin_auth")
      .select("password_hash")
      .eq("id", "primary")
      .single();

    if (error || !data?.password_hash) {
      const fallback = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
      return inputPassword === fallback;
    }

    return await bcrypt.compare(inputPassword, data.password_hash);
  } catch (err) {
    console.error("Error verifying admin password:", err);
    return false;
  }
}

/**
 * Update the admin password in Supabase.
 */
export async function updateAdminPasswordInDB(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isValid = await verifyAdminPassword(currentPassword);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const { error } = await supabaseAdmin.from("admin_auth").upsert({
      id: "primary",
      password_hash: newHash,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Error updating admin password:", err);
    return { success: false, error: err.message || "Failed to update password." };
  }
}

/**
 * Create a cryptographically signed JWT for the admin session (7 days validity).
 */
export async function createAdminToken(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verify a JWT string.
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Check if the current request has an active, valid admin session.
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}

/**
 * Set the secure httpOnly cookie.
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the session cookie on logout.
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
