import { supabasePublic, supabaseAdmin } from "./supabase";
import { Creator } from "@/modules/creators/creators.types";
import { ProjectItem } from "@/modules/projects/types/projects.types";
import { RentalProperty, StayProperty } from "@/modules/stay/types/stay.types";
import { StudioServiceDetail } from "@/modules/studio/types/studio.types";
import { BuildServiceDetail, MaterialCategory } from "@/modules/build/types/build.types";
import { TestimonialItem } from "@/modules/testimonials/types/testimonials.types";
import { PartnerBrand } from "@/modules/brands/types/brands.types";
import { AboutPageData } from "@/modules/about/types/about.types";
import { ContactDetailsData } from "@/modules/contact/types/contact.types";
import { IncomeRecord, IncomeAuditLog } from "@/app/admin/finances-shared";

// -------------------------------------------------------------
// CLIENT-SIDE REQUEST DEDUPLICATION & 60s TTL MEMORY CACHE
// Prevents duplicate queries on same-page components (e.g. Navbar + Footer)
// and cuts redundant Supabase reads during navigation by ~80%
// -------------------------------------------------------------
const CACHE_TTL_MS = 60_000;
const memoryCache = new Map<string, { data: any; timestamp: number; version: string }>();
const inFlightRequests = new Map<string, Promise<any>>();

function getCacheVersion(): string {
  if (typeof window === "undefined") return "server";
  try {
    return localStorage.getItem("dn_cache_version") || "v0";
  } catch {
    return "v0";
  }
}

export function bumpClientCacheVersion(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("dn_cache_version", String(Date.now()));
    memoryCache.clear();
  } catch {}
}

async function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // Always fetch fresh on the server
  if (typeof window === "undefined") {
    return fetcher();
  }

  const version = getCacheVersion();
  const cached = memoryCache.get(key);
  const now = Date.now();

  if (cached && cached.version === version && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  const existingInFlight = inFlightRequests.get(key);
  if (existingInFlight) {
    return existingInFlight as Promise<T>;
  }

  const requestPromise = fetcher()
    .then((result) => {
      if (result !== null) {
        memoryCache.set(key, { data: result, timestamp: Date.now(), version });
      }
      inFlightRequests.delete(key);
      return result;
    })
    .catch((err) => {
      inFlightRequests.delete(key);
      throw err;
    });

  inFlightRequests.set(key, requestPromise);
  return requestPromise;
}

// -------------------------------------------------------------
// 1. CREATORS
// -------------------------------------------------------------
export async function getCreatorsFromDB(): Promise<Creator[] | null> {
  return withCache("creators", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("creators")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) throw error;

      return data.map((r: any) => ({
      id: r.id,
      name: r.name,
      handle: r.handle,
      role: r.role,
      category: r.category,
      formats: r.formats || [],
      tier: r.tier,
      location: r.location,
      avatar: r.avatar,
      featuredImage: r.featured_image,
      secondaryImage: r.secondary_image,
      verified: r.verified ?? true,
      engagementRate: Number(r.engagement_rate) || 5.0,
      followersCount: r.followers_count,
      avgViews: r.avg_views,
      startingRate: r.starting_rate,
      turnaroundDays: r.turnaround_days || 3,
      bio: r.bio || "",
      pastBrands: r.past_brands || [],
      tags: r.tags || [],
      demographics: r.demographics || { topLocations: [], ageGroup: "", genderSplit: "" },
      caseStudies: r.case_studies || [],
      packages: r.packages || [],
      videoPreviewUrl: r.video_preview_url || undefined,
      featuredInHero: r.featured_in_hero ?? false,
    }));
    } catch (err) {
      console.error("Error fetching creators:", err);
      return null;
    }
  });
}

