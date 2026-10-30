"use server";

import { isAuthenticatedAdmin } from "./server-auth";
import {
  upsertCreatorInDB,
  deleteCreatorFromDB,
  upsertProjectInDB,
  deleteProjectFromDB,
  upsertStayRentalInDB,
  deleteStayRentalFromDB,
  upsertStayHotelInDB,
  deleteStayHotelFromDB,
  upsertStudioServiceInDB,
  deleteStudioServiceFromDB,
  upsertBuildServiceInDB,
  deleteBuildServiceFromDB,
  saveAllMaterialsInDB,
  upsertTestimonialInDB,
  deleteTestimonialFromDB,
  saveAllPartnerBrandsInDB,
  updateContactDetailsInDB,
  updateAboutContentInDB,
  updateTopCreatorsInDB,
  getInquiriesFromDB,
  getFinancesFromDB,
  upsertFinancialRecordInDB,
  deleteFinancialRecordInDB,
  updateInquiryStatusInDB,
  deleteInquiryFromDB,
} from "./db-service";
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

async function verifyAuth() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized admin access");
  }
}

// 1. Creators
export async function serverUpsertCreator(creator: Creator): Promise<boolean> {
  await verifyAuth();
  return await upsertCreatorInDB(creator);
}

export async function serverDeleteCreator(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteCreatorFromDB(id);
}

// 2. Projects
export async function serverUpsertProject(project: ProjectItem): Promise<boolean> {
  await verifyAuth();
  return await upsertProjectInDB(project);
}

export async function serverDeleteProject(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteProjectFromDB(id);
}

// 3. Stays
export async function serverUpsertStayRental(rental: RentalProperty): Promise<boolean> {
  await verifyAuth();
  return await upsertStayRentalInDB(rental);
}

export async function serverDeleteStayRental(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteStayRentalFromDB(id);
}

export async function serverUpsertStayHotel(hotel: StayProperty): Promise<boolean> {
  await verifyAuth();
  return await upsertStayHotelInDB(hotel);
}

export async function serverDeleteStayHotel(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteStayHotelFromDB(id);
}

// 4. Studio & Build Services
export async function serverUpsertStudioService(service: StudioServiceDetail, order = 0): Promise<boolean> {
  await verifyAuth();
  return await upsertStudioServiceInDB(service, order);
}

export async function serverDeleteStudioService(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteStudioServiceFromDB(id);
}

export async function serverUpsertBuildService(service: BuildServiceDetail, order = 0): Promise<boolean> {
  await verifyAuth();
  return await upsertBuildServiceInDB(service, order);
}

export async function serverDeleteBuildService(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteBuildServiceFromDB(id);
}

// 5. Materials
export async function serverSaveAllMaterials(materials: MaterialCategory[]): Promise<boolean> {
  await verifyAuth();
  return await saveAllMaterialsInDB(materials);
}

// 6. Testimonials & Brands
export async function serverUpsertTestimonial(testimonial: TestimonialItem): Promise<boolean> {
  await verifyAuth();
  return await upsertTestimonialInDB(testimonial);
}

export async function serverDeleteTestimonial(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteTestimonialFromDB(id);
}

export async function serverSaveAllPartnerBrands(brands: PartnerBrand[]): Promise<boolean> {
  await verifyAuth();
  return await saveAllPartnerBrandsInDB(brands);
}

// 7. Site Settings
export async function serverUpdateContactDetails(contact: ContactDetailsData): Promise<boolean> {
  await verifyAuth();
  return await updateContactDetailsInDB(contact);
}

export async function serverUpdateAboutContent(about: AboutPageData): Promise<boolean> {
  await verifyAuth();
  return await updateAboutContentInDB(about);
}

export async function serverUpdateTopCreators(ids: string[]): Promise<boolean> {
  await verifyAuth();
  return await updateTopCreatorsInDB(ids);
}

// 8. Inquiries & Finances
export async function serverGetInquiries(): Promise<any[] | null> {
  await verifyAuth();
  return await getInquiriesFromDB();
}

export async function serverUpdateInquiryStatus(id: string, status: string): Promise<boolean> {
  await verifyAuth();
  return await updateInquiryStatusInDB(id, status);
}

export async function serverDeleteInquiry(id: string): Promise<boolean> {
  await verifyAuth();
  return await deleteInquiryFromDB(id);
}

export async function serverGetFinances(): Promise<{
  records: IncomeRecord[];
  logs: IncomeAuditLog[];
} | null> {
  await verifyAuth();
  return await getFinancesFromDB();
}

export async function serverUpsertFinancialRecord(record: IncomeRecord, log?: IncomeAuditLog): Promise<boolean> {
  await verifyAuth();
  return await upsertFinancialRecordInDB(record, log);
}

export async function serverDeleteFinancialRecord(id: string, log?: IncomeAuditLog): Promise<boolean> {
  await verifyAuth();
  return await deleteFinancialRecordInDB(id, log);
}
