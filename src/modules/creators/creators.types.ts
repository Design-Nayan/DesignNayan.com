export type CreatorCategory =
  | "All"
  | "High Fashion & Luxury"
  | "Tech & Gadgets"
  | "Viral UGC & Short-Form"
  | "3D & CGI Motion"
  | "Architecture & Spaces"
  | "Lifestyle & Travel"
  | "Fitness & Performance";

export type DeliverableFormat =
  | "All"
  | "4K Viral Reels & TikTok"
  | "YouTube Long-Form"
  | "Commercial Production"
  | "Editorial Photo Stills"
  | "3D / CGI Product VFX";

export type ReachTier = "All" | "Rising (25K-100K)" | "Prime (100K-500K)" | "Macro (500K-1.5M)" | "Icon (1.5M+)";

export interface CreatorDemographics {
  topLocations: { name: string; percentage: number }[];
  ageGroup: string; // e.g. "74% 18–34"
  genderSplit: string; // e.g. "54% M / 46% F"
}

export interface CreatorCaseStudy {
  brand: string;
  campaign: string;
  metric: string; // e.g. "3.4M Views • 8.2x ROAS"
  thumbnail: string;
}

export interface CreatorRatePackage {
  title: string;
  deliverables: string;
  priceEstimate: string;
  turnaround: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  role: string;
  category: CreatorCategory;
  formats: DeliverableFormat[];
  tier: ReachTier;
  location: string;
  avatar: string;
  featuredImage: string;
  secondaryImage?: string;
  verified: boolean;
  engagementRate: number; // e.g. 5.8%
  followersCount: string; // e.g. "840K"
  avgViews: string; // e.g. "420K"
  startingRate: string; // e.g. "$1,200"
  turnaroundDays: number; // e.g. 2
  bio: string;
  pastBrands: string[];
  tags: string[];
  demographics: CreatorDemographics;
  caseStudies: CreatorCaseStudy[];
  packages: CreatorRatePackage[];
  videoPreviewUrl?: string;
  featuredInHero?: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: CreatorCategory;
  format: DeliverableFormat;
  tier: ReachTier;
  sortBy: "popular" | "engagement" | "reach" | "turnaround";
}

export interface CampaignInquiry {
  selectedCreatorIds: string[];
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  objective: string;
  budgetBracket: string;
  timeline: string;
  notes?: string;
}

// -------------------------------------------------------------
// Admin Panel & Modular Data Configuration Interfaces
// -------------------------------------------------------------

/** Configuration for Top Creators of the Month Pyramid spotlight */
export interface TopCreatorSpotlight {
  creatorId: string;
  rank: number;
  featuredBadge?: string;
  specialNote?: string;
}

/** Configuration for Browse Category rows in Creator Discovery */
export interface BrowseCategoryConfig {
  id: string;
  category: CreatorCategory;
  title: string;
  maxDisplayCount: number;
  description?: string;
}

/** Configuration for Smart Matchmaker Objectives & Matching Criteria */
export interface MatchmakerObjectiveConfig {
  id: string;
  label: string;
  matchedCategories: CreatorCategory[];
  description?: string;
}

export interface MatchmakerFormatConfig {
  id: string;
  label: string;
}

export interface MatchmakerBudgetConfig {
  id: string;
  label: string;
}

/** Showcase Video Reel in 'Turn Ideas into Visual Statements' */
export interface ShowcaseVideoItem {
  id: string;
  creatorId: string;
  creatorName: string;
  role: string;
  brand: string;
  campaign: string;
  views: string;
  roas: string;
  format: string;
  thumbnail: string;
  accentColor: string;
}

/** Capabilities Bento step pills */
export interface CapabilityStepItem {
  id: string;
  step: string;
  title: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  textClass: string;
  targetCategory?: CreatorCategory;
}

/** Agency Guarantee Card item */
export interface AgencyGuaranteeItem {
  id: string;
  iconName: "ShieldCheck" | "Award" | "Sparkles" | "Zap";
  title: string;
  desc: string;
  tag: string;
}

/** Request Custom Campaign Banner Config */
export interface CustomCampaignBannerConfig {
  title: string;
  highlightText: string;
  description: string;
  bullets: string[];
  ctaText: string;
}

