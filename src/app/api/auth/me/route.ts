import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.adminId,
      email: session.email,
      role: session.role,
      name: session.name,
    },
  });
}
