import { Creator, TopCreatorSpotlight } from "../creators.types";
import { CREATORS_DATA } from "./creators.data";

/**
 * TOP CREATORS OF THE MONTH CONFIGURATION
 *
 * Future Admin Panel Note:
 * The website owner can re-order, add, or swap creator IDs here.
 * The order in this array defines:
 * 1. Center spotlight card in the Interactive Pyramid (#1)
 * 2. Flanking cards left and right (#2, #3, #4, #5)
 * 3. Featured accolades in editorial sections
 */
export const TOP_CREATORS_SPOTLIGHT: TopCreatorSpotlight[] = [
  {
    creatorId: "kai-vance",
    rank: 1,
    featuredBadge: "Creator of the Month",
    specialNote: "Top performing luxury fashion drop of Q3",
  },
  {
    creatorId: "maya-solis",
    rank: 2,
    featuredBadge: "Top Tech Talent",
    specialNote: "4.1M Views hardware unveil",
  },
  {
    creatorId: "damon-cross",
    rank: 3,
    featuredBadge: "Viral CGI Pioneer",
    specialNote: "7.6M Views mixed reality spectacle",
  },
  {
    creatorId: "elena-rostova",
    rank: 4,
    featuredBadge: "Editorial Muse",
    specialNote: "Byredo Parfums 9.1x ROAS",
  },
  {
    creatorId: "zayn-malik-k",
    rank: 5,
    featuredBadge: "UGC Retention Leader",
    specialNote: "9.2% consistent engagement rate",
  },
];

/**
 * Resolves full Creator objects for Top Creators of Month based on admin configuration.
 * If an admin customizes `TOP_CREATORS_SPOTLIGHT`, this ensures the frontend displays them in exact rank order.
 */
export function getTopCreators(customRoster: Creator[] = CREATORS_DATA): Creator[] {
  const resolved: Creator[] = [];

  for (const spotlight of TOP_CREATORS_SPOTLIGHT) {
    const found = customRoster.find((c) => c.id === spotlight.creatorId);
    if (found && !resolved.some((r) => r.id === found.id)) {
      resolved.push(found);
    }
  }

  // Fallback: if spotlight has fewer than 5 or invalid IDs, backfill from master list
  if (resolved.length < 5) {
    for (const c of customRoster) {
      if (!resolved.some((r) => r.id === c.id)) {
        resolved.push(c);
      }
      if (resolved.length >= 5) break;
    }
  }

  return resolved.slice(0, 5);
}
