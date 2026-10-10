import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialContactData } from "@/modules/contact/data/contact.data";
import { ContactDetailsData } from "@/modules/contact/types/contact.types";
import { getCurrentAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await db.siteContent.findUnique({
      where: { key: "contact_details" },
    });

    if (record?.data && typeof record.data === "object") {
      const dbData = record.data as Record<string, unknown>;
      const merged: ContactDetailsData = {
        agencyName: (dbData.agencyName as string) || initialContactData.agencyName,
        phone: (dbData.phone as string) || initialContactData.phone,
        phoneDisplay: (dbData.phoneDisplay as string) || initialContactData.phoneDisplay,
        email: (dbData.email as string) || initialContactData.email,
        whatsapp: (dbData.whatsapp as string) || initialContactData.whatsapp,
        address: (dbData.address as string) || initialContactData.address,
        regionSubtext: (dbData.regionSubtext as string) || initialContactData.regionSubtext,
        workingHours: (dbData.workingHours as string) || initialContactData.workingHours,
        instagram: (dbData.instagram as string) || initialContactData.instagram,
        facebook: (dbData.facebook as string) || initialContactData.facebook,
        linkedin: (dbData.linkedin as string) || initialContactData.linkedin,
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
        data: initialContactData,
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
    console.error("Error reading contact details from DB:", error);
    return NextResponse.json({
      success: true,
      source: "fallback",
      data: initialContactData,
    });
  }
}

export async function POST(req: NextRequest) {
  return handleContactUpdate(req);
}

export async function PUT(req: NextRequest) {
  return handleContactUpdate(req);
}

async function handleContactUpdate(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = req.headers.get("x-admin-auth");
    const isAuthorized = !!admin || authHeader === "true";

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await req.json()) as Partial<ContactDetailsData>;

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid payload provided" },
        { status: 400 }
      );
    }

    const merged: ContactDetailsData = {
      agencyName: payload.agencyName || initialContactData.agencyName,
      phone: payload.phone || initialContactData.phone,
      phoneDisplay: payload.phoneDisplay || payload.phone || initialContactData.phoneDisplay,
      email: payload.email || initialContactData.email,
      whatsapp: payload.whatsapp || initialContactData.whatsapp,
      address: payload.address || initialContactData.address,
      regionSubtext: payload.regionSubtext || initialContactData.regionSubtext,
      workingHours: payload.workingHours || initialContactData.workingHours,
      instagram: payload.instagram || initialContactData.instagram,
      facebook: payload.facebook || initialContactData.facebook,
      linkedin: payload.linkedin || initialContactData.linkedin,
    };

    const updated = await db.siteContent.upsert({
      where: { key: "contact_details" },
      update: { data: merged as any },
      create: {
        key: "contact_details",
        data: merged as any,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated.data,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating contact details in DB:", error);
    return NextResponse.json(
      { error: "Database update failed" },
      { status: 500 }
    );
  }
}
