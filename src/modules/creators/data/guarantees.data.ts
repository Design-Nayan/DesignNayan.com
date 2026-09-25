import { AgencyGuaranteeItem, CustomCampaignBannerConfig } from "../creators.types";

/**
 * AGENCY DIFFERENCE: GUARANTEES CONFIGURATION
 *
 * Future Admin Panel Note:
 * Website owners can customize the 4 agency guarantees and SLA terms.
 */
export const AGENCY_GUARANTEES: AgencyGuaranteeItem[] = [
  {
    id: "guarantee-escrow",
    iconName: "ShieldCheck",
    title: "Zero Escrow Risk",
    desc: "Payments are held securely in agency escrow and released to creators only after you review and approve final deliverable masters.",
    tag: "ESCROW SECURE",
  },
  {
    id: "guarantee-ip",
    iconName: "Award",
    title: "100% Commercial IP Rights",
    desc: "Every asset comes with full commercial licensing, ad whitelisting permissions, and perpetual digital brand usage rights.",
    tag: "IP CLEARED",
  },
  {
    id: "guarantee-direction",
    iconName: "Sparkles",
    title: "In-House Creative Direction",
    desc: "Our senior creative directors oversee scripts, hooks, lighting, and sound design to ensure output matches high-fashion agency standards.",
    tag: "WHITE-GLOVE",
  },
  {
    id: "guarantee-replacement",
    iconName: "Zap",
    title: "48-Hour Replacement Guarantee",
    desc: "If any creator encounters scheduling or production delays, we deploy an equal or higher-tier creator within 48 hours at zero extra charge.",
    tag: "SLA BACKED",
  },
];

/**
 * REQUEST CUSTOM CAMPAIGN BANNER CONFIGURATION
 */
export const CUSTOM_CAMPAIGN_CONFIG: CustomCampaignBannerConfig = {
  title: "Need a Custom Multi-Creator Roster or Enterprise Production?",
  highlightText: "Custom Multi-Creator Roster",
  description:
    "Have unique technical constraints, strict NDAs, or high-volume seasonal campaigns? Our executive producers assemble custom rosters, negotiate multi-talent buyout packages, and oversee end-to-end delivery.",
  bullets: [
    "Dedicated Creative Director assigned",
    "Bespoke multi-talent rate negotiations",
    "Whitelisting & cross-platform ad permissions",
    "24/7 dedicated campaign Slack / WhatsApp channel",
  ],
  ctaText: "Request Custom Campaign",
};
