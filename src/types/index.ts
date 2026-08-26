export type ProjectCategory = 
  | "Web Development"
  | "UI/UX Design"
  | "Brand Identity"
  | "Mobile App"
  | "Design System";

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  fullContent?: string;
  category: ProjectCategory;
  client: string;
  year: string;
  coverImage: string;
  galleryImages?: string[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: "Palette" | "Code" | "Layout" | "Layers" | "Smartphone" | "Globe" | "Sparkles";
  features: string[];
  deliverables: string[];
  priceRange?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
  projectSlug?: string;
}

export interface ContactInquiry {
  id?: string;
  name: string;
  email: string;
  company?: string;
  serviceRequested: string;
  budgetRange: string;
  message: string;
  status?: "NEW" | "IN_REVIEW" | "CONTACTED" | "ARCHIVED";
  createdAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
