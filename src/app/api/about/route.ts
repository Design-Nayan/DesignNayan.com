import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialAboutData } from "@/modules/about/data/about.data";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: "about_page" },
    });

    if (record?.data) {
      return NextResponse.json({
        success: true,
        source: "database",
        data: record.data,
      });
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      data: initialAboutData,
    });
  } catch (error) {
    console.error("Error reading about page from DB:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: initialAboutData,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid payload provided" },
        { status: 400 }
      );
    }

    const updated = await db.siteContent.upsert({
      where: { key: "about_page" },
      update: { data: payload },
      create: {
        key: "about_page",
        data: payload,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated.data,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating about page in DB:", error);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }
}