export async function upsertCreatorInDB(creator: Creator): Promise<boolean> {
  try {
    const row = {
      id: creator.id,
      name: creator.name,
      handle: creator.handle,
      role: creator.role,
      category: creator.category,
      formats: creator.formats,
      tier: creator.tier,
      location: creator.location,
      avatar: creator.avatar,
      featured_image: creator.featuredImage,
      secondary_image: creator.secondaryImage || creator.avatar,
      verified: creator.verified,
      engagement_rate: creator.engagementRate,
      followers_count: creator.followersCount,
      avg_views: creator.avgViews,
      starting_rate: creator.startingRate,
      turnaround_days: creator.turnaroundDays,
      bio: creator.bio,
      past_brands: creator.pastBrands,
      tags: creator.tags,
      demographics: creator.demographics,
      case_studies: creator.caseStudies,
      packages: creator.packages,
      video_preview_url: creator.videoPreviewUrl || null,
      featured_in_hero: creator.featuredInHero || false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("creators").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting creator in DB:", err);
    return false;
  }
}

export async function deleteCreatorFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("creators").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting creator from DB:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. PROJECTS (PORTFOLIO)
// -------------------------------------------------------------
export async function getProjectsFromDB(): Promise<ProjectItem[] | null> {
  return withCache("projects", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) throw error;

      return data.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        location: r.location,
        categoryTag: r.category_tag,
        image: r.image,
        href: r.href || `/portfolio/${r.slug}`,
        year: r.year,
        area: r.area,
        client: r.client,
        overview: r.overview,
        highlights: r.highlights || [],
        gallery: r.gallery || [],
      }));
    } catch (err) {
      console.error("Error fetching projects:", err);
      return null;
    }
  });
}

export async function upsertProjectInDB(project: ProjectItem): Promise<boolean> {
  try {
    const row = {
      id: project.id,
      slug: project.slug,
      title: project.title,
      location: project.location,
      category_tag: project.categoryTag,
      image: project.image,
      href: project.href || `/portfolio/${project.slug}`,
      year: project.year,
      area: project.area,
      client: project.client,
      overview: project.overview,
      highlights: project.highlights || [],
      gallery: project.gallery || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("projects").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting project in DB:", err);
    return false;
  }
}

export async function deleteProjectFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting project from DB:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 3. STAY RENTALS & HOTELS
// -------------------------------------------------------------
export async function getStayRentalsFromDB(): Promise<RentalProperty[] | null> {
  return withCache("stay_rentals", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("stay_rentals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) throw error;

      return data.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        locality: r.locality,
        city: r.city,
        propertyType: r.property_type,
        monthlyRent: Number(r.monthly_rent),
        securityDeposit: Number(r.security_deposit),
        carpetAreaSqFt: Number(r.carpet_area_sqft),
        bedrooms: Number(r.bedrooms),
        bathrooms: Number(r.bathrooms),
        furnishing: r.furnishing,
        image: r.image,
        amenities: r.amenities || [],
        description: r.description || "",
      }));
    } catch (err) {
      console.error("Error fetching rentals:", err);
      return null;
    }
  });
}

export async function upsertStayRentalInDB(rental: RentalProperty): Promise<boolean> {
  try {
    const row = {
      id: rental.id,
      slug: rental.slug,
      title: rental.title,
      locality: rental.locality,
      city: rental.city,
      property_type: rental.propertyType,
      monthly_rent: rental.monthlyRent,
      security_deposit: rental.securityDeposit,
      carpet_area_sqft: rental.carpetAreaSqFt,
      bedrooms: rental.bedrooms,
      bathrooms: rental.bathrooms,
      furnishing: rental.furnishing,
      image: rental.image,
      amenities: rental.amenities,
      description: rental.description,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("stay_rentals").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting rental in DB:", err);
    return false;
  }
}

export async function deleteStayRentalFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("stay_rentals").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting rental from DB:", err);
    return false;
  }
}

