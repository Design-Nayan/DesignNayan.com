export type CreatorCategory = 
  | "ALL"
  | "Lifestyle"
  | "Fashion"
  | "Beauty"
  | "Travel"
  | "Food"
  | "Fitness"
  | "Tech"
  | "UGC";

export interface CreatorPackage {
  title: string;
  price: number;
  deliverables: string;
}

export interface CreatorItem {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  verified: boolean;
  category: CreatorCategory;
  nicheTags: string[];
  rating: number;
  reviewCount: number;
  location: string;
  followers: string;
  followersRaw: number;
  startingPrice: number;
  currency: string;
  priceUnit: string;
  bio: string;
  engagementRate: string;
  avgViews: string;
  languages: string[];
  portfolioVideos?: string[];
  packages?: CreatorPackage[];
  featured?: boolean;
}

export interface CreatorFilterState {
  searchQuery: string;
  category: string;
  location: string;
  followerTier: string;
  sortBy: "popular" | "rating" | "followers" | "price_asc" | "price_desc";
  viewMode: "grid" | "list";
}
