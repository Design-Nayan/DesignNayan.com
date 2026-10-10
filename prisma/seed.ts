import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CREATORS_DATA } from "../src/modules/creators/data/creators.data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Design Nayan database seed...");

  // 1. Seed Initial Superadmin Account
  const adminEmail = (process.env.ADMIN_INITIAL_EMAIL || "admin@designnayan.com").toLowerCase();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "DesignNayan@2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Agency Director",
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log(`✅ Superadmin created/verified: ${admin.email}`);

  // 2. Seed Master Creators
  console.log(`🌱 Seeding ${CREATORS_DATA.length} master creators...`);
  for (const c of CREATORS_DATA) {
    await prisma.creator.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        handle: c.handle,
        role: c.role,
        category: c.category,
        formats: c.formats,
        tier: c.tier,
        location: c.location,
        avatar: c.avatar,
        featuredImage: c.featuredImage,
        secondaryImage: c.secondaryImage || null,
        startingRate: c.startingRate,
        turnaroundDays: c.turnaroundDays,
        bio: c.bio,
        pastBrands: c.pastBrands,
        tags: c.tags,
        demographics: c.demographics ? JSON.parse(JSON.stringify(c.demographics)) : undefined,
        caseStudies: c.caseStudies ? JSON.parse(JSON.stringify(c.caseStudies)) : undefined,
        packages: c.packages ? JSON.parse(JSON.stringify(c.packages)) : undefined,
        verified: c.verified,
        featuredInHero: !!c.featuredInHero,
        isActive: true,
      },
      create: {
        id: c.id,
        name: c.name,
        handle: c.handle,
        role: c.role,
        category: c.category,
        formats: c.formats,
        tier: c.tier,
        location: c.location,
        avatar: c.avatar,
        featuredImage: c.featuredImage,
        secondaryImage: c.secondaryImage || null,
        startingRate: c.startingRate,
        turnaroundDays: c.turnaroundDays,
        bio: c.bio,
        pastBrands: c.pastBrands,
        tags: c.tags,
        demographics: c.demographics ? JSON.parse(JSON.stringify(c.demographics)) : undefined,
        caseStudies: c.caseStudies ? JSON.parse(JSON.stringify(c.caseStudies)) : undefined,
        packages: c.packages ? JSON.parse(JSON.stringify(c.packages)) : undefined,
        verified: c.verified,
        featuredInHero: !!c.featuredInHero,
        isActive: true,
      },
    });
  }
  console.log("✅ Master creators synced to PostgreSQL.");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
