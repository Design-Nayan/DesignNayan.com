import { NextResponse } from "next/server";
import {
  comparePassword,
  signAdminToken,
  SECURE_COOKIE_OPTIONS,
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Check if database has matching admin user
    let admin = null;
    try {
      admin = await db.adminUser.findUnique({
        where: { email: cleanEmail },
      });
    } catch {
      // If DB is offline or not yet migrated, we check initial environment admin
    }

    // 2. Fallback check for initial setup bootstrapping (from process.env)
    const initialEmail = (
      process.env.ADMIN_INITIAL_EMAIL || "admin@designnayan.com"
    ).toLowerCase();
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "DesignNayan@2026";

    let isValid = false;
    let adminPayload = {
      adminId: "initial_superadmin",
      email: cleanEmail,
      role: "SUPERADMIN",
      name: "Agency Director",
    };

    if (admin) {
      isValid = await comparePassword(password, admin.passwordHash);
      if (isValid) {
        adminPayload = {
          adminId: admin.id,
          email: admin.email,
          role: admin.role,
          name: admin.name || "Agency Director",
        };

        // Update last login timestamp asynchronously
        db.adminUser
          .update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          })
          .catch(() => {});
      }
    } else if (cleanEmail === initialEmail && password === initialPassword) {
      // Validated via initial bootstrapping credentials
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    // 3. Issue cryptographically signed session token
    const token = await signAdminToken(adminPayload);

    const response = NextResponse.json({
      success: true,
      user: {
        email: adminPayload.email,
        name: adminPayload.name,
        role: adminPayload.role,
      },
    });

    // 4. Set HttpOnly cookie
    response.cookies.set({
      ...SECURE_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
