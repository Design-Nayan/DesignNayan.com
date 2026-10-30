"use server";

import {
  verifyAdminPassword,
  updateAdminPasswordInDB,
  createAdminToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  isAuthenticatedAdmin,
} from "@/lib/server-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Brute-force login rate limiter: max 5 failed attempts per 15 minutes per IP
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function loginAdminAction(password: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!password || typeof password !== "string") {
    return { success: false, error: "Password is required." };
  }

  let clientKey = "global_admin";
  try {
    const hdrs = await headers();
    const forwarded = hdrs.get("x-forwarded-for");
    clientKey = forwarded ? forwarded.split(",")[0].trim() : hdrs.get("x-real-ip") || "global_admin";
  } catch {}

  const now = Date.now();
  const record = loginAttempts.get(clientKey);
  if (record && record.lockUntil > now) {
    const remainingMins = Math.ceil((record.lockUntil - now) / 60000);
    return {
      success: false,
      error: `Too many failed attempts. Gateway locked for ${remainingMins} minute(s).`,
    };
  }

  const isValid = await verifyAdminPassword(password);
  if (!isValid) {
    const nextCount = record && record.lockUntil <= now ? 1 : (record?.count || 0) + 1;
    const lockUntil = nextCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0;
    loginAttempts.set(clientKey, { count: nextCount, lockUntil });

    if (lockUntil > 0) {
      return {
        success: false,
        error: "Maximum attempts exceeded. Gateway locked for 15 minutes.",
      };
    }

    return {
      success: false,
      error: `Incorrect password. (${MAX_ATTEMPTS - nextCount} attempt(s) remaining)`,
    };
  }

  loginAttempts.delete(clientKey);
  const token = await createAdminToken();
  await setAdminSessionCookie(token);

  return { success: true };
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  await clearAdminSessionCookie();
  revalidatePath("/admin");
  return { success: true };
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return { success: false, error: "Unauthorized. Please log in again." };
  }

  return await updateAdminPasswordInDB(currentPassword, newPassword);
}

export async function checkSessionAction(): Promise<{ authenticated: boolean }> {
  const authenticated = await isAuthenticatedAdmin();
  return { authenticated };
}
