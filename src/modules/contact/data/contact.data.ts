import { ContactDetailsData } from "../types/contact.types";
import { siteConfig } from "@/config/site";

export const initialContactData: ContactDetailsData = {
  agencyName: siteConfig.name,
  phone: siteConfig.contact.phone,
  phoneDisplay: siteConfig.contact.phoneDisplay,
  email: siteConfig.contact.email,
  whatsapp: siteConfig.contact.whatsapp,
  address: siteConfig.contact.address,
  regionSubtext: "We operate across Assam, Northeast India, and provide digital solutions globally.",
  workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
  instagram: siteConfig.socials.instagram,
  facebook: siteConfig.socials.facebook,
  linkedin: siteConfig.socials.linkedin,
};
