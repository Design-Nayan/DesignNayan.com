import { NextResponse } from "next/server";
import { verifySync } from "otplib";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, secret, backupCodes } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required." },
        { status: 400 }
      );
    }

    const cleanToken = String(token).trim();

    // 1. Check backup codes first if provided
    if (Array.isArray(backupCodes) && backupCodes.length > 0) {
      const isBackupMatch = backupCodes.some(
        (code: string) =>
          code.replace(/[-\s]/g, "").toLowerCase() === cleanToken.replace(/[-\s]/g, "").toLowerCase()
      );
      if (isBackupMatch) {
        return NextResponse.json({
          success: true,
          method: "backup_code",
          message: "Emergency recovery code verified successfully.",
        });
      }
    }

    // 2. Verify 6-digit TOTP token against secret
    if (!secret) {
      return NextResponse.json(
        { error: "Secret key is required for TOTP verification." },
        { status: 400 }
      );
    }

    // Verify token using otplib v13 verifySync
    const result = verifySync({
      token: cleanToken,
      secret: String(secret).trim(),
    });

    if (!result || !result.valid) {
      return NextResponse.json(
        { error: "Invalid 6-digit verification code. Please check your authenticator app and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      method: "totp",
      message: "Authenticator code verified successfully.",
    });
  } catch (err: any) {
    console.error("2FA verify error:", err);
    return NextResponse.json(
      { error: "Failed to verify 2FA code." },
      { status: 500 }
    );
  }
}
