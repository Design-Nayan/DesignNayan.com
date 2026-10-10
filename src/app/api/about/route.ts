import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialAboutData } from "@/modules/about/data/about.data";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: "about_page" },
    });

    if (record?.data && typeof record.data === "object") {
      const dbData = record.data as Record<string, unknown>;
      const merged = {
        ...initialAboutData,
        ...dbData,
        stats: Array.isArray(dbData.stats) && dbData.stats.length > 0 ? dbData.stats : initialAboutData.stats,
        philosophyHighlights: Array.isArray(dbData.philosophyHighlights) && dbData.philosophyHighlights.length > 0 ? dbData.philosophyHighlights : initialAboutData.philosophyHighlights,
        processSteps: Array.isArray(dbData.processSteps) && dbData.processSteps.length > 0 ? dbData.processSteps : initialAboutData.processSteps,
      };

      return NextResponse.json(
        {
          success: true,
          source: "database",
          data: merged,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: "fallback",
        data: initialAboutData,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error reading about page from DB:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: initialAboutData,
    });
  }
}

export async function POST(req: NextRequest) {
  return handleAboutUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleAboutUpdate(req);
}

async function handleAboutUpdate(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = req.headers.get("x-admin-auth");
    const isAuthorized = !!admin || authHeader === "true";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid payload provided" },
        { status: 400 }
      );
    }

    const merged = {
      ...initialAboutData,
      ...payload,
    };

    const updated = await db.siteContent.upsert({
      where: { key: "about_page" },
      update: { data: merged },
      create: {
        key: "about_page",
        data: merged,
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
