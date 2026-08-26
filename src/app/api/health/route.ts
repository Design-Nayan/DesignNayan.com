import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    service: siteConfig.name,
  });
}
