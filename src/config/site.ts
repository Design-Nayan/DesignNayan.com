export const siteConfig = {
  name: "Design Nayan",
  banglaName: "designনয়ন",
  tagline: "DESIGN • BUILD • STAY",
  description: "One ecosystem for all your creative, construction and property needs.",
  url: "https://designnayan.com",
  ogImage: "https://designnayan.com/og.png",
  contact: {
    phone: "+91 86380 53380",
    phoneDisplay: "+91 86380 53380",
    email: "hello@designnayan.com",
    address: "Guwahati, Assam, India",
    whatsapp: "https://wa.me/918638053380",
  },
  stats: {
    projects: "250+",
    satisfaction: "98%",
    partners: "50+",
    experience: "5+",
    trustedClients: "250+",
  },
  socials: {
    instagram: "https://instagram.com/designnayan",
    facebook: "https://facebook.com/designnayan",
    linkedin: "https://linkedin.com/company/designnayan",
    whatsapp: "https://wa.me/918638053380",
  },
} as const;

export type SiteConfig = typeof siteConfig;
