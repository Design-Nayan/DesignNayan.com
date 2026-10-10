import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { studioServicesData } from "@/modules/studio/data/studio.data";
import { buildServicesData } from "@/modules/build/data/build.data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [studioRecord, buildRecord] = await Promise.all([
      db.siteContent.findUnique({ where: { key: "studio_services" } }),
      db.siteContent.findUnique({ where: { key: "build_services" } }),
    ]);

    const studio =
      studioRecord?.data && Array.isArray(studioRecord.data) && studioRecord.data.length > 0
        ? studioRecord.data
        : studioServicesData;

    const build =
      buildRecord?.data && Array.isArray(buildRecord.data) && buildRecord.data.length > 0
        ? buildRecord.data
        : buildServicesData;

    return NextResponse.json(
      {
        success: true,
        studio,
        build,
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
    console.error("Error reading services from DB:", error);
    return NextResponse.json({
      success: true,
      studio: studioServicesData,
      build: buildServicesData,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = req.headers.get("x-admin-auth");
    const isAuthorized = !!admin || authHeader === "true";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (payload.studio && Array.isArray(payload.studio)) {
      await db.siteContent.upsert({
        where: { key: "studio_services" },
        update: { data: payload.studio },
        create: {
          key: "studio_services",
          data: payload.studio,
        },
      });
    }

    if (payload.build && Array.isArray(payload.build)) {
      await db.siteContent.upsert({
        where: { key: "build_services" },
        update: { data: payload.build },
        create: {
          key: "build_services",
          data: payload.build,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving services to DB:", error);
    return NextResponse.json(
      { error: "Failed to update services" },
      { status: 500 }
    );
  }
}