export async function getStayHotelsFromDB(): Promise<StayProperty[] | null> {
  return withCache("stay_hotels", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("stay_hotels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) throw error;

      return data.map((h: any) => ({
        id: h.id,
        slug: h.slug,
        title: h.title,
        location: h.location,
        city: h.city,
        category: h.category,
        pricePerNight: Number(h.price_per_night),
        rating: Number(h.rating) || 4.8,
        reviewsCount: Number(h.reviews_count) || 0,
        image: h.image,
        tag: h.tag || "",
        guests: Number(h.guests) || 2,
        bedrooms: Number(h.bedrooms) || 1,
        bathrooms: Number(h.bathrooms) || 1,
        amenities: h.amenities || [],
        description: h.description || "",
      }));
    } catch (err) {
      console.error("Error fetching hotels:", err);
      return null;
    }
  });
}

export async function upsertStayHotelInDB(hotel: StayProperty): Promise<boolean> {
  try {
    const row = {
      id: hotel.id,
      slug: hotel.slug,
      title: hotel.title,
      location: hotel.location,
      city: hotel.city,
      category: hotel.category,
      price_per_night: hotel.pricePerNight,
      rating: hotel.rating,
      reviews_count: hotel.reviewsCount,
      image: hotel.image,
      tag: hotel.tag,
      guests: hotel.guests,
      bedrooms: hotel.bedrooms,
      bathrooms: hotel.bathrooms,
      amenities: hotel.amenities,
      description: hotel.description,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("stay_hotels").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting hotel in DB:", err);
    return false;
  }
}

export async function deleteStayHotelFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("stay_hotels").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting hotel from DB:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 4. STUDIO SERVICES & BUILD SERVICES
// -------------------------------------------------------------
export async function getStudioServicesFromDB(): Promise<StudioServiceDetail[] | null> {
  return withCache("studio_services", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("studio_services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data) throw error;

      return data.map((s: any) => ({
        id: s.id,
        title: s.title,
        category: s.category,
        badge: s.badge || "",
        description: s.description,
        iconName: s.icon_name,
        deliverables: s.deliverables || [],
        specs: s.specs || [],
        priceGuide: s.price_guide,
        turnaround: s.turnaround,
        popular: s.popular ?? false,
      }));
    } catch (err) {
      console.error("Error fetching studio services:", err);
      return null;
    }
  });
}

export async function upsertStudioServiceInDB(service: StudioServiceDetail, order = 0): Promise<boolean> {
  try {
    const row = {
      id: service.id,
      title: service.title,
      category: service.category,
      badge: service.badge,
      description: service.description,
      icon_name: service.iconName,
      deliverables: service.deliverables,
      specs: service.specs,
      price_guide: service.priceGuide,
      turnaround: service.turnaround,
      popular: service.popular || false,
      display_order: order,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("studio_services").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting studio service:", err);
    return false;
  }
}

export async function deleteStudioServiceFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("studio_services").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting studio service:", err);
    return false;
  }
}

export async function getBuildServicesFromDB(): Promise<BuildServiceDetail[] | null> {
  return withCache("build_services", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("build_services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data) throw error;

      return data.map((b: any) => ({
        id: b.id,
        title: b.title,
        badge: b.badge || "",
        description: b.description,
        iconName: b.icon_name,
        deliverables: b.deliverables || [],
        specs: b.specs || [],
        priceGuide: b.price_guide,
        turnaround: b.turnaround,
        popular: b.popular ?? false,
      }));
    } catch (err) {
      console.error("Error fetching build services:", err);
      return null;
    }
  });
}

export async function upsertBuildServiceInDB(service: BuildServiceDetail, order = 0): Promise<boolean> {
  try {
    const row = {
      id: service.id,
      title: service.title,
      badge: service.badge,
      description: service.description,
      icon_name: service.iconName,
      deliverables: service.deliverables,
      specs: service.specs,
      price_guide: service.priceGuide,
      turnaround: service.turnaround,
      popular: service.popular || false,
      display_order: order,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("build_services").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting build service:", err);
    return false;
  }
}

export async function deleteBuildServiceFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("build_services").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting build service:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 5. BUILDING MATERIALS
// -------------------------------------------------------------
export async function getMaterialsFromDB(): Promise<MaterialCategory[] | null> {
  return withCache("materials", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("building_materials")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data) throw error;

      return data.map((m: any) => ({
        category: m.category,
        brands: m.brands || [],
        desc: m.description,
        badge: m.badge || "",
      }));
    } catch (err) {
      console.error("Error fetching materials:", err);
      return null;
    }
  });
}

