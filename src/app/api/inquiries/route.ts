import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

// Public POST: Anyone can submit an inquiry / lead
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, serviceRequested, budget, budgetRange, message, location } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const inquiry = await db.inquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        service: service || serviceRequested || "General Inquiry",
        budget: budget || budgetRange || null,
        message: message ? String(message).trim() : null,
        location: location ? String(location).trim() : "India",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

// Protected GET: Authenticated admins can fetch full lead list
export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    const authHeader = request.headers.get("x-admin-auth");
    if (!admin && authHeader !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, inquiries },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries.", inquiries: [] },
      { status: 200 }
    );
  }
}
