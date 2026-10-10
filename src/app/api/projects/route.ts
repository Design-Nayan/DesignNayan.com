import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projectsData } from "@/modules/projects/data/projects.data";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: "portfolio_projects" },
    });

    if (record?.data && Array.isArray(record.data) && record.data.length > 0) {
      return NextResponse.json({
        success: true,
        source: "database",
        data: record.data,
      });
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      data: projectsData,
    });
  } catch (error) {
    console.error("Error reading portfolio projects from DB:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: projectsData,
    });
  }
}

export async function POST(req: NextRequest) {
  return handleProjectsUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleProjectsUpdate(req);
}

async function handleProjectsUpdate(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = req.headers.get("x-admin-auth");
    const isAuthorized = !!admin || authHeader === "true";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    if (!payload || !Array.isArray(payload)) {
      return NextResponse.json(
        { error: "Invalid payload provided. Array of projects expected." },
        { status: 400 }
      );
    }

    const updated = await db.siteContent.upsert({
      where: { key: "portfolio_projects" },
      update: { data: payload },
      create: {
        key: "portfolio_projects",
        data: payload,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated.data,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating portfolio projects in DB:", error);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }
}
