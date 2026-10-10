import { NextResponse } from "next/server";
import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || "director@designnayan.com";
    const issuer = "Design Nayan";

    // 1. Generate an RFC 6238 Base32 secret using otplib v13
    const secret = generateSecret();

    // 2. Generate standard otpauth URI compatible with Google Authenticator, Microsoft Authenticator & Apple Keychain
    const otpauth = generateURI({
      issuer,
      label: email,
      secret,
    });

    // 3. Generate QR code data URL (image/png;base64)
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth, {
      margin: 2,
      width: 240,
      color: {
        dark: "#1c1917",
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      success: true,
      secret,
      qrCodeDataUrl,
      otpauth,
    });
  } catch (err: any) {
    console.error("2FA generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate 2FA credentials" },
      { status: 500 }
    );
  }
}
