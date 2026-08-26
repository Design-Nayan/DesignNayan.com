import { NextRequest, NextResponse } from "next/server";
import { ContactInquiry, ApiResponse } from "@/types";

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

    // Note: Ready for database integration (Prisma / Drizzle / Supabase / MongoDB)

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
