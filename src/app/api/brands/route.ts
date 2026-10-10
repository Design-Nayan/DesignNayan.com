import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partnerBrandsData } from "@/modules/brands/data/brands.data";
import { PartnerBrand } from "@/modules/brands/types/brands.types";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: "partner_brands" },
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
        data: partnerBrandsData,
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
    console.error("Error reading partner brands from DB:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: partnerBrandsData,
    });
  }
}

export async function POST(req: NextRequest) {
  return handleBrandsUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleBrandsUpdate(req);
}

async function handleBrandsUpdate(req: NextRequest) {
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
        { error: "Invalid payload provided. Array of partner brands expected." },
        { status: 400 }
      );
    }

    const updated = await db.siteContent.upsert({
      where: { key: "partner_brands" },
      update: { data: payload },
      create: {
        key: "partner_brands",
        data: payload,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated.data,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating partner brands in DB:", error);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }
}