export async function saveAllMaterialsInDB(materials: MaterialCategory[]): Promise<boolean> {
  try {
    await supabaseAdmin.from("building_materials").delete().neq("id", "none");
    const rows = materials.map((m, idx) => ({
      id: `mat_${idx + 1}`,
      category: m.category,
      brands: m.brands,
      description: m.desc,
      badge: m.badge,
      display_order: idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin.from("building_materials").insert(rows);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error saving materials:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 6. TESTIMONIALS & PARTNER BRANDS
// -------------------------------------------------------------
export async function getTestimonialsFromDB(): Promise<TestimonialItem[] | null> {
  return withCache("testimonials", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) throw error;

      return data.map((t: any) => ({
        id: t.id,
        quote: t.quote,
        name: t.name,
        role: t.role,
        rating: t.rating || 5,
        avatar: t.avatar,
      }));
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      return null;
    }
  });
}

export async function upsertTestimonialInDB(testimonial: TestimonialItem): Promise<boolean> {
  try {
    const row = {
      id: testimonial.id,
      quote: testimonial.quote,
      name: testimonial.name,
      role: testimonial.role,
      rating: testimonial.rating || 5,
      avatar: testimonial.avatar,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseAdmin.from("testimonials").upsert(row);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error upserting testimonial:", err);
    return false;
  }
}

export async function deleteTestimonialFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    return false;
  }
}

export async function getPartnerBrandsFromDB(): Promise<PartnerBrand[] | null> {
  return withCache("partner_brands", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("partner_brands")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data) throw error;

      return data.map((b: any) => ({
        id: b.id,
        name: b.name,
        category: b.category,
      }));
    } catch (err) {
      console.error("Error fetching partner brands:", err);
      return null;
    }
  });
}

export async function saveAllPartnerBrandsInDB(brands: PartnerBrand[]): Promise<boolean> {
  try {
    await supabaseAdmin.from("partner_brands").delete().neq("id", "none");
    const rows = brands.map((b, idx) => ({
      id: b.id || `brand_${idx + 1}`,
      name: b.name,
      category: b.category,
      display_order: idx,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin.from("partner_brands").insert(rows);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error saving partner brands:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 7. SITE SETTINGS (ABOUT, CONTACT DETAILS & TOP CREATORS)
// -------------------------------------------------------------
export async function getSiteSettingsFromDB(): Promise<{
  contact: ContactDetailsData | null;
  about: AboutPageData | null;
  topCreatorIds?: string[] | null;
}> {
  return withCache("site_settings", async () => {
    try {
      const { data, error } = await supabasePublic
        .from("site_settings")
        .select("*")
        .eq("id", "primary")
        .single();

      if (error || !data) throw error;
      return {
        contact: data.contact_data || null,
        about: data.about_data || null,
        topCreatorIds: Array.isArray(data.top_creator_ids) ? data.top_creator_ids : null,
      };
    } catch (err) {
      console.error("Error fetching site settings:", err);
      return { contact: null, about: null, topCreatorIds: null };
    }
  });
}

export async function updateContactDetailsInDB(contact: ContactDetailsData): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        contact_data: contact,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "primary");
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating contact details:", err);
    return false;
  }
}

export async function updateAboutContentInDB(about: AboutPageData): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        about_data: about,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "primary");
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating about content:", err);
    return false;
  }
}

export async function updateTopCreatorsInDB(topCreatorIds: string[]): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        top_creator_ids: topCreatorIds.slice(0, 5),
        updated_at: new Date().toISOString(),
      })
      .eq("id", "primary");
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating top creators:", err);
    return false;
  }
}

