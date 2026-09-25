import {
  Creator,
  MatchmakerObjectiveConfig,
  MatchmakerFormatConfig,
  MatchmakerBudgetConfig,
} from "../creators.types";

/**
 * SMART MATCHMAKER CONFIGURATION
 *
 * Future Admin Panel Note:
 * Website owners can customize the questions, available options, and category mapping rules
 * for recommending creators to brand managers and agencies.
 */
export const MATCHMAKER_OBJECTIVES: MatchmakerObjectiveConfig[] = [
  {
    id: "viral-growth",
    label: "Viral Brand Growth",
    matchedCategories: ["Viral UGC & Short-Form", "Tech & Gadgets"],
    description: "Prioritizes high hook rates, fast retention curves, and mass audience reach.",
  },
  {
    id: "luxury-elevation",
    label: "Luxury Brand Elevation",
    matchedCategories: ["High Fashion & Luxury", "Architecture & Spaces"],
    description: "Focuses on moody lighting, prestige aesthetics, and high-fashion editorial styling.",
  },
  {
    id: "tech-hardware",
    label: "Tech / Hardware Launch",
    matchedCategories: ["Tech & Gadgets", "3D & CGI Motion"],
    description: "Spotlights macro mechanics, hardware ASMR, and 3D exploded view VFX.",
  },
  {
    id: "direct-sales",
    label: "Direct-Response Sales",
    matchedCategories: ["Viral UGC & Short-Form", "Fitness & Performance"],
    description: "Engineered for high conversion, problem/solution demonstrations, and app installs.",
  },
];

export const MATCHMAKER_FORMATS: MatchmakerFormatConfig[] = [
  { id: "reels-tiktok", label: "Short-Form Reels" },
  { id: "cinema-commercials", label: "Cinema Commercials" },
  { id: "cgi-vfx", label: "3D / CGI Product VFX" },
  { id: "editorial-stills", label: "Editorial Stills & Lookbook" },
];

export const MATCHMAKER_BUDGETS: MatchmakerBudgetConfig[] = [
  { id: "starter", label: "Under $3k (Starter)" },
  { id: "standard", label: "$3k - $8k Campaign" },
  { id: "multi-creator", label: "$8k - $20k Multi-Creator" },
  { id: "enterprise", label: "$20k+ Enterprise Retainer" },
];

/**
 * Smart Matchmaker algorithm:
 * Derives top creator recommendations based on selected goal, format, and budget.
 */
export function findMatchmakerCreators(
  options: {
    goal: string;
    format?: string;
    budget?: string;
  },
  allCreators: Creator[]
): Creator[] {
  const objectiveConfig = MATCHMAKER_OBJECTIVES.find((o) => o.label === options.goal);

  let filtered = [...allCreators];

  if (objectiveConfig && objectiveConfig.matchedCategories.length > 0) {
    filtered = filtered.filter((c) =>
      objectiveConfig.matchedCategories.includes(c.category)
    );
  }

  // Fallback if filtered list has fewer than 3 creators
  if (filtered.length < 3) {
    for (const c of allCreators) {
      if (!filtered.some((f) => f.id === c.id)) {
        filtered.push(c);
      }
      if (filtered.length >= 3) break;
    }
  }

  return filtered.slice(0, 3);
}
