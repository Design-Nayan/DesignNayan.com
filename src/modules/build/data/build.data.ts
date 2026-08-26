import { BuildOffering, MaterialCategory } from "../types/build.types";

export const buildOfferingsData: BuildOffering[] = [
  {
    title: "Nayan Constructions",
    badge: "FULL TURNKEY CIVIL",
    desc: "Complete civil construction from foundation soil testing to final roof casting, plumbing, electrical, and finishing handover.",
    features: [
      "Site survey, soil testing & RCC foundation",
      "Earthquake zone V structural safety compliance",
      "Dedicated site engineer & weekly milestone tracking",
      "10-year structural warranty & fixed-cost quotation",
    ],
    ctaText: "Get Construction Quote",
    iconName: "HardHat",
  },
  {
    title: "Material Supply & Wholesale",
    badge: "DIRECT WHOLESALE SOURCING",
    desc: "Direct bulk procurement of certified TMT steel bars, Grade-53 cement, vitrified tiles, UPVC windows, and designer sanitary fittings.",
    features: [
      "Direct mill & factory wholesale pricing",
      "Certified Grade 53 cement & Fe 550D TMT rebars",
      "On-site delivery across Northeast India",
      "Bulk trade credit & invoice consolidation",
    ],
    ctaText: "Inquire Material Rates",
    iconName: "Truck",
  },
  {
    title: "Commercial & Retail Fit-outs",
    badge: "COMMERCIAL EXECUTION",
    desc: "Fast-track turnkey interiors, facade glazing, acoustic ceilings, and MEP execution for retail showrooms, corporate offices, and cafes.",
    features: [
      "Toughened glass structural glazing & ACP claddings",
      "Fire-safety & HVAC ducted air distribution",
      "Acoustic gypsum partition walls & glass cubicles",
      "Night-shift execution for active malls & commercial hubs",
    ],
    ctaText: "Commercial Consultation",
    iconName: "Building2",
  },
  {
    title: "Renovation & Structural Retrofitting",
    badge: "RESTORATION & STRENGTHENING",
    desc: "Structural retrofitting, waterproofing, terrace garden creation, and modernizing heritage residential and colonial properties.",
    features: [
      "Micro-concrete jacketing & carbon-fiber wrapping",
      "Dr. Fixit certified multi-layer waterproofing",
      "Structural floor expansion & beam additions",
      "Thermal insulation & modern facade makeover",
    ],
    ctaText: "Request Site Inspection",
    iconName: "ShieldCheck",
  },
];

export const materialCategoriesData: MaterialCategory[] = [
  {
    category: "Structural Steel (TMT)",
    brands: ["Tata Tiscon", "Jindal Panther", "Sail", "Kamdhenu"],
    desc: "Fe 500D & 550D high-ductility earthquake-resistant corrosion-resistant rebars.",
  },
  {
    category: "Cement & Aggregates",
    brands: ["UltraTech", "Dalmia Cement", "Star Cement", "Ambuja"],
    desc: "PPC, OPC 53 Grade high-early-strength cement and certified river sand & blue metal stone.",
  },
  {
    category: "Sanitaryware & Bath Fixtures",
    brands: ["Kohler", "Jaquar", "Grohe", "Hindware"],
    desc: "Wall-hung smart toilets, thermostatic rain showers, and PVD gold brassware.",
  },
  {
    category: "Tiles & Marble Slabs",
    brands: ["Kajaria", "Somany", "Simpolo", "Italian Imported"],
    desc: "Large format 1200x2400mm vitrified slabs, anti-skid tiles, and polished granites.",
  },
];
