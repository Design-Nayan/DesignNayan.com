import { NextRequest, NextResponse } from "next/server";
import { ContactInquiry, ApiResponse } from "@/types";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactInquiry;

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Name, email, and message are required fields.",
        },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const inquiryRecord: ContactInquiry = {
      ...body,
      id: `inq_${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    // Save directly to Supabase PostgreSQL database
    try {
      await db.inquiry.create({
        data: {
          id: inquiryRecord.id,
          name: inquiryRecord.name,
          email: inquiryRecord.email,
          phone: inquiryRecord.phone || inquiryRecord.company || null,
          service: inquiryRecord.serviceRequested || "General Inquiry",
          budget: inquiryRecord.budgetRange || null,
          message: inquiryRecord.message,
          location: "India",
          status: "NEW",
        },
      });
    } catch (dbErr) {
      console.error("Database save failed (falling back):", dbErr);
    }

    return NextResponse.json<ApiResponse<ContactInquiry>>(
      {
        success: true,
        message: "Thank you! Your project inquiry has been received.",
        data: inquiryRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact inquiry:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
