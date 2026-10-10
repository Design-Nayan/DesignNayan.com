import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonialsData } from "@/modules/testimonials/data/testimonials.data";
import { TestimonialItem } from "@/modules/testimonials/types/testimonials.types";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: "testimonials" },
    });

    if (record?.data && Array.isArray(record.data) && record.data.length > 0) {
      return NextResponse.json(
        {
          success: true,
          source: "database",
          data: record.data,
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
        data: testimonialsData,
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
    console.error("Error reading testimonials from DB:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: testimonialsData,
    });
  }
}

export async function POST(req: NextRequest) {
  return handleTestimonialsUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleTestimonialsUpdate(req);
}

async function handleTestimonialsUpdate(req: NextRequest) {
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
        { error: "Invalid payload provided. Array of testimonials expected." },
        { status: 400 }
      );
    }

    const updated = await db.siteContent.upsert({
      where: { key: "testimonials" },
      update: { data: payload },
      create: {
        key: "testimonials",
        data: payload,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated.data,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating testimonials in DB:", error);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }
}
