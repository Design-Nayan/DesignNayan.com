import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

// Public GET: Retrieve active creators from PostgreSQL
export async function GET() {
  try {
    const creators = await db.creator.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, creators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return NextResponse.json(
      { error: "Failed to fetch creators." },
      { status: 500 }
    );
  }
}

// Protected POST: Create or update creator in PostgreSQL
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      handle,
      role,
      category,
      formats,
      tier,
      location,
      avatar,
      featuredImage,
      secondaryImage,
      startingRate,
      turnaroundDays,
      bio,
      pastBrands,
      tags,
      demographics,
      caseStudies,
      packages,
      verified,
      featuredInHero,
    } = body;

    const creatorId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const creator = await db.creator.upsert({
      where: { id: creatorId },
      update: {
        name,
        handle,
        role,
        category,
        formats: formats || [],
        tier,
        location,
        avatar,
        featuredImage,
        secondaryImage: secondaryImage || null,
        startingRate: startingRate || "₹15,000",
        turnaroundDays: Number(turnaroundDays) || 3,
        bio: bio || "",
        pastBrands: pastBrands || [],
        tags: tags || [],
        demographics: demographics ?? undefined,
        caseStudies: caseStudies ?? undefined,
        packages: packages ?? undefined,
        verified: !!verified,
        featuredInHero: !!featuredInHero,
        isActive: true,
      },
      create: {
        id: creatorId,
        name,
        handle,
        role,
        category,
        formats: formats || [],
        tier,
        location,
        avatar,
        featuredImage,
        secondaryImage: secondaryImage || null,
        startingRate: startingRate || "₹15,000",
        turnaroundDays: Number(turnaroundDays) || 3,
        bio: bio || "",
        pastBrands: pastBrands || [],
        tags: tags || [],
        demographics: demographics ?? undefined,
        caseStudies: caseStudies ?? undefined,
        packages: packages ?? undefined,
        verified: !!verified,
        featuredInHero: !!featuredInHero,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, creator }, { status: 200 });
  } catch (error) {
    console.error("Error saving creator:", error);
    return NextResponse.json(
      { error: "Failed to save creator." },
      { status: 500 }
    );
  }
}
