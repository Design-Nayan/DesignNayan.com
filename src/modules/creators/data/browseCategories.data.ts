import { Creator, CreatorCategory, BrowseCategoryConfig } from "../creators.types";

/**
 * BROWSE CATEGORIES CONFIGURATION
 *
 * Future Admin Panel Note:
 * Website owners can manage which categories appear in the Discovery horizontal rows,
 * change their display order, customize row titles, or adjust maximum card limits.
 */
export const BROWSE_CATEGORIES_CONFIG: BrowseCategoryConfig[] = [
  {
    id: "fashion-luxury",
    category: "High Fashion & Luxury",
    title: "High Fashion & Luxury",
    maxDisplayCount: 10,
    description: "Couture, runway aesthetics, high-jewelry, and cinematic fashion narratives.",
  },
  {
    id: "viral-ugc",
    category: "Viral UGC & Short-Form",
    title: "Viral UGC & Short-Form",
    maxDisplayCount: 10,
    description: "High-retention hooks, direct-response video, and native TikTok/Reels pacing.",
  },
  {
    id: "cgi-motion",
    category: "3D & CGI Motion",
    title: "3D & CGI Motion",
    maxDisplayCount: 10,
    description: "Hyper-real 3D product simulation, faux-OOH viral stunts, and visual effects.",
  },
];

/**
 * Helper to group creators according to admin's configured browse categories.
 */
export function getBrowseCategoriesWithCreators(allCreators: Creator[]) {
  return BROWSE_CATEGORIES_CONFIG.map((cfg) => {
    const matched = allCreators.filter((c) => c.category === cfg.category);
    return {
      category: cfg.category,
      title: cfg.title,
      totalCount: matched.length,
      creators: matched.slice(0, cfg.maxDisplayCount),
      hasMore: matched.length > cfg.maxDisplayCount,
    };
  });
}