// -------------------------------------------------------------
// 8. INQUIRIES & FINANCES
// -------------------------------------------------------------
export async function getInquiriesFromDB(): Promise<any[] | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) throw error;
    return data.map((r: any) => ({
      id: r.id,
      name: r.name || "Unknown",
      phone: r.phone || "Not provided",
      email: r.email || "",
      service: r.service || "General Inquiry",
      budget: r.budget || "Not specified",
      message: r.message || "",
      location: r.location || "Assam / Online",
      status: r.status || "NEW",
      date:
        r.date ||
        (r.created_at
          ? new Date(r.created_at).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Recent"),
    }));
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    return null;
  }
}

export async function createInquiryInDB(inq: any): Promise<boolean> {
  try {
    const { error } = await supabasePublic.from("inquiries").insert({
      id: inq.id || `inq_${Date.now()}`,
      name: inq.name,
      phone: inq.phone || null,
      email: inq.email || null,
      service: inq.service,
      budget: inq.budget || null,
      message: inq.message || null,
      location: inq.location || null,
      status: inq.status || "NEW",
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error inserting inquiry:", err);
    return false;
  }
}

export async function updateInquiryStatusInDB(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("inquiries").update({ status }).eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error updating inquiry status:", err);
    return false;
  }
}

export async function deleteInquiryFromDB(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("inquiries").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    return false;
  }
}

export async function getFinancesFromDB(): Promise<{
  records: IncomeRecord[];
  logs: IncomeAuditLog[];
} | null> {
  try {
    const [recordsRes, logsRes] = await Promise.all([
      supabaseAdmin.from("financial_records").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("financial_logs").select("*").order("iso_date", { ascending: false }),
    ]);

    const records: IncomeRecord[] = (recordsRes.data || []).map((r: any) => ({
      id: r.id,
      amount: Number(r.amount),
      totalAmount: Number(r.total_amount),
      pendingAmount: Number(r.pending_amount),
      paymentStatus: r.payment_status,
      dueDate: r.due_date || undefined,
      category: r.category,
      clientName: r.client_name,
      clientPhone: r.client_phone || undefined,
      projectDetails: r.project_details,
      date: r.date,
      paymentMethod: r.payment_method,
      createdAt: r.created_at,
    }));

    const logs: IncomeAuditLog[] = (logsRes.data || []).map((l: any) => ({
      id: l.id,
      action: l.action,
      description: l.description,
      timestamp: l.timestamp,
      isoDate: l.iso_date,
    }));

    return { records, logs };
  } catch (err) {
    console.error("Error fetching finances:", err);
    return null;
  }
}

export async function upsertFinancialRecordInDB(record: IncomeRecord, log?: IncomeAuditLog): Promise<boolean> {
  try {
    const row = {
      id: record.id,
      amount: record.amount,
      total_amount: record.totalAmount,
      pending_amount: record.pendingAmount,
      payment_status: record.paymentStatus,
      due_date: record.dueDate || null,
      category: record.category,
      client_name: record.clientName,
      client_phone: record.clientPhone || null,
      project_details: record.projectDetails,
      date: record.date,
      payment_method: record.paymentMethod,
    };

    await supabaseAdmin.from("financial_records").upsert(row);

    if (log) {
      await supabaseAdmin.from("financial_logs").insert({
        id: log.id,
        action: log.action,
        description: log.description,
        timestamp: log.timestamp,
        iso_date: log.isoDate || new Date().toISOString(),
      });
    }

    return true;
  } catch (err) {
    console.error("Error upserting financial record:", err);
    return false;
  }
}

export async function deleteFinancialRecordInDB(id: string, log?: IncomeAuditLog): Promise<boolean> {
  try {
    await supabaseAdmin.from("financial_records").delete().eq("id", id);
    if (log) {
      await supabaseAdmin.from("financial_logs").insert({
        id: log.id,
        action: log.action,
        description: log.description,
        timestamp: log.timestamp,
        iso_date: log.isoDate || new Date().toISOString(),
      });
    }
    return true;
  } catch (err) {
    console.error("Error deleting financial record:", err);
    return false;
  }
}
