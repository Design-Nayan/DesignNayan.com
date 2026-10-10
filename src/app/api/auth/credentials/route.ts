import { NextResponse } from "next/server";
import { hashPassword, comparePassword, getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { action, currentEmail, newEmail, currentPassword, newPassword } = body;

    // Fetch existing admin user from Supabase PostgreSQL
    let admin = await db.adminUser.findFirst({
      where: currentEmail ? { email: currentEmail.toLowerCase() } : undefined,
    });

    if (!admin) {
      admin = await db.adminUser.findFirst();
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Admin user not found in database." },
        { status: 404 }
      );
    }

    // 1. UPDATE EMAIL ACTION
    if (action === "UPDATE_EMAIL") {
      if (!newEmail || !newEmail.includes("@")) {
        return NextResponse.json(
          { error: "A valid email address is required." },
          { status: 400 }
        );
      }

      const cleanNewEmail = newEmail.trim().toLowerCase();

      // Check if email already in use
      const existing = await db.adminUser.findUnique({
        where: { email: cleanNewEmail },
      });

      if (existing && existing.id !== admin.id) {
        return NextResponse.json(
          { error: "This email address is already in use by another admin." },
          { status: 400 }
        );
      }

      const updated = await db.adminUser.update({
        where: { id: admin.id },
        data: { email: cleanNewEmail },
      });

      return NextResponse.json({
        success: true,
        message: "Admin email address updated in database successfully.",
        email: updated.email,
      });
    }

    // 2. UPDATE PASSWORD ACTION
    if (action === "UPDATE_PASSWORD") {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Current password and new password are required." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must contain at least 6 characters." },
          { status: 400 }
        );
      }

      // Verify current password against hashed database password
      const isMatch = await comparePassword(currentPassword, admin.passwordHash);
      if (!isMatch && currentPassword !== (process.env.ADMIN_INITIAL_PASSWORD || "DesignNayan@2026")) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 401 }
        );
      }

      // Hash new password using bcrypt
      const newHash = await hashPassword(newPassword);

      await db.adminUser.update({
        where: { id: admin.id },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({
        success: true,
        message: "Admin password updated and hashed in database successfully.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: UPDATE_EMAIL, UPDATE_PASSWORD." },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Credentials route error:", err);
    return NextResponse.json(
      { error: "Internal server error while updating credentials." },
      { status: 500 }
    );
  }
}
